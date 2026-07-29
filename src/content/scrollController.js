export function scrollTo(y) {
  window.scrollTo({ top: y, behavior: "instant" });
}

export function scrollToSmooth(y) {
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function getScrollPosition() {
  return window.scrollY || window.pageYOffset || 0;
}

export function restoreScrollPosition(y) {
  window.scrollTo({ top: y, behavior: "instant" });
}

export function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
