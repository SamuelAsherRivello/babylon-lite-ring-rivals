# AI Template Usage Checklist

Use this checklist only when creating a project from this repository. For
reference-only requests, follow `AGENTS.md` and do not copy files.

## 1. Confirm project and destination

- [ ] Identify the reuse mode: new GitHub repository, local project copy, or
      reference only. Do not mix repository-creation workflows.
- [ ] Confirm or discover the project's purpose, target platforms, selected
      stack, deployment target, dependency policy, and whether OpenSpec is
      required. Ask only for material facts that are neither provided nor
      discoverable from the project.
- [ ] Decide whether the resulting project is a **game** or an **app**. For a
      game, retain the Babylon content and Babylon dependencies as the starting
      point, adapting them to the requested game. For an app, remove Babylon
      content and Babylon dependencies, including associated imports, tests,
      assets, and documentation that exist only for that content. Update the
      lockfile after dependency changes.
- [ ] For GitHub creation, use GitHub's **Use this template** flow when the user
      has authorized creating the destination. For a local copy, require an
      explicitly named destination and copy tracked files without `.git`,
      history, branches, or tags. Do not create a destination on the user's
      behalf if it was not requested.
- [ ] If repository settings or access prevent the selected workflow, continue
      independent local work and record the external action as pending with the
      specific access needed.

## 2. Establish the new project

Apply these items only to a newly created GitHub repository or local project
copy:

- [ ] For a new repository, initialize fresh history with exactly one initial
      commit named `Initial Commit`. Before project-specific changes, verify
      `git rev-list --count HEAD` returns `1` and
      `git log -1 --format=%B` returns `Initial Commit`. If GitHub's template
      flow created a different bootstrap commit, normalize only that initial
      state before project work; do not rewrite history after project-specific
      commits exist.
- [ ] For GitHub creation, verify `origin` points to the new project repository
      before pushing. For a local-only copy, do not invent or configure a
      remote.
- [ ] Rename `project-name/`, update the Vite `root` setting, and replace
      `{project-name}`, `{github-owner}`, and `{repository-name}` with confirmed
      metadata before adding project-specific implementation.
- [ ] Rename the README H1 (`# {project-name}`) and replace introduction,
      getting-started, and project-details placeholders with concise, verified
      project information.
- [ ] When the destination is on GitHub and settings are accessible, set its
      About description and topics from the implemented purpose, technologies,
      platforms, and features. Remove inherited topics that do not apply; do
      not advertise planned capabilities. If access is unavailable, report the
      update as pending.
- [ ] For GitHub repositories, set the About website URL to
      `https://www.samuelasherrivello.com/`. Keep the project's live demo URL
      in the README's Live Demo section.
- [ ] Remove or replace template images, demo links, commands, packages, and
      release instructions that do not apply to the resulting project.
- [ ] Configure CI or deployment only when required and after the target and
      commands are known. Document the real release process and version policy
      when the project has a release workflow; confirm a demo URL is live
      before presenting it as the project's demo.
- [ ] Keep baseline package configuration at the repository root and
      application source, tests, and assets under the chosen application
      directory unless the selected stack deliberately changes this layout.
- [ ] Preserve or deliberately adapt the four HTML corner roles in `AGENTS.md`.

## 3. Select tooling and verification

Base commands on the resulting project's inspected configuration; examples in
the template are not evidence that a command exists in the new project.

- [ ] Add only the runtime, package manager, and dependencies required by the
      project. Use existing test/build tools; add a new check tool only to
      address a concrete gap.
- [ ] Document actual setup, run, test, build, and formatting commands in the
      README. Do not document a command unless it exists and its configuration
      has been inspected.
- [ ] Update `.gitignore` for generated outputs, local state, and secrets. Keep
      the `node_modules/` and `project-name/dist/` exclusions if Node/Vite
      remains.
- [ ] Add a safe `.env.example` only if configuration is required; include no
      real credentials.
