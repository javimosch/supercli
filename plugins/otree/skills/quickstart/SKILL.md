---
name: otree
description: Use this skill when the user wants to explore or navigate structured data (JSON, YAML, TOML) interactively in the terminal — inspect large config files, API responses, or nested documents as a collapsible tree.
---

# otree Plugin

Interactive TUI to view JSON, YAML, and TOML as a navigable tree. Faster than scrolling raw text for deeply nested documents.

## Installation

```bash
cargo install otree
# or
brew install otree
```

Download binaries from [GitHub Releases](https://github.com/fioncat/otree/releases).

## Basic Usage

```bash
# Open a file
otree config.json

# Pipe structured data
curl -s https://api.example.com/data | otree

# YAML or TOML
otree docker-compose.yml
otree Cargo.toml
```

## Key Bindings

- `j/k` or `↓/↑` — Move cursor
- `h/l` or `←/→` — Collapse/expand node
- `Enter` — Toggle expand/collapse
- `/` — Search
- `q` — Quit

## Usage Examples

- "Show me this JSON response as a tree"
- "Navigate the nested keys in package.json"
- "Inspect this YAML config interactively"

## SuperCLI

```bash
sc otree _ _ config.json
sc plugins learn otree
```
