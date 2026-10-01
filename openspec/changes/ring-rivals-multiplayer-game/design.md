# Design

## Context

See proposal.md and specs/online-boxing-game/spec.md for product behavior. The game repository is `D:\Documents\Projects\VC\BabylonJS\babylon-lite-ring-rivals`; its Vite app root is `ring-rivals/`, with Babylon Lite 1.32.0 and the reconciled GitHub template workflow. The public repository's Pages workflow targets its repository base path. The shared Colyseus server is a separate repository; its Ring Rivals room was implemented in an isolated worktree, released as `v0.9.3`, and production-verified without changing unrelated active changes.

## Goals / Non-Goals

**Goals:**
- Keep game rules deterministic and server-owned, with browser rendering/input isolated from match authority.
- Keep the template's landscape 16:9 composition independent of browser orientation and remove the orientation toggle, shortcut, and persisted override.
- Prove the complete experience using two independent clients and the deployed service.

**Non-Goals:**
- Couch co-op, local play, AI opponents, public matchmaking, accounts, ranking, or durable match history.
- ROM-derived content or a local authoritative fallback when the multiplayer service is unavailable.

## Decisions

### Client structure and rendering

Rename the template app folder to a game-specific slug and update Vite, workflows, tests, docs, and Pages base paths together. Retain the root React surface for menus/settings and use the fixed 16:9 viewport with a game-specific 320x180 logical canvas. The ring stays landscape; on portrait devices it is fitted/letterboxed without rotation. Keep relevant render-quality controls but remove orientation selection and saved override. Use Pixel Perfect rendering with nearest sampling, no mipmaps, and no WebGL fallback.

### Multiplayer boundary

Extend the shared Colyseus service with a separate `ring-rivals` room and game registration. Keep combat simulation in a pure server module, process bounded input actions at the service tick, and broadcast timestamped authoritative state. The client predicts its local movement from current input and interpolates delayed opponent snapshots; it smoothly reconciles prediction errors without deciding hits or outcomes. Publish a compatible shared client release that supports returning to a room with a one-time, room-scoped 15-second seat credential. Never send server secrets to the browser. Isolate changes from the unrelated active server changes using a branch/worktree, and only deploy after tests and release checks pass.

### Game rules and interaction

Use the agreed two original boxers, six-character private room codes, ready lobby, fixed 30 Hz server updates and approximately 20 Hz snapshots, responsive punch/guard/evasion inputs, and best-of-three 60-second rounds. Tied health at expiry yields a drawn round with no point. After three rounds, an equal score yields a drawn match. Disconnect freezes the bout for up to 15 seconds while the same seat may resume. Use six original event-driven sound effects, mute UI, and a `?mute=1` silent-test option; no music.

### Verification and delivery

Use focused server simulation/protocol tests, existing client tests, project tests/build, and browser automation with two isolated browser contexts. Verify room creation, join, mirrored seat-specific perspectives, combat, timer tie, match completion, reconnect or forfeit, responsive portrait/landscape fitting, and WebGPU error presentation. Deploy server first and client second, then verify the README demo link against the public deployment.

## Risks / Trade-offs

- [The shared server has unrelated in-progress work] → isolate this game's branch, preserve all unrelated files/tasks, and inspect the final diff before publishing.
- [Anonymous in-memory rooms can disappear on service restart] → document ephemeral matches and return cleanly to room entry after a reset.
- [Real-time input over browser networks adds latency] → send intent only, simulate on server, interpolate snapshots, and make action windows readable.
- [Some devices lack WebGPU] → show an actionable compatibility message and keep menus/errors usable.
- [Fixed landscape composition on a portrait device reduces size] → letterbox to preserve pixel proportions and keep touch actions accessible.

## Migration Plan

1. Rename and configure the app, import required library skills, and verify the original template surface.
2. Implement and release the isolated server room/client resume contract.
3. Build the game client and focused verification for both seats and recovery.
4. Publish the game to GitHub Pages and verify live join/play from the README URL.

Rollback can restore the previous Pages artifact and prior server release; active ephemeral rooms may end during either deployment.
