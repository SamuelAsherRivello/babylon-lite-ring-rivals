# Ring Rivals Repository Guidance

## Project requirements

- This repository is an original online-only 1v1 boxing game. Do not add local play, couch co-op, AI opponents, public matchmaking, accounts, rankings, or persistent match history.
- Keep the local boxer small in the foreground and seen from behind; render the remote boxer larger and facing the local player. Each client independently maps the same server-authoritative match to its own view.
- Select one orientation before implementation. This game is landscape; use the template's landscape viewport, remove orientation toggle/shortcut/persisted override, and do not provide another orientation or a layout for both.
- Replace the Babylon pixel-art showcase with actual gameplay. Babylon Lite is WebGPU-only; show a clear unsupported-browser message and do not use a fallback renderer. This 2D game uses Pixel Perfect rendering and chooses its own logical resolution and render scale.
- Keep primary play UI inside the viewport in windowed and fullscreen use. Preserve the four corner roles: title upper left, project links upper right, settings lower left, version lower right. Gutter content is optional and secondary.
- Audio in this game is limited to six original event-driven effects, with visible mute and documented `?mute=1` silence for testing; do not add music or borrowed audio.
- Multiplayer state, combat, scoring, timers, disconnects, and outcomes are server-authoritative. Never trust client-supplied position, damage, health, or result fields.
- Use only original character designs, names, artwork, code, and sound. Supplied Punch-Out reference links are research only.

## Repository layout and implementation

- The npm project is at the repository root; the Vite app, source, tests, assets, and project documentation are in `ring-rivals/`.
- Keep React components and styles under `ring-rivals/src/ui/`; game content and renderer code under `ring-rivals/src/content/`.
- Babylon Lite is the selected renderer. Verify engine APIs against the pinned package declarations. Do not introduce Babylon.js or WebGL.
- Preserve template protected external links, version.txt sourcing, fullscreen persistence, and GitHub Pages base-path handling.
- Do not assign React shortcuts to WASD, arrows, Space, or Enter; display assigned shortcuts in the UI.
- Use OpenSpec for behavior changes. Keep accepted specs synchronized when finalizing the change.
- Do not create pull requests unless the user explicitly asks.

## Commands

Run from repository root: `npm ci`, `npm run dev`, `npm test`, and `npm run build`. Verify visible game behavior in a real browser, including two independent online clients, portrait and landscape browser surfaces, WebGPU errors, and public deployment.
