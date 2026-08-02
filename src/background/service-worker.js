import { MessageType, buildStartCapture, buildError, buildExtractDesignProgress, buildExtractDesignComplete, buildExtractDesignError } from "../shared/messages.js";
import { CAPTURE_INTERVAL_MS } from "../shared/constants.js";
import { makeFilename } from "../shared/helpers.js";
import { buildPayload } from "./services/payloadBuilder.js";
import { generateProject, fixDiscrepancies, testConnection } from "./services/geminiService.js";
import { compareScreenshots, generateDiffReport, calculateSimilarity } from "./services/visualVerifier.js";
import { exportProject } from "./services/projectExporter.js";
import { getExtractDesignStatus, recordDesignExtract, saveExtractDesignStatus, clearExtractDesignStatus } from "../shared/storage.js";
import { saveDesignExtractArchive } from "../shared/designArchive.js";

const CONTENT_SCRIPT = "content/index.js";
const captureTimes = new Map();
let activeCaptureTabId = null;
let activeExtractPromise = null;
let activeExtractAbortController = null;

function extractCancelledError() {
  const err = new Error("Extraction cancelled");
  err.code = "EXTRACT_CANCELLED";
  return err;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab || null;
}

function isInjectable(tab) {
  return Boolean(tab?.id && tab.url && /^(https?|file):/i.test(tab.url));
}

async function ensureContentScript(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: MessageType.PING, payload: {} });
    if (response?.ready) return;
  } catch {
  }
  await chrome.scripting.executeScript({ target: { tabId }, files: [CONTENT_SCRIPT] });
  const response = await chrome.tabs.sendMessage(tabId, { type: MessageType.PING, payload: {} });
  if (!response?.ready) throw new Error("Capture controller did not initialize");
}

function sendToPopup(message) {
  chrome.runtime.sendMessage(message).catch(() => {});
}

async function updateExtractStatus(status) {
  await saveExtractDesignStatus(status).catch(() => {});
}

function sendExtractProgress(stage, percent, detail = {}) {
  const payload = { stage, percent, ...detail };
  updateExtractStatus({ state: "running", payload });
  sendToPopup(buildExtractDesignProgress(stage, percent, detail));
}

