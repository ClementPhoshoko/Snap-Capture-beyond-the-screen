import { startCapture, cancelCapture } from "./captureManager.js";
import { extractDOM } from "./extractors/domExtractor.js";
import { extractComputedStyles, extractCSSVariables, extractFonts } from "./extractors/styleExtractor.js";
import { analyzeLayout } from "./extractors/layoutAnalyzer.js";
import { collectAssets } from "./extractors/assetCollector.js";
import { MessageType } from "../shared/messages.js";

function extractAll() {
  return {
    dom: extractDOM(),
    computedStyles: extractComputedStyles(),
    cssVariables: extractCSSVariables(),
    fonts: extractFonts(),
    layout: analyzeLayout(),
    assets: collectAssets(),
  };
}

if (!globalThis.__akovoSnapControllerInstalled) {
  globalThis.__akovoSnapControllerInstalled = true;
  let captureInProgress = false;
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message?.type) return;
    if (message.type === MessageType.PING) {
      sendResponse({ ready: true });
      return;
    }
    if (message.type === MessageType.CANCEL_CAPTURE) {
      cancelCapture();
      sendResponse({ success: true });
      return;
    }
    if (message.type === "SNAP/EXTRACT_DESIGN_CONTENT") {
      try {
        const data = extractAll();
        sendResponse({ success: true, data });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
      return true;
    }
    if (message.type !== MessageType.START_CAPTURE) return;
    if (captureInProgress) {
      sendResponse({ success: false, error: "A capture is already in progress" });
      return;
    }
    captureInProgress = true;
    startCapture(message.payload)
      .then(sendResponse)
      .catch((error) => sendResponse({ success: false, error: error.message }))
      .finally(() => { captureInProgress = false; });
    return true;
  });
}
