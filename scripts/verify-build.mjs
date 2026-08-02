import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");

const requiredFiles = [
  "manifest.json",
  "index.html",
  "popup.js",
  "popup.css",
  "storage.js",
  "background/service-worker.js",
  "content/index.js",
];

const missing = requiredFiles.filter((file) => !existsSync(resolve(dist, file)));

if (missing.length > 0) {
  console.error(
    "[verify-build] Build is INCOMPLETE. Missing required file(s) in dist/:\n" +
      missing.map((f) => `  - ${f}`).join("\n") +
      "\n\nRun `npm run build` so both vite steps run. Running `vite build` alone wipes dist/content/ and produces a broken package."
  );
  process.exit(1);
}

const serviceWorker = readFileSync(resolve(dist, "background/service-worker.js"), "utf8");
if (!serviceWorker.includes("content/index.js")) {
  console.error('[verify-build] background/service-worker.js does not reference "content/index.js". Injection path drifted.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(resolve(dist, "manifest.json"), "utf8"));
if (manifest.manifest_version !== 3) {
  console.error(`[verify-build] Unexpected manifest_version: ${manifest.manifest_version}`);
  process.exit(1);
}

const declared = [
  manifest.action?.default_popup,
  manifest.background?.service_worker,
];
const declaredMissing = declared.filter((file) => file && !existsSync(resolve(dist, file)));
if (declaredMissing.length > 0) {
  console.error("[verify-build] manifest.json references missing file(s): " + declaredMissing.join(", "));
  process.exit(1);
}

console.log("[verify-build] dist/ is complete and consistent.");
