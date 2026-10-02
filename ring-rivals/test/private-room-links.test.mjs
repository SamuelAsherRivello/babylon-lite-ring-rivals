import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Ring Rivals accepts four-character private codes and joins copied room links", async () => {
  const game = await readFile(new URL("../src/content/ring-rivals/Game.jsx", import.meta.url), "utf8");
  assert.match(game, /maxLength=\{4\}/);
  assert.match(game, /invite\.trim\(\)\.length !== 4/);
  assert.match(game, /\[A-Z0-9\]\{4\}/);
  assert.match(game, /new URLSearchParams\(location\.search\)\.get\("room"\)/);
  assert.match(game, /connect\(false, code\)/);
  assert.match(game, /url\.searchParams\.set\("room", code\)/);
  assert.match(game, /navigator\.clipboard\.writeText\(url\.href\)/);
  assert.match(game, /sessionUnsubscribeRef\.current\?\.\(\)/);
});
