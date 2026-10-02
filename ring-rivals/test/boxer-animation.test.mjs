import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { inflateSync } from "node:zlib";
import test from "node:test";
import { BOXER_ATLAS, getBoxerAnimation } from "../src/content/ring-rivals/boxer-animation.js";

function decodeAtlas(png) {
  let offset = 8;
  const chunks = [];
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    if (type === "IDAT") chunks.push(png.subarray(offset + 8, offset + 8 + length));
    offset += length + 12;
    if (type === "IEND") break;
  }
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  const scanlines = inflateSync(Buffer.concat(chunks));
  for (let y = 0; y < height; y++) assert.equal(scanlines[y * (1 + width * 4)], 0, "generator uses unfiltered hard-edged rows");
  assert.equal(png[24], 8, "atlas stays at original 8-bit channel depth");
  assert.equal(png[25], 6, "atlas stays RGBA for transparent pixel edges");
  const alphaValues = new Set();
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) alphaValues.add(scanlines[y * (1 + width * 4) + 1 + x * 4 + 3]);
  assert.ok([...alphaValues].every((alpha) => alpha === 0 || alpha === 150 || alpha === 255), "no antialiased edge alpha values");
  return { width, height, scanlines };
}

function celPixels(atlas, index) {
  const x = (index % BOXER_ATLAS.columns) * BOXER_ATLAS.cellWidth;
  const y = Math.floor(index / BOXER_ATLAS.columns) * BOXER_ATLAS.cellHeight;
  const rows = [];
  for (let row = 0; row < BOXER_ATLAS.cellHeight; row++) {
    const start = (y + row) * (1 + atlas.width * 4) + 1 + x * 4;
    rows.push(atlas.scanlines.subarray(start, start + BOXER_ATLAS.cellWidth * 4));
  }
  return Buffer.concat(rows);
}

test("maps all authoritative attacks and reactions to distinct front/rear cels", () => {
  const actions = ["idle", "attack-jab-head", "attack-cross-head", "attack-jab-body", "attack-cross-body", "guard-high", "guard-low", "dodge-left", "dodge-right", "hit-block", "hit-stun"];
  const expectedClips = new Map(actions.map((action, index) => [action, index]));
  const frames = new Set();
  for (const boxer of ["rook", "flash"]) for (const view of ["rear", "front"]) for (const action of actions) {
    const pose = getBoxerAnimation({ boxer, action, actionFrame: 10 }, { local: view === "rear", view });
    assert.ok(pose.frame >= 0 && pose.frame < BOXER_ATLAS.columns * BOXER_ATLAS.rows);
    assert.equal(Math.floor(pose.frame / 3) % 11, expectedClips.get(action), `${action} selects its generated atlas clip`);
    frames.add(pose.frame);
    if (action.startsWith("attack-")) assert.equal(pose.attackCue, action.endsWith("head") ? "head" : "body");
  }
  assert.equal(frames.size, 44);
  assert.deepEqual([BOXER_ATLAS.columns, BOXER_ATLAS.rows], [11, 12]);
});

test("punch and evade offsets are temporary and settle at the fixed anchor", () => {
  for (const view of ["rear", "front"]) for (const action of ["attack-jab-head", "attack-cross-head", "attack-jab-body", "attack-cross-body"]) {
    const start = getBoxerAnimation({ action, actionFrame: 0 }, { view });
    const impact = getBoxerAnimation({ action, actionFrame: 12 }, { view });
    assert.equal(start.offsetX, 0);
    assert.ok(Math.abs(impact.offsetX) > 0);
    assert.equal(getBoxerAnimation({ action: "idle" }, { view }).offsetX, 0);
    assert.equal(getBoxerAnimation({ action: "idle" }, { view }).offsetY, 0);
  }
  assert.ok(Math.abs(getBoxerAnimation({ action: "dodge-left", actionFrame: 12 }).offsetX) < 1e-9);
  assert.equal(getBoxerAnimation({ predictedAction: "attack-jab-head", predictedFrame: 8 }).frame, getBoxerAnimation({ action: "attack-jab-head", actionFrame: 8 }).frame);
});

