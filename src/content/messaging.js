import { buildProgress, buildComplete, buildError } from "../shared/messages.js";

export function sendProgress(stage, percent, detail) {
  chrome.runtime.sendMessage(buildProgress(stage, percent, detail)).catch(() => {});
}

export function sendComplete(result) {
  chrome.runtime.sendMessage(buildComplete(result)).catch(() => {});
}

export function sendError(code, message, recoverable = false) {
  chrome.runtime.sendMessage(buildError(code, message, recoverable)).catch(() => {});
}

export async function captureTab() {
  const response = await chrome.runtime.sendMessage({ type: "SNAP/CAPTURE_TAB" });
  console.log("[Snap Content] CAPTURE_TAB response:", response);
  if (!response?.imageData) {
    const errMsg = response?.error || "response missing imageData";
    console.error("[Snap Content] CAPTURE_TAB failed:", errMsg);
    throw new Error(errMsg);
  }
  return response.imageData;
}
