---
name: dos2unix
description: Use this skill when the user needs to fix line endings in text files — convert between DOS/Windows (CRLF) and Unix (LF) formats, including batch directory processing.
---

# dos2unix Plugin

dos2unix converts text file line endings between formats. Essential for cross-platform development to fix files transferred between Windows and Unix systems.

## Commands

- `dos2unix _ _ <args>` — Passthrough

## Usage Examples

- "convert a file from DOS to Unix line endings"
- "convert all .txt files in a directory"
- "check if a file has DOS line endings without converting"
- "convert from Unix to DOS format"

## Installation

```bash
brew install dos2unix
```

## Key Features
- DOS/Mac to Unix line ending conversion
- Unix to DOS/Mac conversion (unix2dos, mac2unix)
- Batch directory processing with glob patterns
- Encoding conversion support
- Preserve file timestamps option
- Keep backup of original files
- Force conversion even when encoding is unknown
- Verbose and quiet operation modes
