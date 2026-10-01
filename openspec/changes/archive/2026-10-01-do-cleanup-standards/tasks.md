# Tasks

## 1. Source organization

- [x] 1.1 Create `src/ui/` and `src/content/`, move the existing UI modules, and update imports while verifying Vite still resolves the application entry
- [x] 1.2 Add the renderer-free content entry and starter `ui/Template` component, then verify the default app starts without engine imports
- [x] 1.3 Add the concise coding and source-organization guidance under `project-name/documentation/` and verify it names the UI/content boundary and conventions

## 2. Verification and documentation cleanup

- [x] 2.1 Extend the focused tests with source-structure assertions and verify the existing layout smoke checks remain covered
- [x] 2.2 Remove generated layout-review screenshots/report and repair maintained documentation links, verifying no remaining link points to deleted evidence
- [x] 2.3 Run `npm test`, `npm run build`, and `openspec validate do-cleanup-standards --strict`; record any pre-existing unrelated test failures
