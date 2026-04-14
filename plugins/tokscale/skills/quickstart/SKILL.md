---
name: tokscale
description: Use this skill when the user wants to track AI coding agent token usage, generate year-in-review wrapped images, check model pricing, or submit usage to the leaderboard.
---

# Tokscale Plugin

Track token usage and costs across AI coding agents like OpenCode, Claude Code, Codex CLI, Copilot, Cursor, Gemini, and more.

## Commands

### Usage Tracking
- `tokscale usage overview` — Show token usage overview across all AI agents
- `tokscale usage models` — Show breakdown by AI model
- `tokscale graph export` — Export contribution graph data as JSON

### Wrapped 2025
- `tokscale wrapped generate` — Generate year-in-review image
- `tokscale wrapped generate --clients` — Include client breakdown
- `tokscale wrapped generate --agents` — Include agent breakdown

### Social
- `tokscale social submit` — Submit usage to leaderboard
- `tokscale social login` — Login via GitHub

### Pricing
- `tokscale pricing lookup <model>` — Look up model pricing

## Usage Examples

Track your token usage:
```
tokscale --json
tokscale models --json
tokscale --opencode --claude --week
```

Generate Wrapped 2025:
```
tokscale wrapped
tokscale wrapped --year 2025
tokscale wrapped --clients --agents
```

Export graph data:
```
tokscale graph --output data.json
tokscale graph --month --json
```

Check model pricing:
```
tokscale pricing "claude-3-5-sonnet-20241022"
tokscale pricing "gpt-4o" --provider openrouter
```

## Installation

```bash
bunx tokscale@latest
```

## Supported Platforms

OpenCode, Claude Code, Codex CLI, Copilot CLI, Cursor IDE, Gemini CLI, Amp, Droid, OpenClaw, Hermes Agent, Pi, Kimi CLI, Qwen CLI, Roo Code, Kilo, Mux, Kilo CLI, Crush, Synthetic

## Key Features
- Interactive TUI with 6 views: Overview, Models, Daily, Hourly, Stats, Agents
- Real-time pricing from LiteLLM with 1-hour disk cache
- Input, output, cache read/write, and reasoning token tracking
- Native Rust core for ~10x faster processing
- Social leaderboard and public profiles
- GitHub-style contribution graph with 9 color themes
- Wrapped 2025 year-in-review images for social sharing