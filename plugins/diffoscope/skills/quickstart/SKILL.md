---
name: diffoscope
description: Use this skill when the user wants to deeply compare files, archives, or directories, debug why two builds differ, or analyze binary differences.
---

# diffoscope Plugin

In-depth comparison of files, archives, and directories. Recursively unpacks archives and transforms binary formats into human-readable form for comparison.

## Commands

### Info
- `diffoscope self version` — Print diffoscope version
- `diffoscope self list-tools` — List external tools used by diffoscope

### Comparison
- `diffoscope compare files` — Compare two files/archives/directories in-depth

### Utility
- `diffoscope _ _` — Passthrough to diffoscope CLI

## Usage Examples
- "Compare two tarballs to find the difference"
- "Deep comparison of two .deb packages"
- "Find what changed between two ISO images"
- "Compare directories recursively"

## Installation

```bash
pip install diffoscope
```

Or via package manager:
```bash
brew install diffoscope
apt install diffoscope
```

## Examples

```bash
# Compare two files
diffoscope compare files file1.txt file2.txt

# Compare with HTML output
diffoscope compare files --html report.html package1.deb package2.deb

# Compare with JSON output
diffoscope compare files --json report.json dir1/ dir2/

# Compare with text output to file
diffoscope compare files --text report.txt old.tar.gz new.tar.gz

# List external tools
diffoscope self list-tools

# Compare ISO images
diffoscope compare files image1.iso image2.iso

# Passthrough for custom options
diffoscope _ _ --max-page-size 1024 file1.bin file2.bin
```

## Key Features
- **Recursive unpacking** — Archives within archives within archives
- **Wide format support** — 150+ file formats including deb, rpm, tar, zip, ISO, ELF, PDF, images, SQLite, Git repos
- **Multiple output formats** — Text, HTML, JSON
- **Fuzzy matching** — Handles file renames between versions
- **Hexdump fallback** — Shows hex differences for unknown formats
- **Extensible** — Easy to add support for new formats

## Notes
- Part of the reproducible-builds.org project
- Supports comparing directories, archives, and individual files
- External tools enhance comparison quality (use `diffoscope self list-tools` to see what's available)
- Try online at https://try.diffoscope.org
