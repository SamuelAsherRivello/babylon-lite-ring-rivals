# Spec Delta

## Purpose

Provides a runtime-selectable Babylon Lite render resolution independent of game logical coordinates. It keeps the same 2D world view while making resolution and nearest-neighbor presentation behavior visible and adjustable.

## ADDED Requirements

### Requirement: Logical resolution independent of render resolution
Babylon Lite 2D content SHALL define a developer-editable logical resolution for game coordinates and camera framing independently from the internal render resolution. Changing the internal render resolution SHALL NOT change logical coordinates, visible world bounds, or camera framing.

#### Scenario: Render target changes while playing
- **WHEN** the selected render resolution changes
- **THEN** the same logical scene and camera view are rendered at the newly selected internal target dimensions
- **AND** game positions and visible world bounds remain unchanged

### Requirement: Four native-relative render resolutions
The Babylon Lite 2D integration SHALL offer four render-resolution presets: quarter-native, half-native, native, and double-native dimensions. The native dimensions SHALL be the current DPR-aware canvas backing dimensions. Each choice SHALL scale both axes by its stated factor while preserving aspect ratio, and its pixel dimensions SHALL be integral.

#### Scenario: Resolution presets at a native backing size
- **WHEN** the native backing is 1280 by 720 pixels
- **THEN** the four target resolutions are 320 by 180, 640 by 360, 1280 by 720, and 2560 by 1440 pixels

#### Scenario: Resolution presets after resize or DPR change
- **WHEN** the content viewport or device pixel ratio changes
- **THEN** all four target dimensions are recalculated from the new native backing dimensions
- **AND** the selected preset remains the same

### Requirement: Nearest-neighbor presentation
The selected internal render target SHALL be presented into the native backing buffer using nearest-neighbor sampling when its dimensions differ from the native backing dimensions. This behavior SHALL retain hard, intentionally jagged pixel-art edges when enlarging or reducing the rendered image.

#### Scenario: Smaller render target is enlarged
- **WHEN** the half-native render target is selected
- **THEN** its output is enlarged into the native backing buffer with nearest-neighbor sampling and no blended edge colors

#### Scenario: Larger render target is reduced
- **WHEN** the double-native render target is selected
- **THEN** its output is reduced into the native backing buffer with nearest-neighbor sampling and no blended edge colors

### Requirement: React-owned render-resolution control
The React HUD SHALL display a render-resolution control immediately below the Babylon Lite title. It SHALL show `(R) RenderResolution: <width>x<height>` using the active target dimensions and append `(Native)` when the native preset is selected. Clicking the `(R)` control or pressing R SHALL cycle through quarter-native, half-native, native, and double-native choices, wrapping to quarter-native after double-native. React SHALL own the selection, default it to Native, persist the selected preset in local storage, and pass the selected preset to Babylon Lite. The Babylon Lite settings dialog SHALL display the same active render-resolution value.

#### Scenario: Default and displayed selection
- **WHEN** the application starts without a saved render-resolution preference
- **THEN** Native is selected and displayed as `(R) RenderResolution: <native width>x<native height> (Native)`

#### Scenario: User cycles render resolution
- **WHEN** the user clicks `(R)` or presses R
- **THEN** React advances the selected preset, persists that preset, and passes it to Babylon Lite
- **AND** the HUD and Babylon Lite settings dialog display the active dimensions and Native label when applicable

#### Scenario: Saved preset restored
- **WHEN** the application restarts with a saved render-resolution preference
- **THEN** React restores that preset and Babylon Lite recalculates its dimensions from the current native backing size

### Requirement: WebGPU render-target limits
Any upscaled render target SHALL be capped to the largest dimensions supported by the active WebGPU device when either scaled dimension exceeds its texture dimension limit. The cap SHALL preserve aspect ratio, the selected preset SHALL remain unchanged, and the HUD SHALL display the actual capped dimensions. Babylon Lite SHALL continue using WebGPU and SHALL NOT switch to another renderer.

#### Scenario: Double target exceeds device texture limit
- **WHEN** twice the native width or height exceeds the active WebGPU device's supported texture dimensions
- **THEN** Babylon Lite creates a target at the largest supported capped dimensions with the native aspect ratio
- **AND** React displays those actual dimensions without changing the selected double-native preset
