---
name: moor
description: Use this skill when the user wants to page through files or command output with a modern less replacement that highlights syntax automatically.
---

# moor Plugin

moor (formerly moar) is a pager that does the right thing out of the box — syntax highlighting, incremental `/` search, scrolling, and smart defaults.

## Commands

### Paging
- `moor file view <file>` — Page a file with syntax highlighting
- `moor self version` — Show version
- `moor _ _` — Passthrough to moor CLI

## Usage Examples

- "Show me this log file in a pager"
- "Page through this file with search support"
- "Set a nicer pager for git output"

## Installation

```bash
go install github.com/walles/moor@latest
# or: brew install moor
# or: binary from https://github.com/walles/moor/releases
```

## Examples

```bash
moor main.go                # page a file, syntax highlighted
moor +42 main.go            # jump to line 42
git show | moor             # page any stdout
moor --no-linenumbers f.txt # hide line numbers
export PAGER=moor           # use everywhere less is used
```

## Key Features

- Syntax highlighting via Chroma (no config needed)
- Incremental search with `/`, scroll with arrows/trackpad
- Streams output fast — shows content while still reading input
- Honors `PAGER` and `MOAR` env vars; drop-in `less` replacement
