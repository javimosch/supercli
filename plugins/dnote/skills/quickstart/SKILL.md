---
name: dnote
description: Use this skill when the user wants to take notes from the command line, create a terminal notebook, or build a personal knowledge base.
---

# dnote Plugin

A simple command line notebook for programmers. Take notes, create flashcards, and build a personal knowledge base directly from the terminal.

## Commands

### Note Management
- `dnote note add` — Add a new note
- `dnote note view` — View notes

### Utility
- `dnote _ _` — Passthrough to dnote CLI

## Usage Examples
- "Add a note"
- "View notes"
- "Search notes"
- "Terminal notebook"

## Installation

```bash
brew install dnote
```

## Examples

```bash
# Add note to a book
dnote note add cli "Use grep -r for recursive search"

# View notes in a book
dnote note view cli

# Search notes
dnote note view --query "grep"

# Any dnote command with passthrough
dnote _ _ add cli "New tip"
dnote _ _ view
dnote _ _ sync
```

## Key Features
- **Books** - Organize by topic
- **Search** - Full-text search
- **Sync** - Cloud sync
- **Flashcards** - Study mode
- **CLI** - Terminal native
- **Simple** - Easy commands
- **Tags** - Note tagging
- **Export** - Export notes
- **Markdown** - Markdown support
- **Knowledge** - Knowledge base

## Notes
- Great for terminal workflows
- Organize notes into books
- Supports sync across devices
- Perfect for code snippets
