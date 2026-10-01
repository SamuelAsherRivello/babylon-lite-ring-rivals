---
name: ai-skills-library-move-project
description: Move one Codex user skill into the current project's skill directory safely.
---

# AI Skills Library Move Project

Use this skill when the user wants to transfer one named skill from Codex user skills into the current project's `.agents/skills` directory.

1. Require exactly one skill name. The source is `$HOME/.agents/skills/<skill-name>` and the destination is `<project-root>/.agents/skills/<skill-name>`.
2. Confirm the source is a real directory and contains `SKILL.md`. Refuse symbolic links and junctions.
3. Compare source and destination recursively when the destination exists, using the newest file modification time in each directory to determine which is newer. If the destination is older than the source, replace it and move the complete source directory without asking. If the destination is newer, stop and ask the user. If contents differ but neither directory is newer, stop and ask the user. If they are identical, remove the source and retain the destination.
4. When the destination is absent, move the complete skill directory there. Verify the destination contains `SKILL.md`, is not a link, and the source no longer exists.
5. Report the exact project-local path.

This command transfers ownership; it does not copy the skill or update the shared library.
