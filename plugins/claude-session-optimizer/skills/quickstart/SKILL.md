---
name: claude-session-optimizer
description: Compress oversized Claude Code session files to prevent crashes and recover disk space. Uses the claude-session-optimizer tool from GitHub (javimosch/claude-session-optimizer).
---

# Claude Session Optimizer

Claude Code sessions (`~/.claude/projects/*/*.jsonl`) grow unbounded. Once a session exceeds **~75 MB**, Claude crashes on load. This tool compresses them back to < 50 MB while keeping conversation history intact.

## Quick Start

### 🔍 One-command health check (safe)
```bash
# First-time: sync latest plugins, install, and run health check
sc plugins update && sc plugins install claude-session-optimizer
sc claude-session-optimizer self auto
```
The `auto` command auto-installs the optimizer (cached), scans all sessions, reports oversized ones, and tells you how to compress. **Never modifies files** — safe to run anytime.

> **Note for npx users:** Replace `sc` with `npx superacli`. The `plugins update` command fetches the latest plugin catalog directly from GitHub — no npm publish needed.

### Manual commands
```bash
# List all sessions with sizes
sc claude-session-optimizer self list

# Compress all sessions over 50 MB
sc claude-session-optimizer self compress

# Preview savings (no writes)
sc claude-session-optimizer self dry-run

# Target a specific session
sc claude-session-optimizer self file --path ~/.claude/projects/-my-project/uuid.jsonl

# Custom threshold (e.g., 30 MB)
sc claude-session-optimizer self compress-threshold --threshold 30
```

## What Gets Removed

| Component | Why | Typical savings |
|-----------|-----|-----------------|
| **thinking** blocks | Internal reasoning (not needed to continue) | ~11 MB |
| **file-history-snapshots** | Undo history (auto-rebuilt) | ~17 MB |
| **pr-link, queue-operation** | Redundant metadata | ~1 MB |
| **tool_result** (large) | Command output → `[truncated: N B]` | ~3 MB |
| **tool_use** input (large) | Tool args → tool name + size note | ~4 MB |

**Kept:** user messages, assistant text, attachments/goals, system prompts, last-prompt, mode markers.

## Installation

```bash
mkdir -p ~/.local/bin
curl -sL https://raw.githubusercontent.com/javimosch/claude-session-optimizer/main/compress-claude-session.py -o ~/.local/bin/compress-claude-session
chmod +x ~/.local/bin/compress-claude-session
```

Or run directly without installing:

```bash
python3 <(curl -sL https://raw.githubusercontent.com/javimosch/claude-session-optimizer/main/compress-claude-session.py) --list
```

## Safety

- Creates `.bak` backup before modifying any file
- Idempotent: running on already-compressed session is a no-op
- Dry-run: use `--dry-run` to preview
- Zero dependencies: Python 3 standard library only

## GitHub

https://github.com/javimosch/claude-session-optimizer
