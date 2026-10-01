# Change: Organize starter source and document lightweight standards

## Why

The starter currently keeps React UI, layout code, and future content concerns in one flat source directory. Consumers need an obvious place for canvas or game content while keeping the reusable UI easy to find. The repository also contains generated layout-review artifacts that are useful during development but add noise to the shipped template.

## What changes

- Organize the application source into `src/ui/` for React components, layout, styles, and the starter template component, and `src/content/` for the current content entry and future canvas-based content.
- Add a concise project-level coding and naming guide that establishes the boundary between UI and content without introducing a framework or renderer dependency.
- Add minimal automated checks for the source layout and the existing renderer-free layout contract.
- Remove generated layout verification artifacts from `project-name/documentation/` and update remaining documentation links so the guide points only to maintained material.

## Scope and impact

- Affects the Vite application source tree, its lightweight test coverage, and documentation organization.
- Preserves the existing browser layout behavior, keyboard controls, HUD/config/stats UI, and renderer-free startup contract.
- Adds no runtime dependencies, renderer, canvas engine, or new deployment behavior.
- No external service or migration is required.

## Capabilities

### New capabilities

- `source-organization-standards`: Defines the UI/content source boundary, starter component location, and minimal coding guidance.
- `template-layout-verification`: Defines focused checks that keep the source organization and current layout contract intact.

### Modified capabilities

- None.

## Implementation notes

The implementation should preserve the existing application entry point and import behavior while moving modules behind the new directories. Documentation cleanup should remove only generated verification material, retaining the maintained integration guide and README assets.
