---
name: gohash
description: Use this skill when the user wants to calculate file hashes, encode/decode data, or work with cryptographic operations.
---

# gohash Plugin

Command line tools and library to work with hashes and various encodings. Calculate hashes and encode/decode data.

## Commands

### Hash Calculation
- `gohash calculate hash` — Calculate hash from stdin or files

### Utility
- `gohash _ _` — Passthrough to hasher CLI

## Usage Examples
- "Calculate SHA256 of this file"
- "Get MD5 hash"
- "Encode to base64"
- "List supported hash algorithms"

## Installation

```bash
go install github.com/martinlindhe/gohash/cmd/hasher@latest
```

## Examples

```bash
# Calculate hash of file
gohash calculate hash file.txt

# List supported hashes
gohash calculate hash --list-hashes

# Calculate SHA256
gohash calculate hash --encoding=sha256 file.txt

# Calculate MD5
gohash calculate hash --encoding=md5 file.txt

# From stdin
cat file.txt | gohash calculate hash

# Any hasher command with passthrough
gohash _ _ --list-hashes
gohash _ _ --encoding=sha256 file.txt
```

## Key Features
- **Multiple algorithms** - MD5, SHA1, SHA256, SHA512, and more
- **Encodings** - base64, hex, and more
- **File support** - Hash files or stdin
- **Fast** - Efficient Go implementation
- **Library** - Can be used as Go package
- **Cross-platform** - Works everywhere
- **Extensible** - Many hash types supported

## Included Tools
- **hasher** - Calculate hashes
- **coder** - Encode/decode between formats
- **findhash** - Search for plaintext matching hashes

## Notes
- Default hash algorithm is SHA256
- Use --list-hashes to see all options
- Use --list-encodings for encoding options
- Great for file verification
- Can be used in security workflows
