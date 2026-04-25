---
name: cloc-cli
description: Use this skill when the user wants to count lines of code.
---

# CLOC-CLI Plugin

Count lines of code in directories.

## Commands

### Code Counting
- `cloc-cli directory count` — Count lines of code in directory

## Usage Examples
- "cloc-cli directory count --directory src/"
- "cloc-cli directory count --directory src/ --json"

## Installation

```bash
npm install -g cloc
```

## Examples

```bash
# Count current directory
cloc

# Count specific directory
cloc src/

# Output as JSON
cloc --json src/

# Exclude directories
cloc --exclude-dir node_modules,vendor

# Count by language
cloc --by-lang src/

# Count files only
cloc --by-file src/

# Count multiple directories
cloc src/ lib/
```

## Key Features
- Lines of code counting
- 200+ programming languages
- JSON output
- Directory exclusion
- File filtering
- Detailed statistics