function buildStoredExtractResult(result) {
  return {
    projectName: result.projectName,
    similarityScore: result.similarityScore,
    files: result.files,
    size: result.size,
    format: result.format,
    archiveId: result.archiveId,
    capturedAt: result.capturedAt,
    extractionData: result.extractionData,
  };
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

async function handleStartCapture(payload) {
  const tab = await getActiveTab();
  if (!tab) throw new Error("No active tab found");
  if (!isInjectable(tab)) {
    throw new Error("This page cannot be captured as a full page. Open a regular http(s) webpage and try again.");
  }
  await ensureContentScript(tab.id);
  activeCaptureTabId = tab.id;
  try {
    const response = await chrome.tabs.sendMessage(tab.id, buildStartCapture(payload.mode, payload.settings));
    if (!response?.success) throw new Error(response?.error || "Capture failed");
    return response;
  } finally {
    activeCaptureTabId = null;
  }
}

async function handleCaptureTab(senderTab) {
  if (!senderTab?.windowId || !senderTab?.id) throw new Error("No capture tab context");
  const activeTab = await getActiveTab();
  if (activeTab?.id !== senderTab.id) {
    throw new Error("Capture cancelled because the active tab changed");
  }
  const lastCapture = captureTimes.get(senderTab.windowId) || 0;
  const remaining = CAPTURE_INTERVAL_MS - (Date.now() - lastCapture);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
  const imageData = await chrome.tabs.captureVisibleTab(senderTab.windowId, { format: "png" });
  captureTimes.set(senderTab.windowId, Date.now());
  return { success: true, imageData };
}

async function handleDownload(payload) {
  if (!payload?.imageData) throw new Error("No image available to download");
  const filename = makeFilename(payload.namingPattern, payload.title, payload.format);
  await chrome.downloads.download({
    url: payload.imageData,
    filename,
    saveAs: payload.location === "ask",
    conflictAction: "uniquify",
  });
  return { success: true, filename };
}

function withTimeout(fn, ms, label, externalSignal) {
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort(extractCancelledError());
  if (externalSignal) {
    if (externalSignal.aborted) onExternalAbort();
    else externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }
  const timer = setTimeout(() => {
    controller.abort();
    console.warn(`[Timeout] ${label} exceeded ${ms}ms`);
  }, ms);
  return fn(controller.signal)
    .catch((err) => {
      if (err.name === "AbortError") {
        if (controller.signal.reason?.code === "EXTRACT_CANCELLED") throw controller.signal.reason;
        throw new Error(`Timed out after ${ms}ms: ${label}`);
      }
      throw err;
    })
    .finally(() => {
      clearTimeout(timer);
      if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
    });
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function captureDesignScreenshots(tab, signal) {
  const planResponse = await chrome.tabs.sendMessage(tab.id, { type: "SNAP/EXTRACT_DESIGN_SCREENSHOT_PLAN" });
  if (!planResponse?.success) throw new Error(planResponse?.error || "Screenshot planning failed");

  const { page, originalScrollY, positions } = planResponse.data;
  const screenshots = [];
  try {
    for (let index = 0; index < positions.length; index += 1) {
      if (signal?.aborted) throw extractCancelledError();
      const y = positions[index];
      const scrollResponse = await chrome.tabs.sendMessage(tab.id, {
        type: "SNAP/EXTRACT_DESIGN_SCROLL_TO",
        payload: { y },
      });
      if (!scrollResponse?.success) throw new Error(scrollResponse?.error || "Could not scroll page for extraction");

      await delay(CAPTURE_INTERVAL_MS);
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg", quality: 30 });
      screenshots.push({
        dataUrl,
        y: scrollResponse.data?.y ?? y,
        label: index === 0 ? "top" : index === positions.length - 1 ? "bottom" : `middle-${index}`,
        viewport: { width: page.vpWidth, height: page.vpHeight },
        pageHeight: page.scrollHeight,
      });
    }
  } finally {
    chrome.tabs.sendMessage(tab.id, {
      type: "SNAP/EXTRACT_DESIGN_RESTORE_SCROLL",
      payload: { y: originalScrollY || 0 },
    }).catch(() => {});
  }
  return screenshots;
}

async function handleExtractDesign() {
  if (activeExtractPromise) return activeExtractPromise;

  activeExtractAbortController = new AbortController();
  const signal = activeExtractAbortController.signal;
  activeExtractPromise = runExtractDesign(signal)
    .finally(() => {
      if (activeExtractAbortController?.signal === signal) activeExtractAbortController = null;
      activeExtractPromise = null;
    });
  return activeExtractPromise;
}

async function runExtractDesign(signal) {
  const tab = await getActiveTab();
  if (!tab) throw new Error("No active tab found");
  if (!isInjectable(tab)) {
    throw new Error("Extraction requires an http(s) webpage. Open a regular page and try again.");
  }

  sendExtractProgress("dom", 5, { message: "Preparing page analysis" });
  await ensureContentScript(tab.id);

  sendExtractProgress("capture", 8, { message: "Capturing visual references" });
  const screenshots = await captureDesignScreenshots(tab, signal);

  const extResponse = await chrome.tabs.sendMessage(tab.id, { type: "SNAP/EXTRACT_DESIGN_CONTENT" });
  if (!extResponse?.success) throw new Error(extResponse?.error || "DOM extraction failed");
  const extractionData = extResponse.data;

  sendExtractProgress("styles", 18, { message: "Collecting computed styles" });
  sendExtractProgress("css-vars", 22, { message: "Extracting design tokens" });
  sendExtractProgress("fonts", 25, { message: "Identifying typography" });
  sendExtractProgress("images", 28, { message: "Collecting media assets" });
  sendExtractProgress("svgs", 31, { message: "Extracting vector graphics" });
  sendExtractProgress("icons", 34, { message: "Collecting icon assets" });
  sendExtractProgress("layout", 38, { message: "Detecting page layout" });
  sendExtractProgress("spacing", 42, { message: "Measuring gaps and alignment" });
  sendExtractProgress("assets", 46, { message: "Organizing collected assets" });

  extractionData.screenshot = screenshots[0]?.dataUrl || "";
  extractionData.screenshots = screenshots;

  sendExtractProgress("payload", 50, { message: "Preparing AI payload" });
  const payload = buildPayload(extractionData);

  sendExtractProgress("generate", 55, { message: "AI reconstructing project" });
  const generatedProject = await withTimeout(
    (signal) => generateProject(payload, null, signal),
    180000,
    "generateProject",
    signal
  ).catch((err) => {
    if (err?.code === "EXTRACT_CANCELLED") throw err;
    throw new Error(`AI generation failed: ${err.message}`);
  });

  sendExtractProgress("verify", 75, { message: "Checking visual accuracy" });
  const diffReport = generateDiffReport(payload, generatedProject);
  let similarityScore = calculateSimilarity(payload, generatedProject);
  let currentProject = generatedProject;

  const MAX_ITERATIONS = 0;
  for (let i = 0; i < MAX_ITERATIONS && similarityScore < 95; i++) {
    sendExtractProgress("improve", 80 + i * 5, { message: `Improving iteration ${i + 1} (${similarityScore}%)` });
    currentProject = await withTimeout(
      (signal) => fixDiscrepancies(payload, currentProject, diffReport, null, signal),
      120000,
      `fixDiscrepancies iter ${i + 1}`,
      signal
    );
    similarityScore = calculateSimilarity(payload, currentProject);
  }

  if (currentProject.similarityScore) {
    similarityScore = Math.max(similarityScore, currentProject.similarityScore);
  }

  currentProject = { ...currentProject, sourceScreenshots: screenshots };

  sendExtractProgress("export", 95, { message: "Packaging project files" });
  const exportResult = await exportProject(currentProject, "react");

  const result = {
    ...exportResult,
    similarityScore,
    files: currentProject.files?.length || 0,
    capturedAt: new Date().toISOString(),
    extractionData: {
      domElements: extractionData.dom?.tagCount || 0,
      stylesCollected: extractionData.computedStyles ? Object.keys(extractionData.computedStyles).length : 0,
      fontsFound: extractionData.fonts?.length || 0,
      imagesFound: extractionData.assets?.images?.length || 0,
      svgsFound: extractionData.assets?.svgs?.length || 0,
    },
  };

  const archiveId = crypto.randomUUID();
  result.archiveId = archiveId;
  await saveDesignExtractArchive(archiveId, exportResult.blob);
  await recordDesignExtract(result, {
    title: tab.title,
    url: tab.url,
    domain: getDomain(tab.url),
    favicon: tab.favIconUrl,
  }, archiveId);

  await updateExtractStatus({ state: "complete", result: buildStoredExtractResult(result) });
  sendToPopup(buildExtractDesignProgress("export", 100, { message: "Done" }));
  sendToPopup(buildExtractDesignComplete(result));

  return { success: true, data: result };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type) return;
  const respond = (work) => {
    Promise.resolve().then(work).then(sendResponse).catch((error) => {
      const result = { success: false, error: error.message || "Unexpected extension error" };
      if (message.type === MessageType.START_CAPTURE) sendToPopup(buildError("CAPTURE_FAILED", result.error));
      if (message.type === MessageType.EXTRACT_DESIGN) {
        if (error?.code === "EXTRACT_CANCELLED") {
          clearExtractDesignStatus().catch(() => {});
        } else {
          updateExtractStatus({ state: "error", error: { code: "EXTRACT_FAILED", message: result.error } });
          sendToPopup(buildExtractDesignError("EXTRACT_FAILED", result.error));
        }
      }
      sendResponse(result);
    });
    return true;
  };
  switch (message.type) {
    case MessageType.START_CAPTURE:
      return respond(() => handleStartCapture(message.payload));
    case MessageType.CAPTURE_TAB:
      return respond(() => handleCaptureTab(sender.tab));
    case MessageType.CANCEL_CAPTURE:
      if (activeCaptureTabId) chrome.tabs.sendMessage(activeCaptureTabId, message).catch(() => {});
      return;
    case MessageType.DOWNLOAD_RESULT:
      return respond(() => handleDownload(message.payload));
    case MessageType.EXTRACT_DESIGN:
      return respond(() => handleExtractDesign());
    case MessageType.EXTRACT_DESIGN_STATUS:
      return respond(async () => ({ success: true, data: await getExtractDesignStatus() }));
    case MessageType.EXTRACT_DESIGN_CANCEL:
      if (activeExtractAbortController) {
        activeExtractAbortController.abort(extractCancelledError());
        activeExtractAbortController = null;
      }
      clearExtractDesignStatus().catch(() => {});
      sendResponse({ success: true });
      break;
    case "SNAP/AI_CONFIG_TEST":
      return respond(() => testConnection());
    case MessageType.CAPTURE_PROGRESS:
    case MessageType.CAPTURE_COMPLETE:
    case MessageType.CAPTURE_ERROR:
      sendToPopup(message);
      break;
  }
});
