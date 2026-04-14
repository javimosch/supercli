---
name: fd
description: Use this skill when the user wants to find files in the filesystem, search by extension, find directories, or replace find with a faster alternative.
---

# fd Plugin

A fast and user-friendly alternative to `find`.

## Commands

### Find
- `fd find run` — Find files by pattern
- `fd find extension` — Find files by extension
- `fd find type` — Find files by type (file, directory, etc.)

## Usage Examples
- "Find all markdown files"
- "Search for files named test"
- "Find all directories"
- "Find executables"

## Installation

```bash
cargo install fd-find
# or
brew install fd
```

## Examples

```bash
# Basic search
fd "pattern"

# Find by extension
fd -e md

# Find files (not directories)
fd -t f

# Find directories
fd -t d

# Case insensitive (default)
fd "PATTERN"

# Regex search
fd "^src"

# Full path search
fd -p "src"
```

## Common Flags
- `-e` — Filter by extension
- `-t f` — Files only
- `-t d` — Directories only
- `-t x` — Executables
- `-H` — Include hidden
- `-I` — Ignore gitignore
- `-l` — Long listing format
- `-S size` — Filter by size