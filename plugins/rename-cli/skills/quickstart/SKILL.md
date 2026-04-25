---
name: rename-cli
description: Use this skill when the user wants to batch rename files.
---

# Rename-CLI Plugin

Batch file renaming tool.

## Commands

### File Renaming
- `rename-cli file rename` — Rename files using patterns

## Usage Examples
- "rename-cli file rename --pattern 'foo' --replacement 'bar'"
- "rename-cli file rename --pattern 'foo' --replacement 'bar' --files '*.txt'"

## Installation

```bash
npm install -g rename-cli
```

## Examples

```bash
# Replace text in filenames
rename 'foo' 'bar' *.txt

# Dry run to preview
rename -d 'foo' 'bar' *.txt

# Use glob patterns
rename 'old' 'new' **/*.js

# Replace extension
rename '.js' '.ts' *.js

# Add prefix
rename '' 'prefix_' *.txt

# Remove text
rename 'remove_' '' *.txt
```

## Key Features
- Batch file renaming
- Search and replace patterns
- Glob pattern support
- Dry run mode
- Recursive operations
