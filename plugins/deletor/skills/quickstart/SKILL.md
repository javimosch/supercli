---
name: deletor
description: Use this skill when the user wants to clean up, delete, or manage files by filtering on extension, size, or age from the command line.
---

# deletor Plugin

Manage and delete files efficiently with a scriptable CLI mode. Filter by extension, size, age, and preview before removing. Supports smart rules and progress tracking.

## Commands

### File Cleanup
- `deletor files clean` — Clean files in CLI mode with filters

### Utility
- `deletor self version` — Print deletor version
- `deletor _ _` — Passthrough to deletor CLI

## Usage Examples
- "Clean old log files from /var/log"
- "Delete all zip files in Downloads larger than 100MB"
- "Remove files older than 30 days in temp directory"
- "Preview files matching *.tmp before deleting"
- "Clean up node_modules and vendor directories"

## Installation

```bash
go install github.com/pashkov256/deletor@latest
```

## Examples

```bash
# Preview files in Downloads (no deletion)
deletor files clean -d ~/Downloads

# Delete mp4 and zip files in Downloads
deletor files clean -d ~/Downloads -e mp4,zip -skip-confirm

# Delete files larger than 100MB
deletor files clean -d ~/Downloads --min-size 100mb -skip-confirm

# Delete files between 10KB and 1MB
deletor files clean -d ~/Downloads --min-size 10kb --max-size 1mb -skip-confirm

# Delete files older than 7 days
deletor files clean -d ~/temp --older 7day -skip-confirm

# Delete files newer than 1 hour
deletor files clean -d ~/uploads --newer 1hour -skip-confirm

# Include subdirectories
deletor files clean -d ~/Projects -e log -subdirs -skip-confirm

# Exclude specific directories
deletor files clean -d ~/Projects -e tmp --exclude node_modules,vendor -subdirs -skip-confirm

# Remove empty directories after deletion
deletor files clean -d ~/Downloads -e tmp -prune-empty -skip-confirm

# Use smart rules for safe deletion
deletor files clean -d ~/Downloads -rules -skip-confirm

# Show progress
deletor files clean -d ~/Downloads -e mp4 -progress -skip-confirm
```

## Key Features
- Filter by file extension (comma-separated)
- Filter by minimum and maximum file size
- Filter by file age (older than or newer than)
- Include or exclude subdirectories
- Exclude specific directories or files
- Prune empty directories after deletion
- Smart rules for safer deletion
- Progress tracking for large operations
- Confirmation prompts by default (use -skip-confirm to bypass)

## Safety Notes
- By default, deletor prompts for confirmation before deleting
- Use `-skip-confirm` only when you are certain about the targets
- Always preview with `-rules` before bulk deletion
- The `-rules` flag applies smart safety rules to prevent accidental deletions
