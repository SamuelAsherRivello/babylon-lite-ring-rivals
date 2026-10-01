# Design

## Context

See [proposal.md](proposal.md) for motivation and [the spec delta](specs/babylon-render-resolution/spec.md) for user-visible behavior. The Babylon Lite 2D integration uses a DPR-sized canvas and SpriteRenderer. The installed Lite 1.32.0 declarations expose `createRenderTexture2D`, texture sampler options, `setSpriteRendererTarget`, and render-target copy/blit tasks. The WebGPU device exposes `maxTextureDimension2D`.

## Goals / Non-Goals

**Goals:**

- Keep logical world dimensions stable while changing the internal render target.
- Keep React as the owner of user settings and persistence; keep Babylon Lite as owner of GPU targets and presentation.
- Preserve nearest-neighbor sampling and the single-sample Pixel Perfect 2D policy.
- Recompute target dimensions from the current canvas backing size after resize or DPR changes.

**Non-Goals:**

- Change renderers or add a non-WebGPU fallback.
- Change logical resolution, camera framing, or gameplay coordinates when cycling target sizes.
- Add a runtime renderer/content-style picker or alter the separate 3D policy.

## Decisions

1. **Persist a preset identifier and derive dimensions at runtime.** React stores `quarter`, `half`, `native`, or `double`, not dimensions captured for one viewport. It passes the setting through the existing viewport-info context. A missing or invalid value selects Native.

   **Alternative considered:** Persist explicit dimensions. Rejected because they become stale when viewport size or DPR changes.

2. **Render to an internal texture, then present to the native canvas.** Set the scene SpriteRenderer's target to a selected-size render texture. Register a later presentation SpriteRenderer that samples this texture and covers the canvas backing dimensions. Set nearest minification and magnification on the render texture. Keep Lite responsible for canvas sizing; use computed backing dimensions only for internal targets and presentation geometry.

   **Alternative considered:** Change canvas backing dimensions to the selected render size. Rejected because Lite sizes the canvas from CSS dimensions and DPR, and this would conflate internal resolution with presentation size.

3. **Keep scene geometry in logical coordinates.** Render the unchanged camera/world view into the selected target. Rebuild or resize target resources and presentation geometry when the selection, viewport, or DPR changes, without changing world positions or camera bounds.

   **Alternative considered:** Use target pixel dimensions as scene coordinates. Rejected because a rendering setting would then change gameplay and framing.

4. **Expose the control in React and cycle the four presets.** Add a `(R)` button below the Babylon Lite title and bind R to the same cycle action. Show actual dimensions, append `(Native)` only for Native, and mirror the value in the Babylon Lite dialog. Add a validated preset property to the existing local-storage record without changing existing preference semantics.

   **Alternative considered:** Put the setting only in a dialog. Rejected because the user requested a visible and directly adjustable HUD value.

5. **Cap upscaled resolution to device texture limits.** Compute a uniform cap factor from the selected upscaled dimensions and `maxTextureDimension2D`, then floor both dimensions to positive integers. Preserve aspect ratio, keep the selected preset, and display actual dimensions. If allocation still fails for memory or another reason, show a clear content error without switching renderers.

   **Alternative considered:** Hide or disable an upscaled preset. Rejected because the four choices should remain available and show their actual dimensions.

## Risks / Trade-offs

- [A target may exceed available GPU memory even when dimensions meet WebGPU limits] → Catch allocation failures and show a clear in-content error; never change renderer.
- [Nearest-neighbor downscaling discards fine details] → This is intentional for `2DPixelPerfect` and will be documented.
- [Two SpriteRenderers add a presentation pass] → Keep presentation to one fullscreen sprite and verify lifecycle disposal on resize, preset changes, and StrictMode remount.
- [Odd native dimensions can make exact half ratios impossible] → Compute integer dimensions with one shared aspect-preserving scale and show the resulting actual dimensions.

## Migration Plan

Missing or invalid saved preset values resolve to Native. Existing saved fullscreen, orientation, and HUD settings retain their meanings. Rollback removes the preference and two-stage render path without changing Lite's canvas configuration.
