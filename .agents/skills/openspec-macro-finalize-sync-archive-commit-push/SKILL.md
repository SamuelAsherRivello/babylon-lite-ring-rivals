---
name: openspec-macro-finalize-sync-archive-commit-push
description: "Run an ordered macro of OpenSpec finalization skills after apply: verify readiness, sync specs, archive, commit scoped files, then push normally when the remote branch is unchanged. Stop with clear blockers instead of creating release infrastructure, merging divergent branches, or sweeping unrelated work."
---

# OpenSpec Macro: Finalize, Sync, Archive, Commit, Push

Use only when the user explicitly asks to finish one completed OpenSpec change through sync, archive, Git commit, and a normal push. This macro coordinates the applicable finalization skills in that required order: `openspec-sync-specs`, `openspec-archive-change`, and `openspec-commit-inclusive`, followed by a normal push. It is not a substitute for implementation, review, release, tagging, pull requests, or remote branch integration.

The goal is one command after `openspec-apply-change` is done:

```text
verify done -> sync specs -> archive change -> commit scoped files -> push
```

Leave a verifiable remote commit, or stop with explicit blockers. Never report success from a local commit alone.

## Hard Stops

Stop before editing, staging, committing, archiving, or pushing when any of these are true:

- More than one active change plausibly matches and the user did not name one.
- The OpenSpec change artifacts are missing, invalid, or ambiguous.
- Required tasks are unchecked or the proposal's requested behavior is not satisfied by the implementation evidence.
- Verification has not been run, failed, or is too incomplete to support completion.
- The relevant dirty files include unrelated work that cannot be separated safely.
- The target remote branch has advanced or diverged from the local branch.
- The repository has no configured remote branch for the current branch.

When stopped, report the exact blockers and the safest next command or decision. Do not auto-create missing workflow, release, branch-integration, or project infrastructure.

## Preflight

1. Resolve exactly one OpenSpec change from the user's request or current conversation.
   - If the user names a change, use that change.
   - If no change is named, use the last change explicitly mentioned in the current chat.
   - If no single change is clear, list active changes and ask the user to choose.

2. Confirm the repository root, OpenSpec root, current branch, upstream branch, remote URL, dirty files, and current `HEAD`.

3. Fetch the current upstream branch before any file edits or commit decisions. If the remote branch has advanced, stop before committing. Do not reset, restore, rebase, force-push, or attempt an automatic merge/API merge in this workflow.

4. Inspect OpenSpec state using the installed CLI and repository conventions:
   - `openspec list --json`
   - `openspec status --change "<name>" --json`, when supported
   - `openspec show "<name>"`, when needed
   - project `.openspec/` or `openspec/` files directly, when CLI output is insufficient

   Use JSON fields such as artifact paths when available, but do not assume specific field names across OpenSpec versions. If a field such as `artifactPaths.specs.existingOutputPaths` is absent, inspect the change directory and schema/config instead of inventing paths.

5. Read the proposal, design if present, task list, delta specs, and relevant implementation diff. Build a completion candidate:
   - change id/name
   - proposal behavior to satisfy
   - tasks and whether each is checked off
   - delta specs to sync
   - implementation/test/doc files expected in the commit
   - verification evidence found
   - target branch and upstream branch

6. Stop if the completion candidate is ambiguous, incomplete, or includes unrelated work.

## Readiness Verification

Before syncing or archiving:

1. Confirm every required task is checked off. If implementation appears complete but task markers are unchecked, stop and list the unchecked tasks. Do not silently mark tasks complete unless the user explicitly requested that and the staged scope is otherwise clear.
2. Compare the proposal's requested behavior and impact against the scoped implementation diff and verification evidence.
3. Run or confirm the repository's relevant validation commands. Prefer commands already documented by the project, OpenSpec change, or package scripts. If validation is impractical, report the limitation and stop unless the user explicitly asked to proceed without that validation.
4. Run strict OpenSpec validation for the active change using the repository-supported command. If the CLI syntax differs, inspect help and use the supported equivalent.

## Sync Specs

1. Sync every selected delta spec into its owning main spec before archive.
2. Read both the delta spec and target main spec before editing.
3. Preserve main-spec content unrelated to the delta.
4. Keep added, modified, and removed requirements coherent with the accepted change.
5. Validate the synced specs using the repository-supported OpenSpec command, such as `openspec validate --specs` or the current equivalent.
6. Re-read the synced main specs and selected deltas to confirm they match the intended change.

## Archive

Archive only after:

- implementation readiness is confirmed,
- sync verification passes,
- strict validation for the active change passes,
- and the remote branch preflight still shows the target branch has not advanced.

Archive through the repository's OpenSpec workflow or CLI. Do not manually move files unless the project's workflow requires it and the file operations are clearly scoped.

## Stage, Commit, Push

1. Inspect `git status` after archive.
2. Stage only:
   - implementation files attributable to the completed proposal,
   - tests/docs/assets attributable to the completed proposal,
   - synced main specs,
   - archived OpenSpec change files.
3. Do not stage unrelated dirty files. If unrelated files overlap the same paths and cannot be separated safely, stop.
4. Review the staged diff before committing. Use `git diff --cached --name-status`, `git diff --cached --check`, and a focused cached diff review.
5. Commit with the repository-approved identity when one is defined, using a concise imperative message that names the change or outcome.
6. Fetch the upstream branch again immediately before pushing. If it advanced since preflight, stop before pushing and report the local commit SHA and remote SHA.
7. Push with an ordinary non-force push only when the upstream branch is unchanged and fast-forward-safe.
8. Fetch once more and verify that `origin/<branch>` resolves to the pushed commit or a descendant containing it.

## Final Audit

Finish with a concise audit:

- OpenSpec change name and archive path.
- Synced specs.
- Scoped commit SHA.
- Pushed branch and verified remote SHA.
- Validation commands run and results.
- Any skipped validation or non-blocking limitation.

If any step stopped, do not present the workflow as complete. List blockers and the smallest safe next step.

## Boundaries

- The user must explicitly authorize this macro because it commits and pushes.
- Do not create a release, tag, pull request, release workflow, or branch-integration branch unless separately requested.
- Do not use provider merge APIs in this workflow.
- Preserve the normal OpenSpec sync-before-archive ordering.
- Never use destructive Git operations, force pushes, rebases, resets, restores, or broad cleanups.
- Never sweep unrelated dirty files into the commit.
- Never claim that a rejected push succeeded.
- A pre-existing unrelated test failure must be reported and kept outside the commit; do not conceal it or rewrite its test.
