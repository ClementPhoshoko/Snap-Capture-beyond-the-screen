const STYLE_PROPS = [
  "width", "height", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
  "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
  "gap", "display", "flexDirection", "flexWrap", "justifyContent", "alignItems", "alignContent",
  "gridTemplateColumns", "gridTemplateRows", "gap",
  "position", "top", "right", "bottom", "left",
  "overflow", "overflowX", "overflowY",
  "zIndex",
  "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "lineHeight", "textAlign", "textTransform", "textDecoration",
  "color", "opacity",
  "transform", "transition", "animation",
  "border", "borderTop", "borderRight", "borderBottom", "borderLeft",
  "borderRadius", "borderWidth", "borderStyle", "borderColor",
  "boxShadow",
  "filter", "backdropFilter",
  "background", "backgroundColor", "backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat",
  "objectFit", "objectPosition",
];

const FILTERED_VALUES = new Set([
  "none", "normal", "auto", "initial", "inherit", "unset", "0px", "0", "",
  "rgba(0, 0, 0, 0)", "transparent",
]);

function isDefault(type, prop, value) {
  if (!value || FILTERED_VALUES.has(value)) return true;
  return false;
}

export function extractComputedStyles() {
  const styles = {};
  const allElements = document.querySelectorAll("*");
  let sampled = 0;
  const MAX_SAMPLED = 120;
  const MIN_RECT_AREA = 20;

  for (const el of allElements) {
    if (sampled >= MAX_SAMPLED) break;
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "link", "meta", "noscript"].includes(tag)) continue;
    const id = el.id ? `#${el.id}` : "";
    const classes = el.className && typeof el.className === "string"
      ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
    const key = `${tag}${id}${classes}`.slice(0, 80);
    if (!key || styles[key]) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width * rect.height < MIN_RECT_AREA) continue;

    const computed = window.getComputedStyle(el);
    const entry = { tag, rect: { w: Math.round(rect.width), h: Math.round(rect.height) } };

    for (const prop of STYLE_PROPS) {
      const value = computed[prop];
      if (!isDefault(tag, prop, value)) {
        if (!entry.styles) entry.styles = {};
        entry.styles[prop] = value;
      }
    }

    const styleCount = entry.styles ? Object.keys(entry.styles).length : 0;
    if (styleCount > 2) {
      styles[key] = entry;
      sampled++;
    }
  }

  return styles;
}

export function extractCSSVariables() {
  const root = document.documentElement;
  const vars = {};
  const computed = window.getComputedStyle(root);

  for (let i = 0; i < computed.length; i++) {
    const name = computed[i];
    if (name.startsWith("--")) {
      vars[name] = computed.getPropertyValue(name).trim();
    }
  }

  return vars;
}

export function extractFonts() {
  const fonts = [];
  const seen = new Set();

  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          const family = rule.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
          const src = rule.style.getPropertyValue("src");
          const key = family.toLowerCase();
          if (family && !seen.has(key)) {
            seen.add(key);
            fonts.push({ family, src: src || "", weight: rule.style.getPropertyValue("font-weight") || "400" });
          }
        }
      }
    } catch {}
  }

  for (const el of document.querySelectorAll("[style*='font-family']")) {
    const family = el.style.fontFamily?.replace(/["']/g, "").trim();
    if (family && !seen.has(family.toLowerCase())) {
      seen.add(family.toLowerCase());
      fonts.push({ family, src: "inline", weight: el.style.fontWeight || "400" });
    }
  }

  return fonts;
}
