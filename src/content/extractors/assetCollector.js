export function collectAssets() {
  const assets = { images: [], icons: [], svgs: [], fonts: [], favicons: [], backgrounds: [] };
  const seen = new Set();
  const origin = location.origin;

  function makeAbsolute(url) {
    if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
    try { return new URL(url, location.href).href; } catch { return url; }
  }

  function addAsset(category, url, meta = {}) {
    if (!url) return;
    const absUrl = makeAbsolute(url);
    const key = absUrl.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    assets[category].push({ url: absUrl, ...meta });
  }

  for (const img of document.querySelectorAll("img[src]")) {
    addAsset("images", img.src, { alt: img.alt || "", width: img.naturalWidth, height: img.naturalHeight });
  }

  for (const el of document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")) {
    addAsset("favicons", el.href, { sizes: el.sizes?.toString() || "" });
  }

  for (const el of document.querySelectorAll("svg")) {
    const cloned = el.cloneNode(true);
    const svgHtml = cloned.outerHTML;
    const key = svgHtml.slice(0, 200);
    if (!seen.has(key)) {
      seen.add(key);
      assets.svgs.push({ html: svgHtml.slice(0, 5000), width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height });
    }
  }

  const iconSelectors = 'i[class*="icon"], i[class*="Icon"], span[class*="icon"], span[class*="Icon"], [class*="material-icons"], [class*="fa-"], [class*="glyphicon"]';
  for (const el of document.querySelectorAll(iconSelectors)) {
    const classes = el.className?.toString() || "";
    const text = el.textContent?.trim() || "";
    if (classes || text) {
      assets.icons.push({ classes: classes.slice(0, 100), text: text.slice(0, 50), tag: el.tagName.toLowerCase() });
    }
  }

  for (const el of document.querySelectorAll("[style*='background'], [style*='background-image'], [style*='background']")) {
    const match = el.style.backgroundImage?.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) {
      addAsset("backgrounds", match[1]);
    }
  }

  assets.images = assets.images.slice(0, 100);
  assets.svgs = assets.svgs.slice(0, 50);
  assets.icons = assets.icons.slice(0, 50);

  return assets;
}
