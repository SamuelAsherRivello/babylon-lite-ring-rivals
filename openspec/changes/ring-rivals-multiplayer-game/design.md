# Design

## Context

See proposal.md and specs/online-boxing-game/spec.md for product behavior. The generated project currently has a clean GitHub template checkout at `D:\Documents\Projects\VC\BabylonJS\babylon-lite-ring-rivals`, a React/Vite app still under `project-name/`, Babylon Lite 1.32.0, and template UI/layout/render-resolution modules. The game repository is public and its Pages workflow targets the repository base path. The shared Colyseus server is a separate repository with an unrelated active change; avoid its checkout and change state while developing this game's server support.

## Goals / Non-Goals

**Goals:**
- Keep game rules deterministic and server-owned, with browser rendering/input isolated from match authority.
- Keep the fixed landscape 4:3 composition independent of browser orientation and remove any orientation choice from the UI.
- Prove the complete experience using two independent clients and the deployed service.

**Non-Goals:**
- Couch co-op, local play, AI opponents, public matchmaking, accounts, ranking, or durable match history.
- ROM-derived content or a local authoritative fallback when the multiplayer service is unavailable.

## Decisions

### Client structure and rendering

Rename the template app folder to a game-specific slug and update Vite, workflows, tests, docs, and Pages base paths together. Retain the root React surface for menus/settings and host the 320x240 logical 4:3 ring in the Babylon Lite game layer. The ring stays landscape; on portrait devices it is fitted/letterboxed without rotation. Keep the template's render-quality controls only if they remain relevant; remove orientation selection. Use native pixel-art drawing/texture assets authored for this game, nearest sampling, no mipmaps, and no WebGL fallback.

### Multiplayer boundary

Extend the shared Colyseus service with a separate `ring-rivals` room and game registration. Keep combat simulation in a pure server module, process bounded input actions at the service tick, and broadcast authoritative state. Publish a compatible shared client release that supports returning to a room with a one-time, room-scoped 15-second seat credential. Never send server secrets to the browser. Isolate changes from the unrelated active server change using a branch/worktree, and only deploy after tests and release checks pass.

### Game rules and interaction

Use the agreed two original boxers, six-character private room codes, ready lobby, fixed 30 Hz server updates and approximately 20 Hz snapshots, responsive punch/guard/evasion inputs, and best-of-three 60-second rounds. Tied health at expiry yields a drawn round with no point. After three rounds, an equal score yields a drawn match. Disconnect freezes the bout for up to 15 seconds while the same seat may resume.

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
