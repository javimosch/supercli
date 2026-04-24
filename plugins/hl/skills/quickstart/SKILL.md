---
name: hl
description: Use this skill when the user wants to view and highlight log files, filter logs, or tail logs with syntax highlighting.
---

# hl Plugin

Log file highlighter. A fast and powerful log viewer with syntax highlighting, filtering, and live tail support for various log formats.

## Commands

### Log Viewing
- `hl log view` — View and highlight log files

### Utility
- `hl _ _` — Passthrough to hl CLI

## Usage Examples
- "View log file"
- "Highlight logs"
- "Filter log entries"
- "Tail logs with colors"

## Installation

```bash
brew install pamburus/tap/hl
```

Or via Cargo:
```bash
cargo install hl
```

## Examples

```bash
# View log file
hl log view app.log

# Filter logs
hl log view app.log --filter "ERROR"

# Follow mode
hl log view app.log --follow

# Filter by level
hl log view app.log --level warn

# Any hl command with passthrough
hl _ _ app.log
hl _ _ app.log --filter "database"
```

## Key Features
- **Highlighting** - Syntax highlighting
- **JSON** - JSON log support
- **Filter** - Powerful filtering
- **Tail** - Live tail mode
- **Fast** - High performance
- **Themes** - Custom themes
- **Structured** - Structured logs
- **Levels** - Log level filtering
- **Format** - Multiple formats
- **Pipe** - Pipe friendly

## Notes
- Great for log analysis
- Supports JSON logs
- Pipe-friendly design
- Customizable themes
