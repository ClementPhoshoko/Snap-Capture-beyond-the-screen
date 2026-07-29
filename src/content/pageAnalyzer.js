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

export function hidePositionedElements({ floatingMode = "smart" }) {
  if (floatingMode === "none") return () => {};
  const changed = [];
  const candidates = [];
  walkElements(document.documentElement, (node) => {
    if (isExplicitlyKept(node)) return;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return;
    const position = style.position;
    const isPositioned = position === "fixed" || position === "sticky";
    if (floatingMode === "all") {
      const isLayeredBar = isLayeredEdgeElement(node, style);
      if (isPositioned || isLayeredBar) candidates.push(node);
    } else {
      const geometry = isFloatingBarGeometry(node.getBoundingClientRect(), { width: window.innerWidth, height: window.innerHeight });
      if ((isPositioned || isLayeredEdgeElement(node, style)) && geometry) candidates.push(node);
    }
  });
  for (const node of candidates) {
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

export function expandNestedScrollContainers() {
  const changed = [];
  walkElements(document.documentElement, (node) => {
    if (node === document.body || node === document.documentElement) return;
    const style = getComputedStyle(node);
    const overflowY = style.overflowY;
    if (overflowY !== "scroll" && overflowY !== "auto") return;
    if (node.scrollHeight <= node.clientHeight) return;
    changed.push({
      node,
      overflow: node.style.getPropertyValue("overflow"),
      overflowPriority: node.style.getPropertyPriority("overflow"),
      overflowY: node.style.getPropertyValue("overflow-y"),
      overflowYPriority: node.style.getPropertyPriority("overflow-y"),
      maxHeight: node.style.getPropertyValue("max-height"),
      maxHeightPriority: node.style.getPropertyPriority("max-height"),
    });
    node.style.setProperty("overflow", "visible", "important");
    node.style.setProperty("overflow-y", "visible", "important");
    node.style.setProperty("max-height", "none", "important");
  });
  return () => {
    for (const entry of changed) {
      const { node, overflow, overflowPriority, overflowY, overflowYPriority, maxHeight, maxHeightPriority } = entry;
      if (overflow) node.style.setProperty("overflow", overflow, overflowPriority);
      else node.style.removeProperty("overflow");
      if (overflowY) node.style.setProperty("overflow-y", overflowY, overflowYPriority);
      else node.style.removeProperty("overflow-y");
      if (maxHeight) node.style.setProperty("max-height", maxHeight, maxHeightPriority);
      else node.style.removeProperty("max-height");
    }
  };
}

export function pauseVideos() {
  const videos = document.querySelectorAll("video");
  const paused = [];
  for (const video of videos) {
    if (!video.paused) {
      video.pause();
      paused.push(video);
    }
  }
  return () => {
    for (const video of paused) {
      video.play().catch(() => {});
    }
  };
}
