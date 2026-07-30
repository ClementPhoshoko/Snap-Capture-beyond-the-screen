import { MessageType, buildStartCapture, buildError, buildExtractDesignProgress, buildExtractDesignComplete, buildExtractDesignError } from "../shared/messages.js";
import { CAPTURE_INTERVAL_MS } from "../shared/constants.js";
import { makeFilename } from "../shared/helpers.js";
import { buildPayload } from "./services/payloadBuilder.js";
import { generateProject, fixDiscrepancies, testConnection } from "./services/geminiService.js";
import { compareScreenshots, generateDiffReport, calculateSimilarity } from "./services/visualVerifier.js";
import { exportProject } from "./services/projectExporter.js";

const CONTENT_SCRIPT = "content/index.js";
const captureTimes = new Map();
let activeCaptureTabId = null;

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

function withTimeout(fn, ms, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
    console.warn(`[Timeout] ${label} exceeded ${ms}ms`);
  }, ms);
  return fn(controller.signal)
    .catch((err) => {
      if (err.name === "AbortError") throw new Error(`Timed out after ${ms}ms: ${label}`);
      throw err;
    })
    .finally(() => clearTimeout(timer));
}

async function handleExtractDesign() {
  const tab = await getActiveTab();
  if (!tab) throw new Error("No active tab found");
  if (!isInjectable(tab)) {
    throw new Error("Extraction requires an http(s) webpage. Open a regular page and try again.");
  }

  sendToPopup(buildExtractDesignProgress("capture", 5, { message: "Capturing full-page screenshot" }));

  const imageData = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg", quality: 30 });

  sendToPopup(buildExtractDesignProgress("dom", 10, { message: "Analyzing page structure" }));
  await ensureContentScript(tab.id);

  const extResponse = await chrome.tabs.sendMessage(tab.id, { type: "SNAP/EXTRACT_DESIGN_CONTENT" });
  if (!extResponse?.success) throw new Error(extResponse?.error || "DOM extraction failed");
  const extractionData = extResponse.data;

  sendToPopup(buildExtractDesignProgress("styles", 18, { message: "Collecting computed styles" }));
  sendToPopup(buildExtractDesignProgress("css-vars", 22, { message: "Extracting design tokens" }));
  sendToPopup(buildExtractDesignProgress("fonts", 25, { message: "Identifying typography" }));
  sendToPopup(buildExtractDesignProgress("images", 28, { message: "Collecting media assets" }));
  sendToPopup(buildExtractDesignProgress("svgs", 31, { message: "Extracting vector graphics" }));
  sendToPopup(buildExtractDesignProgress("icons", 34, { message: "Collecting icon assets" }));
  sendToPopup(buildExtractDesignProgress("layout", 38, { message: "Detecting page layout" }));
  sendToPopup(buildExtractDesignProgress("spacing", 42, { message: "Measuring gaps and alignment" }));
  sendToPopup(buildExtractDesignProgress("assets", 46, { message: "Organizing collected assets" }));

  extractionData.screenshot = imageData;

  sendToPopup(buildExtractDesignProgress("payload", 50, { message: "Preparing AI payload" }));
  const payload = buildPayload(extractionData);

  sendToPopup(buildExtractDesignProgress("generate", 55, { message: "AI reconstructing project" }));
  const generatedProject = await withTimeout(
    (signal) => generateProject(payload, null, signal),
    180000,
    "generateProject"
  ).catch((err) => {
    throw new Error(`AI generation failed: ${err.message}`);
  });

  sendToPopup(buildExtractDesignProgress("verify", 75, { message: "Checking visual accuracy" }));
  const diffReport = generateDiffReport(payload, generatedProject);
  let similarityScore = calculateSimilarity(payload, generatedProject);
  let currentProject = generatedProject;

  const MAX_ITERATIONS = 3;
  for (let i = 0; i < MAX_ITERATIONS && similarityScore < 95; i++) {
    sendToPopup(buildExtractDesignProgress("improve", 80 + i * 5, { message: `Improving iteration ${i + 1} (${similarityScore}%)` }));
    currentProject = await withTimeout(
      (signal) => fixDiscrepancies(payload, currentProject, diffReport, null, signal),
      120000,
      `fixDiscrepancies iter ${i + 1}`
    );
    similarityScore = calculateSimilarity(payload, currentProject);
  }

  if (currentProject.similarityScore) {
    similarityScore = Math.max(similarityScore, currentProject.similarityScore);
  }

  sendToPopup(buildExtractDesignProgress("export", 95, { message: "Packaging project files" }));
  const exportResult = await exportProject(currentProject, "react");

  const result = {
    ...exportResult,
    similarityScore,
    extractionData: {
      domElements: extractionData.dom?.tagCount || 0,
      stylesCollected: extractionData.computedStyles ? Object.keys(extractionData.computedStyles).length : 0,
      fontsFound: extractionData.fonts?.length || 0,
      imagesFound: extractionData.assets?.images?.length || 0,
      svgsFound: extractionData.assets?.svgs?.length || 0,
    },
  };

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
      if (message.type === "SNAP/EXTRACT_DESIGN") sendToPopup(buildExtractDesignError("EXTRACT_FAILED", result.error));
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
    case "SNAP/EXTRACT_DESIGN":
      return respond(() => handleExtractDesign());
    case "SNAP/AI_CONFIG_TEST":
      return respond(() => testConnection());
    case MessageType.CAPTURE_PROGRESS:
    case MessageType.CAPTURE_COMPLETE:
    case MessageType.CAPTURE_ERROR:
      sendToPopup(message);
      break;
  }
});
