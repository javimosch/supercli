---
name: todoman
description: Use this skill when the user wants to manage a task list from the CLI with todoman (the `todo` binary), including CalDAV-synced tasks.
---

# todoman Plugin

todoman keeps tasks as iCalendar files in `~/.local/share/calendars/<list>/`. It works fully offline and syncs to CalDAV through vdirsyncer. `--porcelain` gives stable JSON for automation.

## Commands

### Tasks
- `todoman tasks list` — Pending tasks; add `--porcelain` for JSON output
- `todoman tasks new` — Create a task (`-l <list> -s <summary>` for non-interactive)
- `todoman tasks show` — Full task details by id
- `todoman tasks edit` — Change summary/due/priority by id
- `todoman tasks done` — Mark complete by id
- `todoman tasks delete` — Permanently delete by id
- `todoman tasks flush` — Drop all completed tasks
- `todoman _ _` — Passthrough (`todo copy`, `todo move`, `todo repl`)

## Usage Examples

- "Add 'renew domain' to my personal task list due Friday"
- "Show all my pending tasks as JSON"
- "Mark task 5 done"
- "Clear out completed tasks"

## Installation

```bash
pipx install todoman
# or: sudo apt install todoman
```

## Examples

```bash
todo new -l work -s "Review PRs" --due 2026-10-17
todo list                    # human table
todo list --porcelain        # JSON for scripts
todo list -l personal        # one list only
todo done 3 && todo flush
```

## Key Features

- iCalendar (.ics) on-disk format — readable, syncable, version-controllable
- CalDAV sync via vdirsyncer (Nextcloud, Radicale, Fastmail, ...)
- `--porcelain` JSON output designed for scripts and agents
- Multiple named lists via `-l/--list`; human ids stay stable across edits
