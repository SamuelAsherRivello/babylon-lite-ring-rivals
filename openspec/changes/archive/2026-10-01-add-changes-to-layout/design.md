# Design

## Context

See `proposal.md` for motivation. `main.jsx` mounts React only into `ui_layer`; `index.html` has an empty content sibling. `App.jsx` supplies four corners and calculates a 20px inset as percentages of window dimensions. CSS fixes UI across the browser, and page tests assert that old structure directly.

React, React DOM, Vite, and its React plugin are already configured. Vite root is `project-name/`, base is `/github-repository-template/`, and GitHub Pages CI uses Node 24, npm tests/build, and `project-name/dist/`. Accepted specs are absent. OpenSpec context is stale about the stack. Skill tests expect bundled skills despite current repository guidance; that is a separate potential baseline failure.

## Goals / Non-Goals

**Goals:** Use one React composition tree with viewport-owned content/UI, external gutter slots, validated CSS geometry, and a future renderer seam.

**Non-Goals:** Installing Babylon Lite, choosing unverified engine APIs, implementing rendering or diagnostics, generating skills, changing deployment/release, or creating a derived repository.

## Decisions

### React surface and layers

Mount into a browser-surface root and compose a centered viewport containing `content_layer` and `ui_layer`. Preserve stable corner identifiers, version import, repository link, fullscreen storage/event/failure semantics. Extract a reusable corner component with explicit roles. Content fills the viewport under an absolutely positioned UI overlay. Overlay gaps use `pointer-events: none`; interactive corners use `auto`.

Optional top/bottom/left/right React gutter slots occupy residual external regions, with clipping or internal scrolling and no minimum size that pushes the viewport inward. App content uses responsive layout and internal scrolling as needed. This keeps composition in React; retaining independently managed HTML roots would complicate injection and ownership.

Conceptual mockup; content extends beneath UI and spacing is illustrative:

```text
+------------------------------------------------------------+
|                      BROWSER SURFACE                       |
|                           GUTTER                           |
|              +------------------------------+              |
|              |           VIEWPORT           |              |
|              | Title                  Links |              |
|              |                              |              |
|    GUTTER    |        CONTENT LAYER         |    GUTTER    |
|              |     React app content or     |              |
|              |     optional game canvas     |              |
|              |                              |              |
|              | Settings             Version |              |
|              +------------------------------+              |
|                           GUTTER                           |
+------------------------------------------------------------+
```

### Shared configuration and geometry

Use a layout configuration module under `project-name/src/` plus React composition props. Validate finite positive dimensions and orientation consistency: width < height for portrait, width > height for landscape, equal for square. For available CSS dimensions W,H and ratio r, fit width `min(W,H*r)` and height `width/r`; center using opposing residual gutters. Use CSS sizing and, if measurement is necessary, a resize observer. DPR never multiplies layout dimensions.

Proposed starter assumptions: landscape 16:9 and plain gutter; current code establishes no preferred ratio. Preserve 20 CSS-pixel inset at normal sizes, cap it at small sizes, and bound corner regions with wrapping/scrolling so controls stay reachable. Browser zoom changes available CSS dimensions; recompute fit normally. Arbitrarily tiny surfaces cannot guarantee all corner text is simultaneously visible.

Full-browser stretching fails the ratio contract. Orientation-only presets would prohibit project-defined ratios. These choices remain source configuration rather than new settings controls.

Usage parameter organization:

```text
Template
|
+-- Shared
|   +-- Viewport orientation: portrait / landscape / square
|   +-- Project-defined aspect ratio: width:height
|   +-- Gutter background and optional React content
|   +-- React UI layer with the four corner roles
|
+-- App
|   +-- React content
|   +-- Responsive layout within the viewport
|
+-- Game
    +-- Optional game canvas integration point
    +-- Content style: 2D / 3D
    +-- Rendering policy
    |   +-- Responsive smooth
    |   +-- Pixel-perfect 2D
    |   |   +-- Logical resolution: width x height
    |   |   +-- Optional tile size and grid dimensions
    |   |   +-- Derive logical resolution from tile grid
    |   |   +-- Integer display scale: automatic / explicit
    |   |   +-- Small-viewport fallback policy
    |   |   +-- Pixel alignment
    |   |   +-- Internal letterbox background
    |   +-- Performance-scaled 3D
    |       +-- Fixed or dynamic render resolution scale
    |       +-- Dynamic scale limits
    +-- Integration guidance in comments
    |   +-- Orthographic / perspective camera conventions
    |   +-- Texture filtering and mipmaps
    |   +-- Anti-aliasing
    |   +-- Device-pixel-ratio-aware canvas sizing
    +-- Development resolution diagnostics guidance
```

