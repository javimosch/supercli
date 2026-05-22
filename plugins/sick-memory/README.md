# Sick-Memory

File-based memory system for AI coding agents - persistent knowledge storage across sessions using markdown files with YAML frontmatter, inspired by Claude Code's memory system.

## Overview

Sick-Memory provides a clean-room implementation of Claude Code's file-based memory system as a standalone CLI tool. It enables AI coding agents to maintain persistent knowledge across sessions through:

- **Markdown-based storage**: Human-readable memory files with YAML frontmatter
- **Project-scoped memory**: Each project maintains its own memory directory
- **Agent-agnostic design**: Works with Claude Code, OpenCode, Copilot, and other AI agents
- **Intelligent retrieval**: JSON output for agent integration
- **Bridge commands**: Automatic generation of agent-specific configurations

## Installation

### From Source

```bash
cd ~/ai/sick-memory
go build -o sick-memory .
sudo cp sick-memory /usr/local/bin/
sudo ln -sf /usr/local/bin/sick-memory /usr/local/bin/sm
```

### Via SuperCLI

```bash
supercli plugins install ./plugins/sick-memory
```

## Usage

### Basic Commands

```bash
# Initialize memory system for current project
sick-memory init

# Add a memory
sick-memory remember "Use real database instances in tests, not mocks"

# Using shorthand
sm remember "Integration tests must hit real DB"

# Recall memories
sick-memory recall "database"

# List all memories
sick-memory list

# Check status
sick-memory status

# Show version
sick-memory --version
```

### JSON Output

All commands support `--json` flag for machine-readable output:

```bash
sick-memory status --json
sick-memory list --json
sick-memory recall --json
```

### Agent Integration

Generate agent-specific configurations automatically:

```bash
# Claude Code integration
sick-memory bridge claude-code

# OpenCode integration
sick-memory bridge opencode

# Copilot integration
sick-memory bridge copilot
```

## Memory Format

Memories are stored as Markdown files with YAML frontmatter:

```markdown
---
name: Memory 1234567890
description: Use real database instances in tests, not mocks
type: user
created: 1234567890
---

Use real database instances in tests, not mocks
```

## Memory Types

Following Claude Code's taxonomy, memories are categorized into four types:

- **user**: Information about the person (role, goals, expertise level)
- **feedback**: Corrections and confirmations about work approach
- **project**: Ongoing work context (who, what, why, when)
- **reference**: External system pointers (URLs, dashboard links)

## Architecture

### Directory Structure

```
.sick-memory/
├── MEMORY.md          # Pointer index (always loaded)
├── memory_123456.md   # Individual memory files
└── memory_789012.md   # Individual memory files
```

### Design Principles

- **Human-readable**: All memories are plain Markdown files
- **Version-controllable**: Memory changes diff cleanly in git
- **Zero infrastructure**: No database or server required
- **Debuggable**: Use standard file tools (ls, cat) for inspection
- **Epistemological clarity**: Files represent observations, not authoritative state

## SuperCLI Integration

Install the plugin to use sick-memory through supercli:

```bash
supercli plugins install ./plugins/sick-memory
```

### Available Commands

- `sc sick-memory self version` — Show version
- `sc sick-memory memory init` — Initialize memory system
- `sc sick-memory memory remember <content>` — Add memory
- `sc sick-memory memory recall [query]` — Retrieve memories
- `sc sick-memory memory list` — List all memories
- `sc sick-memory memory status` — Show status
- `sc sick-memory bridge generate <agent>` — Generate agent integration
- `sc sm <command>` — Shorthand passthrough

## Exit Codes

- `0` — Success
- `1` — Generic failure
- `80-89` — Input/validation errors
- `90-99` — Resource/state errors
- `100-109` — Integration/external errors
- `110-119` — Internal software errors

## License

MIT — Copyright (c) 2025 Javier Leandro Arancibia

## Inspired By

- [Claude Code Memory System](https://code.claude.com/docs/en/memory)
- [amem](https://github.com/yuiseki/amem) — Local memory CLI for AI assistant workflows
- [mnemonic](https://github.com/zircote/mnemonic) — Filesystem-based memory system for Claude Code