---
name: mco
description: Use this skill when the user wants to orchestrate multiple AI coding agents in parallel — run code reviews with consensus, execute tasks across agents, or check agent health.
---

# MCO — Multi-CLI Orchestrator

Orchestrate AI coding agents. Dispatch prompts to multiple agents (Claude Code, Codex CLI, Gemini CLI, OpenCode, Qwen Code) in parallel, deduplicate findings, and generate consensus reports.

## Commands

- `mco doctor check` — Check installed AI agents and auth status
- `mco review run` — Run multi-agent code review with consensus
- `mco run exec` — Run general multi-agent task execution
- `mco agent list` — List available and configured agents
- `mco _ _` — Passthrough to mco CLI

## Installation

```bash
npm i -g @tt-a1i/mco
```

Requires at least one supported AI coding agent CLI.

## Usage Examples

- "Run a multi-agent code review on this repo with Claude and OpenCode"
- "Check which AI agents are installed and authenticated"
- "Run a security review with all available agents"
- "Summarize project architecture using 3 agents in parallel"

## Key Commands

```bash
# Check agent health
mco doctor --json

# Multi-agent code review
mco review --repo . --prompt "Review for security issues" --providers claude,opencode --json

# General task execution
mco run --repo . --prompt "Summarize project architecture" --providers claude,opencode

# List available agents
mco agent list

# Parallel review with consensus synthesis
mco review --repo . --prompt "Find bugs" --providers claude,opencode --synthesize

# SARIF output for CI
mco review --repo . --prompt "Review code" --providers claude,opencode --format sarif
```

## Key Features
- **Parallel Fan-Out** — Dispatch to multiple agents simultaneously
- **Consensus Engine** — Deduplicate and score findings across agents
- **Structured Output** — JSON, SARIF, Markdown
- **Doctor** — Agent health checks
- **Review Mode** — Structured code review findings
- **Run Mode** — General task execution
- **Debate Mode** — Challenge round on merged findings
- **Divide Mode** — Split work by files or dimensions
- **Chain Mode** — Sequential provider execution
- **CI/CD Ready** — SARIF for GitHub Code Scanning
