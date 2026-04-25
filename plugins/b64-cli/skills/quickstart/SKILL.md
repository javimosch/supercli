---
name: b64-cli
description: Use this skill when the user wants to encode or decode files as base64.
---

# B64-CLI Plugin

Command line tool for encoding and decoding files as base64.

## Commands

### File Operations
- `b64-cli file encode` — Encode file to base64
- `b64-cli file decode` — Decode base64 to file

## Usage Examples
- "b64-cli file encode --input image.png"
- "b64-cli file decode --input data.b64 --output image.png"

## Installation

```bash
npm install -g b64-cli
```

## Examples

```bash
# Encode file to base64
b64 image.png > image.b64

# Decode base64 to file
b64 -d image.b64 > image.png

# Encode with output file
b64 input.txt -o output.b64

# Decode with output file
b64 -d input.b64 -o output.txt

# Use stdin/stdout
cat file.txt | b64 > encoded.b64
cat encoded.b64 | b64 -d > decoded.txt
```

## Key Features
- Base64 encoding
- Base64 decoding
- File operations
- Stdin/stdout support
- Pipeline operations
