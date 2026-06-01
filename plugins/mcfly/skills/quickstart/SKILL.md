---
name: mcfly
description: Use this skill when the user wants to search shell history, find a command they ran before, or explore their terminal history with smart ranking.
---

# mcfly Plugin

Smart shell history search. Replaces Ctrl+R with neural ranking that learns from context, frequency, and recency.

## Commands

### Search
- `mcfly history search <query>` — Search shell history with neural ranking

### Manage
- `mcfly history dump` — Dump all shell history entries
- `mcfly history train` — Train mcfly model on current history

## Usage Examples
- "Find that docker command I ran yesterday"
- "Search my history for git rebase commands"
- "Dump my entire shell history"
- "Train mcfly on my history"

## Installation

```bash
cargo install mcfly
```

For shell integration, add to your `.bashrc`:

```bash
eval "$(mcfly init bash)"
```

## Examples

```bash
# Search history for a command
mcfly search docker compose

# Dump all history (json lines)
mcfly dump

# Train on history
mcfly train --train-all

# Shell integration (in .bashrc)
eval "$(mcfly init bash)"
```

## Key Features
- Neural network ranking for relevant results
- Works with bash, zsh, and fish
- Time-based and frequency-based ranking
- Fuzzy matching
- Lightweight and fast (Rust)
- Session-aware history context
