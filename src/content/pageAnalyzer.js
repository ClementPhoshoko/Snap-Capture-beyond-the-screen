export function analyzePage() {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
  const vpHeight = window.innerHeight;
  const vpWidth = window.innerWidth;
  const totalSections = Math.ceil(scrollHeight / vpHeight);

  const stickyElements = [];
  const fixedElements = [];
  if (document.body) {
    document.body.querySelectorAll("*").forEach((el) => {
      const pos = getComputedStyle(el).position;
      if (pos === "sticky") stickyElements.push(el);
      else if (pos === "fixed") fixedElements.push(el);
    });
  }

  return {
    scrollHeight,
    vpHeight,
    vpWidth,
    totalSections,
    stickyElements,
    fixedElements,
  };
}

export function calculateSectionViewports(totalSections, vpHeight) {
  const sections = [];
  for (let i = 0; i < totalSections; i++) {
    sections.push({ index: i, y: i * vpHeight, height: vpHeight });
  }
  return sections;
}
