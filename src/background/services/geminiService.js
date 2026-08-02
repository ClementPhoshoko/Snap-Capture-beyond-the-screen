import { getAIConfig } from "../../shared/storage.js";
import { AI_DEFAULT_SETTINGS } from "../../shared/constants.js";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const API_REVISION = "2026-05-20";
let _modelsCache = null;

const DEPRECATED_PREFIXES = [
  "gemini-2.0-",
  "gemini-2.5-",
  "gemini-1.5-",
  "gemini-pro",
  "deep-research-",
  "learnlm-",
  "embedding-",
  "text-",
  "chat-",
];

function isDeprecated(model) {
  return DEPRECATED_PREFIXES.some((p) => model.startsWith(p));
}

function isGeminiModel(name) {
  return name.startsWith("gemini-");
}

const FALLBACK_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-pro-preview",
];

async function getApiKey() {
  const config = await getAIConfig();
  return config.apiKey || null;
}

async function getModelConfig() {
  const config = await getAIConfig();
  let primary = config.model || AI_DEFAULT_SETTINGS.model;
  if (!isGeminiModel(primary) || isDeprecated(primary)) {
    primary = AI_DEFAULT_SETTINGS.model;
  }
  const cascade = config.modelsCascade?.length
    ? config.modelsCascade.filter((m) => isGeminiModel(m) && !isDeprecated(m))
    : AI_DEFAULT_SETTINGS.modelsCascade;
  return { primary, cascade };
}

async function listModels(apiKey) {
  if (_modelsCache) return _modelsCache;
  try {
    const res = await fetch(`${GEMINI_API_BASE}/models?key=${apiKey}`);
    const data = await res.json();
    if (res.ok && data.models) {
      const supported = data.models
        .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m) => m.name.replace("models/", ""))
        .filter((m) => isGeminiModel(m) && !isDeprecated(m));
      if (supported.length > 0) {
        _modelsCache = supported;
        return supported;
      }
    }
  } catch {}
  return FALLBACK_MODELS;
}

async function interactionsRequest(model, body, signal) {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("Gemini API key not configured. Add it in Settings > AI Configuration.");
  const response = await fetch(`${GEMINI_API_BASE}/interactions?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Revision": API_REVISION,
    },
    body: JSON.stringify({
      model,
      ...body,
    }),
    signal,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err.error?.message || `Gemini API error: ${response.status}`;
    const lower = msg.toLowerCase();
    if (
      lower.includes("unknown parameter") ||
      lower.includes("not found") ||
      lower.includes("no longer available") ||
      lower.includes("not available") ||
      lower.includes("disabled") ||
      lower.includes("deprecated") ||
      lower.includes("does not exist") ||
      lower.includes("does not support image")
    ) {
      return { _modelNotFound: true, message: msg };
    }
    if (response.status === 404) {
      return { _modelNotFound: true, message: msg };
    }
    throw new Error(msg);
  }
  return response.json();
}

async function generateContentRequest(model, body, signal) {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("Gemini API key not configured. Add it in Settings > AI Configuration.");
  const response = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err.error?.message || `Gemini API error: ${response.status}`;
    const lower = msg.toLowerCase();
    if (
      response.status === 404 ||
      lower.includes("not found") ||
      lower.includes("no longer available") ||
      lower.includes("does not support image")
    ) {
      return { _modelNotFound: true, message: msg };
    }
    throw new Error(msg);
  }
  return response.json();
}

function extractResponseText(data) {
  if (!data) return null;
  // Interactions API format: { steps: [...] }
  const steps = data.steps;
  if (steps && steps.length > 0) {
    const lastOutput = [...steps].reverse().find((s) => s.type === "model_output" || s.type === "tool_output");
    if (lastOutput) {
      const textPart = (lastOutput.content || []).find((p) => p.type === "text");
      if (textPart?.text) return textPart.text;
    }
  }
  // generateContent format: { candidates: [{ content: { parts: [...] } }] }
  const candidates = data.candidates;
  if (candidates && candidates.length > 0) {
    const parts = candidates[0]?.content?.parts;
    if (parts && parts.length > 0) {
      const textPart = parts.find((p) => p.text);
      if (textPart?.text) return textPart.text;
    }
  }
  return null;
}

async function cascadeRequest(modelBodyFn, signal) {
  const { primary, cascade } = await getModelConfig();
  const modelsToTry = [primary, ...cascade.filter((m) => m !== primary)]
    .filter((m) => isGeminiModel(m) && !isDeprecated(m));
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("Gemini API key not configured. Add it in Settings > AI Configuration.");

  const errors = [];
  for (const model of modelsToTry) {
    const body = modelBodyFn(model);

    // Prefer generateContent because it supports JSON response hints more consistently.
    try {
      const gcBody = {
        contents: [{ parts: body.input?.parts || [] }],
      };
      if (body.config?.system_instruction) {
        gcBody.systemInstruction = { parts: [{ text: body.config.system_instruction }] };
      }
      if (body.config?.generation_config) {
        gcBody.generationConfig = body.config.generation_config;
      }
      const result = await generateContentRequest(model, gcBody, signal);
      if (result && result._modelNotFound) {
        errors.push(`${model} (generateContent): ${result.message}`);
      } else {
        return result;
      }
    } catch (gcErr) {
      if (gcErr?.name === "AbortError") throw gcErr;
      errors.push(`${model} (generateContent): ${gcErr.message}`);
    }

    // Fallback to Interactions API for endpoints that need it.
    try {
      const result = await interactionsRequest(model, body, signal);
      if (result && result._modelNotFound) {
        errors.push(`${model} (interactions): ${result.message}`);
      } else {
        return result;
      }
    } catch (err) {
      if (err?.name === "AbortError") throw err;
      errors.push(`${model} (interactions): ${err.message}`);
    }
  }

  const quotaErrors = errors.filter((e) => e.includes("quota") || e.includes("limit") || e.includes("rate"));
  const notFound = errors.filter((e) => e.includes("not found") || e.includes("deprecated") || e.includes("no longer available"));
  const summary = [];
  if (quotaErrors.length > 0) {
    summary.push(`Quota exhausted on ${quotaErrors.length} model(s). Enable billing at https://console.cloud.google.com/billing or create a new API key without billing restrictions at https://aistudio.google.com/apikey`);
  }
  if (notFound.length > 0 && quotaErrors.length === 0) {
    summary.push(`Models unavailable: ${notFound.join("; ")}. Create a new API key at https://aistudio.google.com/apikey`);
  }
  if (summary.length === 0) {
    summary.push(errors[errors.length - 1]);
  }
  throw new Error(summary.join("\n"));
}

