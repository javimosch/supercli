---
name: fq
description: Use this skill when the user wants to query, decode, or transform binary data, analyze file formats, or inspect binary files.
---

# fq Plugin

jq for binary formats. A tool, language, and decoders for working with binary and text formats. Query, decode, and transform binary data with a jq-like syntax.

## Commands

### Data Query
- `fq data query` — Query binary data with jq-like syntax

### Utility
- `fq _ _` — Passthrough to fq CLI

## Usage Examples
- "Query this binary file"
- "Decode pcap data"
- "Inspect file structure"
- "Extract data from binary format"

## Installation

```bash
brew install fq
```

Or download pre-built binaries from releases.

## Examples

```bash
# Query binary file
fq data query file.bin

# Output as JSON
fq data query file.bin --output json

# Compact output
fq data query file.bin --output compact

# Limit depth
fq data query file.bin --depth 3

# Start REPL mode
fq data query --repl

# Query specific path
fq data query file.bin '.data[0]'

# Any fq command with passthrough
fq _ _ file.bin --output json
fq _ _ --repl pcap.pcap
```

## Key Features
- **Multiple formats** - pcap, mp4, png, jpeg, pdf, and many more
- **jq-like syntax** - Familiar query language
- **REPL mode** - Interactive exploration
- **JSON output** - Convert binary to JSON
- **Depth control** - Limit query depth
- **Binary decoding** - Decode complex binary structures
- **Transform** - Modify and re-encode data
- **Cross-platform** - Linux, macOS, Windows
- **Fast** - Efficient binary processing
- **Extensible** - Custom decoders support

## Notes
- Supports many file formats out of the box
- REPL mode is great for exploration
- Can handle large binary files efficiently
- Perfect for reverse engineering
- Useful for debugging file formats
