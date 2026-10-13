---
name: pdu
description: Use this skill when the user wants to measure directory sizes or find what is eating disk space, much faster than du.
---

# pdu Plugin

pdu (parallel disk usage) is a `du` replacement that scans trees in parallel with a progress bar, tree output, and JSON mode.

## Commands

### Disk usage
- `pdu disk scan` — Parallel scan of given paths (default: cwd), prints tree
- `pdu disk json` — Same scan but emits `--json-output`
- `pdu self version` — Show version
- `pdu _ _` — Passthrough (e.g. `--top=20`, `--max-depth=2`, `--bytes-format=metric`)

## Usage Examples

- "What's using all the disk space in /var?"
- "Show the 20 biggest directories in my home folder"
- "Get directory sizes as JSON for a script"

## Installation

```bash
cargo install parallel-disk-usage
# or: cargo binstall parallel-disk-usage
# or: brew install pdu
```

## Examples

```bash
pdu                        # scan cwd
pdu /var /home             # scan multiple roots
pdu --top=20 ~             # 20 largest entries only
pdu --max-depth=2 /        # limit tree depth
pdu --json-output . | jq '.size'
pdu --json-input < scan.json   # re-render a saved scan
```

## Key Features

- Parallel directory traversal (uses all cores; far faster than `du`)
- Live progress bar during scan
- `--top`, `--min-ratio`, `--max-depth` to trim the tree
- `--json-output`/`--json-input` for pipelines and resumable reporting