function extractScreenshotData(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function stripJsonFence(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseProjectJson(text) {
  const cleaned = stripJsonFence(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Gemini did not return JSON");
    return JSON.parse(jsonMatch[0]);
  }
}

function validateProject(project) {
  if (!project || typeof project !== "object") {
    throw new Error("Gemini returned an invalid project payload");
  }
  if (!Array.isArray(project.files) || project.files.length === 0) {
    throw new Error("Gemini returned no project files");
  }
  const hasApp = project.files.some((file) => {
    const path = String(file?.path || "").replace(/\\/g, "/").replace(/^(\.\/)+/, "");
    const content = file?.content || file?.code || file?.source;
    return /(^|\/)App\.jsx$/i.test(path) && typeof content === "string" && content.trim();
  });
  if (!hasApp) {
    throw new Error("Gemini returned project files, but none contained App.jsx");
  }
  return project;
}

export async function testConnection() {
  const apiKey = await getApiKey();
  if (!apiKey) return { success: false, error: "API key not configured" };
  try {
    const probeErrors = [];
    for (const model of FALLBACK_MODELS) {
      for (const label of ["interactions", "genContent"]) {
        let url, body, headers;
        if (label === "interactions") {
          url = "interactions";
          headers = { "Api-Revision": API_REVISION, "Content-Type": "application/json" };
          body = { model, input: { parts: [{ text: "ping" }] }, config: { generation_config: { max_output_tokens: 10 } } };
        } else {
          url = `models/${model}:generateContent`;
          headers = { "Content-Type": "application/json" };
          body = { contents: [{ parts: [{ text: "ping" }] }] };
        }
        const genResp = await fetch(`${GEMINI_API_BASE}/${url}?key=${apiKey}`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        if (genResp.ok) {
          _modelsCache = null;
          return { success: true, models: FALLBACK_MODELS };
        }
        const errData = await genResp.json().catch(() => ({}));
        const msg = errData.error?.message || `HTTP ${genResp.status}`;
        if (msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("rate")) {
          return { success: false, error: msg, models: FALLBACK_MODELS };
        }
        probeErrors.push(`${model} (${label}): ${msg}`);
      }
    }
    return { success: false, error: `No working model. Errors:\n${probeErrors.join("\n")}`, models: FALLBACK_MODELS };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// rough estimate: 1 token ~ 4 chars for text, image tokens based on pixels
function estimateTokens(text, imageBase64) {
  const textTokens = Math.ceil(text.length / 4);
  let imageTokens = 0;
  if (imageBase64) {
    const bytes = Math.round((imageBase64.length * 3) / 4);
    const pixels = bytes; // rough: 1 byte ~ 1 pixel for JPEG
    imageTokens = Math.ceil(pixels / 3); // ~3 pixels per token for images
  }
  return { textTokens, imageTokens, total: textTokens + imageTokens };
}

function truncateJson(obj, maxChars) {
  const str = JSON.stringify(obj);
  if (str.length <= maxChars) return obj;
  if (Array.isArray(obj)) {
    while (JSON.stringify(obj).length > maxChars && obj.length > 0) {
      if (typeof obj[obj.length - 1] === "object" && obj[obj.length - 1] !== null) {
        const keys = Object.keys(obj[obj.length - 1]);
        for (const k of keys) {
          delete obj[obj.length - 1][k];
        }
      }
      obj.pop();
    }
    return obj;
  }
  if (obj && typeof obj === "object") {
    const keys = Object.keys(obj);
    for (const k of keys) {
      if (JSON.stringify(obj).length <= maxChars) break;
      if (typeof obj[k] === "string") {
        obj[k] = obj[k].slice(0, Math.max(100, Math.floor(obj[k].length / 2)));
      } else if (typeof obj[k] === "object" && obj[k] !== null) {
        obj[k] = truncateJson(obj[k], Math.floor(maxChars / keys.length));
      }
    }
    while (JSON.stringify(obj).length > maxChars && keys.length > 0) {
      delete obj[keys.pop()];
    }
    return obj;
  }
  return obj;
}

export async function generateProject(payload, onProgress, signal) {
  const systemInstruction = `Generate a React project matching the provided design data (DOM, styles, screenshots). Match layout, spacing, colors, and typography precisely. Use the visualReferences metadata to understand where each screenshot appears on long pages.

Text policy: Transcribe SHORT UI text exactly — headings, buttons, links, nav items, labels, form placeholders, footer text. For LONG body copy (paragraphs, article text, descriptions over ~120 chars), do NOT transcribe it — use a skeleton placeholder component instead (e.g. <Skeleton rows={n} />) whose height matches the original block. This preserves the visual design while keeping output compact.

Rules: React + plain CSS, responsive, accessible, no inline styles, clean naming, reusable components.
Use this simple project shape:
- App.jsx imports "./App.css"
- App.css contains regular class selectors
- index.jsx only mounts <App />
- Use plain className="..." strings. Do not use CSS Modules or className={styles.name}.

Output JSON:
{
  "projectName": "extracted-design",
  "files": [
    { "path": "App.jsx", "content": "..." },
    { "path": "App.css", "content": "..." },
    { "path": "index.jsx", "content": "..." }
  ],
  "assets": [{ "path": "public/img.png", "dataUrl": "..." }],
  "similarityScore": 95
}`;

  const { screenshot, screenshots, ...restPayload } = payload;

  let userPrompt = JSON.stringify(restPayload);
  const imageParts = (screenshots?.length ? screenshots : [screenshot])
    .map(extractScreenshotData)
    .filter(Boolean)
    .slice(0, 3);
  const estimated = estimateTokens(userPrompt, imageParts.map((img) => img.data).join(""));

  // Keep room for image input and generated files; oversized context slows output.
  const MAX_TEXT_TOKENS = 30000;
  if (estimated.textTokens > MAX_TEXT_TOKENS) {
    const maxChars = MAX_TEXT_TOKENS * 4;
    truncateJson(restPayload, maxChars);
    userPrompt = JSON.stringify(restPayload);
    console.warn(`[Gemini] Text payload truncated: ${estimated.textTokens} -> ~${Math.ceil(userPrompt.length / 4)} tokens`);
  }

  const parts = [{ text: userPrompt }];
  for (const img of imageParts) {
    parts.push({ inlineData: img });
  }

  const data = await cascadeRequest(
    (model) => ({
      input: { parts },
      config: {
        system_instruction: systemInstruction,
        generation_config: { max_output_tokens: 32768, responseMimeType: "application/json" },
      },
    }),
    signal,
  );

  const text = extractResponseText(data);
  if (!text) throw new Error("Gemini returned an empty response");

  return validateProject(parseProjectJson(text));
}

export async function fixDiscrepancies(originalPayload, generatedProject, diffReport, onProgress, signal) {
  const layoutSummary = {
    sections: originalPayload.layout?.sections?.length || 0,
    grids: originalPayload.layout?.grids?.length || 0,
    flexLayouts: originalPayload.layout?.flexLayouts?.length || 0,
    cards: originalPayload.layout?.cards?.length || 0,
  };

  const styleSummary = originalPayload.computedStyles
    ? Object.entries(originalPayload.computedStyles).slice(0, 30).map(([k, v]) => ({ selector: k, tag: v.tag, dims: v.rect }))
    : [];

  const domSummary = {
    elements: originalPayload.dom?.tagCount || 0,
    semantic: (originalPayload.dom?.semanticElements || []).slice(0, 20),
    links: (originalPayload.dom?.links || []).length,
    buttons: (originalPayload.dom?.buttons || []).length,
    forms: (originalPayload.dom?.forms || []).length,
  };

  const projectFiles = generatedProject.files
    ? generatedProject.files.map((f) => ({ path: f.path, length: f.content?.length || 0 }))
    : [];

  const fixPayload = {
    layout: layoutSummary,
    keyStyles: styleSummary,
    dom: domSummary,
    projectStructure: projectFiles,
    diffReport,
    instructions: "Fix the generated project to match original design. Focus on: layout alignment, spacing, colors, fonts, missing sections. Keep short UI text (headings, buttons, links, labels) exact; long body copy stays as skeleton placeholders. Return full updated project JSON with same structure as original generation.",
  };

  const data = await cascadeRequest(
    (model) => ({
      input: { parts: [{ text: JSON.stringify(fixPayload) }] },
      config: { generation_config: { max_output_tokens: 32768, responseMimeType: "application/json" } },
    }),
    signal,
  );

  const text = extractResponseText(data);
  if (!text) throw new Error("Gemini returned an empty response during fix");

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return generatedProject;
  } catch {
    return generatedProject;
  }
}
