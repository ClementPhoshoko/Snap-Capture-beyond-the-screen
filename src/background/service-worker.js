import { MessageType, buildStartCapture, buildError } from "../shared/messages.js";

const CONTENT_SCRIPT = "content/index.js";

console.log("[Snap BG] Service worker started");

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] ?? null;
}

async function injectContentScript(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    files: [CONTENT_SCRIPT],
  });
  for (const r of results) {
    if (r.error) {
      console.error("[Snap BG] Injection error:", r.error);
      throw new Error(r.error.message || "Content script injection failed");
    }
  }
  console.log("[Snap BG] Content script injected into tab", tabId);
}

function sendToPopup(message) {
  return chrome.runtime.sendMessage(message).catch((err) => {
    console.warn("[Snap BG] sendToPopup failed:", err.message);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type) return;

  console.log("[Snap BG] Received:", message.type, "from:", sender.tab ? "content" : "popup");

  switch (message.type) {
    case MessageType.START_CAPTURE: {
      handleStartCapture(message.payload)
        .then((result) => {
          console.log("[Snap BG] START_CAPTURE response:", result.success);
          sendResponse(result);
        })
        .catch((err) => {
          console.error("[Snap BG] START_CAPTURE error:", err);
          sendToPopup(buildError("BG_ERROR", err.message));
          sendResponse({ success: false, error: err.message });
        });
      return true;
    }

    case MessageType.CAPTURE_TAB: {
      const tab = sender.tab;
      console.log("[Snap BG] CAPTURE_TAB tab:", tab?.id, "window:", tab?.windowId);
      if (!tab?.windowId) {
        console.error("[Snap BG] No windowId for capture");
        sendResponse({ success: false, error: "No window context for capture" });
        return;
      }
      handleCaptureTab(tab.windowId)
        .then((result) => {
          console.log("[Snap BG] CAPTURE_TAB result has imageData:", !!result.imageData);
          sendResponse(result);
        })
        .catch((err) => {
          console.error("[Snap BG] CAPTURE_TAB error:", err.message);
          sendResponse({ success: false, error: err.message });
        });
      return true;
    }

    case MessageType.CAPTURE_PROGRESS:
    case MessageType.CAPTURE_COMPLETE:
    case MessageType.CAPTURE_ERROR:
      console.log("[Snap BG] Forwarding to popup:", message.type);
      sendToPopup(message);
      break;
  }
});

async function handleStartCapture(payload) {
  const tab = await getActiveTab();
  if (!tab) {
    console.log("[Snap BG] No active tab found");
    sendToPopup(buildError("NO_TAB", "No active tab found. Try refreshing the page."));
    return { success: false, error: "No active tab found" };
  }

  console.log("[Snap BG] Tab found:", tab.id, tab.url);

  try {
    await injectContentScript(tab.id);
  } catch (err) {
    const msg = err.message ?? "Failed to inject capture script";
    console.error("[Snap BG] Injection failed:", msg);
    sendToPopup(buildError("INJECT_FAILED", msg));
    return { success: false, error: msg };
  }

  console.log("[Snap BG] Sending START_CAPTURE to content script");

  try {
    const response = await chrome.tabs.sendMessage(tab.id, buildStartCapture(payload.mode, payload.settings));
    console.log("[Snap BG] Content script response:", response);

    if (!response?.success) {
      const errMsg = response?.error ?? "Unknown capture error";
      sendToPopup(buildError("CAPTURE_FAILED", errMsg));
      return { success: false, error: errMsg };
    }

    return { success: true, data: response.data };
  } catch (err) {
    console.error("[Snap BG] tabs.sendMessage failed:", err);
    sendToPopup(buildError("CONTENT_UNREACHABLE", "Content script did not respond: " + err.message));
    return { success: false, error: err.message };
  }
}

async function handleCaptureTab(windowId) {
  if (!windowId) throw new Error("No window context for capture");
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 2000;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log("[Snap BG] Calling captureVisibleTab for window:", windowId, "attempt:", attempt + 1);
      const dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: "png" });
      console.log("[Snap BG] captureVisibleTab returned:", typeof dataUrl, dataUrl ? dataUrl.substring(0, 50) + "..." : "NULL");
      return { success: true, imageData: dataUrl };
    } catch (err) {
      const isQuota = err.message?.includes("MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND");
      if (!isQuota || attempt === MAX_RETRIES - 1) throw err;
      console.log("[Snap BG] Quota hit, retrying in", RETRY_DELAY, "ms");
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Snap BG] Extension installed");
});
