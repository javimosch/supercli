---
name: sttr
description: Use this skill when the user wants to transform strings, encode/decode text, convert formats, or perform string operations.
---

# sttr Plugin

Cross-platform CLI app to perform various operations on strings. Transform, encode, decode, and manipulate text.

## Commands

### String Transformation
- `sttr transform string` — Transform string with various operations

### Utility
- `sttr _ _` — Passthrough to sttr CLI

## Usage Examples
- "Base64 encode this string"
- "Decode this URL"
- "Convert YAML to JSON"
- "Calculate MD5 hash"

## Installation

```bash
brew install abhimanyu003/sttr/sttr
```

Or via Go:
```bash
go install github.com/abhimanyu003/sttr@latest
```

## Examples

```bash
# Base64 encode
sttr transform string base64-encode "Hello World"

# Base64 decode
sttr transform string base64-decode "SGVsbG8gV29ybGQ="

# MD5 hash
sttr transform string md5 "Hello World"

# URL encode
sttr transform string url-encode "hello world"

# URL decode
sttr transform string url-decode "hello%20world"

# YAML to JSON
sttr transform string yaml-json file.yaml > file-output.json

# JSON to YAML
sttr transform string json-yaml file.json

# From file
sttr transform string md5 file.txt

# From stdin
echo "Hello World" | sttr transform string md5

# Chain operations
sttr transform string md5 "hello" | sttr transform string base64-encode

# Interactive mode
sttr

# Any sttr command with passthrough
sttr _ _ md5 "Hello World"
sttr _ _ base64-encode -i input.txt
```

## Key Features
- **50+ operations** - Encode, decode, hash, convert
- **File support** - Read from files
- **Stdin support** - Pipe data from other commands
- **Chaining** - Chain multiple operations
- **Interactive mode** - Browse operations
- **Cross-platform** - Linux, macOS, Windows
- **Fast** - Written in Go
- **Extensible** - Plugin architecture

## Operations Include
- Encoding: base64, url, html
- Hashing: md5, sha1, sha256, sha512
- Conversion: json-yaml, yaml-json, xml-json
- Text: upper, lower, title, reverse
- Crypto: encrypt, decrypt
- And many more

## Notes
- Interactive mode with sttr (no args)
- Use -h for operation-specific help
- Can write output to file with >
- Great for data transformation pipelines
