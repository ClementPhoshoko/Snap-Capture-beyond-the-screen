export function buildPayload(extractionData) {
  const {
    screenshot,
    dom,
    computedStyles,
    cssVariables,
    fonts,
    assets,
    layout,
  } = extractionData;

  const payload = {
    screenshot,
    dom: {
      tagCount: dom?.tagCount || 0,
      semanticElements: (dom?.semanticElements || []).slice(0, 30),
      links: (dom?.links || []).slice(0, 30),
      buttons: (dom?.buttons || []).slice(0, 20),
      forms: (dom?.forms || []).slice(0, 10),
      inputs: (dom?.inputs || []).slice(0, 20),
      tables: (dom?.tables || []).slice(0, 5),
      media: (dom?.media || []).slice(0, 20),
      iframes: (dom?.iframes || []).slice(0, 10),
    },
    computedStyles: trimStyles(computedStyles),
    cssVariables: cssVariables || {},
    fonts: (fonts || []).slice(0, 20),
    images: (assets?.images || []).slice(0, 20).map((i) => ({ url: i.url, alt: i.alt, w: i.width, h: i.height })),
    icons: (assets?.icons || []).slice(0, 20),
    svgs: (assets?.svgs || []).slice(0, 10).map((s) => ({ html: s.html?.slice(0, 2000), w: s.width, h: s.height })),
    layout: {
      containers: (layout?.containers || []).slice(0, 20),
      grids: (layout?.grids || []).slice(0, 10),
      flexLayouts: (layout?.flexLayouts || []).slice(0, 20),
      sections: (layout?.sections || []).slice(0, 15),
      navigation: layout?.navigation || null,
      footer: layout?.footer || null,
      sidebar: layout?.sidebar || null,
    },
  };

  return payload;
}

function trimStyles(styles) {
  if (!styles || typeof styles !== "object") return {};
  const keys = Object.keys(styles);
  if (keys.length <= 80) return styles;

  const sampled = {};
  const step = Math.max(1, Math.floor(keys.length / 80));
  let count = 0;
  for (let i = 0; i < keys.length && count < 80; i += step) {
    const entry = styles[keys[i]];
    if (entry?.styles) {
      const trimmed = {};
      let s = 0;
      for (const [prop, val] of Object.entries(entry.styles)) {
        if (s >= 8) break;
        trimmed[prop] = val;
        s++;
      }
      sampled[keys[i]] = { tag: entry.tag, rect: entry.rect, styles: trimmed };
      count++;
    }
  }
  return sampled;
}
