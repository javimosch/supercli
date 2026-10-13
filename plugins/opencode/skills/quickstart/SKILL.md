---
name: opencode
description: Use this skill when the user wants to run an AI coding agent non-interactively, launch the opencode TUI, or manage opencode providers and models.
---

# opencode Plugin

opencode is SST's terminal-first AI coding agent. It is provider-agnostic, has an interactive TUI, and a headless `opencode run` mode that emits JSON events for pipelines.

## Commands

### Agent
- `opencode agent run` — Run a prompt non-interactively (`opencode run`)
- `opencode _ _` — Passthrough (bare `opencode` opens the TUI; `opencode serve` runs the HTTP server)

### Setup
- `opencode self version` — Show version
- `opencode models list` — List models from configured providers
- `opencode auth manage` — `auth login` / `auth list` / `auth logout`
- `opencode self upgrade` — Upgrade to latest (or pass a version)
- `opencode stats show` — Token usage statistics

## Usage Examples

- "Run opencode headlessly to fix the lint errors"
- "What models can opencode use?"
- "Set up provider credentials for opencode"
- "Start the opencode server on port 4096"

## Installation

```bash
curl -fsSL https://opencode.ai/install | bash
# or: npm install -g opencode-ai
# or: brew install opencode
```

## Examples

```bash
# Headless run with JSON event output
supercli opencode agent run "Fix the failing test" --json

# Choose model and limit turns
supercli opencode agent run "Refactor auth.ts" -m anthropic/claude-sonnet-4-5

# See available models
supercli opencode models list

# TUI
supercli opencode
```

## Key Features

- Provider-agnostic: Anthropic, OpenAI, Google, Bedrock, Azure, local providers
- `opencode run` headless mode emits structured JSON events (`--json`) for scripts
- `opencode serve` exposes the same agent over HTTP for other clients
- Sessions are shareable via `opencode` share links
- LSP-aware editing and built-in subagents (`/init`, plan/build modes)
