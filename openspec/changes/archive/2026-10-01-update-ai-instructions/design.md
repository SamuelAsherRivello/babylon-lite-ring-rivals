# Design

## Context

See proposal.md for motivation. `AGENTS.md` currently contains repository-wide constraints and the checklist contains a long, mostly unconditional project-creation sequence. They disagree about GitHub repository creation, repeat some OpenSpec requirements, and require a checklist-cleanup question at the end. The current checkout also has ongoing edits to project source and documentation; implementation must reconcile with, not overwrite, those changes.

## Goals / Non-Goals

**Goals:**

- Make one predictable decision tree for GitHub template use, local copies, and reference-only use.
- Keep durable repository-wide rules in `AGENTS.md` and detailed project-creation steps in the checklist.
- Make optional work conditional and make exceptions reportable with evidence.
- Keep OpenSpec setup details authoritative in one linked location.

**Non-Goals:**

- Changing application behavior, dependencies, deployment configuration, or the OpenSpec runtime workflow.
- Requiring GitHub access, deployment, formatting tools, screenshots, or OpenSpec for projects that do not need them.
- Rewriting current in-progress application changes as part of the guidance update.

## Decisions

### Resolve repository creation as a single branching workflow

Inspect repository metadata and the user's stated target first. Document the authorized route for each mode: GitHub's template flow for a new repository when that is the intended mode; a fresh local copy only for an explicitly named local destination; and read-only reference use when requested. Specify history and remote expectations only for the route that creates a new repository. This avoids prescribing a copied `HEAD` with a new one-commit history and a GitHub template flow as if both were the same operation.

### Split always-required decisions from conditional work

Keep project purpose, platform, stack, deployment target, dependency policy, and OpenSpec need as decisions to confirm or discover. Gate operations on those decisions: GitHub metadata requires an accessible GitHub repository; deployment checks require a configured target and authorization; OpenSpec setup applies only when selected. Every gated step gets a defined outcome when it is not applicable or unavailable.

### Use existing configuration to select checks

Document checks only after inspecting the actual package scripts and deployment setup. Prefer the project's existing test and build tools; add checks or dependencies only for a concrete gap. The delivery gate records commands actually run and their results, plus skipped or blocked checks and reasons. This is a reporting contract, not a demand to execute external actions without authorization.

### Establish a single source for detailed OpenSpec setup

Keep repository-wide discovery pointers and invariant constraints in `AGENTS.md`; place the detailed setup sequence in one checklist section or linked focused guide. Remove duplicated version and command lists from secondary locations. The chosen source must include version verification, doctor, target marker, generated metadata, and reopening the resulting workspace, consistent with the repository's current OpenSpec policy.

### End with an evidence-based delivery summary

Replace the cleanup question with a completion summary using a small fixed status vocabulary: verified, not applicable, pending authorization, blocked, or unverified. Readiness requires applicable local checks to pass and unresolved external work to be clearly disclosed; do not label an incomplete delivery gate as ready.

## Risks / Trade-offs

- [Risk] Shorter guidance could omit a template-specific requirement. → Preserve concrete invariants and map every existing checklist obligation to a required step, a conditional step, or an intentionally removed step.
- [Risk] Choosing GitHub template use versus copy semantics may still depend on repository settings or user intent. → Make the route explicit and ask only when that choice is not discoverable and materially changes history or destination.
- [Risk] Existing edits can conflict with implementation changes to the same guidance files. → Inspect the current diff before editing and make narrow changes that preserve unrelated work.

## Migration Plan

1. Review current `AGENTS.md`, checklist, repository metadata, OpenSpec setup, and in-progress diff.
2. Rewrite the two instruction documents to remove contradictions and make conditional steps and evidence reporting explicit.
3. Cross-check every current checklist obligation against the new flow; retain valid project-specific requirements and remove redundant or irrelevant prompts.
4. Review the resulting guidance for consistency and verify links, placeholders, and commands against current configuration. Do not alter unrelated application files.

Rollback is a targeted revert of the two guidance documents; OpenSpec artifacts remain historical planning records.
