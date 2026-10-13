---
name: memo
description: Use this skill when the user wants to write, search, or browse Markdown notes/memos with the mattn memo CLI.
---

# memo Plugin

memo stores notes as plain Markdown files under a memodir (`~/.config/memo/_posts` by default, configurable), lists them through a fuzzy picker, greps contents, and can serve a local web UI.

## Commands

### Notes
- `memo notes new` — Create a memo (prompts for a title, opens `$EDITOR`)
- `memo notes list` — Pick a memo through the configured picker (fzf/peco/percol)
- `memo notes grep` — Full-text search all memos (`memo grep <pattern>`)
- `memo notes cat` — Print a picked memo to stdout
- `memo notes edit` — Open a picked memo in `$EDITOR`

### Server & Config
- `memo server serve` — Local HTTP UI for browsing memos
- `memo config edit` — Edit `~/.config/memo/config.toml`
- `memo _ _` — Passthrough (`memo delete`, `memo help`, ...)

## Usage Examples

- "Create a note about today's standup"
- "Search my memos for the database migration steps"
- "Show me my memos in the browser"
- "What did I write about that cert renewal?"

## Installation

```bash
go install github.com/mattn/memo@latest
```

## Examples

```bash
memo new                          # prompts for a title, opens $EDITOR
memo grep "ssh config"            # search memo contents
memo list                         # fuzzy-pick a memo to view
memo serve                        # browse at http://localhost:8080
```

## Key Features

- Plain Markdown files in one directory — trivially git-versioned
- Picker-agnostic: works with fzf, peco, or percol
- Built-in `memo serve` web UI for reading/searching in a browser
- `memo grep` is a real grep over the memodir (fast, pipe-friendly)
