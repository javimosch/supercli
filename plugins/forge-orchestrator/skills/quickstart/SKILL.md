---
name: forge-orchestrator
description: Use this skill when the user wants to coordinate multiple AI coding tools, prevent file conflicts, or orchestrate tasks across Claude Code, Codex, and Gemini CLI.
---

# forge-orchestrator Plugin

Multi-tool orchestration with file locking, knowledge capture, and drift detection.

## Commands

### Init
- `forge-orchestrator project init` — Initialize Forge in a project

### Plan
- `forge-orchestrator plan generate` — Generate task plan from spec

### Dashboard
- `forge-orchestrator dashboard` — Live TUI dashboard

## Usage Examples
- "Initialize Forge in a project"
- "Generate tasks from SPEC.md"
- "Run headless autonomous mode"

## Installation

```bash
curl -fsSL https://forge.nxtg.ai/install.sh | sh
forge init
```

## Examples

```bash
# Initialize
forge init

# Configure AI brain
forge config brain openai

# Generate task plan
forge plan --generate

# See status
forge status

# Headless mode
forge run

# Dashboard
forge dashboard --pty
```

## Key Features
- File locking prevents conflicts
- Knowledge flywheel captures decisions
- Plan generation from specs
- Drift detection against specs
- Multi-tool adapters (Claude, Codex, Gemini)
- TUI dashboard or headless mode
