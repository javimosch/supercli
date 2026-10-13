---
name: patool
description: Use this skill when the user wants to extract, create, list, or test archives of any format (tar, zip, 7z, rar, etc.) with one uniform CLI via patool.
---

# patool Plugin

patool gives one command surface for ~40 archive formats — it detects the format by extension/magic and delegates to installed helper binaries. No need to remember per-format flags.

## Commands

### Archive ops
- `patool archive extract <file>` — Extract anything (`--outdir DIR`)
- `patool archive create <out>` — Create (format from extension); files via `_args`
- `patool archive list <file>` — List contents
- `patool archive test <file>` — Integrity test
- `patool formats list` — Formats + which helpers are installed
- `patool _ _` — Passthrough (`diff`, `repack`, `search`, ...)

## Usage Examples

- "Extract this weird .tar.zst file"
- "Zip up ./logs into an archive"
- "What's inside this .deb without installing it?"
- "Check if this archive is corrupt"

## Installation

```bash
sudo apt-get install -y patool
# or: pipx install patool / brew install patool
# helpers for more formats:
sudo apt-get install -y p7zip-full unrar zstd lrzip
```

## Examples

```bash
# Extract (any format, same command)
patool extract archive.7z --outdir ./out
patool extract data.tar.xz

# Create
patool create bundle.zip src/ README.md
patool create bundle.tar.gz src/

# List / test
patool list archive.zip
patool test backup.rar

# Compare two archives' contents
patool diff v1.tar.gz v2.tar.gz

# Convert format
patool repack old.tar.gz new.zip

# Search inside an archive
patool search "pattern" archive.tar.gz
```

## Key Features

- Formats: tar.*, zip, 7z, rar, gzip/bzip2/xz/lzma/zstd/lrzip, cpio, deb, rpm, iso, cab, chm, lha...
- Missing helper → clear message naming the tool to install
- `diff` (archive-vs-archive), `repack` (convert), `search` (grep inside), `test` (integrity)
- Also usable as a Python library (`patoolib`)
