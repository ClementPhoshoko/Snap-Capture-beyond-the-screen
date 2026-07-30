/**
 * AkovoLabs Snap — Message Protocol
 *
 * Shared types and helpers for communication between
 * popup ↔ background ↔ content script.
 *
 * Flow:
 *   popup  →  background  →  content   (START_CAPTURE)
 *   content →  background  →  popup     (PROGRESS / COMPLETE / ERROR)
 */

// ─── Message types ───────────────────────────────────────────

/** @readonly */
export const MessageType = Object.freeze({
  START_CAPTURE: "SNAP/START_CAPTURE",
  CAPTURE_PROGRESS: "SNAP/CAPTURE_PROGRESS",
  CAPTURE_COMPLETE: "SNAP/CAPTURE_COMPLETE",
  CAPTURE_ERROR: "SNAP/CAPTURE_ERROR",
  CAPTURE_TAB: "SNAP/CAPTURE_TAB",
  PING: "SNAP/PING",
  CANCEL_CAPTURE: "SNAP/CANCEL_CAPTURE",
  DOWNLOAD_RESULT: "SNAP/DOWNLOAD_RESULT",
  EXTRACT_DESIGN: "SNAP/EXTRACT_DESIGN",
  EXTRACT_DESIGN_PROGRESS: "SNAP/EXTRACT_DESIGN_PROGRESS",
  EXTRACT_DESIGN_COMPLETE: "SNAP/EXTRACT_DESIGN_COMPLETE",
  EXTRACT_DESIGN_ERROR: "SNAP/EXTRACT_DESIGN_ERROR",
  AI_CONFIG_SAVE: "SNAP/AI_CONFIG_SAVE",
  AI_CONFIG_GET: "SNAP/AI_CONFIG_GET",
  AI_CONFIG_TEST: "SNAP/AI_CONFIG_TEST",
});

// ─── Payload builders ────────────────────────────────────────

/**
 * @param {"fullpage"|"visible"} mode
 * @param {Object} [settings]
 * @param {"high"|"medium"|"low"} [settings.quality]
 * @param {string} [settings.format]
 * @param {number} [settings.delay]
 * @param {"smart"|"none"|"all"} [settings.floatingMode]
 * @param {boolean} [settings.autoDownload]
 */
export function buildStartCapture(mode, settings = {}) {
  return {
    type: MessageType.START_CAPTURE,
    payload: { mode, settings },
  };
}

export function buildCaptureTab() {
  return { type: MessageType.CAPTURE_TAB };
}

export function buildCancelCapture() {
  return { type: MessageType.CANCEL_CAPTURE, payload: {} };
}

/**
 * @param {"analyze"|"scroll"|"capture"|"merge"|"finalize"} stage
 * @param {number} percent  0–100
 * @param {Object} [detail]
 * @param {number} [detail.currentSection]
 * @param {number} [detail.totalSections]
 * @param {string} [detail.message]
 */
export function buildProgress(stage, percent, detail = {}) {
  return {
    type: MessageType.CAPTURE_PROGRESS,
    payload: { stage, percent, ...detail },
  };
}

/**
 * @param {Object} result
 * @param {string} result.imageData   base64 data URL
 * @param {string} result.dimensions  e.g. "1920 × 1080"
 * @param {string} result.format      e.g. "PNG"
 * @param {string} result.size        e.g. "2.4 MB"
 * @param {string} result.capturedAt  ISO string
 * @param {string} result.source      page title / URL
 */
export function buildComplete(result) {
  return {
    type: MessageType.CAPTURE_COMPLETE,
    payload: result,
  };
}

/**
 * @param {string} code    machine-readable error code
 * @param {string} message human-readable description
 * @param {boolean} [recoverable]
 */
export function buildError(code, message, recoverable = false) {
  return {
    type: MessageType.CAPTURE_ERROR,
    payload: { code, message, recoverable },
  };
}

export function buildExtractDesignProgress(stage, percent, detail = {}) {
  return {
    type: MessageType.EXTRACT_DESIGN_PROGRESS,
    payload: { stage, percent, ...detail },
  };
}

export function buildExtractDesignComplete(result) {
  return {
    type: MessageType.EXTRACT_DESIGN_COMPLETE,
    payload: result,
  };
}

export function buildExtractDesignError(code, message, recoverable = false) {
  return {
    type: MessageType.EXTRACT_DESIGN_ERROR,
    payload: { code, message, recoverable },
  };
}

// ─── Send helpers ────────────────────────────────────────────

/**
 * Send a message to the background service worker.
 * @returns {Promise<Object>} response `{ success, data?, error? }`
 */
export function sendToBackground(message) {
  if (!chrome.runtime?.sendMessage) {
    console.warn("[Snap] chrome.runtime.sendMessage not available");
    return Promise.resolve({ success: false, error: "chrome.runtime not available" });
  }
  try {
    const result = chrome.runtime.sendMessage(message);
    if (result instanceof Promise) {
      return result.then((res) => res || { success: false, error: "Background did not respond" }).catch((err) => ({
        success: false,
        error: err.message ?? "Failed to reach background",
      }));
    }
    return Promise.resolve({ success: false, error: "Background did not respond" });
  } catch (err) {
    return Promise.resolve({ success: false, error: err.message ?? "Unexpected error" });
  }
}

/**
 * Send a message to a specific tab (content script).
 * @param {number} tabId
 * @returns {Promise<Object>}
 */
export function sendToTab(tabId, message) {
  if (!chrome.tabs?.sendMessage) {
    console.warn("[Snap] chrome.tabs.sendMessage not available");
    return Promise.resolve({ success: false, error: "chrome.tabs not available" });
  }
  return chrome.tabs.sendMessage(tabId, message).catch((err) => ({
    success: false,
    error: err.message ?? "Failed to reach tab",
  }));
}

// ─── Listener helpers ────────────────────────────────────────

const _listeners = new WeakMap();

/**
 * Register a typed message listener.
 * Handler receives `(message, sender)` and should return a response
 * or `true` to indicate async response will be sent later.
 *
 * @param {(message: Object, sender: chrome.runtime.MessageSender) => any} handler
 */
export function onMessage(handler) {
  if (!chrome.runtime?.onMessage) {
    console.warn("[Snap] chrome.runtime.onMessage not available in this context");
    return;
  }
  const wrapper = (message, sender, sendResponse) => {
    if (!message || !message.type) return;
    const result = handler(message, sender);
    if (result instanceof Promise) {
      result.then(sendResponse);
      return true;
    }
    if (result !== undefined) sendResponse(result);
  };

  _listeners.set(handler, wrapper);
  chrome.runtime.onMessage.addListener(wrapper);
}

export function offMessage(handler) {
  if (!chrome.runtime?.onMessage) return;
  const wrapper = _listeners.get(handler);
  if (wrapper) {
    chrome.runtime.onMessage.removeListener(wrapper);
    _listeners.delete(handler);
  }
}

// ─── Validation ──────────────────────────────────────────────

const VALID_TYPES = new Set(Object.values(MessageType));

/** @param {any} message */
export function isValidMessage(message) {
  return message && typeof message === "object" && VALID_TYPES.has(message.type) && message.payload != null;
}
