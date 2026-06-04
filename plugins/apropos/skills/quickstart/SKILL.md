---
name: apropos
description: Use this skill when the user needs to search manual page names and descriptions for keywords.
---

# apropos Plugin

Search the manual page names and descriptions for keywords. Essential for finding the right command when you can't remember its name.

## Commands

### Search
- `apropos search keyword <keyword>` — Search man pages for a keyword
- `apropos self version` — Show apropos version info
- `apropos _ _ <args>` — Passthrough to apropos CLI

## Usage Examples
- "Find all commands related to compression"
- "Search for commands that deal with encryption"
- "List all commands in section 8 (system administration)"

## Installation

```bash
# Pre-installed on most Linux systems
# If missing:
apt-get install man-db
supercli plugins install ./plugins/apropos --on-conflict replace --json
```

## Examples

```bash
# Basic keyword search
apropos compression

# Exact match
apropos --exact compression

# Regex search
apropos --regex "^git.*"

# Search only section 1 (user commands)
apropos --section 1 compression

# Search with shell wildcards
apropos --wildcard "git-*"

# Show full output without trimming
apropos --long compression
```

## Key Features
- Search man page names and descriptions by keyword
- Regex and wildcard support for flexible matching
- Filter by manual section
- Exact match mode for precise lookups
- Long output mode to see full descriptions
