export function analyzeLayout() {
  const layout = {
    containers: [],
    grids: [],
    flexLayouts: [],
    sections: [],
    navigation: null,
    hero: null,
    cards: [],
    footer: null,
    sidebar: null,
    responsiveGroupings: [],
  };

  const allElements = document.querySelectorAll("*");

  for (const el of allElements) {
    const tag = el.tagName.toLowerCase();
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const computed = window.getComputedStyle(el);

    if (["header", "nav", "footer", "main", "section", "article", "aside"].includes(tag)) {
      const entry = { tag, id: el.id || "", classes: el.className?.toString().slice(0, 80) || "", rect: { w: Math.round(rect.width), h: Math.round(rect.height) } };

      if (tag === "nav") layout.navigation = entry;
      else if (tag === "footer") layout.footer = entry;
      else if (tag === "aside") layout.sidebar = entry;
      else if (tag === "section") layout.sections.push(entry);
      else layout.containers.push(entry);
    }

    if (computed.display === "grid" || computed.display === "inline-grid") {
      layout.grids.push({
        tag,
        columns: computed.gridTemplateColumns,
        rows: computed.gridTemplateRows,
        gap: computed.gap,
        rect: { w: Math.round(rect.width), h: Math.round(rect.height) },
      });
    }

    if (computed.display === "flex" || computed.display === "inline-flex") {
      layout.flexLayouts.push({
        tag,
        direction: computed.flexDirection,
        wrap: computed.flexWrap,
        justify: computed.justifyContent,
        align: computed.alignItems,
        gap: computed.gap,
        rect: { w: Math.round(rect.width), h: Math.round(rect.height) },
      });
    }

    if (el.matches && el.matches('[class*="card"], [class*="Card"], [class*="hero"], [class*="Hero"]')) {
      if (tag === "section" || tag === "div") {
        layout.cards.push({ tag, classes: el.className?.toString().slice(0, 80) || "" });
      }
    }
  }

  layout.containers = layout.containers.slice(0, 50);
  layout.grids = layout.grids.slice(0, 20);
  layout.flexLayouts = layout.flexLayouts.slice(0, 50);
  layout.sections = layout.sections.slice(0, 30);

  return layout;
}
