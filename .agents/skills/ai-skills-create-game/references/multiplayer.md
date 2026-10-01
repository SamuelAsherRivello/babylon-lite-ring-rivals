# Multiplayer workflow

Read this reference only when multiplayer is requested. Use the same required repository template, shared skills import, Babylon Lite renderer, OpenSpec workflow, original-prompt README section, and GitHub Pages delivery as single-player games.

## Define and inspect

- Derive cooperative/competitive play, capacity, shared state, join/leave behavior, completion, and restart rules from the game request. Document assumptions. Specify what pause or focus loss does for one player while the shared session continues; a local pause or restart must not unintentionally reset everyone.
- Use https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server as the shared backend. Inspect its current default branch, `AGENTS.md`, README feature catalog, `docs/games.md`, `packages/client/README.md`, source, tests, and release/deployment workflows. Reuse a suitable local checkout while preserving unrelated work, or obtain a separate checkout.
- Reuse the existing shared client and lifecycle features. Verify current behavior rather than assuming accounts, persistent identities, durable state, or unlimited session duration exist. Record hosting constraints that affect the proposed game.
- Plan the server extension and client integration together, including the game identifier, message/state contract, capacity, authority, compatible client release, and acceptance tests. Track server work in its own repository's OpenSpec workflow when applicable.

## Extend and release the server first

1. Register the new game and implement the required room/state/message handling. Isolate game-specific rules and state so the new game cannot join or alter another game's session. Preserve existing consumers and protocols; use an explicit compatibility/migration plan if a breaking change is unavoidable.
2. Validate incoming actions, payload bounds, ownership, and game rules on the server where shared outcomes require authority. Reuse shared identity, admission, connection status, retry, subscription, and teardown support. Put broadly useful additions in the shared client rather than duplicating them in each game.
3. Update the game registry, feature catalog, client API documentation, and meaningful integration tests. Cover two-client synchronization, late join, departure, fresh reconnect or supported recovery, capacity, game isolation, and game-specific rules. Run applicable existing-game regressions and build/type checks.
4. Commit and push the scoped server changes. Inspect and invoke the repository's actual Release workflow with the appropriate version. Verify its release/tag, published client package, backend deployment, and live game-specific checks; release success alone does not prove deployment or the new game's protocol works. Extend deployment verification where needed so existing drawing checks are not the only evidence for a different game.
5. Record the server release, client asset URL/version, deployed public endpoint, and verification results. Synchronize the local server checkout with release-generated commits. If deployment or checks fail, use the repository's documented recovery path, preserve evidence, and report the blocker rather than repeatedly publishing versions or claiming success.

## Create and verify the game client

After the server supports the agreed contract and its release is verified, create the game through the required template-generation flow and import the shared skills. Build against the exact released shared-client package and commit the lockfile. Discover the current artifact naming and compatible SDK versions from the server repository; do not copy an old example version.

Use configurable local and production backend URLs. GitHub Pages hosts the static client; the server runs on its separately deployed backend. Use the public secure endpoint in production and keep deployment credentials out of browser code. Show connecting, connected, full, disconnected, and retry/error states as applicable. Do not silently substitute offline simulation for a requested multiplayer experience.

Test a meaningful game loop with at least two independent browser sessions connected to the same game. Verify shared actions/state, late join, leave/reconnect, completion/replay behavior, and desktop/mobile controls. Exercise capacity and isolation with integration tests where appropriate. Repeat a two-client smoke test against the released public game and backend, recording any browser/GPU or physical-device limitations.

Document multiplayer setup, controls, player limits, connection/recovery behavior, hosting limitations, and the pinned server/client release in the game README. Follow the common game release and Pages workflow. Return game and server repository/release links, the playable URL, both local checkout paths, and verification results. Keep the server and game release statuses distinct if either delivery is blocked.
