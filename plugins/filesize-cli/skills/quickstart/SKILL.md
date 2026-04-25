---
name: filesize-cli
description: Use this skill when the user wants to check file sizes.
---

# Filesize-CLI Plugin

Calculate and display file sizes.

## Commands

### File Size
- `filesize-cli file size` — Get file size

## Usage Examples
- "filesize-cli file size --file data.txt"
- "filesize-cli file size --file data.txt --human"

## Installation

```bash
npm install -g filesize-cli
```

## Examples

```bash
# Get file size in bytes
filesize data.txt

# Get human-readable size
filesize -h data.txt

# Get size in specific unit
filesize --mb data.txt

# Check multiple files
filesize file1.txt file2.txt

# Use glob pattern
filesize *.txt
```

## Key Features
- File size calculation
- Human-readable format
- Multiple unit options
- Batch file checking
- Glob pattern support
