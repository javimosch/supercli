---
name: codex
description: Use this skill when the user wants to run OpenAI's codex coding agent, execute tasks headlessly, or manage codex MCP servers and auth.
---

# codex Plugin

codex is OpenAI's official coding agent CLI. It has an interactive TUI, a headless `codex exec` mode, sandboxed execution levels, and can consume or serve MCP.

## Commands

### Agent
- `codex agent exec` — Run a task non-interactively (`codex exec`)
- `codex session resume` — Resume a previous session
- `codex _ _` — Passthrough (bare `codex` opens the TUI)

### Setup
- `codex self version` — Show version
- `codex auth login` — Sign in with ChatGPT or API key
- `codex mcp manage` — `mcp add` / `mcp list` / `mcp remove` / `mcp serve`

## Usage Examples

- "Run codex exec to add tests for this module"
- "Authenticate codex with my API key"
- "Add an MCP server to codex"
- "Resume my last codex session"

## Installation

```bash
npm install -g @openai/codex
# or: brew install codex
# or: GitHub release binary codex-x86_64-unknown-linux-gnu.tar.gz
```

## Examples

```bash
# Read-only analysis (cannot modify files)
supercli codex agent exec "Explain the retry logic" --sandbox read-only

# Let codex edit files inside the workspace
supercli codex agent exec "Add input validation" --sandbox workspace-write

# Machine-readable output
supercli codex agent exec "List TODOs" --json

# Register an MCP server
supercli codex mcp manage add context7 -- npx -y @upstash/context7-mcp
```

## Key Features

- `--sandbox` levels: read-only, workspace-write, danger-full-access
- `codex exec` runs non-interactively for CI and scripts (`--json` events, `-o` output file)
- Sign in via ChatGPT account (included quota) or `OPENAI_API_KEY`
- `codex mcp serve` exposes codex itself as an MCP server to other agents
- Review mode (`codex review`) and cloud tasks (`codex cloud`)
