import { DEFAULT_SETTINGS, AI_DEFAULT_SETTINGS } from "./constants.js";

const SETTINGS_KEY = "settings";
const HISTORY_KEY = "captureHistory";
const AI_CONFIG_KEY = "aiConfig";
const EXTRACT_STATUS_KEY = "extractDesignStatus";

export async function getSettings() {
  const stored = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(stored[SETTINGS_KEY] || {}) };
}

export async function saveSettings(settings) {
  const next = { ...DEFAULT_SETTINGS, ...settings };
  await chrome.storage.local.set({ [SETTINGS_KEY]: next });
  return next;
}

export async function resetSettings() {
  await chrome.storage.local.remove(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS };
}

export async function getCaptureHistory() {
  const stored = await chrome.storage.local.get(HISTORY_KEY);
  return stored[HISTORY_KEY] || [];
}

export async function deleteCaptureEntry(id) {
  const entries = await getCaptureHistory();
  await chrome.storage.local.set({ [HISTORY_KEY]: entries.filter((e) => e.id !== id) });
}

function buildDesignExtractSummary(result, archiveId) {
  return {
    archiveId,
    projectName: result.projectName || "extracted-design",
    filename: `${result.projectName || "extracted-design"}.zip`,
    size: result.size || "",
    format: result.format || "react",
    similarityScore: result.similarityScore || 0,
    files: result.files || 0,
    capturedAt: result.capturedAt || new Date().toISOString(),
  };
}

export async function recordCapture(result) {
  const entries = await getCaptureHistory();
  const entry = {
    id: crypto.randomUUID(),
    title: result.title || result.source,
    domain: result.domain || "",
    url: result.url || "",
    favicon: result.favicon || "",
    thumbnail: result.thumbnail || "",
    resolution: result.dimensions,
    format: result.format,
    size: result.size,
    capturedAt: result.capturedAt,
  };
  await chrome.storage.local.set({ [HISTORY_KEY]: [entry, ...entries].slice(0, 50) });
  return entry;
}

export async function recordDesignExtract(result, tabMeta = {}, archiveId) {
  const entries = await getCaptureHistory();
  const designExtract = buildDesignExtractSummary(result, archiveId);
  const entry = {
    id: crypto.randomUUID(),
    title: tabMeta.title || result.projectName || "Extracted design",
    domain: tabMeta.domain || "",
    url: tabMeta.url || "",
    favicon: tabMeta.favicon || "",
    thumbnail: tabMeta.thumbnail || "",
    type: "design-extract",
    resolution: "Design extract",
    format: "ZIP",
    size: result.size || "",
    capturedAt: designExtract.capturedAt,
    designExtract,
  };
  await chrome.storage.local.set({ [HISTORY_KEY]: [entry, ...entries].slice(0, 50) });
  return entry;
}

export async function getAIConfig() {
  const stored = await chrome.storage.local.get(AI_CONFIG_KEY);
  return { ...AI_DEFAULT_SETTINGS, ...(stored[AI_CONFIG_KEY] || {}) };
}

export async function saveAIConfig(config) {
  const next = { ...AI_DEFAULT_SETTINGS, ...config };
  await chrome.storage.local.set({ [AI_CONFIG_KEY]: next });
  return next;
}

export async function getExtractDesignStatus() {
  const stored = await chrome.storage.local.get(EXTRACT_STATUS_KEY);
  return stored[EXTRACT_STATUS_KEY] || null;
}

export async function saveExtractDesignStatus(status) {
  const next = { ...status, updatedAt: new Date().toISOString() };
  await chrome.storage.local.set({ [EXTRACT_STATUS_KEY]: next });
  return next;
}

export async function clearExtractDesignStatus() {
  await chrome.storage.local.remove(EXTRACT_STATUS_KEY);
}
