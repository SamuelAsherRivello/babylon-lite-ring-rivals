---
name: ai-skills-library-push
description: Copy one Codex user skill into this library, commit it, and push the change to GitHub.
---

# AI Skills Library Push

Use this skill when the user wants to publish one named Codex user skill to the shared AI Skills Library.

1. Require exactly one skill name. The source is `$HOME/.agents/skills/<skill-name>`; on this Windows machine it is `C:\\Users\\srive\\.agents\\skills\\<skill-name>`.
2. Confirm the source and this library's `.agents/skills/<skill-name>` are real directories, not symbolic links or junctions. Stop if either is a link.
3. Inspect Git status and compare the source and destination directories recursively. Use the newest file modification time in each directory to determine which is newer. If contents are identical, report that it is current and make no content change. If the destination is absent or older than the source, copy the source into the library without asking. If the destination is newer, stop and ask the user. If contents differ but neither directory is newer, stop and ask the user.
4. Stop for unrelated local changes or a non-fast-forward remote state. Review the resulting diff, run the repository's applicable skill validation, then commit only the named skill's files with a descriptive message.
5. Push normally to the configured upstream and verify the pushed commit. Report the repository URL and commit.

Never publish secrets, credentials, local environment files, or unrelated global skills.
