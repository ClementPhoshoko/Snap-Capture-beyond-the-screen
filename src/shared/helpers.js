import { FORMAT_DETAILS } from "./constants.js";

export function formatToDetails(format) {
  return FORMAT_DETAILS[String(format || "png").toLowerCase()] || FORMAT_DETAILS.png;
}

export function qualityToNumber(quality) {
  return ({ high: 0.92, medium: 0.8, low: 0.65 })[quality] ?? 0.92;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function dataUrlSize(dataUrl) {
  const raw = dataUrl?.split(",")[1] || "";
  return Math.floor((raw.length * 3) / 4);
}

export function safeFilename(value, fallback = "Snap") {
  const cleaned = String(value || "")
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "")
    .slice(0, 120);
  return cleaned || fallback;
}

export function makeFilename(pattern, title, format, now = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const name = String(pattern || "Snap_{date}-{time}")
    .replaceAll("{title}", safeFilename(title, "page"))
    .replaceAll("{date}", date)
    .replaceAll("{time}", time);
  return `${safeFilename(name)}.${formatToDetails(format).extension}`;
}
