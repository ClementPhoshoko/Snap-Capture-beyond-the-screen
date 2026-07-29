import { buildProgress, buildComplete, buildError, MessageType } from "../shared/messages.js";

export const sendProgress = (stage, percent, detail) => chrome.runtime.sendMessage(buildProgress(stage, percent, detail)).catch(() => {});
export const sendComplete = (result) => chrome.runtime.sendMessage(buildComplete(result)).catch(() => {});
export const sendError = (code, message, recoverable = false) => chrome.runtime.sendMessage(buildError(code, message, recoverable)).catch(() => {});

export async function captureTab() {
  const response = await chrome.runtime.sendMessage({ type: MessageType.CAPTURE_TAB, payload: {} });
  if (!response?.imageData) throw new Error(response?.error || "Browser did not return an image");
  return response.imageData;
}

export async function downloadResult(result, settings) {
  const response = await chrome.runtime.sendMessage({
    type: MessageType.DOWNLOAD_RESULT,
    payload: { imageData: result.imageData, title: result.title, format: result.settings.format, location: settings.location, namingPattern: settings.namingPattern },
  });
  if (!response?.success) throw new Error(response?.error || "Download failed");
}
