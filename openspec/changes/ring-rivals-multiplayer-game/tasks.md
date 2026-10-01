# Tasks

## 1. Project setup

- [ ] 1.1 Rename the Vite app to `ring-rivals`, update Pages/base paths and replace project placeholders; verify `npm run build` produces the renamed app output and no required template metadata is stale.
- [ ] 1.2 Set up project OpenSpec context/skills and reconcile shared-library skills; verify `openspec doctor --json` and generated skill metadata.
- [ ] 1.3 Replace the starter screen with the Ring Rivals React/Babylon Lite shell and fixed landscape 4:3 viewport; verify rendered UI has no orientation toggle and stays fitted in portrait and landscape.

## 2. Multiplayer service

- [ ] 2.1 Create isolated OpenSpec change and branch/worktree in the shared server repository; verify its unrelated active change and working files remain untouched.
- [ ] 2.2 Implement the two-seat `ring-rivals` private room, validated inputs, server-owned boxing simulation, round/match outcomes, and draw rules; verify simulation and protocol tests cover both seats, invalid inputs, tied rounds, KO, and best-of-three.
- [ ] 2.3 Add room-scoped one-time 15-second seat recovery to the server and compatible shared client API; verify reconnect restores same seat/state and expiry forfeits, with client/server tests and updated game registry docs.
- [ ] 2.4 Run server and shared client verification, release and deploy the service, and document the production endpoint; verify the health endpoint and room create/join work against the deployed release.

## 3. Game client

- [ ] 3.1 Implement original two-boxer art and mirrored foreground/opponent presentation with HUD and ring; verify both local seat mappings show the local boxer small from behind and remote boxer large facing them.
- [ ] 3.2 Implement invite-room entry, boxer selection, ready/rematch/leave states and multiplayer connection errors; verify two clients join the same private room and full/invalid codes are visible.
- [ ] 3.3 Implement combat controls, server-state rendering, touch/gamepad/keyboard input, audio settings, and neutral input on focus loss; verify actions and authoritative snapshots appear for both clients.
- [ ] 3.4 Implement round timer, score, KO, tied-round draw, match draw/win, disconnect recovery and forfeit UI; verify all endings and reconnection states with two clients.
- [ ] 3.5 Add focused client tests and update README/docs with verified commands, controls, limitations, and the live demo URL; verify `npm test` and `npm run build`.

## 4. Release and live verification

- [ ] 4.1 Deploy the client to GitHub Pages and update repository metadata; verify the public README demo URL loads the latest build.
- [ ] 4.2 Run browser verification with two independent clients against production for room creation/join, seat-specific views, combat, match flow and reconnect/forfeit; verify console/network errors are resolved and save a representative current screenshot.
