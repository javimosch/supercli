---
name: ccusage
description: Use this skill when the user wants to analyze coding CLI token usage and costs.
---

# ccusage Plugin

Analyze coding (agent) CLI token usage and costs from local data. Supports 15+ coding agent sources.

## Commands

### Usage Reports
- `ccusage usage daily` — Show daily token usage and costs
- `ccusage usage weekly` — Show weekly token usage and costs
- `ccusage usage monthly` — Show monthly token usage and costs

## Usage Examples
- "Show my Claude Code token usage this week"
- "How much am I spending on Codex?"
- "Export my usage data as JSON"

## Installation

```bash
npm install -g ccusage
```

## Examples

```bash
ccusage daily
ccusage claude daily --json
ccusage codex weekly --json
ccusage monthly --offline
```

## Key Features
- --json flag for structured output
- --offline mode for air-gapped environments
- Supports Claude Code, Codex, OpenCode, Gemini CLI, Amp, and 10+ more
- Filter by source and project
- No authentication required (reads local data)
