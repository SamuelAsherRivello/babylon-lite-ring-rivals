# Design

## Context

See [proposal.md](proposal.md) for motivation. The Vite app mounts React from `project-name/src/main.jsx`; the content canvas must remain inside the existing content layer and React UI must remain independent. Babylon Lite is WebGPU-only. Its current API documents `Texture2DOptions` with `minFilter`, `magFilter`, and `mipMaps`, and `SurfaceOptions` with `msaaSamples` and DPR-aware surface sizing. See the [Lite architecture overview](https://github.com/BabylonJS/Babylon-Lite/blob/master/docs/lite/architecture/00-overview.md) and [Lite surface options](https://github.com/BabylonJS/Babylon-Lite/blob/master/packages/babylon-lite/src/engine/surface.ts).

## Goals / Non-Goals

**Goals:**

- Keep renderer setup, mode configuration, and the showcase asset within `src/content/`, while integrating through the existing React content mount.
- Make the chosen 2D pixel policy explicit in Babylon Lite-native settings and avoid double-applying device pixel ratio.
- Keep initialization, render-loop ownership, resizing, and disposal compatible with React StrictMode.

**Non-Goals:**

- Add a 3D scene or a runtime mode picker.
- Add a Babylon.js/WebGL fallback or use Babylon.js-only API constants.
- Change the surrounding UI, protected links, fullscreen behavior, or viewport design.

## Decisions

1. **Use Babylon Lite's native engine/surface and texture options.** Pin a compatible `@babylonjs/lite` version only after checking that version's package metadata and typings. Create the engine with `msaaSamples: 1` to disable Lite's multisample anti-aliasing. For the pixel-art texture use `minFilter: "nearest"`, `magFilter: "nearest"`, and `mipMaps: false`; do not translate the older Babylon.js forum's constants into Lite. These options prevent filtering and mip-level blending from softening authored pixel edges. Re-check exact option types against the pinned release while implementing.

   **Alternative considered:** render a hand-built canvas/WebGL scene outside Lite. Rejected because the requested integration specifically uses Babylon Lite and should demonstrate its supported configuration.

2. **Let the canvas surface apply DPR once.** Keep scene coordinates at a 32-pixel logical unit and size the CSS presentation box using centered integer logical-to-CSS scaling when the viewport permits. Do not manually multiply canvas backing dimensions by DPR in a second code path; use Lite's surface resize behavior and observe content viewport changes. If fractional fitting is needed below 1x, use the documented fallback without claiming strict pixel alignment. Avoid setting a DPR cap that would defeat the requested DPR-aware backing resolution.

   **Alternative considered:** force `maxDevicePixelRatio: 1`. Rejected because it removes high-DPI backing resolution rather than accounting for the device's DPR once.

3. **Keep content configuration and engine lifecycle in a content-layer React boundary.** A small developer-editable configuration in `src/content/` selects Babylon Lite with 2D showcase content by default. A React content component owns a canvas ref; its effect creates the engine/scene, registers and starts the Lite scene, and returns complete cleanup. Resize observers and any DPR-change listener are effect-owned and removed during cleanup. UI remains a sibling/overlay controlled by the existing application layout.

   **Alternative considered:** initialize the engine at module load or from a React render function. Rejected because those paths can create duplicate engines or render loops during StrictMode and remounts.

4. **Author the tile as a deterministic 32x32 nearest-sampled image asset.** Draw the black/gray concentric squares and stepped edges at native resolution, with no antialiased vector resampling. Place its visual center at the scene origin, use a white scene clear color, and update in-plane rotation from elapsed frame time so speed is stable across refresh rates.

   **Alternative considered:** scale the image into a larger pre-rendered asset. Rejected because source-resolution artwork makes the logical pixel grid explicit and avoids hidden resampling.

5. **Keep settings text in the React UI and draw the scene outline with Babylon Lite.** Place `(B) Babylon Lite`, the live scale/integer-status line, and `Mode: 2DPixelPerfect` in the reference's upper lower-center target area, using `corner-title` on the first line and `corner-body` on the remaining lines, with left alignment starting just left of center. Use the provided `#e0694b` swatch for both. The `(B)` button and B shortcut open the existing React dialog, which repeats those settings. Four 5-CSS-pixel Babylon Lite sprites show the full content-world outline while that dialog is open and hide as it closes (including Escape). Report measured scale from the content scene through a small UI context; keep canvas backing conversion/DPR behavior in the renderer.

   **Alternative considered:** keep the settings string baked into pixel-font sprites. Rejected because the requested corner-body font sizing/casing and clickable React control are more faithfully handled in the UI layer; the scene border remains an engine-rendered element for accurate viewport-edge verification.

6. **Treat missing WebGPU as a content initialization state.** Catch engine initialization failure, replace the canvas presentation with a concise WebGPU-required message, and keep the React shell mounted. Cleanup remains safe whether initialization succeeds, fails, or is interrupted by unmount.

   **Alternative considered:** silently fall back to Babylon.js/WebGL. Rejected because Lite's supported rendering path is WebGPU and an implicit engine substitution would obscure the template's actual requirement.

## Risks / Trade-offs

- [The current upstream docs may differ from the package release selected by implementation] → Pin a compatible release and verify its shipped declarations before coding against these option names.
- [Nearest sampling cannot fix fractional physical-pixel placement under every DPR/zoom combination] → Keep the guarantee to sharp logical/CSS sampling and make fractional-scale fallback explicit.
- [WebGPU availability and initialization can vary by browser/device] → Render an in-content unsupported state and preserve the rest of the React app.
- [StrictMode can expose duplicate loops or stale resize callbacks] → Make the effect own all observers, listeners, scene registrations, and engine disposal, then verify a mount-cleanup-remount cycle.
- [The settings text is UI-rendered over the canvas] → Keep it positioned and sized in CSS pixels independently of DPR; draw only the viewport edge diagnostic through Babylon Lite.

## Migration Plan

No migration is needed for existing projects because this change updates the reusable template baseline. Rollback consists of reverting the Babylon Lite dependency/content integration and restoring the renderer-free starter requirement and prior integration guidance.
