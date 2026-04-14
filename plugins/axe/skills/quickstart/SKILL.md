---
name: axe
description: Use this skill when the user wants to run single-purpose AI agents defined in TOML, pipe data into agents, or manage LLM-powered automation workflows.
---

# axe Plugin

A lightweight cli for running single-purpose AI agents. Define focused agents in TOML, trigger them from anywhere; pipes, git hooks, cron, or the terminal.

## Commands

### Agent Management
- `axe agents list` — List all configured agents
- `axe agents init <name>` — Scaffold a new agent TOML file
- `axe agents edit <name>` — Open an agent TOML in $EDITOR
- `axe agents show <name>` — Display an agent's full configuration

### Running Agents
- `axe run <agent>` — Run an agent
- `axe gc <agent>` — Run memory garbage collection
- `axe gc --all` — Run GC on all memory-enabled agents

### Configuration
- `axe config init` — Initialize the config directory with defaults
- `axe config path` — Print the configuration directory path

### Version
- `axe version` — Print axe version

## Usage Examples

```bash
# Initialize config
axe config init

# Create a new agent
axe agents init my-agent

# Run an agent
axe run my-agent

# Pipe stdin to agent
git diff | axe run pr-reviewer

# Override model
axe run my-agent --model anthropic/claude-sonnet-4-20250514

# Dry run (show context without calling LLM)
axe run my-agent --dry-run

# JSON output for scripting
axe run my-agent --json

# Verbose debug output
axe run my-agent --verbose

# Memory garbage collection
axe gc my-agent
axe gc --all
```

## Installation

```bash
go install github.com/jrswab/axe@latest
```

## Key Features
- TOML-based agent configuration
- Multi-provider support (Anthropic, OpenAI, Ollama, OpenCode, AWS Bedrock)
- Sub-agent delegation with depth limiting
- Persistent memory across runs
- Built-in tools (file ops, shell, URL fetch, web search)
- Stdin piping support
- Local agent directories (auto-discovers `<cwd>/axe/agents/`)
- Token budget enforcement
- MCP tool support
- Configurable retry with exponential/linear/fixed backoff
