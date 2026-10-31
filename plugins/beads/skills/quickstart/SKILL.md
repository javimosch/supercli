---
name: beads
description: Issue tracking plugin for beads_rust (br)
---

# beads Plugin

Issue tracking plugin for beads_rust (br)

## Installation

```bash
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/beads_rust/main/install.sh?$(date +%s)" | bash
br --version
```

Installation is intentionally delegated to your LLM/automation flow (dcli/scli/supercli).

## Commands

### `sc beads install steps`

Show beads_rust installation steps for LLM automation

### `sc beads workspace init`

Initialize beads workspace in current repository

### `sc beads issue create <title> [--type <value>] [--priority <value>] [--description <value>]`

Create a beads issue

- `title` (string, required) — 
- `type` (string, optional) — 
- `priority` (integer, optional) — 
- `description` (string, optional) — 

### `sc beads issue list [--status <value>] [--priority <value>] [--assignee <value>]`

List beads issues

- `status` (string, optional) — 
- `priority` (string, optional) — 
- `assignee` (string, optional) — 

### `sc beads issue ready`

List actionable beads issues

### `sc beads issue show <id>`

Show beads issue details

- `id` (string, required) — 

### `sc beads issue update <id> [--status <value>] [--priority <value>] [--assignee <value>]`

Update a beads issue

- `id` (string, required) — 
- `status` (string, optional) — 
- `priority` (integer, optional) — 
- `assignee` (string, optional) — 

### `sc beads issue close <id> [--reason <value>]`

Close a beads issue

- `id` (string, required) — 
- `reason` (string, optional) — 

### `sc beads issue reopen <id>`

Reopen a beads issue

- `id` (string, required) — 

### `sc beads dep add <child> <parent>`

Add dependency child->parent

- `child` (string, required) — 
- `parent` (string, required) — 

### `sc beads dep remove <child> <parent>`

Remove dependency child->parent

- `child` (string, required) — 
- `parent` (string, required) — 

### `sc beads dep cycles`

Find dependency cycles

### `sc beads sync run [--flush-only] [--import-only]`

Run beads sync

- `flush-only` (boolean, optional) — 
- `import-only` (boolean, optional) — 

### `sc beads stats show`

Show beads project stats

## SuperCLI

```bash
sc beads _ _ --help
sc plugins learn beads
```
