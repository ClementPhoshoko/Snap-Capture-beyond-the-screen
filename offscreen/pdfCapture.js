import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

const MAX_PDF_PAGES = 6;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdf.worker.min.mjs");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "SNAP/PDF_RENDER") return;
  renderPDF(message.payload).then(sendResponse).catch((err) => sendResponse({ success: false, error: err.message }));
  return true;
});

async function renderPDF({ pdfUrl, format, quality }) {
  const response = await fetch(pdfUrl);
  if (!response.ok) throw new Error(`Failed to fetch PDF blob: ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();

  const loadingTask = getDocument({ data: arrayBuffer, useWorkerFetch: false, isEvalSupported: false, disableRange: true, disableStream: true, disableAutoFetch: true });
  const pdf = await loadingTask.promise;

  const totalPages = Math.min(pdf.numPages, MAX_PDF_PAGES);
  const scale = 1.5;
  const rendered = [];

  let totalHeight = 0;
  let maxWidth = 0;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    rendered.push(canvas);
    totalHeight += viewport.height;
    maxWidth = Math.max(maxWidth, viewport.width);
  }

  const result = document.createElement("canvas");
  result.width = maxWidth;
  result.height = totalHeight;
  const rctx = result.getContext("2d");
  rctx.fillStyle = "#ffffff";
  rctx.fillRect(0, 0, result.width, result.height);

  let y = 0;
  for (const c of rendered) {
    rctx.drawImage(c, (maxWidth - c.width) / 2, y);
    y += c.height;
  }

  const mime = format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
  const qualityNum = { high: 0.92, medium: 0.8, low: 0.65 }[quality] ?? 0.92;
  const dataUrl = result.toDataURL(mime, qualityNum);

  const rawSize = Math.floor((dataUrl.split(",")[1]?.length || 0) * 3 / 4);

  return {
    success: true,
    imageData: dataUrl,
    width: result.width,
    height: result.height,
    totalPages,
    format: format.toUpperCase(),
    size: formatBytes(rawSize),
  };
}
