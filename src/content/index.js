import { startCapture } from "./captureManager.js";
import { MessageType } from "../shared/messages.js";

console.log("[Snap Content] Script loaded");

let captureInProgress = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type) return;

  console.log("[Snap Content] Received:", message.type);

  if (message.type === MessageType.START_CAPTURE) {
    if (captureInProgress) {
      console.log("[Snap Content] Capture already in progress");
      sendResponse({ success: false, error: "Capture already in progress" });
      return;
    }

    captureInProgress = true;
    console.log("[Snap Content] Starting capture with payload:", message.payload);

    startCapture(message.payload)
      .then((result) => {
        captureInProgress = false;
        console.log("[Snap Content] Capture completed:", result.success);
        sendResponse(result);
      })
      .catch((err) => {
        captureInProgress = false;
        console.error("[Snap Content] Capture error:", err);
        sendResponse({ success: false, error: err.message });
      });

    return true;
  }
});
