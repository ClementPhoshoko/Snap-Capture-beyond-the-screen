import { startCapture, cancelCapture } from "./captureManager.js";
import { analyzePage } from "./pageAnalyzer.js";
import { scrollTo, restoreScrollPosition, getScrollPosition, delay } from "./scrollController.js";
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

function getExtractScreenshotPlan() {
  const page = analyzePage();
  const maxY = Math.max(0, page.scrollHeight - page.vpHeight);
  const ratios = page.scrollHeight <= page.vpHeight * 1.5
    ? [0]
    : page.scrollHeight <= page.vpHeight * 3
      ? [0, 1]
      : [0, 0.33, 0.66, 1];
  const seen = new Set();
  const positions = ratios
    .map((ratio) => Math.round(maxY * ratio))
    .filter((y) => {
      const bucket = Math.round(y / Math.max(1, page.vpHeight / 2));
      if (seen.has(bucket)) return false;
      seen.add(bucket);
      return true;
    });

  return {
    page,
    originalScrollY: getScrollPosition(),
    positions,
  };
}

async function settleForExtract() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  if (document.fonts?.ready) await Promise.race([document.fonts.ready, delay(800)]);
  await delay(200);
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
    if (message.type === "SNAP/EXTRACT_DESIGN_SCREENSHOT_PLAN") {
      try {
        sendResponse({ success: true, data: getExtractScreenshotPlan() });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
      return true;
    }
    if (message.type === "SNAP/EXTRACT_DESIGN_SCROLL_TO") {
      scrollTo(message.payload?.y || 0);
      settleForExtract()
        .then(() => sendResponse({ success: true, data: { y: getScrollPosition() } }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }
    if (message.type === "SNAP/EXTRACT_DESIGN_RESTORE_SCROLL") {
      restoreScrollPosition(message.payload?.y || 0);
      sendResponse({ success: true });
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
