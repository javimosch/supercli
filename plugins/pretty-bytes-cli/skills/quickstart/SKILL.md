---
name: pretty-bytes-cli
description: Use this skill when the user wants to convert bytes to human readable format, format file sizes, or display storage sizes.
---

# pretty-bytes-cli Plugin

Convert bytes to a human readable string. 1337 → 1.34 kB

## Commands

### Byte Conversion
- `pretty-bytes convert bytes` — Convert bytes to human readable format

### Utility
- `pretty-bytes _ _` — Passthrough to pretty-bytes CLI

## Usage Examples
- "Convert bytes to readable format"
- "Format file size"
- "Display storage in human readable"
- "Convert 1024 bytes"

## Installation

```bash
npm install -g pretty-bytes-cli
```

## Examples

```bash
# Convert bytes
pretty-bytes convert bytes 1337

# Convert larger numbers
pretty-bytes convert bytes 1000000000

# From stdin
echo "1024" | pretty-bytes

# Any pretty-bytes command with passthrough
pretty-bytes _ _ 1024
pretty-bytes _ _ 1000000000
```

## Key Features
- **Human readable** - Converts to B, kB, MB, GB, etc.
- **Precise** - Proper decimal formatting
- **Fast** - Efficient conversion
- **Simple** - Easy to use
- **Locale support** - Locale-aware formatting
- **Standard format** - Uses standard SI units
- **Cross-platform** - Works everywhere
- **Pipe support** - Accepts stdin

## Supported Units
- **B** - Bytes
- **kB** - Kilobytes
- **MB** - Megabytes
- **GB** - Gigabytes
- **TB** - Terabytes
- **PB** - Petabytes
- **EB** - Exabytes
- **ZB** - Zettabytes
- **YB** - Yottabytes

## Notes
- Uses SI prefixes (1000-based)
- Great for displaying file sizes
- Useful in scripts and logs
- Simple and focused tool
