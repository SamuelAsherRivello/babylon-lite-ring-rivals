# Proposal

## Why

The React starter currently mounts corner overlays across the browser and leaves its content layer empty. A reusable app/game template needs a centered project viewport, independent gutters, and clear renderer integration guidance.

## What Changes

- Compose a full-browser React surface, centered aspect-ratio viewport, content layer, UI layer, and optional React gutter content.
- Configure portrait, landscape, or square projects using positive project-defined width:height dimensions.
- Preserve viewport-bound title, links, settings, and version corners, including fullscreen preferences and version sourcing.
- Document future game rendering policies, resolution conventions, and a Babylon Lite integration seam in comments without adding an engine, engine example, or inactive controls.
- Update focused layout checks and usage documentation.

## Capabilities

### New Capabilities

- `browser-template-layout`: Responsive CSS viewport geometry, independent content/gutters, and four reusable UI corners.
- `game-integration-guidance`: Renderer-free documentation of game policies, resolution, integer scaling, and integration responsibilities.

### Modified Capabilities

None; `openspec list --specs` reports no accepted specifications.

## Impact

Expected implementation touches `project-name/index.html`, `project-name/src/main.jsx`, `App.jsx`, `style.css`, new layout modules, `project-name/test/page.test.mjs`, and linked documentation under `project-name/documentation/`. Keep the repository as npm root and `project-name/` as Vite root. Preserve the repository URL, version source, fullscreen storage key, and deployment configuration. No new runtime dependency, engine, service, release, skill generation, or pull request is proposed.

Verified baseline: React/React DOM with Vite, browser runtime, npm scripts `dev`, `test`, and `build`, and a GitHub Pages base path. Preserve external-link `noopener noreferrer`. The OpenSpec config incorrectly describes an absent stack; update factual context during implementation, not this planning request.

Acceptance: configured ratios fit and center on resize/fullscreen; gutters remain outside the viewport; content extends beneath interactive corner overlays; DPR does not multiply CSS layout; documentation distinguishes working React configuration from future rendering responsibilities.

Minor proposed defaults for review: landscape 16:9, plain gutter, and an adaptive 20 CSS-pixel corner inset. Rendering-policy presets with optional overrides are recommendations for future consumers, not confirmed renderer features. This change improves the template itself rather than creating a derived project.
