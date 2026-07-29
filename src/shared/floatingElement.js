/**
 * Conservative geometry-only classifier for repeated chrome at the top/bottom
 * of a viewport. Keeping it pure makes the policy easy to test and tune.
 */
export function isFloatingBarGeometry(rect, viewport) {
  const { width: vw, height: vh } = viewport;
  if (!rect || !vw || !vh) return false;
  const widthRatio = rect.width / vw;
  const heightLimit = Math.min(320, vh * 0.28);
  const edgeTolerance = Math.min(32, vh * 0.05);
  const touchesTop = rect.top <= edgeTolerance && rect.bottom > 0;
  const touchesBottom = rect.bottom >= vh - edgeTolerance && rect.top < vh;
  return widthRatio >= 0.55 && rect.height >= 24 && rect.height <= heightLimit && (touchesTop || touchesBottom);
}
