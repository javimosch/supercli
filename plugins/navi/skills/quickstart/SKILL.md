---
name: navi
description: Use this skill when the user wants to search command-line cheatsheets, find command examples, or browse shell snippets.
---

# navi Plugin

An interactive cheatsheet tool for the command-line. Search, browse, and execute command-line snippets with interactive fuzzy finding.

## Commands

### Cheatsheet Search
- `navi cheat search` — Search command-line cheatsheets

### Utility
- `navi _ _` — Passthrough to navi CLI

## Usage Examples
- "Search cheatsheets"
- "Find command examples"
- "Browse shell snippets"
- "Command-line cheatsheet"

## Installation

```bash
brew install navi
```

Or via Cargo:
```bash
cargo install navi
```

## Examples

```bash
# Search cheatsheets
navi cheat search

# Search with query
navi cheat search --query "git rebase"

# Best match
navi cheat search --best-match

# Any navi command with passthrough
navi _ _ --query "docker"
navi _ _ --best-match --query "kubectl"
```

## Key Features
- **Interactive** - Fuzzy finding
- **Cheatsheets** - Community snippets
- **Search** - Fast search
- **Execute** - Run commands
- **Browse** - Browse snippets
- **Custom** - Custom cheatsheets
- **Shell** - Shell integration
- **Fast** - Quick access
- **Productive** - Boost productivity
- **Community** - Large repository

## Notes
- Great for discovering commands
- Supports custom cheatsheets
- Integrates with shell
- Perfect for learning
