---
name: go-replace
description: Use this skill when the user wants to find and replace text in files, search and replace patterns, or modify file contents.
---

# go-replace Plugin

Replace in file console utility. Find and replace text patterns in files with multiple modes.

## Commands

### Text Replacement
- `go-replace replace text` — Replace text in files

### Utility
- `go-replace _ _` — Passthrough to go-replace CLI

## Usage Examples
- "Replace text in this file"
- "Find and replace pattern"
- "Replace line in file"
- "Use template replacement"

## Installation

Download from GitHub releases:
```bash
# Download for your platform from:
# https://github.com/webdevops/go-replace/releases

# Add to PATH
export PATH=$PATH:/path/to/go-replace
```

## Examples

```bash
# Simple replace
go-replace replace text -s "old" -r "new" file.txt

# Replace mode (default)
go-replace replace text -s "pattern" -r "replacement" -m replace file.txt

# Line mode (replace entire lines)
go-replace replace text -s "pattern" -r "new line" -m line file.txt

# Lineinfile mode (add if not exists)
go-replace replace text -s "line" -r "new line" -m lineinfile file.txt

# Template mode (Go templates)
go-replace replace text -s "{{.Var}}" -r "value" -m template file.txt

# Multiple files
go-replace replace text -s "old" -r "new" file1.txt file2.txt

# Any go-replace command with passthrough
go-replace _ _ -s "old" -r "new" file.txt
go-replace _ _ -m line -s "pattern" -r "new" *.txt
```

## Key Features
- **Multiple modes** - replace, line, lineinfile, template
- **Fast** - Concurrent file processing
- **Flexible** - Regex and simple patterns
- **Template support** - Go template engine
- **Recursive** - Can process directories
- **Threaded** - Configurable concurrency
- **Cross-platform** - Works everywhere
- **Batch** - Process multiple files

## Replacement Modes
- **replace** - Replace matching text
- **line** - Replace entire lines
- **lineinfile** - Add line if not exists
- **template** - Go template replacement

## Notes
- Default mode is replace
- Can process multiple files at once
- Great for configuration management
- Supports regex patterns
- Thread count configurable
