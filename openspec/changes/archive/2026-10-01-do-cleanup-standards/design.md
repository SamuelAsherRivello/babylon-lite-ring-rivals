# Design

## Context

The current Vite app keeps its React entry, layout modules, menu, and styles in a flat `project-name/src/` directory. Existing tests already exercise the layout through source inspection and runtime-friendly checks, while the documentation directory contains both maintained guidance and generated review artifacts.

## Goals / Non-Goals

**Goals:**

- Establish `src/ui/` and `src/content/` as the only new conceptual boundaries needed by the template.
- Preserve the current `main.jsx` entry and browser behavior while updating imports.
- Add a small standards document and focused structural assertions.
- Remove generated layout-review files and repair maintained documentation links.

**Non-Goals:**

- Adding a renderer, canvas implementation, state-management library, linter, formatter, or test framework.
- Redesigning the existing layout, HUD, menus, colors, or responsive behavior.
- Reworking README artwork that is still referenced by the repository README.

## Decisions

1. **Use directories as the boundary.** Move reusable React and CSS modules into `src/ui/`, and place one minimal content entry under `src/content/`. This makes future canvas integration explicit while keeping the existing Vite entry stable. A package-per-layer design was rejected as too heavy for a template.
2. **Keep the template component intentionally small.** Add a starter `Template` component that demonstrates UI composition and can be replaced or extended by consumers. It will not import or initialize a renderer.
3. **Extend the existing focused test style.** Add file- and import-boundary assertions alongside the current layout checks rather than introducing a browser automation dependency. This keeps the test command fast and compatible with the renderer-free starter.
4. **Treat review evidence as disposable.** Remove generated `layout-*` screenshots and `layout-verification.md`; retain maintained integration guidance and README assets, and update any links that point to removed evidence.
5. **Document conventions in one concise file.** Add a short standards document under `project-name/documentation/` covering placement, naming, imports, and the UI/content responsibility boundary. It will avoid lint rules or broad style mandates.

## Risks / Trade-offs

- **[Risk]** Moving imports can leave a stale relative path. → Update the entry and all internal imports together, then run focused tests and the production build.
- **[Risk]** Consumers may expect the removed screenshots as examples. → Keep the maintained guide and README-linked assets, and describe verification through tests instead of generated snapshots.
- **[Trade-off]** Structural checks do not replace visual browser testing. → Preserve the existing lightweight contract checks and leave visual review to the user’s normal Vite preview workflow.

## Migration Plan

1. Create the new directories and move the existing UI modules, updating imports.
2. Add the content entry, template component, standards document, and focused assertions.
3. Remove only the generated documentation artifacts and repair links.
4. Run `npm test` (recording any pre-existing unrelated failures), `npm run build`, and OpenSpec validation.

Rollback is a file-level revert of the change; no persisted data or external integration is involved.
