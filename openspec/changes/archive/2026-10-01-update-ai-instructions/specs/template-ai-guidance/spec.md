# Spec Delta

## Purpose

Provide a single, consistent, actionable guide for AI agents using this repository as a project template, with clear decisions, conditional steps, and evidence for completion.

## ADDED Requirements

### Requirement: Consistent template reuse workflow
The repository guidance SHALL define compatible steps for creating a GitHub repository, making a local project copy, and using the repository as inspiration only. The guidance SHALL identify which workflow applies from the user's request and SHALL not direct an agent to both preserve template history and create fresh history for the same project.

#### Scenario: User requests a new GitHub project
- **WHEN** the user asks to create a project based on this template
- **THEN** the agent follows one documented GitHub repository workflow and verifies the resulting remote and history requirements before project-specific changes

#### Scenario: User requests reference-only use
- **WHEN** the user says to use the repository as inspiration only
- **THEN** the agent inspects it as reference material and copies no files unless the user separately requests copying

### Requirement: Conditional and verifiable project checklist
The checklist SHALL distinguish required decisions from conditional actions and SHALL explain what to report when an action is inapplicable, unavailable, blocked, or requires authorization. It SHALL require project-specific setup and validation commands to be based on inspected configuration and existing tooling.

#### Scenario: Project does not use an optional service
- **WHEN** a project does not require a GitHub setting, deployment, OpenSpec, or other optional workflow
- **THEN** the agent records that step as not applicable with a concise reason and continues with applicable work

#### Scenario: Required external access is unavailable
- **WHEN** a checklist action requires credentials, permissions, or an external service the agent cannot access
- **THEN** the agent completes independent local work and reports the external action as pending with the specific access needed

#### Scenario: Selecting verification commands
- **WHEN** the agent documents or runs setup, test, build, formatting, deployment, or release commands
- **THEN** it verifies those commands against the resulting project's actual configuration and does not add tools solely to satisfy a generic checklist item

### Requirement: Discoverable authoritative guidance
The repository SHALL identify one authoritative location for each detailed procedure, including OpenSpec setup, and other instruction files SHALL link to it instead of duplicating potentially divergent commands or version requirements.

#### Scenario: Agent needs OpenSpec setup steps
- **WHEN** an agent determines that the resulting project requires OpenSpec
- **THEN** it can find the complete setup, version, doctor, generated-skill, and workspace-reopen procedure through a direct link from the primary repository guidance

### Requirement: Clear completion reporting
The checklist SHALL define a concise delivery summary that distinguishes completed and verified work from not-applicable, blocked, pending-authorization, or unverified items. It SHALL not require an unrelated open-ended cleanup question as a delivery step.

#### Scenario: Delivery gate has exceptions
- **WHEN** one or more checks cannot or should not be performed
- **THEN** the agent identifies each exception and its reason in the delivery summary without claiming full verification

#### Scenario: All applicable work is complete
- **WHEN** applicable checklist items and verification are complete
- **THEN** the agent reports the project as ready with the evidence gathered by the delivery gate
