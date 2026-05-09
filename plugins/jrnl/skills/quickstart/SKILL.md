---
name: jrnl
description: Use this skill when the user wants to write journal entries, take notes, log activities, search past entries by date or tag, or export their journal. Great for keeping a record of decisions, findings, and daily logs.
---

# jrnl Plugin

A command-line journal for collecting thoughts, notes, and logs without leaving the terminal.

## Commands

### Writing
- `jrnl entry create today: Finished the deploy` — Quick entry
- `jrnl entry create yesterday at 3pm: Meeting with team` — Timestamped entry
- `jrnl entry create-from-stdin` — Write entry by piping content

### Reading
- `jrnl entries list -n 10` — Last 10 entries
- `jrnl entries search @meeting` — Search by tag
- `jrnl entries range -from "last week" -to yesterday` — Date range
- `jrnl entries export json` — Full export as JSON

### Full Access
- `jrnl _ _` — Passthrough for any jrnl command

## Usage Examples
- "Log today's progress in my journal"
- "Show me entries from last week"
- "Find all entries tagged with @deploy"
- "Export my journal as JSON"
- "Write a note about the meeting yesterday"

## Installation

```bash
pip install jrnl
```

## Key Features
- **Natural language timestamps**: `yesterday`, `last monday`, `2 weeks ago`
- **Tag support**: `@meeting`, `@deploy`, `@bug`
- **Multiple export formats**: JSON, markdown, CSV, XML
- **Encrypted journals**: AES-256 encryption option
- **Zero platform dependency**: Pure local storage, works offline
