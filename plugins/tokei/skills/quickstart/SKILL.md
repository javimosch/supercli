---
name: tokei
description: Use this skill when the user wants to count lines of code, get code statistics for a project, or analyze code by language.
---

# tokei Plugin

Count your code quickly. Fast code statistics for 150+ languages.

## Commands

### Count
- `tokei count run` — Count code statistics
- `tokei count files` — Count with individual file stats
- `tokei count json` — Output as JSON

## Usage Examples
- "Count lines of code in this directory"
- "Get code statistics as JSON"
- "Show per-file statistics"

## Installation

```bash
cargo install tokei
# or
brew install tokei
```

## Examples

```bash
# Basic count
tokei .

# Count specific path
tokei ./src

# With file details
tokei --files ./src

# JSON output
tokei --output json ./src

# Sort by code lines
tokei --sort code ./src

# Exclude patterns
tokei ./src --exclude *.test.*
```

## Output Columns
- **Files** — number of files
- **Lines** — total lines
- **Code** — lines of code
- **Comments** — lines of comments
- **Blanks** — blank lines

## Key Features
- Supports 150+ languages
- Respects .gitignore
- Multiple output formats (text, JSON, YAML, CBOR)
- Very fast (millions of lines in seconds)
- Accurate multi-line comment handling