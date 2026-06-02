---
name: tldr
description: Simplified, community-driven man pages
---
# tldr Plugin

Simplified man pages with practical examples. Quick lookups for common CLI tools.

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
