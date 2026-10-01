# Proposal

## Why

The template's agent guidance and project checklist repeat requirements while prescribing conflicting repository-creation workflows and unconditional steps that may not apply to a project. That makes it harder for an AI to determine what to do, what it can verify, and when to report a blocker; consolidating the rules will make template use more predictable.

## What Changes

- Define one consistent repository creation and reuse decision, including the distinction between a GitHub template repository, a local copy, and reference-only use.
- Organize template-use guidance into required decisions, conditional actions, and a delivery summary, with clear outcomes for unavailable credentials or inapplicable steps.
- Align quality-check guidance with the selected project's existing tools and require evidence-based reporting for checks that are skipped, blocked, or not applicable.
- Make OpenSpec setup instructions discoverable from one authoritative location and link to them from the other guidance.
- Remove or replace the checklist's open-ended cleanup question with a defined completion outcome.

## Capabilities

### New Capabilities

- `template-ai-guidance`: Give AI agents consistent, actionable, and verifiable instructions for using the repository as a project template.

### Modified Capabilities

None.

## Impact

- `AGENTS.md` and `AGENTS_TEMPLATE_USAGE_CHECKLIST.md` will be reorganized and reconciled.
- A new OpenSpec capability will define the expected behavior of the guidance.
- No runtime code, dependencies, or external repositories are changed by this proposal.
