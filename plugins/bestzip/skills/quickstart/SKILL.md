---
name: bestzip
description: Use this skill when the user wants to create zip archives.
---

# Bestzip Plugin

CLI tool for creating zip files.

## Commands

### Archive Creation
- `bestzip file create` — Create zip archive

## Usage Examples
- "bestzip file create --output archive.zip --input directory/"
- "bestzip file create --output files.zip --input file.txt"

## Installation

```bash
npm install -g bestzip
```

## Examples

```bash
# Create zip from directory
bestzip archive.zip directory/

# Create zip from file
bestzip archive.zip file.txt

# Create zip from multiple files
bestzip archive.zip file1.txt file2.txt file3.txt

# Create zip with specific pattern
bestzip archive.zip *.js
```

## Key Features
- Create zip archives
- Uses system zip command when available
- Falls back to Node.js implementation
- Works with files and directories
- Cross-platform
- Fast performance
