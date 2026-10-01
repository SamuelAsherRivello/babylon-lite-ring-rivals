# Proposal

## Why

The Babylon Lite 2D policy currently reports logical scale but has no independent, user-selectable render target resolution. A resolution selector will let users compare lower, native, and higher internal render resolutions while keeping game coordinates and camera framing stable.

## What Changes

- Add four runtime render-resolution presets relative to the native DPR-scaled canvas backing size: quarter, half, native, and double width and height.
- Keep the developer-configured logical scene dimensions, game coordinates, and camera view unchanged as the selected render target changes.
- Present the selected render target into the native backing buffer using nearest-neighbor sampling in both directions.
- Add a React HUD line immediately below the Babylon Lite title, formatted like `(R) RenderResolution: 1280x720 (Native)`. Clicking `(R)` or pressing R cycles through the choices. Show active pixel dimensions and mark the native choice.
- Make React own the selection, default to Native, persist the selected preset in local storage, and pass it to Babylon Lite. Recompute dimensions when viewport size or DPR changes.
- Keep all rendering on WebGPU. Cap the double-size target to supported WebGPU texture dimensions while preserving aspect ratio and show the actual capped dimensions.
- Document logical resolution, internal render resolution, canvas backing resolution, and CSS display size as separate concepts.

## Capabilities

### New Capabilities

- `babylon-render-resolution`: User-selectable Babylon Lite internal render resolution independent of logical scene dimensions.

### Modified Capabilities

None. This is additive to the existing Babylon Lite integration.

## Impact

- React settings state, local-storage persistence, HUD control, and keyboard handling under `project-name/src/ui/`.
- Babylon Lite render-target allocation, resize handling, nearest-neighbor presentation, and lifecycle under `project-name/src/content/`.
- Integration guidance and focused tests under `project-name/documentation/` and `project-name/test/`.
- No new runtime dependency; use and verify the installed Babylon Lite 1.32.0 render-target APIs and WebGPU device limits.
