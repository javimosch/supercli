---
name: node-duplicate-finder
description: Use this skill when the user wants to find duplicate files.
---

# Node-Duplicate-Finder Plugin

Find duplicate files in directories.

## Commands

### Duplicate Detection
- `node-duplicate-finder directory find` — Find duplicate files in directories

## Usage Examples
- "node-duplicate-finder directory find --directory ./photos"
- "node-duplicate-finder directory find --directory ./music --only mp3"

## Installation

```bash
npm install -g node-duplicate-finder
```

## Examples

```bash
# Find duplicates in directory
dedup ./photos

# Find duplicates recursively
dedup -r ./photos

# Ignore specific directories
dedup --ignore node_modules/ ./project

# Only check specific file types
dedup --only mp3 ./music

# Check multiple directories
dedup ./photos ./backup

# List only duplicates
dedup -l ./directory
```

## Key Features
- Duplicate file detection
- Content-based hashing
- Recursive scanning
- Ignore patterns
- File type filtering
- Multiple directory support
