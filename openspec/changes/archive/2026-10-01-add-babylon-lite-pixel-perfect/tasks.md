# Tasks

## 1. Babylon Lite setup and configuration

- [x] 1.1 Inspect the target `@babylonjs/lite` release metadata and declarations, pin a compatible version, update the lockfile, and verify clean installation with `npm ci`.
- [x] 1.2 Add developer-editable renderer/content-style configuration under `project-name/src/content/`, defaulting to Babylon Lite + 2D, and verify the default and 3D policy selections with focused configuration tests.

## 2. Pixel-art scene and renderer lifecycle

- [x] 2.1 Create an original 32x32 PNG tile with black/gray concentric squares and deliberate stair-step edges; verify its file dimensions and pixel palette with an asset check.
- [x] 2.2 Implement the Babylon Lite 2D scene under `project-name/src/content/` with white clear color, centered tile, elapsed-time-based slow rotation, and texture options `minFilter: "nearest"`, `magFilter: "nearest"`, and `mipMaps: false`; verify scene configuration and sharp authored edges.
- [x] 2.3 Create the Lite engine with `msaaSamples: 1` for the Pixel Perfect 2D policy and verify the pinned package's API/types accept the setting and do not enable multisampling.
- [x] 2.4 Integrate the canvas into the existing content layer without changing viewport/UI CSS geometry; use integer logical-to-CSS sizing when it fits and Lite surface DPR sizing once, then verify centering, resizing, and DPR-change behavior.
- [x] 2.5 Make React setup and cleanup own the engine, scenes, observers, listeners, and render loop; add focused lifecycle checks and verify StrictMode remount does not leave duplicate resources or callbacks.
- [x] 2.6 Handle unavailable or failed WebGPU initialization with a clear in-content message while keeping the React shell usable; verify the unsupported path and cleanup after failed initialization.
- [x] 2.7 Add a 5-CSS-pixel `#e0694b` Babylon Lite sprite outline at the content-world edges, with visibility controlled by React UI state and geometry updated/disposed with resize, DPR changes, and renderer cleanup.
- [x] 2.8 Replace the prior diagnostic label with the requested three-line React UI label at marker 2 in the reference, use `corner-title` for line 1 and `corner-body` for lines 2-3, left-align just left of center, report live scale status, and open a React settings dialog from `(B)`/B with the same settings.
- [x] 2.9 Pause Babylon Lite rendering and sprite-animation processing while any Config, Stats, or Babylon Lite dialog is visible; resume when all are closed.
- [x] 2.10 Render the original 32x32 showcase sprite at exactly 32x32 Babylon Lite backing-store pixels, independent of DPR and stage scale.

## 3. Documentation and integration verification

- [x] 3.1 Update `project-name/documentation/layout-and-game-integration.md` and relevant source comments with the implemented content-layer path, Lite-specific texture/MSAA configuration, DPR behavior, WebGPU requirement, lifecycle responsibilities, and distinct 3D policy; verify terms agree with the implementation and specs.
- [x] 3.2 Run `npm test` and `npm run build` from the repository root and verify they pass.
- [x] 3.2a Run `npm test` and `npm run build` after the initial Babylon Lite diagnostic-overlay implementation.
- [x] 3.2b Run `npm test` and `npm run build` after the React label/dialog update; verify the requested label text, scale display, dialog state, and Babylon border visibility lifecycle.
- [x] 3.2c Run `npm test` and `npm run build` after matching the swatch color and increasing the Babylon outline to 10 CSS pixels.
- [x] 3.3 Verify in a WebGPU-capable browser that the white scene shows the centered rotating 32x32 tile with visibly hard stepped edges and the label/dialog-controlled world-edge outline, remains under the existing UI, and responds correctly to resize; verify the unsupported-WebGPU message in an unavailable-WebGPU environment (verified by the user).
