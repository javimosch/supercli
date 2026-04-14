---
name: sd
description: Use this skill when the user wants to find and replace text in files or stdin, especially with regex patterns, or when they need a easier alternative to sed for text transformation.
---

# sd Plugin

Intuitive find & replace CLI — sed alternative with regex support.

## Commands

### Find & Replace
- `sd replace run` — Find and replace (stdin)
- `sd replace file` — Find and replace in file (in-place)
- `sd replace preview` — Preview changes without modifying
- `sd replace fixed` — Fixed string mode (no regex)
- `sd replace across` — Cross-line matching with -A flag

## Usage Examples
- "Replace 'foo' with 'bar' in a file"
- "Preview changes before modifying"
- "Replace with regex pattern"
- "Replace newlines with commas"
- "Use fixed string mode"

## Installation

```bash
cargo install sd
```

## Basic Examples

```bash
# Simple replacement
echo "hello world" | sd "world" "universe"

# Trim trailing whitespace
echo "lorem ipsum 23   " | sd '\s+$' ''

# Capture groups
echo "cargo +nightly watch" | sd '(\w+)\s+\+(\w+)\s+(\w+)' 'cmd: $1, channel: $2, subcmd: $3'

# In-place file modification
sd 'before' 'after' file.txt

# Preview without modifying
sd -p 'before' 'after' file.txt

# Fixed string (no regex)
sd -F 'exact string' 'replacement' file.txt

# Cross-line (replace \n with comma)
echo -e "hello\nworld" | sd -A '\n' ','
```

## Key Features
- Intuitive syntax (no `/g` flag needed)
- JS/Python regex syntax
- ~11x faster than sed
- Low memory mode (line-by-line default)
- Cross-line matching with `-A` flag