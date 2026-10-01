---
name: ai-skills-library-status
description: Compare library, Codex user, and current-project skills in one lean status report.
---

# AI Skills Library Status

Use this skill when the user wants a compact comparison of the shared library, Codex user skills, and the current project's skills. This command is read-only.

Run [scripts/status.ps1](scripts/status.ps1), supplying the canonical library checkout as `-LibraryRoot` and the current project root as `-ProjectRoot`. The script uses the library's `.agents/skills` as the REPO baseline, `$HOME/.agents/skills` as GLOBAL, and the project’s `.agents/skills` as PROJECT.

Do not recreate the comparison in chat. Return the script output unchanged. It prints the legend before every status section, lists all REPO skills, and shows only `+`, `-`, and `~` differences for GLOBAL and PROJECT. Do not copy, move, create, delete, modify, commit, fetch, or push anything.
