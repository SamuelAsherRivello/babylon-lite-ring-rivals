# Tasks

## 1. Resolution model

- [x] 1.1 Add logical-resolution and render-preset configuration under `project-name/src/content/`, derive quarter/half/native/double integer dimensions from the live native backing size, and verify cycling, aspect preservation, minimum dimensions, and recomputation with focused unit tests.
- [x] 1.2 Cap upscaled dimensions against the active WebGPU device limit while preserving aspect ratio, and verify capped actual dimensions with limit-boundary tests.

## 2. React settings and HUD

- [x] 2.1 Add validated render-preset state to existing React settings persistence with Native as the missing/invalid default, and verify save/restore plus compatibility with existing settings tests.
- [x] 2.2 Add the `(R) RenderResolution: <width>x<height>` HUD control below the Babylon Lite title, cycle it by click and R key, mirror it in the Babylon Lite dialog, and verify display, cycling, focus behavior, and storage through UI tests.
- [x] 2.3 Pass the selected preset and current dimensions from React into Babylon Lite without changing logical resolution, and verify context updates preserve existing dialog pause and resize behavior.

## 3. Babylon Lite render-target pipeline

- [x] 3.1 Verify pinned Babylon Lite 1.32.0 render-texture, SpriteRenderer target, sampling, and disposal APIs from installed declarations and confirm the design with a minimal WebGPU scene.
- [x] 3.2 Render the logical scene into a selected-size internal texture and present it to the canvas with nearest minification/magnification, and verify lower/native/higher output dimensions and hard pixel edges in a WebGPU-capable browser.
- [x] 3.3 Recreate or resize internal and presentation resources on preset, viewport, and DPR changes; dispose stale resources safely under StrictMode remounts and verify no duplicate renderers, leaks, or stale dimensions.
- [x] 3.4 Handle unsupported WebGPU and render-target allocation failures with clear content errors while remaining on the WebGPU path, and verify no alternate renderer is selected.

## 4. Documentation and integration verification

- [x] 4.1 Update `project-name/documentation/layout-and-game-integration.md` with logical, internal render, backing, and CSS dimensions and the four nearest-neighbor presets; verify examples match implementation behavior.
- [x] 4.2 Run focused tests and the production build, then verify click/R cycling, local-storage restore, viewport/DPR recomputation, hardware-limit capping, hard edges, and error handling in a WebGPU-capable browser.
