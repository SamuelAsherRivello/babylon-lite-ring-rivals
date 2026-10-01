import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import viteConfig from '../../vite.config.js';
import { defaultLayout, fitViewport, validateLayout } from '../src/ui/layout.js';

test('keeps npm/application and GitHub Pages roots', () => {
  assert.equal(viteConfig.root, 'project-name');
  assert.equal(viteConfig.base, '/github-repository-template/');
});
test('fits orientations and project-defined ratios in CSS pixels', () => {
  for (const layout of [defaultLayout, {orientation:'portrait',width:9,height:16}, {orientation:'square',width:1,height:1}, {orientation:'landscape',width:7,height:3}]) {
    for (const [w,h] of [[1600,900],[400,900],[800,800],[160,100]]) {
      const fit = fitViewport(w,h,layout);
      assert.ok(fit.width <= w && fit.height <= h + 1e-9);
      assert.ok(Math.abs(fit.width/fit.height - layout.width/layout.height) < 1e-9);
      assert.equal(fit.x*2+fit.width,w);
      assert.equal(fit.y*2+fit.height,h);
      assert.ok(fit.width>0 && fit.height>0);
    }
  }
});
test('invalid dimensions and orientation give actionable errors', () => {
  for (const width of [0,-1,Infinity,NaN,'16']) assert.throws(() => validateLayout({...defaultLayout,width}), /finite positive/);
  assert.throws(() => validateLayout({orientation:'portrait',width:16,height:9}), /orientation must match/);
  assert.throws(() => validateLayout({...defaultLayout,orientation:'unknown'}), /orientation must match/);
  assert.throws(() => fitViewport(-1,900,defaultLayout), /nonnegative CSS/);
  assert.deepEqual(fitViewport(0,0,defaultLayout), {width:0,height:0,x:0,y:0});
});
test('preserves corner contracts and Babylon Lite content-layer guidance', async () => {
  const read = name => readFile(new URL('../'+name,import.meta.url),'utf8');
  const [app,surface,main,html,guide] = await Promise.all([read('src/ui/App.jsx'),read('src/ui/BrowserSurface.jsx'),read('src/main.jsx'),read('index.html'),read('documentation/layout-and-game-integration.md')]);
  assert.ok(main.includes('getElementById("root")'));
  assert.ok(html.includes('id="root"'));
  for (const id of ['content_layer','ui_layer','viewport','browser_surface']) assert.ok(surface.includes('id="'+id+'"'));
  for (const position of ['top_left','top_right','bottom_left','bottom_right']) assert.ok(app.includes('<Corner position="'+position+'">'));
  assert.match(app,/versionText.*trim/);
  assert.match(app,/noopener noreferrer/);
  assert.match(app,/github-repository-template.fullscreen/);
  assert.match(surface,/Babylon Lite content mounts here/);
  assert.doesNotMatch(surface,/future Babylon Lite integration/i);
  for (const term of ['Logical resolution','Internal render resolution','Canvas backing resolution','Display size','CSS size','fractional','StrictMode']) assert.ok(guide.includes(term));
  assert.doesNotMatch(surface,/import.*babylon/i);
});
test('keeps the UI and content source boundaries discoverable', async () => {
  const read = name => readFile(new URL('../' + name, import.meta.url), 'utf8');
  const [main, template, content, standards] = await Promise.all([
    read('src/main.jsx'),
    read('src/ui/Template.jsx'),
    read('src/content/Content.jsx'),
    read('documentation/coding-standards.md'),
  ]);
  assert.match(main, /\.\/ui\/App\.jsx/);
  assert.match(main, /\.\/content\/Content\.jsx/);
  assert.match(main, /<App content=\{<Content \/>\} \/>/);
  assert.match(template, /export function Template/);
  assert.match(content, /export function Content/);
  assert.match(standards, /src\/ui\//);
  assert.match(standards, /src\/content\//);
});
