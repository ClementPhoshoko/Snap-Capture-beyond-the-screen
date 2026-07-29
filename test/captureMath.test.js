import test from "node:test";
import assert from "node:assert/strict";
import { createScrollPlan, outputDimensions, assertCanvasSize } from "../src/shared/captureMath.js";
import { makeFilename, safeFilename } from "../src/shared/helpers.js";

test("scroll plan captures exact final page position without duplicate viewport", () => {
  assert.deepEqual(createScrollPlan(2500, 1000), [0, 1000, 1500]);
  assert.deepEqual(createScrollPlan(2000, 1000), [0, 1000]);
  assert.deepEqual(createScrollPlan(500, 1000), [0]);
});

test("output size follows screenshot scale", () => {
  assert.deepEqual(outputDimensions(1280, 2500, 2), { width: 2560, height: 5000 });
});

test("canvas guard rejects unsafe single-image dimensions", () => {
  assert.throws(() => assertCanvasSize({ width: 1000, height: 40000 }), /too large/);
  assert.doesNotThrow(() => assertCanvasSize({ width: 2000, height: 3000 }));
});

test("filename generation is cross-platform safe and format aware", () => {
  const date = new Date(2026, 6, 29, 8, 5, 4);
  assert.equal(safeFilename('plan: Q3/?'), "plan- Q3--");
  assert.equal(makeFilename("Snap_{title}-{date}-{time}", "plan: Q3", "jpeg", date), "Snap_plan- Q3-2026-07-29-08-05-04.jpg");
});
