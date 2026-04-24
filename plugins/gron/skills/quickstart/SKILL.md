---
name: gron
description: Use this skill when the user wants to make JSON grep-able, search JSON with grep, or convert JSON to a line-by-line format.
---

# gron Plugin

Make JSON greppable. Convert JSON to a grep-able format for easier searching and manipulation with standard Unix tools.

## Commands

### JSON Conversion
- `gron json convert` — Convert JSON to grep-able format

### Utility
- `gron _ _` — Passthrough to gron CLI

## Usage Examples
- "Make this JSON grep-able"
- "Convert JSON to line-by-line format"
- "Search JSON with grep"
- "Convert back to JSON"

## Installation

```bash
brew install gron
```

Or via Go:
```bash
go install github.com/tomnomnom/gron@latest
```

## Examples

```bash
# Convert JSON to gron format
gron json convert data.json

# Convert from URL
gron json convert https://api.example.com/data.json

# Convert from stdin
cat data.json | gron json convert

# Convert back to JSON
gron json convert --ungron data.gron > output.json

# Stream mode for large files
gron json convert --stream large.json

# Disable color output
gron json convert --monochrome data.json

# Don't sort keys
gron json convert --no-sort data.json

# Pipe to grep
gron json convert data.json | grep email

# Pipe to sed
gron json convert data.json | sed 's/old/new/'

# Pipe to awk
gron json convert data.json | awk '/name/ {print}'

# Any gron command with passthrough
gron _ _ data.json
gron _ _ --ungron data.gron
```

## Key Features
- **Grep-friendly** - Convert JSON to path=value format
- **Unix integration** - Works with grep, sed, awk, etc.
- **Bidirectional** - Convert back to JSON with --ungron
- **Multiple sources** - Files, URLs, or stdin
- **Streaming** - Handle large files efficiently
- **Sorted output** - Keys sorted by default
- **Color support** - Syntax highlighting
- **No dependencies** - Single binary
- **Cross-platform** - Linux, macOS, Windows
- **URL support** - Fetch JSON from URLs directly

## Notes
- Default output is sorted by path
- Use --no-sort for faster processing
- Perfect for log analysis and data extraction
- Can be used in shell scripts
- Preserves data types when converting back
