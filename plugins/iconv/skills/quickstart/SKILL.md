---
name: iconv
description: Use this skill when the user needs to convert text between character encodings.
---

# iconv Plugin

Convert text between character encodings. Supports UTF-8, Latin-1, ASCII, and hundreds of other character sets.

## Commands

### Encoding Conversion
- `iconv encoding convert --from-code <src> --to-code <dst> [file]` — Convert text encoding
- `iconv encoding list` — List all known character encodings
- `iconv self version` — Show iconv version info
- `iconv _ _ <args>` — Passthrough to iconv CLI

## Usage Examples
- "Convert a UTF-16 file to UTF-8"
- "List all available character encodings"
- "Convert a Latin-1 file to ASCII"

## Installation

```bash
# Pre-installed on most Linux/macOS systems
# If missing:
apt-get install libc-bin
supercli plugins install ./plugins/iconv --on-conflict replace --json
```

## Examples

```bash
# Convert UTF-16LE to UTF-8
iconv -f UTF-16LE -t UTF-8 input.txt > output.txt

# Convert ISO-8859-1 to UTF-8
iconv -f ISO-8859-1 -t UTF-8 input.txt

# List all supported encodings
iconv -l

# Convert stdin
echo "hello" | iconv -f ASCII -t UTF-8

# Strip invalid characters
iconv -f UTF-8 -t ASCII//IGNORE input.txt
```

## Key Features
- Convert between hundreds of character encodings
- Supports stdin/stdout for pipe usage
- List available encodings
- Silent mode to suppress warnings
- Output redirection to file
