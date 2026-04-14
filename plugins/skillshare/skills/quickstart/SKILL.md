---
name: skillshare
description: Use this skill when the user wants to sync skills across AI CLI tools, install or update skills from GitHub, run security audits on skills, or manage skill sharing across team members.
---

# skillshare Plugin

Sync skills across AI CLI tools — Claude, Codex, OpenClaw, Cursor, and more.

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

## Usage Examples
- "Initialize skillshare in this directory"
- "Sync all skills to their targets"
- "Install a skill from github.com/user/skills"
- "Run a security audit on installed skills"
- "Start the web UI"

## Supported Targets
- Claude Code
- Codex
- OpenClaw
- Cursor
- OpenCode
- And 50+ more

## Key Features
- One source, every agent — edit once, sync everywhere
- Security audit — scan for prompt injection before use
- Agents sync — sync custom agents alongside skills
- Extras — manage rules, commands, prompts
- Project mode — per-repo skills committed with code