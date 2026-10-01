# Tasks

## 1. Establish implementation baseline

- [x] 1.1 Run `npm test` and `npm run build` from the repository root; record existing failures, including unrelated skill-check conflicts, so subsequent validation distinguishes regressions.
- [x] 1.2 Reconcile `openspec/config.yaml` context with the verified browser React/Vite template, npm/application roots, dependency policy, link security, and validation scripts; verify facts against actual configuration without modifying generated skills.

## 2. Compose the shared layout

- [x] 2.1 Add validated layout configuration and ratio fitting under `project-name/src/`, with proposed landscape 16:9 defaults; verify portrait/landscape/square fitting and actionable invalid-configuration errors with focused checks.
- [x] 2.2 Move the React mount to a browser surface and compose viewport-owned content/UI plus independent optional gutter slots; verify containment, centering, residual gutter dimensions, and content beneath UI on resize.
- [x] 2.3 Extract reusable corners and replace browser-percentage margins with adaptive viewport-relative CSS placement; verify all four roles, small-size reachability, overlay hit testing, fullscreen storage/event/failure semantics, repository protection, and root version sourcing.

## 3. Document future game integration

- [x] 3.1 Add comments at the optional content/canvas seam explaining Babylon Lite lifecycle integration and linking a guide; verify no engine imports/dependencies/calls, engine examples, inactive renderer controls, or renderer diagnostics are introduced.
- [x] 3.2 Create a guide under `project-name/documentation/` containing the mockup, parameter tree, proposed policies/overrides, cameras/filtering/mipmaps/anti-aliasing, DPR and all five resolution terms; verify Shared/App implementation is clearly separated from future Game responsibilities.
- [x] 3.3 Document direct/grid-derived logical resolution, consistency rules, automatic/explicit integer scales, centering, letterboxing, nonzero fallback, physical-pixel limitations, dynamic scale bounds, and future diagnostics; verify the 320x576 logical / 640x1152 display example and small-screen fallback calculations.
- [x] 3.4 Link the guide and update affected README structure/usage descriptions; verify commands and paths match the actual repository and template placeholders unrelated to layout remain intentional.

## 4. Validate the integrated result

- [x] 4.1 Replace obsolete page assertions with focused behavior/geometry coverage and preserved-contract checks; run the focused page suite and confirm no new failures in `npm test`, reporting unrelated baseline failures explicitly.
- [x] 4.2 Run `npm run build` and inspect output for the correct Vite root/base and renderer-free starter; confirm deployment and version configuration remain compatible.
- [x] 4.3 Verify actual browser layout in wide, tall, square, small, and fullscreen surfaces at DPR 1/1.25/2; record CSS geometry, content/gutter input, corner reachability, and fullscreen behavior with representative screenshots under `project-name/documentation/`.
- [x] 4.4 Review implementation against both delta specs and record validation evidence and any remaining baseline blocker; verify all completed checkboxes have supporting results without publishing or releasing.
