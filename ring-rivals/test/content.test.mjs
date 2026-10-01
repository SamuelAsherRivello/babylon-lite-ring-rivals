import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';
import test from 'node:test';
import { contentConfig, getRenderingPolicy, pixelPerfectOptions } from '../src/content/babylon/config.js';
import { getInitializationMessage } from '../src/content/babylon/initialization.js';
import { getLogicalToRenderScale } from '../src/content/babylon/pixel-perfect.js';
import { getRenderScaleDisplayText } from '../src/content/babylon/showcase-overlay.js';
import {
  createRenderTargetSurfaceView,
  cycleRenderResolutionPreset,
  getRenderResolutionDimensions,
} from '../src/content/babylon/render-resolution.js';

test('defaults to Babylon Lite 2D and does not apply the pixel preset to 3D', () => {
  assert.deepEqual(contentConfig, { renderer: 'babylon-lite', style: '2d' });
  assert.equal(getRenderingPolicy(contentConfig), 'pixel-perfect');
  assert.equal(getRenderingPolicy({ renderer: 'babylon-lite', style: '3d' }), 'performance-scaled-3d');
  assert.equal(getRenderingPolicy({ renderer: 'other', style: '2d' }), 'renderer-specific');
  assert.deepEqual(pixelPerfectOptions.engine, { msaaSamples: 1, alphaMode: 'premultiplied' });
  assert.deepEqual(pixelPerfectOptions.texture, {
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
    minFilter: 'nearest',
    magFilter: 'nearest',
    mipMaps: false,
  });
});

test('derives four relative render resolutions from native backing dimensions and caps double by the WebGPU limit', () => {
  assert.deepEqual(getRenderResolutionDimensions(1280, 720, 'quarter'), {
    preset: 'quarter', width: 320, height: 180, scale: 0.25,
  });
  assert.deepEqual(getRenderResolutionDimensions(1280, 720, 'half'), {
    preset: 'half', width: 640, height: 360, scale: 0.5,
  });
  assert.deepEqual(getRenderResolutionDimensions(1280, 720, 'native'), {
    preset: 'native', width: 1280, height: 720, scale: 1,
  });
  assert.deepEqual(getRenderResolutionDimensions(1280, 720, 'double'), {
    preset: 'double', width: 2560, height: 1440, scale: 2,
  });
  assert.deepEqual(getRenderResolutionDimensions(10000, 5000, 'double', 8192), {
    preset: 'double', width: 8192, height: 4096, scale: 0.8192,
  });
  const oddHalf = getRenderResolutionDimensions(923, 520, 'half');
  assert.deepEqual([oddHalf.preset, oddHalf.width, oddHalf.height], ['half', 461, 260]);
  assert.ok(Math.abs(oddHalf.scale - 0.5) < 0.001);
  assert.deepEqual(getRenderResolutionDimensions(0, 520, 'double'), {
    preset: 'double', width: 0, height: 0, scale: 0,
  });
  assert.deepEqual([
    'quarter', 'half', 'native', 'double',
    cycleRenderResolutionPreset('double'), cycleRenderResolutionPreset('invalid'),
  ], [
    'quarter', 'half', 'native', 'double', 'quarter', 'double',
  ]);
});

test('keeps the logical camera focus and full arena in frame across target sizes', async () => {
  assert.equal(getLogicalToRenderScale(240, 90), 0.5);
  assert.equal(getLogicalToRenderScale(480, 180), 1);
  assert.equal(getLogicalToRenderScale(960, 360), 2);

  const content = await readFile(new URL('../src/content/Content.jsx', import.meta.url), 'utf8');
  assert.match(content, /positionPx: \[0, 0\]/);
  assert.match(content, /centerSprite2DView\(layer\.view, 0, 0, resolved\.width, resolved\.height\)/);
  assert.match(content, /const zoom = getLogicalToRenderScale\(resolved\.width, resolved\.height, logicalResolution\)/);
  assert.match(content, /layers: \[arenaLayer, layer\]/);
  assert.match(content, /setScale\(resolved\.scale\)/);
});

