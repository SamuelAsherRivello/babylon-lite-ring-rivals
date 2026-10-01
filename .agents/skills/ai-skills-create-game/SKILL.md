---
name: ai-skills-create-game
description: Create and publish Babylon Lite games using the repository template, shared skills library, OpenSpec, and GitHub Pages. Default to single player; support requested multiplayer by extending and releasing the shared Colyseus server.
---

# AI Skills Create Game

Turn one game request into a complete, tested, released browser game. Default to single player. Enable multiplayer when the user requests it, including explicit networked cooperative or competitive play. Carry the request through implementation and GitHub Pages delivery unless the user explicitly limits it to planning or local work.

## Arguments

Accept natural language or named fields; these are prompt inputs, not shell flags.

| Input | Required | Meaning and default |
| --- | --- | --- |
| `game` | Yes | Core idea, player actions, and objective. Infer a small coherent game from a short idea; ask only if the idea itself is missing or materially contradictory. |
| `mode` | No | `single-player` (default) or `multiplayer`. Natural-language multiplayer requests also select multiplayer; resolve contradictory mode requirements before implementation. |
| `name` | No | Display name and/or repository slug. Derive omitted values from the idea; default slug `babylon-lite-<game-slug>`. |
| `art` | No | Visual direction, palette, mood, and supplied assets. Default to original, cohesive artwork suited to the mechanics. |
| `references` | No | URLs, files, or named games. Assign each a role (gameplay, art, layout) and intent (faithful or inspiration). Infer obvious roles and record them; resolve consequential conflicts. |
| `requirements` | No | Must-haves, exclusions, and overrides such as camera, aspect ratio, controls, repository owner, destination, or delivery scope. Explicit requirements override defaults. |

Default GitHub owner: `SamuelAsherRivello`. Use the authenticated account's existing access; never assume an unavailable credential. A name collision is not permission to replace an existing repository. Reuse it only when the user requests continuation of that project.

## Reusable prompt

```text
$ai-skills-create-game
game: A one-screen arcade game where a robot redirects falling sparks into matching batteries before they overflow.
name: Spark Sorter
art: Chunky toy-like machinery, dark navy metal, warm orange sparks, readable silhouettes.
references: None; create an original design.
requirements: A 90-second score challenge with keyboard and touch controls.
```

For any invocation, apply this delivery brief to the supplied inputs:

> Create a complete game from `game`, using single player unless multiplayer is requested. For multiplayer, extend, test, release, and verify the shared Colyseus server for this game before creating the game client. Use `mode`, `name`, `art`, `references`, and `requirements` to refine it. Start from the required repository template, import the shared skills library, and use Babylon Lite with WebGPU. Plan and track the work with OpenSpec. Implement the playable loop, original presentation, desktop and touch controls, and recovery states. Test the game and inspect it in a real browser. Document it, release it through GitHub Actions, deploy it to GitHub Pages, verify the public build, and synchronize the local checkout. Return the playable URL, repository, release, verification results, and any remaining limitations.

## Required sources

- Template: https://github.com/SamuelAsherRivello/github-repository-template
- Shared skills: https://github.com/SamuelAsherRivello/ai-skills-library
- Multiplayer server (multiplayer only): https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server
- README presentation reference: https://github.com/SamuelAsherRivello/babylon-lite-pixel-walker (original prompt presentation, not inherited gameplay).

Use both repositories on every new project. Read their current instructions and actual default branches; do not assume the branches match. Create the game repository using GitHub's template-generation flow, then work in its local checkout. Read the resulting `AGENTS.md` and template usage checklist before changing project files.

Import the library's `.agents/skills` into the game's `.agents/skills` as real files. Inspect overlaps with bundled template skills and preserve local customizations; do not silently overwrite conflicting instructions or hand-edit generated skills. Use current library instructions and compatible OpenSpec tooling, resolving any material version conflict before continuing. Record the source revisions used. Do not update unrelated global skills as a side effect of creating a game.

Keep the template's application layout, corner UI roles, repository links, and version conventions unless the request or stack requires a documented change. Inspect package scripts, workflow files, and current Babylon Lite documentation/source before choosing commands or APIs. Use Babylon Lite specifically; do not silently substitute the full Babylon.js distribution or a different renderer.

## Define the game

