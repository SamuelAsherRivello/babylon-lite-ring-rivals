# Spec Delta

## Purpose

Keep the reusable template’s source layout and renderer-free browser behavior protected by a focused set of fast checks that can run without a browser engine or game renderer.

## ADDED Requirements

### Requirement: Verify the source structure
Automated checks SHALL verify that the expected `src/ui/` and `src/content/` directories and starter files exist, and that the application entry point reaches the UI layer without requiring a renderer.

#### Scenario: Source layout regression
- **WHEN** the focused test suite runs after a source reorganization
- **THEN** it fails with an actionable assertion if a required UI/content directory or starter entry is missing

### Requirement: Preserve layout smoke coverage
Automated checks SHALL retain minimal coverage for the existing viewport, corner controls, configuration behavior, and renderer-free startup contract while avoiding duplicated implementation-detail tests.

#### Scenario: Layout contract regression
- **WHEN** the focused test suite runs against the starter
- **THEN** it verifies the existing layout contract and reports failures without requiring an installed canvas or game engine