test('adapts Babylon Lite sprite projection dimensions while sharing the engine surface registry', () => {
  const contexts = [];
  const engine = {
    engine: null,
    canvas: { width: 1280, height: 720 },
    _renderingContexts: contexts,
    format: 'bgra8unorm',
  };
  engine.engine = engine;
  const targetSurface = createRenderTargetSurfaceView(engine, 640, 360);

  assert.equal(targetSurface.engine, engine);
  assert.equal(targetSurface._renderingContexts, contexts);
  assert.equal(targetSurface.format, engine.format);
  assert.deepEqual([targetSurface.canvas.width, targetSurface.canvas.height], [640, 360]);
  targetSurface.canvas.width = 800;
  assert.deepEqual([targetSurface.canvas.width, targetSurface.canvas.height], [800, 360]);
  assert.deepEqual([engine.canvas.width, engine.canvas.height], [1280, 720]);
});

test('formats the active internal render scale independently of the CSS viewport', () => {
  assert.equal(getRenderScaleDisplayText(1), 'Render Scale: 1x');
  assert.equal(getRenderScaleDisplayText(0.5), 'Render Scale: 0.5x');
  assert.equal(getRenderScaleDisplayText(2), 'Render Scale: 2x');
  assert.equal(getRenderScaleDisplayText(0.8192), 'Render Scale: 0.82x');

});

