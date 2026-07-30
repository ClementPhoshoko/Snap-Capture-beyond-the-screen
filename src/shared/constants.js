export const CAPTURE_INTERVAL_MS = 550;
export const POST_SCROLL_SETTLE_MS = 250;
export const MAX_OUTPUT_DIMENSION = 32767;
export const MAX_OUTPUT_PIXELS = 120_000_000;
export const MAX_SCROLL_STEPS = 300;
export const MAX_PAGE_HEIGHT = 200_000;
export const CAPTURE_TIMEOUT_MS = 120_000;
export const MAX_TAIL_GROWTH_ATTEMPTS = 3;

export const DEFAULT_SETTINGS = Object.freeze({
  format: "png",
  quality: "high",
  delay: "0",
  floatingMode: "smart",
  location: "downloads",
  autoDownload: false,
  namingPattern: "Snap_{title}-{date}-{time}",
  theme: "dark",
  accent: "purple",
});

export const FORMAT_DETAILS = Object.freeze({
  png: { mime: "image/png", extension: "png" },
  jpeg: { mime: "image/jpeg", extension: "jpg" },
  webp: { mime: "image/webp", extension: "webp" },
});

export const AI_DEFAULT_SETTINGS = Object.freeze({
  apiKey: "",
  provider: "gemini",
  model: "gemini-3.6-flash",
  modelsCascade: ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.1-pro-preview"],
});

export const EXTRACT_DESIGN_STAGES = [
  "capture",
  "dom",
  "styles",
  "css-vars",
  "fonts",
  "images",
  "svgs",
  "icons",
  "layout",
  "spacing",
  "assets",
  "payload",
  "generate",
  "verify",
  "improve",
  "export",
];
