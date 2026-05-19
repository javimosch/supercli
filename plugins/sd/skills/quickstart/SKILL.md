---
name: sd
description: Use this skill when the user wants to find and replace text in files, especially with regex patterns, or when they need an easier alternative to sed for text transformation.
---

# sd Plugin

Intuitive find & replace CLI — sed alternative with regex support. ~11x faster than sed.

## Commands

### Find & Replace
- `sd replace file` — Find and replace in a file (in-place)
- `sd replace run` — Find and replace across one or more files
- `sd replace preview` — Preview changes in a file without modifying
- `sd replace fixed` — Fixed string mode (no regex), in-place
- `sd replace across` — Cross-line matching (dot matches newlines), in-place
- `sd self version` — Print sd version

## Args (all structured commands)
- `--find` — Pattern (regex, or literal string for `fixed`)
- `--replace` — Replacement string (supports capture groups: `$1`, `$2`)
- `--file` — File to operate on
- `--files` — File(s) for `replace run`

## Usage Examples
- "Replace 'foo' with 'bar' in a file"
- "Preview changes before modifying"
- "Replace with regex capture groups"
- "Literal string replace (no regex escaping)"
- "Match across lines in a file"

## Installation

```bash
cargo install sd
sc plugins install ./plugins/sd --on-conflict replace --json
```

## sc Command Examples

```bash
# In-place replacement
sc sd replace file --find "before" --replace "after" --file config.txt

# Preview (no modification)
sc sd replace preview --find "before" --replace "after" --file config.txt

# Fixed literal string (no regex)
sc sd replace fixed --find "hello.world" --replace "hi" --file config.txt

# Capture groups
sc sd replace file --find "(\w+)=(\w+)" --replace "$1: $2" --file env.txt

# Multi-file (via replace run)
sc sd replace run --find "oldname" --replace "newname" --files "*.txt"

# Cross-line (dot matches \n)
sc sd replace across --find "hello.world" --replace "hi universe" --file data.txt
```

## Raw sd examples (via passthrough)

```bash
# Trim trailing whitespace
echo "lorem ipsum 23   " | sd '\s+$' ''

# Capture groups on stdin
echo "cargo +nightly watch" | sd '(\w+)\s+\+(\w+)\s+(\w+)' 'cmd: $1, channel: $2, subcmd: $3'
```

## Key Features
- Intuitive syntax (no `/g` flag needed, replaces all by default)
- JS/Python regex syntax (friendlier than POSIX)
- ~11x faster than sed
- Supports `$1`, `$2` capture group references
- `-f s` flag makes `.` match newlines (cross-line patterns)
- `-F` flag for literal string matching (no regex escaping needed)