test('uses the requested corner title/body styles and ties the Lite border to the React dialog', async () => {
  const [app, styles, content] = await Promise.all([
    readFile(new URL('../src/ui/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/ui/style.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/content/Content.jsx', import.meta.url), 'utf8'),
  ]);

  assert.match(app, /className="corner-title">/);
  assert.match(app, /aria-label="Open Babylon Lite settings">\(B\)<\/button> Babylon Lite/);
  assert.match(app, /RenderResolution: \$\{renderResolutionInfo\.width\}x\$\{renderResolutionInfo\.height\}/);
  assert.match(app, /renderPreset: "native"/);
  assert.match(app, /isRenderResolutionPreset\(saved\?\.renderPreset\)/);
  assert.match(app, /localStorage\.setItem\(configStorageKey, JSON\.stringify\(config\)\)/);
  assert.match(app, /key === "r" && !event\.repeat/);
  assert.match(app, /className="corner-body"><button className="babylon_viewport_info_button"/);
  assert.match(app, /onClick=\{\(\) => setConfig\(\(current\) => \(\{ \.\.\.current, renderPreset: cycleRenderResolutionPreset/);
  assert.match(app, /activeDialog === "babylon" \? <div className="dialog_options babylon_settings"><div>Babylon Lite<\/div><div>\{renderResolutionText\}<\/div>/);
  assert.match(app, /className="corner-body">\{getRenderScaleDisplayText/);
  assert.match(app, /Mode: 2DPixelPerfect/);
  assert.match(app, /key === "b"/);
  assert.match(app, /event\.key === "Escape"/);
  assert.match(app, /sceneBorderVisible: activeDialog === "babylon"/);
  assert.match(app, /processingPaused: activeDialog !== null/);
  assert.match(app, /activeDialog === "babylon" \? <div className="dialog_options babylon_settings"/);
  assert.match(app, /className=\{activeDialog === "babylon" \? "babylon_settings_dialog"/);
  assert.match(styles, /left: 50%/);
  assert.match(styles, /bottom: 9px/);
  assert.match(styles, /transform: translateX\(-50%\)/);
  assert.match(styles, /text-align: center/);
  assert.match(styles, /color: #e0694b/);
  assert.match(styles, /\.babylon_viewport_info \.corner-title,\s*\.babylon_viewport_info \.corner-body \{\s*color: inherit/);
  assert.match(content, /sceneBorderVisible && <div className="babylon_scene_border"/);
  assert.match(styles, /\.babylon_scene_border[\s\S]*border: 5px solid orange/);
});

test('reports WebGPU-only initialization and allocation failures and uses the engine-owned frame lifecycle', async () => {
  assert.match(getInitializationMessage(false, new Error('unsupported')), /requires WebGPU/);
  assert.match(getInitializationMessage(true, new Error('WebGPU adapter not available')), /requires WebGPU/);
  assert.match(getInitializationMessage(true, new Error('texture decode failed')), /could not initialize/);
  assert.match(getInitializationMessage(true, new Error('render target allocation failed')), /could not allocate the selected render resolution/);
  assert.match(getInitializationMessage(true, new Error('GPU out of memory while allocating texture')), /could not allocate the selected render resolution/);

  const [content, main] = await Promise.all([
    readFile(new URL('../src/content/Content.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/main.jsx', import.meta.url), 'utf8'),
  ]);
  assert.match(main, /<StrictMode>/);
  for (const expression of [
    /cancelled = false/,
    /cancelled = true/,
    /resizeObserver\?\.disconnect\(\)/,
    /window\.removeEventListener\("resize"/,
    /removeDprQuery\(\)/,
    /disposeSpriteRenderer\(renderer\)/,
    /releaseTexture\(texture\)/,
    /disposeEngine\(engine\)/,
    /disposeSpriteAtlas\(atlas\)/,
  ]) assert.match(content, expression);
  assert.match(content, /await createEngine\(canvas, pixelPerfectOptions\.engine\)/);
  assert.match(content, /createGridSpriteAtlas\(texture,\s*\{\s*cellWidthPx: 64,\s*cellHeightPx: 128,\s*columns: 4,\s*rows: 1/);
  assert.match(content, /queueMicrotask\(\(\) => \{\s*if \(!cancelled\) void setup\(\);\s*\}\)/);
  assert.match(content, /if \(!navigator\.gpu\) throw new Error\("WebGPU is not available in this browser\."\)/);
  assert.match(content, /setMessage\(`\$\{getInitializationMessage\(Boolean\(navigator\.gpu\), error\)\}/);
  assert.doesNotMatch(content, /\.getContext\(["'](?:2d|webgl2?)["']/i);
  assert.match(content, /await startEngine\(engine\)/);
  assert.match(content, /await startEngine\(engine\);\s*\/\/ StrictMode can unmount this effect while the first async engine start[\s\S]*?if \(cancelled\) return;/);
});

test('imports an original 32x32 hard-edged PNG with only black and gray pixels', async () => {
  const png = await readFile(new URL('../src/content/babylon/images/concentric-squares-32.png', import.meta.url));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);

  let offset = 8;
  const idat = [];
  let width;
  let height;
  while (offset < png.length) {
    const size = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + size);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') {
      idat.push(data);
    }
    offset += size + 12;
    if (type === 'IEND') break;
  }

  assert.equal(width, 32);
  assert.equal(height, 32);
  const decoded = inflateSync(Buffer.concat(idat));
  const shades = new Set();
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 4);
    assert.equal(decoded[rowStart], 0, 'asset rows use the exact, non-smoothed PNG filter');
    for (let x = 0; x < width; x++) {
      const pixel = rowStart + 1 + x * 4;
      assert.equal(decoded[pixel], decoded[pixel + 1]);
      assert.equal(decoded[pixel], decoded[pixel + 2]);
      assert.equal(decoded[pixel + 3], 255);
      shades.add(decoded[pixel]);
    }
  }
  assert.deepEqual([...shades].sort((a, b) => a - b), [0, 64, 128, 192]);
});

test('ships original pixel boxer and arena atlases at the documented logical size', async () => {
  const [boxers, arena, config, game] = await Promise.all([
    readFile(new URL('../src/content/ring-rivals/boxers.png', import.meta.url)),
    readFile(new URL('../src/content/ring-rivals/arena.png', import.meta.url)),
    readFile(new URL('../src/content/babylon/config.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/content/ring-rivals/Game.jsx', import.meta.url), 'utf8'),
  ]);
  assert.deepEqual([...boxers.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([boxers.readUInt32BE(16), boxers.readUInt32BE(20)], [256, 128]);
  assert.deepEqual([arena.readUInt32BE(16), arena.readUInt32BE(20)], [480, 180]);
  assert.match(config, /logicalResolution = Object\.freeze\(\{ width: 480, height: 180 \}\)/);
  assert.match(game, /state\.status === "reconnecting"[\s\S]*RECOVERING YOUR SEAT/);
});
