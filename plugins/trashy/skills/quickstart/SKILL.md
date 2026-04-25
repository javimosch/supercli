---
name: trashy
description: Use this skill when the user wants to safely delete files by moving them to trash instead of permanent deletion.
---

# trashy Plugin

CLI system trash manager, alternative to rm and trash-cli.

## Commands

### Trash Management
- `trashy self version` — Print trashy version
- `trashy put files <paths>` — Move files to trash
- `trashy list items` — List items in the trash
- `trashy restore files <patterns>` — Restore files from trash
- `trashy empty files <patterns>` — Empty files from trash
- `trashy _ _` — Passthrough to trashy CLI

## Usage Examples

- "Move file.txt to trash"
- "List all items in trash"
- "Restore deleted file"
- "Empty specific files from trash"

## Installation

```bash
cargo install trashy
```

## Examples

```bash
# Trash files
trashy file1 file2 file3
# or
trashy put file1 file2 file3

# List trash contents
trashy list

# Restore files
trashy restore file1 file2

# Empty specific files
trashy empty file1 file2

# Restore all files
trashy restore --all

# Empty all trash
trashy empty --all
```

## Key Features
- Safe deletion (moves to trash instead of permanent removal)
- Restore capability
- List trash contents
- Pattern matching for restore/empty
- Regex or exact match modes
