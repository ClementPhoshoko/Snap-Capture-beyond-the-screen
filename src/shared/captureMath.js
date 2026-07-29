import { MAX_OUTPUT_DIMENSION, MAX_OUTPUT_PIXELS } from "./constants.js";

export function createScrollPlan(scrollHeight, viewportHeight) {
  const height = Math.max(0, Math.ceil(scrollHeight));
  const viewport = Math.max(1, Math.floor(viewportHeight));
  const maxScroll = Math.max(0, height - viewport);
  const positions = [0];
  for (let y = viewport; y < maxScroll; y += viewport) positions.push(y);
  if (maxScroll > 0 && positions[positions.length - 1] !== maxScroll) positions.push(maxScroll);
  return positions;
}

export function outputDimensions(width, cssHeight, scaleX, scaleY = scaleX) {
  return {
    width: Math.round(width * scaleX),
    height: Math.round(cssHeight * scaleY),
  };
}

export function assertCanvasSize({ width, height }) {
  if (!width || !height || width > MAX_OUTPUT_DIMENSION || height > MAX_OUTPUT_DIMENSION || width * height > MAX_OUTPUT_PIXELS) {
    throw new Error("This page is too large to safely export as one image. Reduce browser zoom or capture it in smaller sections.");
  }
}
