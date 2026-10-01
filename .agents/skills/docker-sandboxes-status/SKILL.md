---
name: docker-sandboxes-status
description: Inspect a Docker Sandbox's actual workspace exposure, policies, ports, and network activity. Use from host PowerShell; do not use to start or nest sandboxes.
---

# Docker Sandboxes Status

Use this skill to explain what a named Docker Sandbox can access **without
changing its policy or lifecycle**. Run the inspection from host PowerShell,
not from a Codex session already inside the sandbox.

## Report the two filesystem layers separately

- **Actual exposure:** `sbx ls` identifies the sandbox, its workspace, status,
  agent, and published ports. A direct workspace mount exposes that directory
  and its descendants subject to normal filesystem permissions.
- **Mount permission:** `sbx policy ls <name> --type filesystem --wide` shows
  which host paths the policy permits as mounts. Permission to mount a path is
  not proof that the existing sandbox currently has that path mounted.
- Host paths outside explicit workspace mounts are blocked. Mention extra
  workspace mounts and the shared skills store when they are present; do not
  claim that a host parent is exposed merely because the sandbox has a parent
  directory in its own VM filesystem.

## Run the read-only report

Require a sandbox name when more than one sandbox exists. From host PowerShell:

```powershell
.\.agents\skills\docker-sandboxes-status\scripts\status.ps1 -Sandbox <name>
```

The script calls only read-only `sbx` commands. It never prints credential
values, changes policy, starts or stops a sandbox, or launches Codex.

## Interpret network access

- `sbx policy ls <name> --type network --wide` shows rules that apply to the
  sandbox, including their source when available.
- `sbx policy log <name>` shows observed allowed and blocked network requests;
  it is history, not a complete permission list.
- Use `sbx policy check network --sandbox <name> <host>` only to answer a
  specific host question. A host-level check does not evaluate HTTP method or
  path restrictions.

## Include other material access categories

Report these separately when relevant:

- **Ports:** `sbx ports <name>` shows host-published ports.
- **Credentials:** credentials are proxy-injected for approved destinations;
  their raw values are not readable inside the sandbox.
- **MCP and shared skills:** these are additional configured boundaries, not
  ordinary workspace access. Do not expose secrets or inspect their contents
  unless the user specifically asks.
- **VM authority:** the agent can install packages and use its private Docker
  Engine inside the sandbox; that does not grant host Docker or host filesystem
  access.

## Boundaries

Do not run `sbx run codex` from an active sandboxed Codex session. It cannot
move the current session into a sandbox and may attempt an unusable nested
launch. If status must be checked while the user is inside a sandbox, explain
the host command for the user to run after leaving that session.