Shared and App parameters become implemented configuration. Game parameters remain guidance, without an unused runtime settings object or inactive panel.

### Future rendering policies and integration seam

Recommend presets with optional overrides as a proposed consumer default, not a confirmed installed feature. Independent settings offer flexibility but make contradictory combinations easier; separate app/game starters duplicate shared layout.

- Responsive smooth follows viewport CSS size with renderer-specific backing decisions.
- Pixel-perfect 2D discusses orthographic camera conventions, nearest filtering, deliberate mipmap/anti-aliasing choices, logical alignment, and centered integer CSS scaling.
- Performance-scaled 3D discusses camera choice, fixed/dynamic internal render scale and explicit dynamic bounds while keeping UI at independent CSS resolution.

Comments at the content integration seam identify where Babylon Lite could initialize, resize, and dispose a canvas renderer under React lifecycle, including StrictMode remounts. Link to a guide under `project-name/documentation/`; do not add imports, calls, dependencies, engine examples, or canvas sizing controllers.

### Resolution contract

CSS size controls layout; logical resolution controls designed coordinates; internal render resolution describes renderer output; backing resolution describes the canvas buffer; display size describes the CSS presentation rectangle. A future integration defines their mapping and accounts for DPR once when sizing buffers, never in CSS geometry. UI resolution remains independent of logical or reduced render resolution.

Logical dimensions are explicit or tile width/height times grid columns/rows. Require finite positive values and agreement if both forms exist. Automatic integer scale is `floor(min(Vw/Lw,Vh/Lh))`. If it is at least 1, center display dimensions `Lw*scale,Lh*scale` in the viewport with an internal letterbox background. Explicit scale must be a positive integer; oversize requests use the consumer's documented fallback.

Proposed small-screen default is positive fractional fit when the integer result is zero, suspending pixel-perfect guarantees. Clipping/scrolling at 1x are documented override alternatives. Never return a zero-size surface for a positive available size. Letterboxing is inside the viewport; browser gutters are outside it.

Guarantees concern integer logical-to-CSS mapping. Physical pixel guarantees additionally depend on DPR, backing size, camera/sprite alignment, filtering, and compositing; fractional DPR prevents a universal promise.

### Verification and documentation

Replace obsolete window-percentage source assertions with focused configuration/geometry and preserved-action checks. Verify real browser geometry at wide, tall, square, small, and fullscreen sizes and DPR 1/1.25/2; check hit testing, gutter clipping, and corner reachability. Use available browser tooling without requiring a new runtime dependency.

Future diagnostics guidance lists CSS/client dimensions, DPR, logical/backing/internal dimensions, active integer/render scales, one-pixel lines, checkerboard, centered crosshair, known-size sprites, and resolution-independent wheel/input handling. No diagnostic scene or switch is implemented now. Link the guide from README and capture representative rendered layout evidence under the canonical documentation directory; temporary outputs remain ignored.

## Risks / Trade-offs

- [Ratio fitting reduces app area] -> Responsive content and internal scrolling; projects choose their ratio.
- [Tiny viewports crowd corners] -> Adaptive insets, bounded regions, and browser verification.
- [Pixel-perfect terminology implies physical guarantees] -> Define the logical/CSS domain and fallback limitations explicitly.
- [Stale OpenSpec context misleads later work] -> Reconcile verified facts at implementation start.
- [Unrelated skill tests conflict with current guidance] -> Establish and report baseline failures; do not generate skills or change unrelated tests in this scope.
- [Fullscreen needs browser support and activation] -> Preserve current behavior and verify supported actions in a real browser.

## Migration Plan

Establish test/build baseline and update factual project context during apply. Move mount and layer ownership together, add layout/configuration and corner reuse, update focused tests and documentation, then run checks and browser verification. Preserve npm/Vite roots and deployment/version/link/storage contracts. Report unrelated baseline failures explicitly rather than claiming a clean delivery gate. No deployment or release is part of this change. Rollback reverts layout, related tests, and documentation together.
