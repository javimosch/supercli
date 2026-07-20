---
name: tlrc
description: Use this skill when the user wants quick, practical CLI examples instead of full man pages — look up tldr pages for commands, update the cache, or list available pages.
---

# tlrc Plugin

Official Rust client for [tldr pages](https://github.com/tldr-pages/tldr) — concise, example-driven command help. Faster and more readable than `man` for everyday CLI tasks.

## Installation

```bash
brew install tlrc
# or
cargo install tlrc --locked
```

## Basic Usage

```bash
# Look up a command
tldr tar
tldr git rebase

# Platform-specific page
tldr --platform linux chmod

# Update local cache
tldr --update

# List all cached pages
tldr --list
```

## Usage Examples

- "Show me practical tar examples"
- "How do I use git stash?"
- "Update my tldr cache"

## SuperCLI

```bash
sc tldr page show tar
sc tldr cache list
sc plugins learn tlrc
```
