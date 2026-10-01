# AI Repository Guidance

## Repository purpose and scope

This repository is a reusable browser app/game template. When a user asks to
use it, first identify the requested mode:

1. **New GitHub repository:** Use GitHub's **Use this template** flow when
   authorized. The destination repository is a new project; do not push
   project-specific work to this template.
2. **Local project copy:** Copy the tracked template files into the explicitly
   named destination, excluding `.git` and its history. Do not create a
   destination the user did not identify.
3. **Reference only:** Inspect this repository as inspiration. Copy no files
   unless the user separately asks for a copy.

For either new-project mode, follow
[the template usage checklist](AGENTS_TEMPLATE_USAGE_CHECKLIST.md). Resolve
any mismatch between the requested mode and repository configuration before
copying or creating a destination. Do not treat reference-only use as permission
to copy.

When establishing a new project, determine whether the user wants a game or an
app. For a game, keep the Babylon content and dependencies as the starting
point and adapt them to the requested game. For an app, remove Babylon content
and dependencies, along with associated imports, tests, assets, and docs used
only by that content; update the lockfile after dependency changes.

## Repository and application layout

- The repository root is the npm project root and contains `.git`, package
  configuration, and repository metadata. Run Git, dependency, build, test,
  and run commands from this root unless the resulting project's inspected
  configuration says otherwise.
- `project-name/` is the Vite application root. Keep app source, tests, and
  assets there unless the chosen stack deliberately changes the layout.
- Project documentation assets belong in `project-name/documentation/`.
- Keep `project-name/` as the Vite root and synchronize the GitHub repository
  URL with the resulting project repository when this template baseline is
  retained.

## React code and styles

- Do not leave dead code or dead styles. Remove unused React components,
  imports, variables, CSS selectors, and custom properties when they are no
  longer used.
- When changing React UI, check that its JSX class names and IDs match the
  styles, and remove obsolete selectors left behind by the change.
- The page structure supports keeping the full HUD visible inside the viewport
  during fullscreen. Gutters are not visible in fullscreen, so custom gutter UI
  may be added only as secondary UI. Keep all primary UI in React and within
  the viewport.

## HTML template corner roles

The default HTML template uses four reusable `corner` instances inside
`ui_layer`. Preserve these roles when adapting the template:

- Upper left: project title.
- Upper right: project links.
- Lower right: project version.
- Lower left: project settings.

Format content in each corner using either the menu title style or the menu
body style. Represent boolean settings with checkboxes.

## OpenSpec setup

The template preserves `.agents/skills/.openspec-target` but does not bundle
generated OpenSpec skills. When the resulting project requires OpenSpec, follow
the authoritative setup and verification procedure in
[the template usage checklist](AGENTS_TEMPLATE_USAGE_CHECKLIST.md#openspec-setup-when-required).
Do not hand-edit generated OpenSpec skills.

## Pull request workflow

Do not create a pull request unless the user explicitly asks for one in the
current request. A push, commit, or completed template/OpenSpec workflow does
not imply approval to create a pull request.
