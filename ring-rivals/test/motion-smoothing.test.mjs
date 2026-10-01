import test from "node:test";
import assert from "node:assert/strict";
import { SnapshotInterpolator, predictLocalPose, reconcilePose } from "../src/content/ring-rivals/motion-smoothing.js";

const frame = (timestamp, x, action = "idle") => ({
  game: "ring-rivals", timestamp, phase: "round", players: [{ x, action, actionFrame: timestamp / 50, health: 100 }],
});

test("remote snapshots interpolate between authoritative positions at a fixed render delay", () => {
  const buffer = new SnapshotInterpolator(50);
  buffer.push(frame(100, 0), 1000);
  buffer.push(frame(200, 10), 1050);
  assert.equal(buffer.sample(1050).players[0].x, 5);
  assert.equal(buffer.sample(1100).players[0].x, 10);
});

test("snapshot buffers are ordered and bounded when packets arrive out of order", () => {
  const buffer = new SnapshotInterpolator(0);
  buffer.push(frame(200, 2), 1000);
  buffer.push(frame(100, 1), 1001);
  assert.equal(buffer.sample(1001).players[0].x, 2);
  for (let i = 0; i < 20; i += 1) buffer.push(frame(300 + i, i), 1010 + i);
  assert.ok(buffer.snapshots.length <= 12);
});

test("local dodge prediction is immediate and authority corrections decay smoothly", () => {
  assert.ok(predictLocalPose({ x: 0 }, "dodge-right", 100).x > 0);
  assert.ok(predictLocalPose({ x: 0 }, "dodge-left", 100).x < 0);
  assert.equal(predictLocalPose({ x: 0 }, "jab-head", 100).x, 0);
  assert.ok(reconcilePose(0, 1, 16) > 0 && reconcilePose(0, 1, 16) < 1);
});
