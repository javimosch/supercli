---
name: ouch
description: Use this skill when the user wants to compress or decompress files, create archives, extract zip/tar/7z files, or work with any supported archive formats.
---

# ouch Plugin

Painless compression and decompression CLI.

## Commands

### Compress
- `ouch compress run` — Compress files into an archive

### Decompress
- `ouch decompress run` — Decompress an archive

### List
- `ouch list run` — List contents of an archive

## Usage Examples
- "Compress files into a zip"
- "Decompress a tar.gz file"
- "List contents of an archive"
- "Extract to a specific directory"

## Installation

```bash
cargo install ouch
# or
brew install ouch
```

## Examples

```bash
# Compress files
ouch compress file.txt archive.zip

# Compress multiple files
ouch compress one.txt two.txt archive.zip

# Decompress
ouch decompress archive.zip

# Decompress to directory
ouch decompress archive.zip --dir output/

# List contents
ouch list archive.zip

# List as tree
ouch list archive.zip --tree
```

## Supported Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Zip | .zip | |
| Tar | .tar | |
| 7z | .7z | |
| Gzip | .gz | Parallel compression |
| Zstandard | .zst | Parallel compression |
| Brotli | .br | |
| LZ4 | .lz4 | |
| XZ | .xz | |
| BZip2 | .bz2 | |
| LZMA | .lzma | |
| RAR | .rar | Decompress only |

Formats can be chained: `.tar.gz`, `.tar.zst`, etc.