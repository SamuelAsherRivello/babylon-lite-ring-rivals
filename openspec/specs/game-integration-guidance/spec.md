# game-integration-guidance Specification

## Purpose
Give template consumers a renderer-free integration guide distinguishing implemented layout from future game resolution and rendering responsibilities.

## Requirements

### Requirement: Parameter and policy guidance
The guide SHALL distinguish Shared viewport/orientation/gutter/UI parameters, App responsive content, and Game canvas/content-style/rendering parameters. It SHALL identify the developer-editable renderer and content-style selection, document Pixel Perfect as the default for Babylon Lite with 2D content, and keep the performance-scaled 3D policy separate. It SHALL distinguish implemented React and Babylon Lite behavior from choices reserved for future integrations, including the implemented scale QA label, React settings dialog, and dialog-controlled Babylon Lite world-edge outline.

#### Scenario: Consumer selects a policy
- **WHEN** a consumer reads the parameter tree and rendering policy guidance
- **THEN** they can identify the implemented Babylon Lite + 2D Pixel Perfect default, the separate 3D policy, and which fixed or dynamic render-scale choices remain project-defined

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
Source comments and linked documentation SHALL identify the implemented Babylon Lite content-layer integration and its renderer lifecycle, resize, camera, texture filtering, mipmap, anti-aliasing, DPR-aware sizing, WebGPU support, and development diagnostic responsibilities. They SHALL describe the React scale QA label and settings dialog, plus the dialog-controlled Babylon Lite world-edge outline, along with any further diagnostics reserved for projects. They SHALL distinguish verified behavior from engine-version-specific APIs that require confirmation, and SHALL keep reusable React UI separate from game content.

#### Scenario: Renderer handoff
- **WHEN** a consumer reads integration comments and the linked guide
- **THEN** they find the content-layer location, initialization/resize/disposal responsibilities, resolution measurements, pixel-art policy, WebGPU requirement, and diagnostic patterns without treating unverified engine APIs as supported guarantees
