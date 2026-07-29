import { showCaptureOverlay, hideCaptureOverlay } from "./captureOverlay.js";
import { analyzePage, calculateSectionViewports } from "./pageAnalyzer.js";
import { scrollTo, restoreScrollPosition, getScrollPosition, delay } from "./scrollController.js";
import { sendProgress, sendComplete, sendError, captureTab } from "./messaging.js";

function hideOverlayForCapture() {
  const el = document.getElementById("snap-capture-overlay");
  if (el) el.style.display = "none";
}

function showOverlayAfterCapture() {
  const el = document.getElementById("snap-capture-overlay");
  if (el) el.style.display = "";
}

function nextFrame() {
  return new Promise((r) => requestAnimationFrame(r));
}

export async function startCapture({ mode, settings }) {
  console.log("[Snap Content] startCapture called", { mode, settings });
  showCaptureOverlay({ mode });

  const capMode = mode === "fullpage" ? "fullpage" : "visible";

  try {
    sendProgress("analyze", 5);

    if (capMode === "fullpage") {
      return await captureFullPage(settings);
    }

    return await captureVisible(settings);
  } catch (err) {
    hideCaptureOverlay();
    sendError("CAPTURE_FAILED", err.message, true);
    return { success: false, error: err.message };
  }
}

async function captureFullPage(settings) {
  const pageInfo = analyzePage();
  const sections = calculateSectionViewports(pageInfo.totalSections, pageInfo.vpHeight);
  const totalSections = sections.length;

  const origScroll = getScrollPosition();
  sendProgress("scroll", 10, { currentSection: 0, totalSections });

  const captures = [];

  for (const section of sections) {
    scrollTo(section.y);
    await delay(300);

    sendProgress("capture", 10 + ((section.index + 1) / totalSections) * 60, {
      currentSection: section.index + 1,
      totalSections,
    });

    hideOverlayForCapture();
    await nextFrame();
    const imageData = await captureTab();
    showOverlayAfterCapture();
    captures.push(imageData);
  }

  sendProgress("merge", 75);

  const merged = await stitchCaptures(captures, pageInfo.vpHeight);
  if (!merged) throw new Error("Failed to stitch captures");

  restoreScrollPosition(origScroll);
  sendProgress("finalize", 90);

  hideCaptureOverlay();
  sendComplete(buildResult(merged, "fullpage", settings));

  return { success: true, data: buildResult(merged, "fullpage", settings) };
}

async function captureVisible(settings) {
  sendProgress("capture", 30);

  hideOverlayForCapture();
  await nextFrame();
  const imageData = await captureTab();
  showOverlayAfterCapture();

  sendProgress("finalize", 80);

  hideCaptureOverlay();
  sendComplete(buildResult(imageData, "visible", settings));

  return { success: true, data: buildResult(imageData, "visible", settings) };
}

function buildResult(imageData, mode, settings) {
  const now = new Date();
  return {
    imageData,
    dimensions: mode === "fullpage"
      ? "Full page"
      : `${window.innerWidth} × ${window.innerHeight}`,
    format: settings?.format || "PNG",
    size: formatSize(dataUrlSize(imageData)),
    capturedAt: now.toISOString(),
    source: document.title || new URL(location.href).hostname,
  };
}

async function stitchCaptures(captures, _vpHeight) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const images = [];
  for (const src of captures) {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = src;
    });
    images.push(img);
  }

  const sectionH = images[0].naturalHeight;
  const sectionW = images[0].naturalWidth;

  canvas.width = sectionW;
  canvas.height = sectionH * images.length;

  for (let i = 0; i < images.length; i++) {
    ctx.drawImage(images[i], 0, i * sectionH);
  }

  return canvas.toDataURL("image/png");
}

function dataUrlSize(dataUrl) {
  const raw = dataUrl.split(",")[1] || "";
  return Math.round((raw.length * 3) / 4);
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
