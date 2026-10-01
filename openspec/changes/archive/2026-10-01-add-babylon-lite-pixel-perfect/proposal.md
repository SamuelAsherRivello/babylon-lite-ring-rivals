# Proposal

## Why

The template currently has a renderer-free content boundary, so consumers have no working Babylon Lite example showing how a 2D pixel-art scene should handle sharp sampling, device-pixel ratio, and canvas lifecycle. A small, usable example will make the content-layer boundary concrete while giving 2D projects a reliable pixel-sharp default.

## What Changes

- Add Babylon Lite as a concrete renderer integration owned by `project-name/src/content/`.
- Add a developer-editable content configuration selecting Babylon Lite and 2D or 3D content; use Pixel Perfect only for Babylon Lite + 2D, without adding a runtime mode selector.
- Provide a default 2D showcase with a white background and an original 32x32 black-and-gray concentric-square tile with deliberate stair-step edges, centered and rotating slowly around its center.
- Render `(B) Babylon Lite`, the live scale, and `Mode: 2DPixelPerfect` in the highlighted area marked 2 in the reference, left justified with its left edge just left of center. Match `corner-title` styling on the first line and `corner-body` on the scale/mode lines. Use the supplied `#e0694b` accent color for the text and a 5-CSS-pixel Babylon Lite outline. Clicking `(B)` opens a matching React settings dialog; show the outline while it is open and remove it when the dialog closes.
- Define Pixel Perfect as DPR-aware backing sizing with DPR applied once, integer logical-to-CSS scaling where it fits, nearest texture sampling (`minFilter` and `magFilter` set to `nearest`, `mipMaps` disabled), and no anti-aliasing or smoothing (`msaaSamples: 1`). State that fractional DPR and fractional fallback scaling do not guarantee physical-pixel alignment.
- Keep React UI at CSS resolution and layered over the content. Show a clear WebGPU-required message when Babylon Lite cannot initialize because WebGPU is unavailable, while preserving the surrounding app where possible.
- Keep 3D content on its own performance/quality policy; do not inherit the Pixel Perfect 2D defaults.
- Update integration guidance and source comments to reflect the implemented Babylon Lite path and lifecycle.

## Capabilities

### New Capabilities

- `babylon-lite-content`: Babylon Lite content configuration and a Pixel Perfect 2D showcase with WebGPU capability handling.

### Modified Capabilities

- `browser-template-layout`: Replace the renderer-free starter requirement with a content-layer renderer integration that preserves the existing viewport and independent React UI behavior.
- `game-integration-guidance`: Change Babylon Lite and Pixel Perfect guidance from future-only recommendations to documented behavior for the implemented 2D integration, while retaining separate 3D guidance.

## Impact

- Runtime code and artwork: `project-name/src/content/`.
- React content mounting and canvas layering: `project-name/src/main.jsx` and `project-name/src/ui/BrowserSurface.jsx` as needed, keeping reusable UI under `src/ui/`.
- Dependencies and lockfile: add and pin a compatible `@babylonjs/lite` version after verifying its current API and WebGPU initialization behavior.
- Documentation: `project-name/documentation/layout-and-game-integration.md`.
- OpenSpec: new `babylon-lite-content` capability and deltas for `browser-template-layout` and `game-integration-guidance`.
- Verification: focused lifecycle/configuration checks, production build, and browser verification of sharp output, rotation, resize/DPR behavior, UI layering, and WebGPU-unavailable handling.

## Assumptions and Deferred Decisions

- The renderer/content-style selection is developer-editable configuration in the content layer, not an in-app settings control.
- The default selected mode is Babylon Lite + 2D so the template opens on the showcase. A 3D selection must not enable Pixel Perfect; a complete 3D scene is outside this change.
- The rotation is a slow, continuous in-plane rotation around the sprite's visual center. An exact angular velocity can be selected during implementation and documented with the configuration.
- Babylon Lite-specific texture and surface options are verified from the current Lite docs/source: `Texture2DOptions` uses `minFilter`, `magFilter`, and `mipMaps`; `SurfaceOptions` exposes `msaaSamples` (`1` disables MSAA). Babylon.js APIs and constants must not be assumed to apply to Babylon Lite. The dependency version still must be pinned after checking the package typings during implementation.
- Browsers without WebGPU receive a clear in-content unsupported message; no automatic Babylon.js fallback is added.
