import { MessageType, buildStartCapture, buildError } from "../shared/messages.js";
import { CAPTURE_INTERVAL_MS } from "../shared/constants.js";
import { makeFilename } from "../shared/helpers.js";

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
    // No receiver yet; inject exactly once for this request.
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
  }
});
