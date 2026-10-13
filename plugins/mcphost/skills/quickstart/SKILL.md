---
name: mcphost
description: Use this skill when the user wants to connect an LLM (local Ollama or cloud) to MCP tool servers from the command line — one-shot prompts or YAML automations.
---

# mcphost Plugin

mcphost is a single-binary Go MCP host. It spins up the MCP servers in your config, discovers their tools, and lets an LLM call them — interactively, one-shot via stdin (`--non-interactive`), or via a YAML `--script` automation.

## Commands

- `mcphost self version` — Print version
- `mcphost agent ask` — `mcphost --non-interactive`; prompt comes from **stdin**, flags via passthrough (`--model`, `--config`)
- `mcphost agent script <file>` — `mcphost --script file.yml`, multi-step automation with tool calls
- `mcphost agent chat` — Interactive session (default mode)
- `mcphost _ _` — Passthrough (`--system-prompt`, `--debug`, `--message-window`, `--allowedTools`, ...)

## Usage Examples

- "Run a one-shot prompt against my MCP servers using ollama"
- "Execute automation.yml through mcphost"
- "Chat interactively with filesystem + bash MCP tools on gpt-4o"

## Installation

```bash
go install github.com/mark3labs/mcphost@latest   # Go 1.23+
```

MCP servers are configured in `~/.mcp.json` (same schema as Claude Desktop). Fully local: `ollama pull qwen2.5` then `-m ollama:qwen2.5`. Cloud: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `GOOGLE_API_KEY`.

## Examples

```bash
# Local, no API key
echo "what's in this directory?" | mcphost --non-interactive -m ollama:qwen2.5

# Cloud model + custom config
mcphost -m openai:gpt-4o --config ./servers.json

# YAML automation
mcphost --script automation.yml
```

## Key Features

- Providers: `ollama:`, `openai:`, `anthropic:`, `google:`, `--provider-url` for any OpenAI-compatible API
- Stdin → `--non-interactive` makes it pipeline-friendly; `--script` for repeatable automations
- Built-in MCP servers (filesystem, bash, todo, http); tool allow/exclude filters and hooks
- Message window, system prompts, debug mode; concurrent servers in one process
