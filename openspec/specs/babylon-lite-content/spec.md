# babylon-lite-content Specification

## Purpose
Provides a working Babylon Lite content-layer example with a crisp 2D pixel-art policy, a small original showcase asset, and clear behavior when WebGPU is unavailable.

## Requirements

### Requirement: Developer-selectable content mode
The template SHALL expose renderer and 2D/3D content-style selection through developer-editable configuration in the content layer. Its default selection SHALL show the Babylon Lite 2D showcase, and the selection SHALL NOT require a runtime mode picker.

#### Scenario: Default content mode
- **WHEN** the template starts with its default content configuration
- **THEN** it displays the Babylon Lite 2D showcase using the Pixel Perfect policy

#### Scenario: 3D content style selected
- **WHEN** a developer selects 3D content
- **THEN** the content SHALL NOT inherit the Pixel Perfect 2D policy and SHALL use the separately documented 3D rendering policy

### Requirement: Pixel Perfect 2D rendering
When Babylon Lite and 2D content are selected, the renderer SHALL use a sharp pixel-art presentation: no anti-aliasing or smoothing, nearest texture minification and magnification sampling, mipmaps disabled for pixel-art textures, pixel-aligned content, and a DPR-aware canvas backing size with device pixel ratio accounted for exactly once. When it fits, logical content SHALL use centered integer logical-to-CSS scaling without stretching. The guarantee SHALL be logical-to-CSS sharpness; it SHALL NOT claim universal physical-pixel alignment.

#### Scenario: Pixel Perfect content on a standard viewport
- **WHEN** Babylon Lite 2D content is displayed at a viewport size that fits a positive integer scale
- **THEN** logical pixels remain sharp at centered integer CSS scale, the backing buffer accounts for DPR once, texture minification and magnification use nearest sampling with mipmaps disabled, and anti-aliasing and smoothing are disabled

#### Scenario: Fractional DPR
- **WHEN** integer logical-to-CSS scaling is used on a display with fractional DPR
- **THEN** the content remains sharply sampled in CSS space while the system makes no universal physical-pixel alignment promise

#### Scenario: No integer scale fits
- **WHEN** the available viewport cannot fit the logical scene at 1x
- **THEN** the configured nonzero fractional-fit fallback displays the scene without distortion and documents that strict integer pixel guarantees are suspended

### Requirement: Pixel-art showcase scene
The default 2D showcase SHALL render on a white background with an original 32x32 pixel-art tile consisting of concentric black and gray squares with deliberate stair-step edges. The tile SHALL rotate slowly around its visual center.

#### Scenario: Centered rotation
- **WHEN** the showcase is running
- **THEN** the tile remains centered in the content scene and rotates continuously around its center without the React UI layer moving with it

#### Scenario: Pixel-art edges
- **WHEN** the tile is rendered at its authored resolution or integer-scaled display size
- **THEN** its black and gray pixels retain hard boundaries and visibly stepped edges without blended edge colors

### Requirement: Native-size showcase sprite
The original 32x32 showcase sprite SHALL render at exactly 32x32 Babylon Lite backing-store pixels, independent of the stage scale and device pixel ratio, so its authored texels stay at native size.

#### Scenario: Render at native size
- **WHEN** the showcase renders at any supported device pixel ratio
- **THEN** Babylon Lite draws the sprite at 32x32 backing-store pixels and keeps it centered in the content scene

### Requirement: Viewport settings label and modal-controlled world-edge outline
The React UI layer SHALL render a left-justified three-line settings label in the lower white UI band, centered horizontally near its bottom edge as indicated by marker 2 in the reference. Its text color SHALL match the supplied `#e0694b` swatch. Its first line `(B) Babylon Lite` SHALL use the existing `corner-title` font style; its scale and mode lines SHALL use `corner-body`. The label SHALL show `Scale: <current scale>x Integer|Fractional` and `Mode: 2DPixelPerfect`. Clicking `(B)` SHALL open a React settings dialog showing the same three settings, with all visible dialog text (including its title and close control) using the same `#e0694b` color. While that dialog is open, Babylon Lite SHALL draw a 5-CSS-pixel `#e0694b` outline on all four content-world edges; closing the dialog with its close control or Escape SHALL remove the Babylon Lite outline. The outline SHALL use nearest-sampled sprites and update after viewport/DPR changes. Babylon Lite processing, including rendering and sprite animations, SHALL pause while any Config, Stats, or Babylon Lite dialog is visible and SHALL resume when all such dialogs are closed.

#### Scenario: Scale and mode label
- **WHEN** the default Babylon Lite 2D showcase is visible
- **THEN** the label reads `(B) Babylon Lite`, the current scale and its `Integer` or `Fractional` status, and `Mode: 2DPixelPerfect`; at a 2x integer scale it reads `Scale: 2x Integer`
- **AND** the first line matches `corner-title` styling while the remaining lines match `corner-body`

#### Scenario: React settings dialog
- **WHEN** the user clicks `(B)` or presses B
- **THEN** a React settings dialog opens and repeats the viewport name, current scale status, and mode

#### Scenario: Dialog shows and hides Babylon Lite world bounds
- **WHEN** the settings dialog opens or closes through its close control or Escape
- **THEN** Babylon Lite shows the 5-CSS-pixel `#e0694b` outline on all four content-world edges while open and removes it when closed
- **AND** Babylon Lite processing pauses while the dialog is open and resumes when it closes

### Requirement: WebGPU unavailable state
If Babylon Lite cannot initialize because WebGPU is unavailable, the template SHALL show a clear in-content message that the game requires WebGPU and SHALL keep the surrounding React application usable where possible.

#### Scenario: Browser has no WebGPU support
- **WHEN** the application starts in a browser without usable WebGPU
- **THEN** the app displays the unsupported message instead of a blank or crashed content region, and the surrounding template UI remains usable

### Requirement: Renderer lifecycle and resize
The Babylon Lite content integration SHALL initialize and release renderer resources with the React content lifecycle and SHALL update its presentation when the content viewport resizes or changes device-pixel ratio. Repeated setup and cleanup SHALL be safe under React StrictMode remounts.

#### Scenario: Resize and remount
- **WHEN** the viewport resizes, DPR changes, or React StrictMode remounts the content
- **THEN** the renderer updates its backing dimensions and releases stale resources, observers, and animation callbacks without duplicate loops
