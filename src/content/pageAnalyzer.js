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

export function hidePositionedElements({ hideFixed, ignoreSticky }) {
  if (!hideFixed && !ignoreSticky) return () => {};
  const changed = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    const position = getComputedStyle(node).position;
    if ((hideFixed && position === "fixed") || (ignoreSticky && position === "sticky")) {
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
