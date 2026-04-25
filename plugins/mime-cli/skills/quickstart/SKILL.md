---
name: mime-cli
description: Use this skill when the user wants to detect MIME types of files.
---

# Mime-CLI Plugin

Detect MIME types of files.

## Commands

### MIME Detection
- `mime-cli file type` — Detect MIME type of file

## Usage Examples
- "mime-cli file type --file image.png"
- "mime-cli file type --file document.pdf"

## Installation

```bash
npm install -g mime-cli
```

## Examples

```bash
# Detect MIME type
mime file.txt

# Check multiple files
mime file1.txt file2.jpg file3.pdf

# Use glob pattern
mime *.png

# Check extension only
mime --ext .json

# Reverse lookup (MIME to extension)
mime --reverse application/json
```

## Key Features
- MIME type detection
- Extension to MIME mapping
- MIME to extension lookup
- Batch file checking
- Glob pattern support
