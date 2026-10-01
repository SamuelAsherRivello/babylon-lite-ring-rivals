# Ring Rivals game integration

Ring Rivals uses the template's fixed 16:9 landscape browser surface. `src/ui/layout.js` defines the aspect ratio, and the surface letterboxes as needed in any browser window. There is no orientation selector or saved orientation override.

The React game client lives in `src/content/ring-rivals/Game.jsx`. It joins the shared Colyseus service using the released `@rmc/multiplayer-client` package, creates or joins private rooms, selects a boxer, sends combat actions, and presents each player's own view. Local player seat identity is resolved from Colyseus presence; the local boxer is drawn smaller in the foreground from behind, while the remote boxer faces the camera at larger scale.

## Smooth multiplayer motion

The server runs simulation at 30 Hz and broadcasts timestamped full snapshots at 20 Hz. `src/content/ring-rivals/motion-smoothing.js` buffers up to twelve snapshots, renders remote state 105 ms behind the newest packet, and interpolates fighter positions, action frames, and hit flashes. This short buffer absorbs ordinary packet timing variation and gives the remote boxer continuous movement between server updates.

The local client predicts dodge pose immediately from the player's input. It only predicts presentation; hit resolution, health, stamina, action acceptance, and match results remain authoritative on the server. Once snapshots arrive, the renderer eases visual offsets toward the interpolated server pose instead of snapping. `ring-rivals/test/motion-smoothing.test.mjs` covers interpolation, reordered and bounded snapshots, immediate dodge response, and easing.

## Online protocol and game flow

The client uses `https://rmc-colyseus-multiplayer-server.vercel.app` unless `VITE_MULTIPLAYER_ENDPOINT` overrides the endpoint for development. The server package and its room protocol are documented in the multiplayer server's `@rmc/multiplayer-client` release README. Two clients share a six-character private room code, independently select either original boxer, and ready before the match begins. A round lasts 60 seconds; the server pauses the clock while a disconnected player attempts same-seat recovery for up to 15 seconds.

Controls work with keyboard (`Z`, `X`, `A`, `S`, arrows), touch action buttons, and standard gamepad face/shoulder/D-pad or left-stick inputs. Focus loss sends neutral input. Six generated Web Audio cues are event-driven; the UI mute control and `?mute=1` support silent play. The experience includes no music.

## Pixel presentation

The project is a 2D game, so the template's Pixel Perfect direction applies: use nearest sampling, no mipmaps, and no multisampling for any game sprites rendered through Babylon Lite. Select logical and internal render resolution based on the game viewport; preserve the 16:9 camera framing as browser dimensions change. Babylon Lite initialization requires WebGPU and must present an actionable error when the browser cannot provide it.

The current lobby screenshot is `documentation/screenshot01.png`. Build and run from repository root with `npm ci`, `npm run dev`, `npm test`, and `npm run build`.
