export const CAPTURE_INTERVAL_MS = 550;
export const POST_SCROLL_SETTLE_MS = 250;
export const MAX_OUTPUT_DIMENSION = 32767;
export const MAX_OUTPUT_PIXELS = 120_000_000;
export const MAX_SCROLL_STEPS = 300;
export const MAX_PAGE_HEIGHT = 200_000;
export const CAPTURE_TIMEOUT_MS = 120_000;

export const DEFAULT_SETTINGS = Object.freeze({
  format: "png",
  quality: "high",
  delay: "0",
  floatingMode: "smart",
  hideFixed: false,
  ignoreSticky: false,
  location: "downloads",
  autoDownload: false,
  namingPattern: "Snap_{title}-{date}-{time}",
});

export const FORMAT_DETAILS = Object.freeze({
  png: { mime: "image/png", extension: "png" },
  jpeg: { mime: "image/jpeg", extension: "jpg" },
  webp: { mime: "image/webp", extension: "webp" },
});
