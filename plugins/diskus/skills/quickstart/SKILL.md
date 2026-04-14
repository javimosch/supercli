---
name: diskus
description: Use this skill when the user wants to quickly compute disk usage of a directory, or needs a faster alternative to du -sh.
---

# diskus Plugin

A minimal, fast alternative to `du -sh`. Parallelized for speed.

## Commands

### Size
- `diskus size current` — Compute total size of current directory
- `diskus size apparent` — Compute apparent size (like du -sb)

## Usage Examples
- "Check disk usage of current directory"
- "Get apparent size"

## Installation

```bash
cargo install diskus
# or
brew install diskus
```

## Examples

```bash
# Default (disk usage)
diskus

# Apparent size
diskus --apparent-size

# Alternative
diskus -b
```

## Key Features
- ~10x faster than `du` on cold cache
- ~3x faster on warm cache
- Parallelized computation
- Matches `du -sh` behavior by default