import { showCaptureOverlay, hideCaptureOverlay } from "./captureOverlay.js";
import { analyzePage, hidePositionedElements } from "./pageAnalyzer.js";
import { scrollTo, restoreScrollPosition, getScrollPosition, delay } from "./scrollController.js";
import { sendProgress, sendComplete, sendError, captureTab, downloadResult } from "./messaging.js";
import { createScrollPlan, outputDimensions, assertCanvasSize } from "../shared/captureMath.js";
import { POST_SCROLL_SETTLE_MS } from "../shared/constants.js";
import { dataUrlSize, formatBytes, formatToDetails, qualityToNumber } from "../shared/helpers.js";

let cancelled = false;
export function cancelCapture() { cancelled = true; }

function nextFrame() { return new Promise((resolve) => requestAnimationFrame(resolve)); }
async function settlePage(ms = POST_SCROLL_SETTLE_MS) {
  await nextFrame();
  await nextFrame();
  if (document.fonts?.ready) await Promise.race([document.fonts.ready, delay(1000)]);
  await delay(ms);
}
function checkCancelled() { if (cancelled) throw new Error("Capture cancelled"); }

export async function startCapture({ mode, settings = {} }) {
  cancelled = false;
  showCaptureOverlay({ mode });
  const originalScroll = getScrollPosition();
  let restoreElements = () => {};
  try {
    if (Number(settings.delay) > 0) {
      sendProgress("analyze", 2, { message: `Waiting ${settings.delay} seconds` });
      await delay(Number(settings.delay) * 1000);
    }
    checkCancelled();
    // A full-page image intentionally keeps its first viewport intact. This
    // presents the page naturally once, then removes repeated floating chrome.
    if (mode !== "fullpage") restoreElements = hidePositionedElements(settings);
    const result = mode === "fullpage" ? await captureFullPage(settings) : await captureVisible(settings);
    sendComplete(result);
    if (settings.autoDownload) await downloadResult(result, settings);
    return { success: true, data: result };
  } catch (error) {
    sendError(cancelled ? "CAPTURE_CANCELLED" : "CAPTURE_FAILED", error.message, cancelled);
    return { success: false, error: error.message };
  } finally {
    restoreElements();
    restoreScrollPosition(originalScroll);
    hideCaptureOverlay();
  }
}

async function captureVisible(settings) {
  sendProgress("capture", 30);
  await settlePage();
  checkCancelled();
  const imageData = await captureWithoutOverlay();
  sendProgress("finalize", 90);
  const rendered = await convertImage(imageData, settings);
  return buildResult(rendered.dataUrl, rendered.width, rendered.height, "visible", settings);
}

async function captureFullPage(settings) {
  sendProgress("analyze", 5);
  let page = analyzePage();
  const positions = createScrollPlan(page.scrollHeight, page.vpHeight);
  const captures = [];
  let restoreFloatingElements = () => {};
  sendProgress("scroll", 10, { currentSection: 0, totalSections: positions.length });
  try {
    for (let index = 0; index < positions.length; index += 1) {
      checkCancelled();
      if (index === 1) restoreFloatingElements = hidePositionedElements(settings);
      scrollTo(positions[index]);
      await settlePage();
      const actualY = getScrollPosition();
      const imageData = await captureWithoutOverlay();
      captures.push({ imageData, y: actualY });
      sendProgress("capture", 10 + ((index + 1) / positions.length) * 65, { currentSection: index + 1, totalSections: positions.length });
    }
    // A lazy-loaded page may have grown; capture the newly exposed tail once.
    page = analyzePage();
    const finalPlan = createScrollPlan(page.scrollHeight, page.vpHeight);
    const tailY = finalPlan.at(-1);
    if (tailY > captures.at(-1).y) {
      scrollTo(tailY);
      await settlePage();
      captures.push({ imageData: await captureWithoutOverlay(), y: getScrollPosition() });
    }
    sendProgress("merge", 78);
    const rendered = await stitchCaptures(captures, page, settings);
    sendProgress("finalize", 94);
    return buildResult(rendered.dataUrl, rendered.width, rendered.height, "fullpage", settings);
  } finally {
    restoreFloatingElements();
  }
}

function hideOverlayForCapture() {
  const el = document.getElementById("snap-capture-overlay");
  if (el) el.style.display = "none";
}
function showOverlayAfterCapture() {
  const el = document.getElementById("snap-capture-overlay");
  if (el) el.style.display = "";
}

async function captureWithoutOverlay() {
  hideOverlayForCapture();
  // Let the browser paint the hidden state before Chrome snapshots the tab.
  await nextFrame();
  try {
    return await captureTab();
  } finally {
    showOverlayAfterCapture();
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to decode a captured image"));
    image.src = src;
  });
}

async function stitchCaptures(captures, page, settings) {
  if (!captures.length) throw new Error("No images were captured");
  const first = await loadImage(captures[0].imageData);
  const scaleX = first.naturalWidth / page.vpWidth;
  const scaleY = first.naturalHeight / page.vpHeight;
  const dimensions = outputDimensions(page.vpWidth, page.scrollHeight, scaleX, scaleY);
  assertCanvasSize(dimensions);
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < captures.length; index += 1) {
    const image = index === 0 ? first : await loadImage(captures[index].imageData);
    const y = Math.round(captures[index].y * scaleY);
    context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, y, canvas.width, image.naturalHeight);
  }
  return exportCanvas(canvas, settings);
}

async function convertImage(dataUrl, settings) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext("2d").drawImage(image, 0, 0);
  return exportCanvas(canvas, settings);
}

function exportCanvas(canvas, settings) {
  const { mime } = formatToDetails(settings.format);
  return { dataUrl: canvas.toDataURL(mime, qualityToNumber(settings.quality)), width: canvas.width, height: canvas.height };
}

function buildResult(imageData, width, height, mode, settings) {
  return {
    imageData,
    dimensions: `${width} × ${height}`,
    format: formatToDetails(settings.format).extension.toUpperCase(),
    size: formatBytes(dataUrlSize(imageData)),
    capturedAt: new Date().toISOString(),
    source: document.title || location.hostname,
    title: document.title || "page",
    domain: location.hostname,
    mode,
    settings: { format: settings.format, location: settings.location, namingPattern: settings.namingPattern },
  };
}
