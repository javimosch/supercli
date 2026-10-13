---
name: cliphist
description: Use this skill when the user wants Wayland clipboard history — store, list, decode, or wipe clipboard entries with cliphist.
---

# cliphist Plugin

cliphist records every clipboard change into `~/.cache/cliphist/db` (start it once per session with `wl-paste --watch cliphist store`). `list` emits TSV (`id<TAB>preview`), `decode` turns a selected line back into the original bytes, pickers like fzf/dmenu/wofi sit in between.

## Commands

### History
- `cliphist history list` — TSV of stored items, newest first (`-fields id,mime,preview` for more columns)
- `cliphist history decode` — Read a `list` line on stdin, emit original content
- `cliphist history store` — Store stdin as a clipboard entry (normally driven by wl-paste --watch)
- `cliphist history wipe` — Clear the DB (`-older-than 720h` to expire instead)
- `cliphist history compact` — Compact the database
- `cliphist _ _` — Passthrough (`delete`, `delete-query`, `-max-items`, ...)

## Usage Examples

- "Show my recent clipboard history"
- "Restore what I copied an hour ago"
- "Clear clipboard entries older than a week"
- "Pipe the last copied thing into a file"

## Installation

```bash
go install go.senan.xyz/cliphist@latest
```

## Examples

```bash
wl-paste --watch cliphist store &        # record (once per session)
cliphist list                            # browse history
cliphist list | fzf | cliphist decode | wl-copy   # restore an entry
cliphist list | head -1 | cliphist decode > /tmp/last.bin
cliphist delete-query "old secret"       # remove one entry
cliphist wipe -older-than 720h           # expire entries over 30 days
```

## Key Features

- Byte-for-byte fidelity: whitespace, newlines, and binary image data survive
- Picker-agnostic — designed for pipes, not a built-in UI
- Config via flags, env vars (`CLIPHIST_*`), or `~/.config/cliphist/config`
- Size limits (`-max-store-size`) and dedupe controls built in
