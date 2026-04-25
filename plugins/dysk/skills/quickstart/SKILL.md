---
name: dysk
description: Use this skill when the user wants to get filesystem information like df but with better formatting and JSON/CSV output.
---

# dysk Plugin

Linux utility to get information on filesystems, like df but better.

## Commands

### Filesystem Info
- `dysk self version` — Print dysk version
- `dysk filesystem info` — Get filesystem information
- `dysk output json` — Output filesystem information in JSON format
- `dysk _ _` — Passthrough to dysk CLI

## Usage Examples

- "Show filesystem information"
- "Get disk usage in JSON format"
- "Check available disk space"

## Installation

```bash
cargo install dysk
```

## Examples

```bash
# Show filesystem info
dysk

# Output as JSON
dysk --json

# Output as CSV
dysk --csv

# Show specific mount point
dysk /home
```

## Key Features
- Better than df with cleaner output
- JSON and CSV output support
- Color-coded output
- Detailed filesystem information
- Script-friendly output formats
