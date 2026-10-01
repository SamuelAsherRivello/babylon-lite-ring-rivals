# browser-template-layout Specification

## Purpose
Provide a reusable browser layout with project content and overlays inside an aspect-ratio viewport and independent external gutters.

## Requirements

### Requirement: Project-defined viewport
The template SHALL fit and center a viewport within the full browser surface using finite positive project-defined width:height dimensions in CSS pixels. It SHALL support portrait, landscape, and square orientations and report actionable errors for invalid or orientation-inconsistent dimensions.

#### Scenario: Orientation and resizing
- **WHEN** a project selects portrait 9:16, landscape 16:9, or square 1:1 and the browser resizes or enters fullscreen
- **THEN** its viewport preserves the selected ratio, fits the available surface, and centers with equal opposing gutters

#### Scenario: Invalid configuration
- **WHEN** dimensions are zero, negative, nonfinite, or inconsistent with the declared orientation
- **THEN** the template reports an actionable configuration error rather than silently distorting the viewport

### Requirement: Independent composition
The template SHALL allow responsive app content inside the viewport and optional React content in external gutters. Content SHALL extend beneath the viewport UI overlay. Gutter content SHALL remain outside the viewport and SHALL NOT reduce its fitted size.

#### Scenario: Content and gutters
- **WHEN** content and gutter elements are supplied and the available dimensions change
- **THEN** content adapts within the viewport and gutter elements stay within residual external space without pushing the viewport inward

### Requirement: Four operable corners
The template SHALL provide reusable upper-left title, upper-right links, lower-left settings, and lower-right version corners inside the viewport. It SHALL preserve fullscreen toggling, preference persistence, fullscreen-event synchronization, failure handling, protected repository-link behavior, and the root version source. Overlay gaps SHALL allow content interaction; corner controls SHALL remain reachable at small sizes.

#### Scenario: Preserved actions
- **WHEN** a user toggles fullscreen, exits it through browser controls, follows the repository link, or reads the version
- **THEN** fullscreen state and stored preference synchronize, failures are handled, the link retains protected new-tab behavior, and the displayed version matches the root version file

#### Scenario: Small viewport and hit testing
- **WHEN** corner content wraps in a small viewport and the user interacts with content outside corner bounds
- **THEN** corner actions remain reachable and overlay gaps do not intercept content input

### Requirement: CSS resolution independence
Browser, viewport, gutter, and UI dimensions SHALL use CSS pixels without multiplication by device pixel ratio or future game render scale.

#### Scenario: Different display densities
- **WHEN** the same CSS surface size is displayed at DPR 1, 1.25, and 2
- **THEN** viewport dimensions and corner placement remain equivalent in CSS pixels

### Requirement: Content renderer preserves browser layout
The starter SHALL allow a game renderer to run inside the viewport content layer beneath the existing UI overlay. Renderer backing resolution and game scaling SHALL NOT change CSS viewport, gutter, or UI geometry. The renderer SHALL not intercept input in UI corner controls.

#### Scenario: Renderer and UI composition
- **WHEN** the Babylon Lite content scene is running inside the viewport
- **THEN** it fills the content layer beneath the UI, and the viewport ratio, external gutters, four corner roles, and UI CSS geometry remain unchanged

#### Scenario: Corner interaction above content
- **WHEN** a user operates a corner control while game content is rendered underneath
- **THEN** the control remains reachable and renderer interaction does not prevent the control action
