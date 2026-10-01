# Spec Delta

## REMOVED Requirements

### Requirement: Renderer-free starter
**Reason**: The template is gaining a concrete Babylon Lite content integration and its default 2D showcase.
**Migration**: Consumers can continue supplying React content through the existing App composition. Projects that do not want the example can change the developer-editable content selection or replace the content-layer entry.

## ADDED Requirements

### Requirement: Content renderer preserves browser layout
The starter SHALL allow a game renderer to run inside the viewport content layer beneath the existing UI overlay. Renderer backing resolution and game scaling SHALL NOT change CSS viewport, gutter, or UI geometry. The renderer SHALL not intercept input in UI corner controls.

#### Scenario: Renderer and UI composition
- **WHEN** the Babylon Lite content scene is running inside the viewport
- **THEN** it fills the content layer beneath the UI, and the viewport ratio, external gutters, four corner roles, and UI CSS geometry remain unchanged

#### Scenario: Corner interaction above content
- **WHEN** a user operates a corner control while game content is rendered underneath
- **THEN** the control remains reachable and renderer interaction does not prevent the control action
