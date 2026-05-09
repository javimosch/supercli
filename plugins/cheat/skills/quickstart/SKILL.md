---
name: cheat
description: Use this skill when the user wants to look up how to use a command, find command examples, search for command syntax, or get quick reference material for any CLI tool.
---

# cheat Plugin

Create and view command-line cheatsheets. Community-driven reference for hundreds of commands.

## Commands

### Viewing
- `cheat sheet view tar` — View cheatsheet for `tar`
- `cheat sheet view git` — View cheatsheet for `git`
- `cheat sheet view docker` — View cheatsheet for `docker`

### Listing
- `cheat sheets list` — List all available cheatsheets
- `cheat sheets list-brief` — List names and tags only
- `cheat sheets list -t networking` — Filter by tag

### Searching
- `cheat sheets search ssh` — Search for "ssh" across cheatsheets
- `cheat sheets search '(?:[0-9]{1,3}\.){3}[0-9]{1,3}' --regex` — Search by regex

### Tags
- `cheat tags list` — List all tags in use

### Full Access
- `cheat _ _` — Passthrough (edit, init, rm, etc.)

## Usage Examples
- "How do I use the tar command?"
- "Show me docker cheatsheet"
- "Search for ssh-related commands"
- "List all available cheatsheets"
- "Find cheatsheets tagged with networking"

## Installation

```bash
brew install cheat
yes | cheat --init  # download community cheatsheets
```

## Key Features
- **Non-interactive**: All commands print to stdout — perfect for agents
- **Community cheatsheets**: 200+ cheatsheets for common commands
- **Search**: Keyword and regex search across all sheets
- **Tags**: Organize cheatsheets by topic (networking, git, docker, etc.)
- **Custom sheets**: Create your own personal cheatsheets
- **Go binary**: Single file, no runtime dependencies
