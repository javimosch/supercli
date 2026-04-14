---
name: ripgrep
description: Use this skill when the user wants to search for text patterns in files, search codebases with regex, find files containing specific text, or replace grep with a faster alternative.
---

# ripgrep (rg) Plugin

Fast recursive regex search that respects gitignore and skips hidden/binary files.

## Commands

### Search
- `ripgrep search run` — Search for regex pattern
- `ripgrep search files` — List files containing pattern

## Usage Examples
- "Find all occurrences of a pattern"
- "Search recursively in this directory"
- "List files containing a word"
- "Search with case-insensitive flag"

## Installation

```bash
cargo install ripgrep
# or
brew install ripgrep
```

## Examples

```bash
# Basic search
rg "pattern"

# Case insensitive
rg -i "pattern"

# Show line numbers
rg -n "pattern"

# Only filenames
rg -l "pattern"

# Whole word match
rg -w "pattern"

# Count matches
rg -c "pattern"

# JSON output
rg --json "pattern"

# Search specific file type
rg -t js "pattern"
```

## Common Flags
- `-n` — Show line numbers
- `-l` — Show only filenames
- `-i` — Case insensitive
- `-w` — Match whole words
- `-c` — Show count per file
- `-t` — Filter by type (js, py, rs, etc.)
- `--json` — JSON output