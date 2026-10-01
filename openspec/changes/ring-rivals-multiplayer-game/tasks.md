# Tasks

## 1. Project setup

- [x] 1.1 Rename the Vite app to `ring-rivals` and update its Vite root, Pages/base paths, package name, and test paths; verify `npm test` and `npm run build` produce the renamed app output.
- [x] 1.2 Set up project OpenSpec context/skills and reconcile shared-library skills; verify `openspec doctor --json` and generated skill metadata.
- [x] 1.3 Replace the Babylon showcase with the Ring Rivals React/Babylon Lite game and fixed landscape 16:9 viewport; verify WebGPU failure is actionable, no orientation toggle/shortcut/persisted override remains, and the viewport stays fitted in portrait and landscape browser surfaces.

## 2. Multiplayer service

- [x] 2.1 Create isolated OpenSpec change and branch/worktree in the shared server repository; verify its unrelated active change and working files remain untouched.
- [x] 2.2 Implement the two-seat `ring-rivals` private room, validated inputs, server-owned boxing simulation, round/match outcomes, and draw rules; verify simulation and protocol tests cover both seats, invalid inputs, tied rounds, KO, and best-of-three.
- [x] 2.3 Add room-scoped one-time 15-second seat recovery to the server and compatible shared client API; verify reconnect restores same seat/state and expiry forfeits, with client/server tests and updated game registry docs.
- [x] 2.4 Run server and shared client verification, release and deploy the service, and document the production endpoint; verify the health endpoint and room create/join work against the deployed release.

## 3. Game client

- [x] 3.1 Implement original two-boxer art and mirrored foreground/opponent presentation with HUD and ring; verify both local seat mappings show the local boxer small from behind and remote boxer large facing them.
- [x] 3.2 Implement invite-room entry, boxer selection, ready/rematch/leave states and multiplayer connection errors; verify two clients join the same private room and full/invalid codes are visible.
- [x] 3.3 Implement combat controls, local movement prediction, timestamped remote snapshot interpolation, smooth correction, touch/gamepad/keyboard input, six event sound effects, mute UI, `?mute=1`, and neutral input on focus loss; verify smooth motion converges to authority, actions/snapshots appear for both clients, and mute works.
- [x] 3.4 Implement round timer, score, KO, tied-round draw, match draw/win, disconnect recovery and forfeit UI; verify all endings and reconnection states with two clients.
- [x] 3.5 Add focused client tests and update README/docs with verified commands, controls, limitations, and the live demo URL; verify `npm test` and `npm run build`.

## 4. Release and live verification

- [x] 4.1 Deploy the client to GitHub Pages and update repository metadata; verify the public README demo URL loads the latest build.
- [ ] 4.2 Run browser verification with two independent clients against production for room creation/join, seat-specific views, combat, match flow and reconnect/forfeit; verify console/network errors are resolved and save a representative current screenshot.
