---
name: docker-sandbox-codex
description: Set up and use Docker Sandboxes to run Codex in isolated microVMs, including installation, authentication, skills, workspaces, and lifecycle management.
---

# Docker Sandbox Codex

Use this skill when the user wants to install, configure, troubleshoot, or use
Docker Sandboxes (`sbx`) with Codex.

## Start with the right workspace

- For a new project, create a named mountless sandbox:
  `sbx create --name <name> codex`
- Reconnect to it with `sbx run --name <name>`.
- For an existing repository, run `sbx run codex` from that repository. The
  current directory is mounted read-write, so inspect `git diff` before making
  commits.
- Do not mount a broad parent directory containing unrelated repositories when
  a narrower project path is available.
- Use clone mode when the agent must work on an isolated copy of an existing
  repository rather than the host working tree.

## Installation and authentication

On Windows, check Windows 11, 64-bit Intel/AMD, and Windows Hypervisor Platform.
Install the current-user CLI with `winget install -h Docker.sbx`, or use the
official Docker release MSI when WinGet is unavailable. Then run `sbx login`.
For Codex/OpenAI authentication, use the host-side flow started by
`sbx run codex` or configure `sbx secret set openai --oauth`; never request or
print API keys, tokens, or other credentials.

## Shared skills

Inspect and manage the persistent shared skill store with:

```text
sbx skills import
sbx skills ls
sbx skills add <owner>/<repository> [--skill <name>]
sbx skills update
```

Codex reads shared skills from `/home/agent/.agents/skills`. New sandboxes use
the shared store read-only by default. Use `--skills=readwrite` only when the
user explicitly needs the sandbox to update shared skills; use
`--skills=off` to keep a sandbox outside that shared boundary. Keep
project-specific skills in the mounted project's `.agents/skills` directory.

## Lifecycle and verification

Use `sbx ls` to verify the daemon and sandbox state, `sbx stop <name>` to pause
a sandbox, and `sbx exec -it <name> bash` to inspect its environment. Explain
that `sbx rm <name>` permanently removes the sandbox's internal files and
requires confirmation; do not run it without explicit authorization.

When diagnosing failures, check `sbx diagnose`, the sandbox name, workspace
mode, authentication, network policy, and whether the sandbox was created
before a changed skills setting. Existing sandboxes retain their original
skills mount mode and may need recreation to change it.

Prefer current Docker documentation for version-sensitive syntax:
https://docs.docker.com/ai/sandboxes/agents/codex/
https://docs.docker.com/ai/sandboxes/workflows/agent-skills/
