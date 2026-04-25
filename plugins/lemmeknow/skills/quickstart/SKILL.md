---
name: lemmeknow
description: Use this skill when the user wants to identify unknown data formats, decode text, or recognize hashes and encodings from the command line.
---

# lemmeknow Plugin

A fast, offline data decoder for identifying data formats. Recognize and decode hundreds of data formats including hashes, encodings, and more.

## Commands

### Data Identification
- `lemmeknow data identify` — Identify data format from input

### Utility
- `lemmeknow _ _` — Passthrough to lemmeknow CLI

## Usage Examples
- "Identify this hash"
- "What format is this text?"
- "Decode unknown data"
- "Recognize data format"

## Installation

```bash
brew install lemmeknow
```

Or via Cargo:
```bash
cargo install lemmeknow
```

## Examples

```bash
# Identify text
echo "SGVsbG8gV29ybGQ=" | lemmeknow

# Identify with JSON output
echo "d41d8cd98f00b204e9800998ecf8427e" | lemmeknow --json

# Identify encoding
echo "hello" | lemmeknow --encoding

# Any lemmeknow command with passthrough
lemmeknow _ _ "unknown text here"
lemmeknow _ _ --json "data to identify"
```

## Key Features
- **Identify** - Data format recognition
- **Decode** - Decode encodings
- **Hashes** - Hash identification
- **Encoding** - Encoding detection
- **Offline** - No network needed
- **Fast** - Fast performance
- **Hundreds** - 100+ formats
- **CTF** - CTF support
- **Forensics** - Forensics tools
- **Security** - Security research

## Notes
- Works offline
- Recognizes 100+ formats
- Great for CTF challenges
- Supports hashes, encodings, crypto
