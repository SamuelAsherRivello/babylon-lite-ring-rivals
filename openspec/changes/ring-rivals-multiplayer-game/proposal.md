# Proposal

## Why

Create an original browser boxing game that brings the readable attack-and-counter rhythm of classic 16-bit boxing to online head-to-head play. Each player needs a distinct local view of the same match, with their own boxer small in the foreground and their opponent large across the ring.

## What Changes

- Build an original 16-bit-style online 1v1 boxing game with two selectable original boxers.
- Provide private invite rooms, authoritative real-time combat, reconnect grace, and best-of-three rounds.
- Give each client its own boxer-from-behind view in a fixed landscape 4:3 frame; do not expose an orientation toggle.
- Deploy the browser client and its multiplayer service publicly, documenting setup, controls, and live play.
- Use the reference pages for gameplay/presentation research only; do not reuse ROM data, code, branding, characters, or media.

## Capabilities

### New Capabilities
- `online-boxing-game`: Online room lifecycle, independent client perspective, combat, match flow, controls, and recovery.

### Modified Capabilities
None.

## Impact

The browser client is generated from the Babylon Lite template and uses its React/Vite layout, WebGPU renderer, tests, and GitHub Pages workflows. The shared Colyseus server and its client package need a game-specific room and short-lived seat recovery contract before the client can rely on them. The project also needs original pixel art and audio, README instructions, and a live deployment.
