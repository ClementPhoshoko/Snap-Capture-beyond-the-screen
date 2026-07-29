import { startCapture, cancelCapture } from "./captureManager.js";
import { MessageType } from "../shared/messages.js";

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
