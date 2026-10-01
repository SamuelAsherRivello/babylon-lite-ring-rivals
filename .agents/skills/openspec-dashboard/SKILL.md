---
name: openspec-dashboard
description: Open, set up, or inspect the local OpenSpecUI dashboard for an OpenSpec project. Check required CLI dependencies first, install or initialize missing pieces when authorized, and keep the dashboard read-only unless the user explicitly requests an action.
---

# OpenSpec Dashboard

Use this skill when the user asks to open, inspect, repair, or use the local OpenSpecUI dashboard for an OpenSpec project.

This skill is a local dashboard launcher and inspector. It does not call an AI service, delegate work to another agent, or invent a separate dashboard. When invoked for a dashboard request, use the terminal before replying; do not only print commands for the user to run.

## Dependency And Project Setup

Before launching the dashboard, check the current project and required CLIs.

1. Resolve the project path from the user's request or the current working directory.
2. Confirm the project has an OpenSpec root. Prefer repository instructions for canonical paths. Common roots are `.openspec/` or `openspec/`.
3. Check CLI availability with read-only commands:
   - `openspec --version`
   - `openspecui --help`
4. If OpenSpec is missing, inspect the project documentation for its expected install command. If no project-specific command exists, ask for approval before installing the OpenSpec CLI globally with npm.
5. If OpenSpecUI is missing, ask for approval before installing the dashboard CLI globally with npm.
6. If the project is not initialized for OpenSpec, explain that initialization will create or update project planning files and ask for explicit approval before running `openspec init` or an equivalent setup command.
7. If setup or installation fails, report the exact failing command and concrete error. Do not claim the dashboard is unavailable without first attempting the relevant check or setup path.

Prefer existing local commands and project scripts over global installs. Never ask the user to paste secrets. Do not modify implementation code as part of dashboard setup.

## Launch

Use browser-safe port `6001` by default; Chromium blocks port `6000` as unsafe.

For a project path:

```powershell
openspecui serve "<project-path>" --web --port 6001 --no-open
```

If port `6001` is already in use, choose the next available safe localhost port and report the actual URL.

The dashboard URL is usually:

```text
http://localhost:6001
```

Leave the server running for the preview session. If browser control is available, open or focus the dashboard and inspect the visible page before reporting completion.

For the native application surface, use only when the user asks for it:

```powershell
openspecui --app
```

Use `openspecui --help` when the user asks about available modes or when the launch command fails.

## Read-Only Inspection

Treat the dashboard as a view by default.

When the user asks to look at the dashboard, summarize the actual visible state: active changes, artifact/task progress, blocked or ready work, and repository scope. Do not summarize the product marketing page when the project dashboard is what the user requested.

Do not click workflow actions such as Apply, Archive, Continue, Fast-forward, Verify, or destructive/irreversible controls unless the user explicitly asks for that action.

## Configure Codex As The Default Agent

When the user explicitly asks to configure the dashboard or project for Codex,
use the dashboard's **Settings → Agent Integrations → Manage** surface. Select
**Codex** in Agent Inventory and run the server-owned initialization command.
OpenSpecUI currently invokes:

```powershell
openspec init --tools codex --profile custom
```

This creates or refreshes the project-local `.agents/skills/` OpenSpec skills
and records `codex` in `.agents/skills/.openspec-target`; it does not install
the Codex application or modify product implementation code. Treat this as a
project-planning configuration write: do it only when the user explicitly asks
for Codex setup, then verify the command exits successfully and the target file
contains `codex`. Reload the dashboard before reporting the result.

## Windows CLI-Runner Recovery

If the dashboard reports `where.exe EPERM`, `spawn EPERM`, or cannot locate the OpenSpec runner:

1. Verify `where.exe openspec`, `where.exe openspecui`, and `node --version`.
2. Find the installed OpenSpec JavaScript runner without printing secrets. Common npm global locations are under `%APPDATA%\npm\node_modules\@fission-ai\openspec\bin\openspec.js`.
3. If the dashboard has an Execute Path setting, set it to the direct Node invocation for the discovered runner, for example:

```text
"C:\Program Files\nodejs\node.exe" "C:\Users\<user>\AppData\Roaming\npm\node_modules\@fission-ai\openspec\bin\openspec.js"
```

4. Restart the dashboard from a terminal with permission to spawn child processes.
5. Reload the dashboard and confirm the CLI error is gone before reporting success.

If elevated execution is required, request approval for the specific command instead of silently changing permissions or substituting another dashboard.
