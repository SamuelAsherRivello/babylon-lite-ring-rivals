---
name: openspec-commit-inclusive
description: Commit complete files related to one archived OpenSpec proposal while excluding wholly unrelated files.
metadata:
  short-description: Inclusive commit for archived OpenSpec work
---

# OpenSpec Inclusive Commit

Use this skill only when the user explicitly invokes it to commit one completed OpenSpec proposal. It favors frequent POC commits at whole-file granularity: every related file is committed completely, while wholly unrelated files are excluded.

## Workflow

1. Consider exactly one active proposal in scope: the proposal identified by the user or the immediately preceding conversation. If zero or more than one proposal could be in scope, stop and ask for clarification. Do not broaden scope to every dirty file or every nearby OpenSpec change.
2. Ensure that proposal is archived locally before committing. Confirm the local archive path, completed tasks, and synced specs; do not commit while the proposal remains unarchived.
3. Gather an explicit file list changed for that proposal from its archived artifacts, implementation and test changes, synced specs, and related documentation. Build a file-by-file scope table with `YES` or `NO`. Mark `YES` when the file contains any direct proposal implementation, test, documentation, spec-sync, or archive change. Mark `NO` for files wholly unrelated to the proposal, other OpenSpec changes, generated caches, secrets, credentials, or another feature.
4. Commit each `YES` file completely, including unrelated hunks that happen to be in that same file. Do not use hunk-level isolation for a `YES` file. Never stage a `NO` file. Shared directories, proximity, timestamps, or concurrent edits are not evidence that a file is related.
5. Review the exact candidate names with `git status`, `git diff --name-status`, and a focused diff. A `YES` decision is file-level: once a file is related, stage the whole file and do not attempt hunk-level filtering. Review `git diff --cached --name-status`, `git diff --cached --check`, and the cached diff.
6. Fetch the upstream branch before committing. Stop if the upstream branch advanced or diverged, if there is no upstream, or if the repository is not on the intended branch. Commit the staged complete files with a concise imperative message naming the archived proposal or outcome. Never delete or rewrite history.
7. Fetch the upstream branch again immediately before pushing. Push only with a normal non-force push when the upstream SHA is unchanged and the push is fast-forward-safe.
8. Fetch once more and verify the remote branch contains the new commit. Report the archived change, included file list, commit SHA, pushed branch/remote SHA, and validation evidence.

## Boundaries

- "Inclusive" means all files related to the named proposal, not all dirty files. It does not authorize unrelated changes merely because this is a POC or because speed is preferred. The skill does not authorize releases, tags, pull requests, force pushes, rebases, resets, merges, or branch creation.
- Preserve repository AGENTS.md rules and never use destructive Git operations.
- If the change is not archived, the proposal identity is ambiguous, validation is absent, or the remote changed, stop and report the exact blocker. Do not use missing validation as a reason to include unrelated files.
- If a user asks for a narrowly scoped commit instead, use the repository's normal scoped workflow rather than this skill.
