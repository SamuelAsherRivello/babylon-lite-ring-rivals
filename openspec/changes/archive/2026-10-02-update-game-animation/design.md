# Design

## Context

See proposal.md and specs/boxer-animation/spec.md. The current renderer uses a four-cel atlas with one front and one rear pose per boxer. The server already broadcasts action names and action-frame progress at 30 Hz, while the client samples timestamped snapshots and renders through Babylon Lite sprites.

## Goals / Non-Goals

**Goals:**
- Make attack target and defensive intent legible on both clients before and during resolution.
- Keep each boxer centered on its existing horizontal anchor when no temporary action motion is active.
- Keep the local/rear and remote/front views synchronized to the same authoritative fight state.

**Non-Goals:**
- Add continuous movement, persistent lane changes, range-based combat, or new inputs.
- Change server action timing, hit rules, stamina, match flow, or the multiplayer protocol.
- Reuse Punch-Out ROM data, sprites, names, or effects.

## Decisions

### Use original multi-cel boxer artwork

Extend the existing deterministic boxer-art generator to produce several original cels per boxer, action, and view. Organize the cels as explicit clips with a small metadata table for idle, head/body jab and cross, high/low guard, left/right evade, block, and hit-stun. Keep the generator and PNGs in the app's existing content directory. This yields readable limb and torso poses at pixel scale; shifting or resizing one whole static sprite alone would repeat the current limitation. Do not add an image or animation dependency.

### Map authoritative action progress to visual clips

Map each server action and `actionFrame` to a clip and cel. Attack cels must show a recognizable target-specific windup before the server's existing hit frame, then impact and recovery. Guard clips remain in their held stance until neutral input; dodge and hit clips finish within their server action windows. Idle uses a restrained loop. Keep the frame mapper pure and unit-testable.

For immediate local feedback, derive a temporary clip progress from the local input timestamp while waiting for the first authoritative action snapshot. Once the snapshot arrives, use its action and action-frame progress; if the server rejects the action, blend back to the authoritative pose. Remote animations always use interpolated snapshots. This affects presentation only.

### Use reversible pose offsets around stable anchors

Keep the existing foreground/background depth, scale, horizontal center, sprite draw order, and seat-specific front/rear mapping. Apply small action-specific horizontal sway and vertical duck/lean offsets while the clip is active, with neutral offset at its end. Each clip must explicitly settle at the same home coordinate, including after interruption or a snapshot correction; never accumulate offsets from a prior frame.

### Preserve the server boundary

The current server action, action-frame, hit-stun, and dodge state already provide the animation timeline. No new message fields or server implementation are needed. The server continues to decide whether an attack lands, whether a defense works, and how health or match state changes. Client pose prediction cannot affect those decisions.

## Risks / Trade-offs

- [Too few pose changes may still make attacks hard to distinguish] → author separate head/body and jab/cross cels and review the silhouettes at actual match scale from both seats.
- [Discrete state snapshots may cause a cel to skip] → use the existing snapshot interpolation and map progress to a small, deliberately slow set of cels; test at the 20 Hz snapshot cadence.
- [Local prediction may animate an action the server rejects] → keep prediction brief and return smoothly to the authoritative clip when no matching action is confirmed.
- [Additional cels can increase texture dimensions] → use a compact grid atlas and confirm the generated dimensions remain within WebGPU texture limits.

## Migration Plan

1. Generate and inspect the original multi-view animation atlas and clip metadata.
2. Add the pure action/frame-to-clip mapper and wire it to both rendered fighters.
3. Add mapper, timing, anchoring, and atlas tests; run the client test suite and production build.
4. Verify two online clients can read and answer head/body attacks from opposite perspectives, then publish the client through the existing repository workflows.

Rollback can restore the prior four-pose atlas and renderer mapping in a client deployment; no server rollback is required.