- [ ] Add focused automated checks when appropriate to the chosen stack and
      project behavior. Avoid duplicating existing coverage or adding tooling
      just to satisfy this generic checklist.
- [ ] For user-visible work, verify the rendered result in its real runtime or
      browser when available. Capture only current, representative screenshots;
      keep canonical README imagery in the project's documentation directory
      and temporary test output ignored.
- [ ] Document manual verification when it is necessary and cannot be
      automated. If a required runtime or access is unavailable, report the
      check as blocked or unverified with the reason.

## 4. OpenSpec setup (when required)

Perform this section only when OpenSpec is selected for the resulting project.

- [ ] Generate repository-local `.agents/skills/openspec-*` files in the
      resulting project using OpenSpec `1.13.1`. This template preserves only
      `.agents/skills/.openspec-target`; never hand-edit generated skills.
- [ ] Verify `openspec --version` reports `1.13.1`. If missing or different,
      install `@fission-ai/openspec@1.13.1` using the
      [official installation guide](https://openspec.dev/docs/installation).
- [ ] Run `openspec doctor --json` from the repository root. Confirm
      `.agents/skills/.openspec-target` contains `codex`, every generated skill
      folder matches its `name:` frontmatter, and every
      `metadata.generatedBy` value is `1.13.1`.
- [ ] Reopen Codex at the resulting repository root and verify `$openspec-*`
      autocomplete includes `$openspec-apply-change` before relying on the
      repository-local workflow. If reopening or UI inspection is unavailable,
      report it as unverified.
- [ ] Replace neutral `openspec/config.yaml` context with verified project
      constraints before planning the first substantial change.
- [ ] Keep `changes/` for active work and `specs/` for accepted specifications.
      Sync accepted delta specifications before archiving a completed change.

## 5. Delivery gate and summary

- [ ] Search for `project-name`, `{github-owner}`, `{repository-name}`,
      `{command}`, `{live-demo-url}`, `{demo_url}`,
      `github-repository-template`, `GitHub Repository Template`, and other
      template placeholders. Resolve or deliberately retain each occurrence
      with a documented reason.
- [ ] Run each applicable, documented local setup, test, build, and formatting
      command. Run deployment or release verification only when configured and
      authorized. Record the exact commands and outcomes.
- [ ] Verify README links, screenshots, commands, packages, deployment
      instructions, and release instructions against the resulting project.
- [ ] For GitHub destinations, verify About metadata and website URL when
      access is available; otherwise mark the external update pending.
- [ ] Report each checklist item using one of these outcomes: **verified**,
      **not applicable** (with reason), **pending authorization** (with action
      needed), **blocked** (with cause), or **unverified** (with missing
      evidence).
- [ ] Call the project ready only when all applicable local checks pass and
      every remaining external or unverified item is clearly disclosed. Do not
      imply that a blocked or pending action was completed.

## 6. Template-use scorecard

Answer each question **true** or **false** based on evidence in the resulting
project. Award **+1 point for each true answer** (maximum 10 points).

- [ ] Is the project purpose reflected in a renamed app folder instead of
      leaving `project-name/` as the final application name?
- [ ] Does the Vite configuration point to the resulting app folder?
- [ ] Have the project-name, owner, and repository placeholders been replaced
      with confirmed values wherever applicable?
- [ ] Does the README describe the actual project rather than the generic
      template?
- [ ] Are setup, run, test, and build instructions based on commands that
      exist in the resulting project?
- [ ] Have template demo links, images, packages, and release instructions
      been removed or adapted to the resulting project?
- [ ] Does the app preserve or deliberately adapt the four HTML corner roles
      documented in `AGENTS.md`?
- [ ] Are React UI shortcuts kept clear of WASD, the arrow keys, Spacebar, and
      Enter, with assigned keys shown in the UI?
- [ ] Does `.gitignore` cover the resulting project's generated files and
      local state while retaining relevant template exclusions?
- [ ] Are applicable checks and user-visible behavior verified, with any
      blocked or unverified items clearly reported?
