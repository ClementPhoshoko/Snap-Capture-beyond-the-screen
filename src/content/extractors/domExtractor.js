export function extractDOM() {
  const data = {
    tagCount: 0,
    elements: [],
    semanticElements: [],
    textNodes: 0,
    links: [],
    buttons: [],
    forms: [],
    inputs: [],
    lists: [],
    tables: [],
    media: [],
    iframes: [],
    ids: [],
    classes: [],
  };

  const allElements = document.querySelectorAll("*");
  data.tagCount = allElements.length;

  const seenIds = new Set();
  const seenClasses = new Set();

  for (const el of allElements) {
    if (el.id) seenIds.add(el.id);
    if (el.className && typeof el.className === "string") {
      el.className.split(/\s+/).forEach((c) => { if (c) seenClasses.add(c); });
    }

    const tag = el.tagName.toLowerCase();

    if (["header", "nav", "main", "section", "article", "aside", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "figure", "figcaption", "details", "summary"].includes(tag)) {
      data.semanticElements.push(tag);
    }

    if (el.tagName === "A" && el.href) {
      data.links.push({ text: (el.textContent || "").slice(0, 100), href: el.href });
    }

    if (el.tagName === "BUTTON" || (el.tagName === "INPUT" && el.type === "button")) {
      data.buttons.push({ text: (el.textContent || el.value || "").slice(0, 100) });
    }

    if (el.tagName === "FORM") {
      data.forms.push({ id: el.id, action: el.action, method: el.method });
    }

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
      data.inputs.push({ type: el.type || el.tagName.toLowerCase(), name: el.name, placeholder: el.placeholder || "" });
    }

    if (["UL", "OL"].includes(el.tagName)) {
      data.lists.push({ type: el.tagName.toLowerCase(), items: el.children.length });
    }

    if (el.tagName === "TABLE") {
      data.tables.push({ rows: el.rows?.length || 0, cells: el.cells?.length || 0 });
    }

    if (el.tagName === "IMG" && el.src) {
      data.media.push({ type: "image", src: el.src, alt: el.alt || "", width: el.naturalWidth, height: el.naturalHeight });
    }

    if (el.tagName === "VIDEO" && el.src) {
      data.media.push({ type: "video", src: el.src });
    }

    if (el.tagName === "IFRAME") {
      data.iframes.push({ src: el.src, width: el.width, height: el.height });
    }
  }

  data.ids = Array.from(seenIds).slice(0, 200);
  data.classes = Array.from(seenClasses).slice(0, 500);
  data.textNodes = document.body?.innerText?.length || 0;
  data.elements = allElements.length;

  return data;
}