test("generated original boxer atlas has complete fixed-size cels", async () => {
  const png = await readFile(new URL("../src/content/ring-rivals/boxers.png", import.meta.url));
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [BOXER_ATLAS.cellWidth * BOXER_ATLAS.columns, BOXER_ATLAS.cellHeight * BOXER_ATLAS.rows]);
  const generator = await readFile(new URL("../scripts/generate-boxers.mjs", import.meta.url), "utf8");
  assert.match(generator, /const actions=\['idle','attack-jab-head','attack-cross-head','attack-jab-body','attack-cross-body','guard-high','guard-low','dodge-left','dodge-right','hit-block','hit-stun'\]/);
  const atlas = decodeAtlas(png);
  for (const boxer of [0, 1]) for (const view of [0, 1]) {
    const firstFrame = (boxer * 2 + view) * 11 * 3;
    assert.notDeepEqual(celPixels(atlas, firstFrame), celPixels(atlas, firstFrame + 1), "idle breath rises by one pixel");
    assert.notDeepEqual(celPixels(atlas, firstFrame + 1), celPixels(atlas, firstFrame + 2), "idle breath returns through a distinct cel");
  }
  for (const boxer of [0, 1]) for (const view of [0, 1]) for (let clip = 1; clip <= 4; clip++) {
    const firstFrame = ((boxer * 2 + view) * 11 + clip) * 3;
    assert.notDeepEqual(celPixels(atlas, firstFrame), celPixels(atlas, firstFrame + 1), "windup and impact have distinct punch art");
    assert.notDeepEqual(celPixels(atlas, firstFrame + 1), celPixels(atlas, firstFrame + 2), "impact and recovery have distinct punch art");
  }
  for (const boxer of [0, 1]) for (const view of [0, 1]) {
    const idle = celPixels(atlas, ((boxer * 2 + view) * 11) * 3 + 1);
    for (const clip of [5, 6]) assert.notDeepEqual(celPixels(atlas, ((boxer * 2 + view) * 11 + clip) * 3 + 1), idle, "high and low guards have distinct cels");
    const head = celPixels(atlas, getBoxerAnimation({ boxer, action: "attack-jab-head", actionFrame: 12 }, { view: view ? "front" : "rear" }).frame);
    const body = celPixels(atlas, getBoxerAnimation({ boxer, action: "attack-jab-body", actionFrame: 12 }, { view: view ? "front" : "rear" }).frame);
    assert.notDeepEqual(head, body, "head and body targets have distinct poses");
  }
});

test("idle uses a restrained repeating three-cel breathing loop", () => {
  const times = [0, 650, 1300, 1950];
  const poses = times.map((timeMs) => getBoxerAnimation({ action: "idle" }, { timeMs }));
  const frames = poses.map((pose) => pose.frame);
  assert.deepEqual(frames.map((frame) => frame % 3), [0, 1, 2, 0]);
  assert.ok(poses.every((pose) => pose.offsetX === 0 && pose.offsetY === 0));
});

test("head and body attack cels progress through windup, impact, and recovery", () => {
  for (const action of ["attack-jab-head", "attack-cross-head", "attack-jab-body", "attack-cross-body"]) {
    const duration = action.includes("jab-head") ? 18 : action.includes("cross-head") ? 27 : action.includes("jab-body") ? 21 : 30;
    const phaseFrames = [0, Math.ceil(duration * 0.45), Math.ceil(duration * 0.8)];
    const indices = phaseFrames.map((actionFrame) => getBoxerAnimation({ action, actionFrame }).frame % 3);
    assert.deepEqual(indices, [0, 1, 2], `${action} presents windup, impact, then recovery`);
  }
});

test("rejected, interrupted, and completed actions return directly to their shared home anchor", () => {
  const active = getBoxerAnimation({ action: "attack-cross-body", actionFrame: 15 }, { local: true, view: "rear" });
  const interrupted = getBoxerAnimation({ action: "hit-block", actionFrame: 0 }, { local: true, view: "rear" });
  const rejectedPrediction = getBoxerAnimation({ action: "idle", predictedAction: null, predictedFrame: 0 }, { local: true, view: "rear" });
  const completedDodge = getBoxerAnimation({ action: "dodge-right", actionFrame: 12 }, { local: true, view: "rear" });
  const idle = getBoxerAnimation({ action: "idle" }, { local: true, view: "rear" });
  assert.ok(active.offsetX !== 0 || active.offsetY !== 0);
  assert.equal(interrupted.offsetX, -3, "interruption begins from its own hit reaction, not the previous punch offset");
  for (const pose of [rejectedPrediction, completedDodge, idle]) {
    assert.equal(pose.offsetX, 0);
    assert.equal(pose.offsetY, 0);
  }
  assert.equal(rejectedPrediction.frame, idle.frame, "rejected input resolves to the authoritative idle cel");
});

test("renderer keeps local boxer rear/small and opponent front/large at fixed anchors", async () => {
  const source = await readFile(new URL("../src/content/Content.jsx", import.meta.url), "utf8");
  assert.match(source, /view: local \? "rear" : "front"/);
  assert.match(source, /positionPx: \[pose\.offsetX, \(local \? 38 : -28\) \+ pose\.offsetY\]/);
  assert.match(source, /sizePx: \[pose\.sizeX, pose\.sizeY\]/);
  assert.deepEqual(getBoxerAnimation({ action: "idle" }, { local: true }).sizeY, getBoxerAnimation({ action: "idle" }, { local: false }).sizeY * 104 / 152);
});
