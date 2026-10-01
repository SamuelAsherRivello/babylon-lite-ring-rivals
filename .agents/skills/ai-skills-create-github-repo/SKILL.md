---
name: ai-skills-create-github-repo
description: Create a GitHub repository from the shared repository template and prepare its local checkout.
---

# AI Skills Create GitHub Repo

Create a new GitHub repository from the required project template, then prepare the local checkout for work.

## Inputs

Accept natural language or these prompt fields:

| Input | Required | Default |
| --- | --- | --- |
| `name` | Yes | None. Use this as the repository name unless a separate slug is provided. |
| `folder` | No | A local folder derived from `name`. |
| `project` | No | A display name derived from `name`. |
| `visibility` | No | `public`. |
| `template` | No | `https://github.com/SamuelAsherRivello/github-repository-template`. |
| `owner` | No | The authenticated GitHub account. |

## Workflow

1. Confirm the repository name, local folder, project name, visibility, owner, and template. Ask only for missing values that cannot be safely derived.
2. Verify GitHub authentication and repository creation permissions before creating anything.
3. Inspect the template's current default branch and usage checklist. Use GitHub's template-generation flow; do not copy a template directory manually when the GitHub API or CLI is available.
4. Create the repository without overwriting an existing repository. A name collision is not permission to replace or reuse it.
5. Clone the new repository into the requested local folder and verify the remote URL, default branch, and working tree.
6. Read the generated `AGENTS.md`, template checklist, and project instructions before making project changes.
7. Report the repository URL, local checkout path, default branch, and any next steps.

## Safety

Never expose tokens or credentials in output, commits, URLs, or project files. Do not force-push, delete repositories, overwrite an existing local folder, or commit unrelated changes. If authentication, permissions, or a remote conflict blocks creation, stop and report the specific blocker.

## Reusable prompt

```text
$ai-skills-create-github-repo
name: fun-project
folder: fun-project
project: Fun Project
visibility: public
template: https://github.com/SamuelAsherRivello/github-repository-template
```
