---
name: qwen-code
description: Use this skill when the user wants an agentic coding CLI that reads, edits, and runs code with Qwen models — headless via -p or interactively.
---

# qwen-code Plugin

qwen-code (`qwen` binary) is Alibaba's agentic coding CLI — a Gemini CLI fork tuned for Qwen3-Coder. It drives an agentic loop over your repo: file tools, shell tool, memory, and MCP servers. `qwen -p` makes it scriptable.

## Commands

- `qwen-code self version` — Print version
- `qwen-code agent ask "<prompt>"` — Headless one-shot run (`qwen -p`), works in current dir
- `qwen-code agent chat` — Interactive TUI (opens the full agent interface)
- `qwen-code mcp manage` — `qwen mcp list|add|remove` MCP servers
- `qwen-code _ _` — Passthrough (`--all-files`, `--yolo`, `extensions`, ...)

## Usage Examples

- "Ask the qwen agent to explain this codebase"
- "Run qwen headlessly to generate tests for src/foo.py"
- "List the MCP servers qwen-code has configured"

## Installation

```bash
npm install -g @qwen-code/qwen-code   # Node 18+
```

Auth: Qwen OAuth on first `qwen` run (free tier) **or** `OPENAI_API_KEY`/`OPENAI_BASE_URL`/`OPENAI_MODEL` for any OpenAI-compatible endpoint — including a local `vllm serve` or `llama.cpp` server.

## Examples

```bash
# Headless agent task (prints result, exits)
qwen -p "find and fix the bug in src/login.py"

# Auto-approve every tool call (dangerous, sandbox it)
qwen -p "migrate this file to async" --yolo

# Include all files in context
qwen -p "refactor for readability" --all-files

# MCP server management
qwen mcp list
qwen mcp add myserver -- npx -y my-mcp-server
```

## Key Features

- Headless `-p/--prompt` mode → scriptable agent runs; `--yolo` for full auto
- Repo-aware agentic loop: read/edit/grep/shell/todo tools out of the box
- MCP server support (`qwen mcp add ...`), extensions, session checkpointing
- Runs against Qwen OAuth free tier or any OpenAI-compatible endpoint
