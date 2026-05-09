---
name: chainlink
description: Use this skill when the user wants to track tasks, create issues, manage a session with an AI coding agent, preserve context between agent restarts, leave handoff notes, prioritize work, or organize tasks into milestones.
---

# Chainlink Plugin

CLI issue tracker built for AI coding agents. Track tasks, preserve context across sessions, leave handoff notes, and manage milestones — all in local SQLite. Zero auth, zero network.

## Commands

### Self
- `chainlink self version` — Print version

### Init
- `chainlink init run` — Initialize chainlink in current project

### Issues
- `chainlink issue create` — Create issue (passthrough: `chainlink create <title> -p high -l bug -d desc`)
- `chainlink issue list` — List issues (`-s all/closed`, `-l label`, `-p priority`, `--json`)
- `chainlink issue show` — Show issue details (`<id>`, `--json`)
- `chainlink issue close` — Close issue (`<id>`, `--no-changelog`)
- `chainlink issue quick` — Quick create + label + start working (`<title> -p high -l bug`)
- `chainlink issue comment` — Add comment (`<id> "text"`)
- `chainlink issue subissue` — Create subissue (`<parent_id> <title>`)
- `chainlink issue next` — Suggest next issue to work on
- `chainlink issue tree` — Show issue hierarchy tree
- `chainlink issue ready` — List unblocked issues ready to work

### Sessions
- `chainlink session start` — Start session (shows previous handoff notes)
- `chainlink session end` — End session with optional notes
- `chainlink session status` — Show current session info
- `chainlink session work` — Set active issue
- `chainlink session action` — Record breadcrumb

### Milestones
- `chainlink milestone create` — Create milestone
- `chainlink milestone list` — List all milestones

### Passthrough
- `chainlink _ _` — Direct passthrough for any chainlink command

## Usage Examples
- "Initialize chainlink in this project"
- "Create a high-priority bug and start working on it"
- "List all open issues tagged as bugs"
- "Show me the issue hierarchy tree"
- "Start a session and record what I'm working on"
- "End the session with handoff notes"

## Installation

```bash
cargo install chainlink-tracker
```

## Common Workflows

```bash
# Initialize in a project
chainlink init
chainlink session start

# Quick create and start working
chainlink quick "Fix login bug" -p high -l bug

# Record progress
chainlink session action "Found root cause in auth.rs"
chainlink comment 1 "Root cause: token refresh race condition"

# End session with handoff
chainlink session end --notes "Found auth bug in token refresh. Next: implement fix."

# Resume next session
chainlink session start
# → Shows previous handoff notes automatically

# List and prioritize
chainlink list --json
chainlink next
chainlink tree

# Milestones
chainlink milestone create "Sprint 24" -d "Bug fixes and performance"
chainlink milestone add 1 2 3
```

## Key Features
- Local-first: all data in `.chainlink/issues.db` (SQLite)
- Session handoff notes survive context compression
- Breadcrumb tracking via `session action`
- Claude Code hooks included for automatic context injection
- Supports labels, priorities, milestones, subissues, dependencies
- `--json` and `--quiet` flags for agent-friendly output
- Smart recommendations via `chainlink next`
- Tree hierarchy visualization
- Export/import for backup and sharing
- Time tracking on individual issues
