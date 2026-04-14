# skillshare Plugin Quickstart

## Overview

skillshare syncs skills across all AI CLI tools with one command. Supports Claude, Codex, OpenClaw, Cursor, and 50+ more.

## Commands

### Setup
- `skillshare init run` — Initialize config and source directory
- `skillshare init run --project` — Initialize in project mode

### Sync
- `skillshare sync run` — Sync skills to all targets
- `skillshare sync run --all` — Sync skills, agents, and extras

### Install & Update
- `skillshare install run` — Install a skill from GitHub
- `skillshare update run` — Update installed skills

### Security
- `skillshare audit run` — Audit skills for prompt injection

### UI
- `skillshare ui start` — Start web dashboard

### Targets
- `skillshare target list` — List configured targets
- `skillshare target mode` — Set sync mode (symlink/copy)

### Passthrough
- `skillshare _ _` — Run any skillshare command directly

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/runkids/skillshare/main/install.sh | sh
```

## Usage Examples

```bash
# Initialize
skillshare init

# Sync all skills
skillshare sync

# Install a skill
skillshare install github.com/user/skills

# Update all skills
skillshare update --all

# Security audit
skillshare audit

# Start web UI
skillshare ui

# Set target to copy mode (if symlinks don't work)
skillshare target claude --mode copy
```

## Supported Targets

- Claude Code
- Codex
- OpenClaw
- Cursor
- OpenCode
- And 50+ more

## Key Features

- **One source, every agent** — edit once, sync everywhere
- **Security audit** — scan for prompt injection before use
- **Agents sync** — sync custom agents alongside skills
- **Extras** — manage rules, commands, prompts
- **Project mode** — per-repo skills committed with code