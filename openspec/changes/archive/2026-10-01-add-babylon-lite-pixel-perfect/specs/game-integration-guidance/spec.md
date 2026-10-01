# Spec Delta

## MODIFIED Requirements

### Requirement: Parameter and policy guidance
The guide SHALL distinguish Shared viewport/orientation/gutter/UI parameters, App responsive content, and Game canvas/content-style/rendering parameters. It SHALL identify the developer-editable renderer and content-style selection, document Pixel Perfect as the default for Babylon Lite with 2D content, and keep the performance-scaled 3D policy separate. It SHALL distinguish implemented React and Babylon Lite behavior from choices reserved for future integrations, including the implemented scale QA label, React settings dialog, and dialog-controlled Babylon Lite world-edge outline.

#### Scenario: Consumer selects a policy
- **WHEN** a consumer reads the parameter tree and rendering policy guidance
- **THEN** they can identify the implemented Babylon Lite + 2D Pixel Perfect default, the separate 3D policy, and which fixed or dynamic render-scale choices remain project-defined

### Requirement: Future renderer integration responsibilities
Source comments and linked documentation SHALL identify the implemented Babylon Lite content-layer integration and its renderer lifecycle, resize, camera, texture filtering, mipmap, anti-aliasing, DPR-aware sizing, WebGPU support, and development diagnostic responsibilities. They SHALL describe the React scale QA label and settings dialog, plus the dialog-controlled Babylon Lite world-edge outline, along with any further diagnostics reserved for projects. They SHALL distinguish verified behavior from engine-version-specific APIs that require confirmation, and SHALL keep reusable React UI separate from game content.

#### Scenario: Renderer handoff
- **WHEN** a consumer reads integration comments and the linked guide
- **THEN** they find the content-layer location, initialization/resize/disposal responsibilities, resolution measurements, pixel-art policy, WebGPU requirement, and diagnostic patterns without treating unverified engine APIs as supported guarantees