Translate the inputs into a short design and concrete acceptance criteria: player actions, camera, objective, scoring/progression, failure or completion, restart, and visual direction. Separate mandatory mechanics from aesthetic references. Do not inherit contradictory mechanics or camera requirements from unrelated example prompts.

Defaults, unless overridden:

- Single player. Record the selected mode in the design and README. Single-player games need no Colyseus dependency, server change, or server release. For multiplayer, read [the multiplayer workflow](references/multiplayer.md) before planning and follow it alongside the common template and delivery steps.
- One complete, replayable game loop with a clear objective. For an explicitly requested sandbox, prioritize its interactions and reset behavior instead of inventing a win condition.
- A 9:16 portrait play area that fits one screen, with responsive desktop and mobile presentation. Fit controls and instructions without covering the action or requiring scrolling to play.
- Original game visuals and coordinated border/gutter artwork for space outside the play area. Follow a reference's rules when requested while giving the project its own assets and identity.
- Keyboard and on-screen touch controls matched to the mechanics. Support concurrent touch actions where needed, visible control feedback, and safe input release after focus loss or pointer cancellation.
- Clear instructions, pause/resume, restart, and recovery from failure. Show a useful unsupported-WebGPU or initialization-error message rather than a blank canvas.

Create an OpenSpec change with proposal, design, requirements, and verifiable tasks using the imported workflow. This invocation requests implementation too: continue once required artifacts are ready, unless the user requested planning only. Track changes to the agreed design and mark tasks complete only after their acceptance criteria are met.

## Build and verify

Keep game rules testable independently of rendering and input where practical. Choose an appropriately small implementation; avoid extra systems that do not support the requested loop. Ensure initialization, resize, pause, restart, and teardown do not duplicate loops or leave stuck input.

Use supplied assets when appropriate. Create the required original raster artwork with an available image-generation skill/tool when that fits the visual direction; use procedural or code-native art when appropriate. Integrate the actual assets and record their provenance. Do not leave placeholder artwork or imply that ungenerated assets exist.

Run the repository's applicable checks, gameplay tests, and production build. Cover meaningful rules and transitions such as scoring, victory/failure, restart, and any mechanic-specific edge cases. Do not treat a successful build as proof of playability.

Use a real browser with WebGPU to play a meaningful full loop. Exercise keyboard and touch/pointer behavior, pause/resume, failure/completion, and replay. Inspect representative desktop and narrow mobile layouts, console/runtime errors, asset loading, and screenshots. If touch hardware is unavailable, distinguish emulated input from physical-device verification. Capture evidence from the actual game, not a mockup. If WebGPU or browser automation is unavailable, report the limitation and keep the relevant acceptance criteria unverified.

Document setup, controls, gameplay, supported browser requirements, screenshots, asset sources, and known limits. In the root README, include an "Original AI Prompt" section using a collapsible details block and fenced text, following Pixel Walker's presentation. Preserve the actual game request, including supplied fields and consequential follow-up requirements; label follow-ups separately. Keep interpreted assumptions outside the quoted prompt, and do not present an invented or expanded brief as the original prompt. Redact credentials or private information before publication. Preserve useful template credits. Include timing or model metadata only when actually recorded.

## Release and deliver

Finish the template's delivery checklist. Verify that production asset paths work under the repository's GitHub Pages subpath. Keep version data consistent with the template's source of truth.

Inspect and use the checked-in GitHub Actions release and Pages workflows. Adapt missing game-specific build/deployment wiring during implementation before invoking a release skill that expects working infrastructure. Commit and push only task-related changes in the game repository and, for multiplayer, the shared server repository; preserve unrelated work. Do not open a pull request unless requested.

Run the release workflow, inspect its result, and verify the release/tag. If a release bot commit does not trigger Pages, explicitly dispatch the existing Pages workflow for the intended revision. Wait for deployment and check the actual public URL: game starts, assets resolve, controls work, and the displayed version matches the release. Do not equate a green deployment job with successful public gameplay verification.

Fetch and fast-forward the local checkout to include any release-generated version commit without discarding local changes. Recheck Git status and local/remote revision alignment. If authentication, permissions, workflow failure, or a conflicting remote update blocks delivery, preserve completed work and report the specific unfinished step; do not force-push or claim it is published.

Return concise links to the playable game, repository, and release, plus the local checkout path. Summarize completed checks and any unverified behavior or blockers. State whether the OpenSpec change is complete and use the applicable finalization workflow when authorized by the request.
