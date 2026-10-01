# game-integration-guidance Specification

## Purpose
Give template consumers a game integration guide distinguishing implemented browser layout and Babylon Lite showcase behavior from game-specific resolution and rendering choices.

## Requirements

### Requirement: Parameter and policy guidance
The guide SHALL distinguish Shared viewport/orientation/gutter/UI parameters, App responsive content, and Game canvas/content-style/rendering parameters. It SHALL identify the developer-editable renderer and content-style selection, require Pixel Perfect for every 2D game, and keep the performance-scaled 3D policy separate. It SHALL distinguish implemented React and Babylon Lite behavior from choices reserved for future integrations, including the implemented scale QA label, React settings dialog, and dialog-controlled Babylon Lite world-edge outline.

#### Scenario: Consumer selects a policy
- **WHEN** a consumer reads the parameter tree and rendering policy guidance
- **THEN** they can identify the required Babylon Lite + 2D Pixel Perfect policy, the separate 3D policy, and that each game chooses its logical resolution and render scale

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

### Requirement: Game orientation is singular
Game guidance SHALL require each game to select portrait or landscape, use the matching template viewport display, and remove the template orientation toggle, shortcut, and saved override. Square SHALL NOT be selected for games.

#### Scenario: Game adapts the template orientation
- **WHEN** an agent adapts the template for a game
- **THEN** it selects one portrait or landscape viewport, retains its corresponding display, and removes the orientation switching controls and state

### Requirement: Showcase and renderer handoff are explicit
Game guidance SHALL identify the Babylon showcase as an example rather than gameplay, require implementation of the requested scene including for 3D, and describe Babylon Lite as WebGPU-only with no fallback renderer.

#### Scenario: WebGPU is unavailable
- **WHEN** a game uses Babylon Lite and WebGPU is unavailable or initialization fails
- **THEN** the game displays a clear unsupported-browser message without substituting a fallback renderer

#### Scenario: Game replaces the showcase
- **WHEN** a game is built from the template
- **THEN** the showcase is replaced by the requested game content and a selected 3D style receives its own scene and renderer setup

### Requirement: Game rendering choices are explicit
Every 2D game SHALL use the Pixel Perfect policy. Each game SHALL choose its own logical resolution and render scale; neither is prescribed by the showcase dimensions.

#### Scenario: 2D game selects dimensions
- **WHEN** an agent implements a 2D game
- **THEN** it uses Pixel Perfect and chooses logical resolution and render scale to fit the game's content

### Requirement: Game viewport and gutter roles are clear
Game guidance SHALL prioritize the viewport for primary content in both windowed and fullscreen modes, require the template gutter layout, and make secondary gutter content optional.

#### Scenario: Game uses optional gutter content
- **WHEN** a game has secondary instructions, design elements, or backstory
- **THEN** it may place that material in a gutter while keeping primary content in the viewport

### Requirement: Game scrolling is project-defined
Game guidance SHALL leave each game free to choose whether content scrolls and how scrolling is implemented.

#### Scenario: Game chooses scrolling behavior
- **WHEN** an agent implements game content movement
- **THEN** it uses the scrolling or non-scrolling behavior appropriate to the game design

### Requirement: Game sound is optional and controllable
Game guidance SHALL make sound optional, recommend 4 to 10 event-based sound effects when sound is used, discourage music, and require both a UI mute toggle and a documented URL argument that mutes all sound.

#### Scenario: Silent AI testing
- **WHEN** a game includes sound and is opened with its documented mute URL argument
- **THEN** all game sound is muted while the normal human-player experience can enable sound through the UI
