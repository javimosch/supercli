---
name: mcfly
description: Use this skill when the user wants to search shell history intelligently, analyze command patterns, or replace their default ctrl-r history search with AI-powered prioritization.
---

# McFly Plugin

Intelligent shell history search with neural network prioritization. McFly learns from your usage patterns to suggest the most relevant commands first.

## Commands

### History Management
- `mcfly history dump` — Export complete history as JSON
- `mcfly history dump-since` — Export history from a specific date
- `mcfly history dump-csv` — Export history as CSV format
- `mcfly history search` — Search history with regex patterns

### Version
- `mcfly self version` — Show McFly version

## Usage Examples
- "Export my shell history as JSON"
- "Find all git commands I ran last week" 
- "Search for cargo commands in history"
- "Show my command history since yesterday"

## Installation

```bash
# Install via Cargo
cargo install mcfly

# Or via Homebrew
brew install mcfly

# Setup shell integration (required for ctrl-r replacement)
echo 'eval "$(mcfly init bash)"' >> ~/.bashrc
# or for zsh:
echo 'eval "$(mcfly init zsh)"' >> ~/.zshrc
# or for fish:
echo 'mcfly init fish | source' >> ~/.config/fish/config.fish
```

## Examples

```bash
# Export all history as JSON
mcfly dump

# Export history from specific date
mcfly dump --since '2023-01-01'

# Export with date range
mcfly dump --since '2023-01-01' --before '2023-12-31'

# Search for specific commands
mcfly dump --regex '^git'

# Export as CSV
mcfly dump --format csv

# Combine filters
mcfly dump --regex '^cargo run' --since '2023-09-12 09:15:30'
```

## Features

- **Neural network prioritization** — Learns from your patterns
- **Context-aware** — Considers current directory and recent commands
- **Smart ranking** — Factors in frequency, recency, and success rate
- **Unicode support** — Works with international characters
- **Shell integration** — Replaces ctrl-r with intelligent search
- **History preservation** — Maintains your original history files

## Configuration

McFly can be configured via environment variables:

- `MCFLY_LIGHT=TRUE` — Enable light mode color scheme
- `MCFLY_FUZZY=2` — Enable fuzzy search (0=off, higher=fuzzier)
- `MCFLY_RESULTS=50` — Maximum results to show (default: 30)
- `MCFLY_KEY_SCHEME=vim` — Use vim key bindings (default: emacs)
- `MCFLY_INTERFACE_VIEW=BOTTOM` — Show interface at bottom

## Database Location

- **macOS**: `~/Library/Application Support/McFly/history.db`
- **Linux**: `~/.local/share/mcfly/history.db` 
- **Windows**: `%LOCALAPPDATA%\McFly\data\history.db`
- **Legacy**: `~/.mcfly/` (if it exists)