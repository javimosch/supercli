---
name: tldr
description: Simplified, community-driven man pages
---
# tldr Plugin

Simplified man pages with practical examples. Quick lookups for common CLI tools.

## Commands
- `tldr <resource> <action>` — Execute tldr commands
- `tldr command show` — Show tldr page for a command
- `tldr cache update` — Update the tldr pages cache
- `tldr cache list` — List all available tldr commands
- `tldr self version` — Print tldr version
- `tldr _ _` — Passthrough to tldr CLI

## Basic Usage

```bash
# Show help for a command
sc tldr command show --command tar
sc tldr command show --command find

# Update local cache
sc tldr cache update

# List all available commands
sc tldr cache list

# Passthrough
sc tldr _ _ -- tar -xzf archive.tar.gz
```
