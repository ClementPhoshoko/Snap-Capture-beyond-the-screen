import { MessageType, buildStartCapture, buildProgress, buildError } from "../shared/messages.js";
import { CAPTURE_INTERVAL_MS } from "../shared/constants.js";
import { formatToDetails, makeFilename } from "../shared/helpers.js";

const CONTENT_SCRIPT = "content/index.js";
const OFSCREEN_DOC = "offscreen/pdfCapture.html";
const captureTimes = new Map();
let activeCaptureTabId = null;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab || null;
}

function isInjectable(tab) {
  return Boolean(tab?.id && tab.url && /^(https?|file):/i.test(tab.url));
}

function isPDFUrl(url) {
  if (!url) return false;
  try { return new URL(url).pathname.toLowerCase().endsWith(".pdf"); } catch { return false; }
}

async function ensureContentScript(tabId) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: MessageType.PING, payload: {} });
    if (response?.ready) return;
  } catch {
    // No receiver yet; inject exactly once for this request.
  }
  await chrome.scripting.executeScript({ target: { tabId }, files: [CONTENT_SCRIPT] });
  const response = await chrome.tabs.sendMessage(tabId, { type: MessageType.PING, payload: {} });
  if (!response?.ready) throw new Error("Capture controller did not initialize");
}

function sendToPopup(message) {
  chrome.runtime.sendMessage(message).catch(() => {});
}

function sendProgress(stage, percent, detail = {}) {
  sendToPopup(buildProgress(stage, percent, detail));
}

async function ensureOffscreenDoc() {
  try {
    await chrome.runtime.sendMessage({ type: "SNAP/PDF_PING" });
    return;
  } catch {
    // No offscreen doc yet, create one
  }
  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL(OFSCREEN_DOC),
    reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
    justification: "Render PDF pages to canvas for screenshot capture",
  });
}

async function handleStartCapture(payload) {
  const tab = await getActiveTab();
  if (!tab) throw new Error("No active tab found");
  if (!isInjectable(tab)) {
    throw new Error("This page cannot be captured as a full page. Open a regular http(s) webpage and try again.");
  }

  if (isPDFUrl(tab.url)) {
    return handlePDFCapture(tab, payload);
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

async function handlePDFCapture(tab, payload) {
  const settings = payload.settings || {};

  sendProgress("analyze", 2, { message: "Preparing PDF capture" });

  let blob;
  try {
    const response = await fetch(tab.url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    blob = await response.blob();
  } catch {
    sendProgress("capture", 30, { currentSection: 1, totalSections: 1, message: "Local PDFs can't be fetched — capturing visible page" });
    const imageData = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
    sendProgress("finalize", 95, { message: "Finalizing" });

    const docTitle = tab.title || tab.url?.split("/").pop() || "document";
    let domain;
    try { domain = new URL(tab.url).hostname || "local"; } catch { domain = "local"; }
    const rawSize = Math.floor((imageData.split(",")[1]?.length || 0) * 3 / 4);

    const result = {
      imageData,
      dimensions: "—",
      format: "PNG",
      size: formatBytes(rawSize),
      capturedAt: new Date().toISOString(),
      source: docTitle,
      title: docTitle,
      domain,
      url: tab.url,
      favicon: "",
      mode: "visible",
      settings: { format: "png", location: settings.location, namingPattern: settings.namingPattern },
    };

    sendProgress("finalize", 100);
    sendToPopup({ type: MessageType.CAPTURE_COMPLETE, payload: result });
    return { success: true, data: result };
  }

  const pdfUrl = URL.createObjectURL(blob);

  await ensureOffscreenDoc();

  sendProgress("scroll", 10, { currentSection: 0, totalSections: 6 });

  const format = settings.format || "png";
  const quality = settings.quality || "high";

  let renderResult;
  try {
    renderResult = await chrome.runtime.sendMessage({
      type: "SNAP/PDF_RENDER",
      payload: { pdfUrl, format, quality },
    });
  } finally {
    URL.revokeObjectURL(pdfUrl);
  }

  if (!renderResult?.success) throw new Error(renderResult?.error || "PDF render failed");

  const { imageData, width, height, totalPages, size } = renderResult;

  sendProgress("capture", 50, { currentSection: totalPages, totalSections: 6, message: `Captured ${totalPages} page${totalPages > 1 ? "s" : ""}` });
  sendProgress("merge", 75, { message: "Stitching PDF pages" });
  sendProgress("finalize", 95, { message: "Finalizing PDF capture" });

  const docTitle = tab.title || tab.url?.split("/").pop() || "document";
  let domain;
  try { domain = new URL(tab.url).hostname || "local"; } catch { domain = "local"; }

  const rawSize = Math.floor((imageData.split(",")[1]?.length || 0) * 3 / 4);
  const sizeStr = size || formatBytes(rawSize);

  const result = {
    imageData,
    dimensions: `${width} × ${height}`,
    format: formatToDetails(format).extension.toUpperCase(),
    size: sizeStr,
    capturedAt: new Date().toISOString(),
    source: docTitle,
    title: docTitle,
    domain,
    url: tab.url,
    favicon: "",
    mode: "fullpage",
    settings: { format, location: settings.location, namingPattern: settings.namingPattern },
  };

  sendProgress("finalize", 100, { message: "PDF capture complete" });
  sendToPopup({ type: MessageType.CAPTURE_COMPLETE, payload: result });

  return { success: true, data: result };
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type) return;
  const respond = (work) => {
    Promise.resolve().then(work).then(sendResponse).catch((error) => {
      const result = { success: false, error: error.message || "Unexpected extension error" };
      if (message.type === MessageType.START_CAPTURE) sendToPopup(buildError("CAPTURE_FAILED", result.error));
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
    case MessageType.CAPTURE_PROGRESS:
    case MessageType.CAPTURE_COMPLETE:
    case MessageType.CAPTURE_ERROR:
      sendToPopup(message);
      break;
    case "SNAP/PDF_PING":
      sendResponse({ ready: true });
      break;
  }
});
