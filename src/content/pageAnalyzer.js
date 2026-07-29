export function analyzePage() {
  const root = document.documentElement;
  const body = document.body;
  const scrollHeight = Math.max(root?.scrollHeight || 0, body?.scrollHeight || 0, root?.offsetHeight || 0, body?.offsetHeight || 0);
  return {
    scrollHeight,
    vpHeight: window.innerHeight,
    vpWidth: window.innerWidth,
  };
}

import { isFloatingBarGeometry } from "../shared/floatingElement.js";

function isExplicitlyKept(element) {
  return element.hasAttribute("data-snap-keep") || element.matches("[role='dialog'], [aria-modal='true'], :popover-open");
}

function isSemanticChrome(element) {
  return element.matches("header, nav, footer, [role='banner'], [role='navigation'], [role='contentinfo']");
}

function isLayeredEdgeElement(element, style) {
  // Some sites (including search applications) keep their chrome visually pinned
  // through nested/translated layers rather than exposing `fixed` on the outer bar.
  // Only accept a semantic landmark or an explicitly layered element to avoid
  // treating ordinary document content at the top of a viewport as navigation.
  const explicitlyLayered = style.zIndex !== "auto" || style.transform !== "none" || style.willChange.includes("transform");
  return explicitlyLayered && (isSemanticChrome(element) || Number(style.zIndex) >= 1 || style.transform !== "none");
}

function walkElements(root, visit) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    visit(node);
    if (node.shadowRoot?.mode === "open") walkElements(node.shadowRoot, visit);
  }
}

export function hidePositionedElements({ floatingMode = "smart", hideFixed, ignoreSticky }) {
  if (floatingMode === "none" && !hideFixed && !ignoreSticky) return () => {};
  const changed = [];
  const candidates = [];
  walkElements(document.documentElement, (node) => {
    if (isExplicitlyKept(node)) return;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return;
    const position = style.position;
    const isPositioned = position === "fixed" || position === "sticky";
    const geometry = isFloatingBarGeometry(node.getBoundingClientRect(), { width: window.innerWidth, height: window.innerHeight });
    const isLayeredBar = isLayeredEdgeElement(node, style) && geometry;
    const hideAll = (hideFixed && position === "fixed") || (ignoreSticky && position === "sticky") || (floatingMode === "all" && (isPositioned || isLayeredBar));
    const hideSmart = floatingMode === "smart" && (isPositioned || isLayeredBar) && geometry;
    if (hideAll || hideSmart) candidates.push(node);
  });
  for (const node of candidates) {
    // Hiding a parent also hides children; avoid recording redundant mutations.
    if (!candidates.some((candidate) => candidate !== node && candidate.contains(node))) {
      changed.push({ node, value: node.style.getPropertyValue("visibility"), priority: node.style.getPropertyPriority("visibility") });
      node.style.setProperty("visibility", "hidden", "important");
    }
  }
  return () => {
    for (const { node, value, priority } of changed) {
      if (value) node.style.setProperty("visibility", value, priority);
      else node.style.removeProperty("visibility");
    }
  };
}
