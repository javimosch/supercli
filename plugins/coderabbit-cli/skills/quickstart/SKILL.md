---
name: coderabbit-cli
description: Use this skill when the user wants AI-powered code review on local changes before committing. Runs in the terminal with agent-friendly output modes.
---

# CodeRabbit CLI

AI code reviews in the terminal. Review uncommitted changes, get bug/security findings, and feed results back into coding agent fix loops.

## Commands

- `coderabbit-cli review run` — Review current repo changes (prompt-only mode)
- `coderabbit-cli _ _` — Passthrough to cr CLI

## Installation

```bash
curl -fsSL https://cli.coderabbit.ai/install.sh | sh
# or brew install coderabbit
```

## Authentication

```bash
cr auth login
# or using API key
cr auth login --api-key "cr-************"
```

## Usage Examples

- "Review my current changes"
- "Run code review on uncommitted changes"
- "Check for bugs before I commit"
- "Review code and suggest fixes"

## Key Commands

```bash
# Review current changes (agent-friendly)
cr --prompt-only

# Plain text output
cr --plain

# Review against specific base branch
cr --base develop

# Any cr command via passthrough
cr _ _ --plain
cr _ _ --base develop
```

## Key Features
- **AI Review** - Catch bugs before commit
- **Prompt-Only** - Agent-friendly output
- **Fast** - Runs locally on changes
- **Security** - Security issue detection
- **Integrates** - Works with coding agent fix loops
