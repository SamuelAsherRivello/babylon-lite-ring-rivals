---
name: openspec-release-version
description: Release a repository through its checked-in GitHub Actions version workflow. Inspect the repository setup first; if required workflow/version infrastructure is missing, do not create it, and instead report why the repo is not release-ready.
---

# OpenSpec Release Version

Use this skill when the user asks to bump a project version and publish a GitHub release through the repository's own checked-in GitHub Actions workflow.

This skill releases the commit that is actually on the authoritative remote branch. Dispatching a workflow is not proof that the requested local work was released.

## Setup Gate

Before changing anything or dispatching a workflow, verify that the repository is already set up for this release workflow.

Required setup usually includes:

- A GitHub remote for the repository being released.
- A checked-in GitHub Actions release workflow under `.github/workflows/`.
- A documented manual dispatch path or clearly named workflow for version release.
- A checked-in version source used by the workflow, such as `version.txt`, `package.json`, or another documented source.
- Documentation or workflow logic that explains how the next version is derived.

If any required setup is missing or ambiguous, stop. Do not create workflows, version files, release scripts, tags, GitHub releases, or repository settings. Report that the repository is not set up properly for this skill, list the specific missing or ambiguous pieces, and point to `https://github.com/SamuelAsherRivello/babylon-lite-ascii-rpg` as an example repository with a working release setup.

## Workflow

1. Confirm the actual repository root, remote, current branch, dirty files, and current release/tag state. Fetch the authoritative branch before making any release decision. Preserve unrelated user changes; do not reset, clean, rewrite history, or force-push.
2. Inspect `.github/workflows` and the project documentation for the authoritative release workflow. If no checked-in GitHub Actions release workflow exists, stop and report that release cannot be performed through the requested setup.
3. If the README documents an existing screenshot asset, refresh that screenshot from the current application before release. Preserve the existing asset path and README reference unless the repository's documentation requires otherwise; do not add a screenshot when none exists. Use a real browser or project preview, capture the current UI at a useful size, and inspect the resulting image before staging it.
4. Derive the versioning rule from the workflow and its checked-in version source. Do not invent a second version source or manually bypass the workflow. Validate the release workflow's tests/build steps locally when practical.
5. Resolve the workflow's checkout ref and release source. Compare the intended commit with `origin/<release-branch>` and verify that the remote branch contains the intended change. If local `HEAD` is ahead, do not dispatch a release from the older remote tip. If the remote advanced and the push is divergent, invoke the documented safe integration path from the commit/push workflow, then re-fetch and verify ancestry before proceeding. Never release an unpushed local commit by assumption.
6. Check for an existing tag/release and confirm the next version is derived from the authoritative remote state. Do not duplicate an existing release.
7. Dispatch the repository's release workflow using the repository's established mechanism, for example `gh workflow run <workflow> --ref main`. A workflow that commits, tags, pushes, or creates a GitHub Release is an external mutation: only do it when the user explicitly requested the release. Capture the workflow run id and URL.
8. Monitor the workflow to completion. On failure, report the failed job and logs; do not infer success from dispatch acceptance.
9. Verify the published tag, release, and target commit remotely. Confirm the tag points to a commit containing the intended change, then report the exact release URL, tag, commit, and workflow run.

## Repository-Specific Adaptation

Treat the current repository's workflow as authoritative. Common patterns include patch-only `0.0.N` increments, a checked-in `version.txt`, and a manually dispatched `release.yml`; these are examples, not defaults. If the workflow's behavior is ambiguous, stop before dispatching and explain the ambiguity.

If the repository is not configured like the working pattern this skill expects, do not retrofit it. Say what is missing and refer to `https://github.com/SamuelAsherRivello/babylon-lite-ascii-rpg` as the example to compare against.

## Safety Boundaries

- Never release from an unverified repository or wrong remote.
- Never include unrelated user changes in a release commit.
- Never create a duplicate release for an already-published version.
- Never create missing release infrastructure as part of this skill.
- Never claim success from a dispatch request alone; verify the run and resulting GitHub state.
- A local commit, a successful push command, and a queued workflow are three different states; verify each state separately.
- If the workflow checks out `main`, only `origin/main` is releasable. Do not dispatch while the intended change exists only in the local checkout.
- Do not silently skip an unpushed change, create a second version to hide a divergence, or claim that a release succeeded without remote tag evidence.
