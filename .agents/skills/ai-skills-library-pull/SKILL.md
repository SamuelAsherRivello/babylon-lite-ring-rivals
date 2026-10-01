---
name: ai-skills-library-pull
description: Copy every shared library skill into Codex user skills without creating links.
---

# AI Skills Library Pull

Use this skill when the user wants the complete local AI Skills Library copied into Codex user skills.

1. Treat this repository's `.agents/skills` directory as the source and `$HOME/.agents/skills` as the destination; on this Windows machine the destination is `C:\\Users\\srive\\.agents\\skills`.
2. Confirm that every library source skill is a real directory, not a symbolic link or junction.
3. Compare every source/destination pair recursively, using the newest file modification time in each directory to determine which is newer. If contents are identical, report that skill as current and make no content change. If a destination is absent or older than its library source, copy the source without asking. If a destination is newer, stop and ask the user. If contents differ but neither directory is newer, stop and ask the user. An existing link may be removed only when it resolves to the same library skill.
4. Copy each eligible library skill directory as a physical copy. Do not create symbolic links or junctions. Verify each destination is a real directory with a `SKILL.md` file.
5. Report copied, skipped, and failed skill names separately, provide the full global directory path, and mention that Codex may need a restart if its skill catalog does not refresh automatically.

Do not modify the library checkout or remote repository as part of this command.
