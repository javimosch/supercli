---
name: sick-memory
description: Use this skill when the user wants to manage persistent memory for AI coding agents with centralized storage, git-based scoping, and worktree support, or integrate memory systems with Claude Code, OpenCode, or other AI agents. Agents should learn this skill to understand how to use sick-memory for context persistence across sessions.
---

# Sick-Memory Plugin

File-based memory system for AI coding agents with centralized storage, git-based scoping, and worktree support - persistent knowledge storage across sessions using markdown files with YAML frontmatter, inspired by Claude Code's memory system.

## Agent Usage Instructions

As an AI agent, use sick-memory to maintain context across sessions and remember important project information:

### When to Use Sick-Memory
- **Session Start**: Recall relevant project context before starting work
- **Important Discoveries**: Remember key findings, decisions, or technical insights
- **Project Patterns**: Store architectural decisions, coding patterns, or conventions
- **Troubleshooting**: Remember solutions to problems for future reference
- **Context Switching**: Quickly recall project context when returning to work

### Core Workflow
1. **At session start**: `sc sick-memory recall "project context" --json`
2. **During work**: `sc sick-memory remember "Key finding: X requires Y approach" --type project`
3. **When stuck**: `sc sick-memory recall "previous solutions" --json`
4. **Before completion**: `sc sick-memory remember "Implementation completed: feature X" --type project`

## Commands

### SuperCLI Plugin Commands (Recommended)
- `sc sick-memory init` — Initialize memory system for current project
- `sc sick-memory remember "<content>"` — Add a memory to the project
- `sc sick-memory recall [query]` — Retrieve relevant memories
- `sc sick-memory list` — List all memories in the project
- `sc sick-memory status` — Show memory system status
- `sc sick-memory config show` — Show configuration and storage location
- `sc sick-memory bridge generate <agent>` — Generate agent-specific integration (claude-code, opencode, copilot)
- `sc sick-memory edit run <id> <content>` — Edit a memory by ID (non-interactive)
- `sc sick-memory delete run <id>` — Delete a memory by ID

### Quick Access via /sm Shorthand
- `/sm init` — Initialize memory system
- `/sm remember "<content>"` — Add a memory
- `/sm recall [query]` — Retrieve memories
- `/sm list` — List all memories
- `/sm status` — Show system status
- `/sm config show` — Show configuration

### Direct CLI Commands (Fallback)
- `sick-memory init` — Initialize memory system
- `sick-memory remember "<content>"` — Add a memory
- `sick-memory recall [query]` — Retrieve memories
- `sick-memory list` — List all memories
- `sick-memory status` — Show system status
- `sick-memory config` — Show configuration
- `sick-memory edit <id> <content>` — Edit a memory (non-interactive)
- `sick-memory delete <id>` — Delete a memory

### JSON Output (For Programmatic Use)
Add `--json` flag to any command for structured output:
- `sc sick-memory recall "query" --json` — Returns structured memory data
- `sc sick-memory status --json` — Returns system status in JSON
- `sc sick-memory list --json` — Returns memory list in JSON
- `sc sick-memory edit run <id> <content> --json` — Returns edit confirmation in JSON
- `sc sick-memory delete run <id> --json` — Returns delete confirmation in JSON

## Usage Examples

### Agent-Focused Examples
- "Initialize memory for this project" → `sc sick-memory init`
- "Remember that we use real database instances in tests" → `sc sick-memory remember "Use real database instances in tests, not mocks" --type project`
- "Recall memories about database testing" → `sc sick-memory recall "database testing" --json`
- "List all project memories" → `sc sick-memory list --json`
- "Show configuration and storage location" → `sc sick-memory config show`
- "Generate Claude Code bridge for this project" → `sc sick-memory bridge generate claude-code`
- "Check memory system status" → `sc sick-memory status --json`
- "Update memory 1779456013 with new content" → `sc sick-memory edit run 1779456013 "Updated content here" --json`
- "Delete memory 1779456013" → `sc sick-memory delete run 1779456013 --json`

### Quick Examples
```bash
# Session start - recall context
sc sick-memory recall "project context" --json

# Remember important finding
sc sick-memory remember "Authentication uses JWT tokens with 24h expiration" --type project

# Get system status
sc sick-memory status --json

# List all memories
sc sick-memory list --json

# Update existing memory (non-interactive)
sc sick-memory edit run 1779456013 "Updated content here" --json

# Delete memory
sc sick-memory delete run 1779456013 --json

# Using shorthand
/sm remember "API rate limit: 1000 requests per minute"
/sm recall "rate limit"
```

## Installation

```bash
cd ~/ai/sick-memory
go build -o sick-memory .
cp sick-memory ~/.local/bin/
```

The supercli plugin handles installation automatically when using `sc plugins install`.

## Centralized Storage

Sick-memory uses centralized storage with git-based scoping:
- **Storage Location**: `~/.sick-memory/projects/<sanitized-git-root>/memory/`
- **Git-based Scoping**: Memory is scoped to git repository root
- **Worktree Support**: All git worktrees share the same memory directory
- **Fallback**: Uses local `.sick-memory/` directory if not in a git repository

## Global Configuration

Global configuration is stored in `~/.sick-memory/config.json`:
- **Default Memory Type**: Default memory type (user, feedback, project, reference)
- **Max Memory Size**: Maximum memory file size in bytes
- **Auto Index**: Whether to automatically update memory index

## Examples

```bash
# Show configuration and storage location
sc sick-memory config show

# Initialize memory system (uses centralized storage if in git repo)
sc sick-memory init

# Add a memory
sc sick-memory remember "Use real database instances in tests, not mocks"

# Using shorthand
/sm remember "Integration tests must hit real DB"

# Recall memories
sc sick-memory recall "database" --json

# List all memories
sc sick-memory list --json

# Check status
sc sick-memory status --json

# Generate Claude Code integration
sc sick-memory bridge generate claude-code
```

## Key Features

- **Centralized storage**: All memories stored in `~/.sick-memory/` with git-based project scoping
- **Git-based scoping**: Memory automatically scoped to git repository root
- **Worktree support**: All git worktrees of the same repository share memory directory
- **Global configuration**: Centralized config file for user preferences
- **File-based storage**: Markdown files with YAML frontmatter for human readability
- **Agent-agnostic**: Works with Claude Code, OpenCode, Copilot, and other AI agents
- **JSON output**: Machine-readable output for agent integration
- **Bridge commands**: Generate agent-specific configurations automatically
- **Zero infrastructure**: No database or server required, works offline

## Memory Types

The system supports four memory types (following Claude Code's taxonomy):
- **user**: Information about the person (role, goals, expertise)
- **feedback**: Corrections and confirmations about work approach
- **project**: Ongoing work context (who, what, why, when)
- **reference**: External system pointers (URLs, dashboard links)

## Integration with AI Agents

### Claude Code
```bash
sc sick-memory bridge generate claude-code
```
Creates `.claude/CLAUDE.md` with memory loading instructions and centralized storage information.

### OpenCode
```bash
sc sick-memory bridge generate opencode
```
Creates `.opencode/memory.json` with OpenCode configuration.

### Copilot
```bash
sc sick-memory bridge generate copilot
```
Creates `.copilot/settings.json` with Copilot configuration.

## Learning This Skill

Agents can learn this skill by using:
```bash
sc skills teach sick-memory:quickstart
```

Or simply:
```bash
sc skills get sick-memory
```

This provides complete guidance for using sick-memory in any agent session.