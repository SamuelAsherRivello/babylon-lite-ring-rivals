# Spec Delta

## Purpose

Give template consumers a renderer-free integration guide distinguishing implemented layout from future game resolution and rendering responsibilities.

## ADDED Requirements

### Requirement: Parameter and policy guidance
The guide SHALL distinguish Shared viewport/orientation/gutter/UI parameters, App responsive content, and future Game canvas/content-style/rendering parameters. It SHALL present responsive smooth, pixel-perfect 2D, and performance-scaled 3D presets with optional overrides as recommendations for future integration rather than confirmed installed features.

#### Scenario: Consumer selects a policy
- **WHEN** a consumer reads the parameter tree and rendering policy guidance
- **THEN** they can distinguish working React configuration from future renderer choices, including fixed or dynamic render scale and explicit dynamic limits

### Requirement: Resolution vocabulary
The guide SHALL distinguish CSS size, logical resolution, internal render resolution, canvas backing resolution, and display size. It SHALL explain DPR-aware backing decisions without multiplying CSS layout or applying DPR twice and SHALL keep React UI independent of reduced game rendering resolution.

#### Scenario: Reduced game render resolution
- **WHEN** a consumer plans a reduced-resolution renderer
- **THEN** the guide requires an explicit mapping between internal render and backing dimensions while retaining independent CSS display and UI dimensions

### Requirement: Integer scaling contract
The guide SHALL describe directly declared logical resolution or derivation from tile size and grid dimensions, consistency checks when both are supplied, automatic or explicit positive integer display scales, pixel alignment, centered content, and internal letterbox background. It SHALL distinguish internal letterboxing from external browser gutters and define the coordinate domain of pixel-perfect guarantees.

#### Scenario: Tile grid calculation
- **WHEN** 32 by 32 logical-pixel tiles form a 10 by 18 grid displayed within a 640 by 1152 CSS viewport
- **THEN** the guide derives 320 by 576 logical dimensions and centered integer scale 2 without stretching

#### Scenario: Smaller screen
- **WHEN** no positive integer scale fits or an explicit scale exceeds the available viewport
- **THEN** the guide requires a documented nonzero fallback, proposes fractional fit with pixel-perfect guarantees suspended, and explains optional clipping or scrolling alternatives

#### Scenario: Fractional DPR
- **WHEN** integer CSS scaling maps to fractional physical pixels
- **THEN** the guide distinguishes logical-to-CSS guarantees from physical display guarantees and does not promise universal physical pixel perfection

### Requirement: Future renderer integration responsibilities
Source comments and linked documentation SHALL identify where Babylon Lite could integrate without engine calls, imports, or examples. Guidance SHALL cover renderer lifecycle, orthographic/perspective cameras, texture filtering and mipmaps, anti-aliasing, DPR-aware sizing, and development diagnostics as future integration responsibilities.

#### Scenario: Renderer handoff
- **WHEN** a consumer reads integration comments and the linked guide
- **THEN** they find initialization/resize/disposal responsibilities, resolution measurements, and diagnostic patterns without an active renderer or diagnostic scene
