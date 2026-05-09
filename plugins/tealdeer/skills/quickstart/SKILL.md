---
name: tealdeer
description: Use this skill when the user wants quick, example-based documentation for a CLI tool — how to use tar, ffmpeg, git, docker, or any common command. Also useful for listing available tldr pages, managing the cache, or viewing raw markdown docs.
---

# Tealdeer Plugin

Fast Rust tldr client — simplified, example-based man pages for any CLI tool. Offline after first cache update.

## Commands

### Self
- `tealdeer self version` — Print version

### Pages
- `tealdeer page show` — Show tldr page for a command (passthrough: `tldr <command> [--platform linux]`)
- `tealdeer page raw` — Show raw markdown (passthrough: `tldr --raw <command>`)

### Cache
- `tealdeer cache update` — Update local page cache from tldr-pages
- `tealdeer cache list` — List all cached commands
- `tealdeer cache clear` — Clear the local cache

### Config
- `tealdeer config paths` — Show file and directory paths used by tealdeer

### Passthrough
- `tealdeer _ _` — Direct passthrough for any tldr command

## Usage Examples
- "How do I use tar to extract a file?"
- "Show me git log examples"
- "List all available tldr commands"
- "Update the tldr cache for offline use"
- "Show the raw markdown for the ffmpeg page"
- "Where does tealdeer store its config files?"

## Installation

```bash
cargo install tealdeer
tldr --update
```

## Examples

```bash
# Show a command page
tldr tar
tldr git log
tldr ffmpeg
tldr docker compose

# Show with specific platform
tldr --platform linux tar

# Show raw markdown
tldr --raw tar

# List all available pages
tldr --list

# Update offline cache
tldr --update

# Show config paths
tldr --show-paths
```

## Key Features
- Fastest tldr client written in Rust
- Offline page cache after initial update
- `--quiet` flag for minimal output
- Multi-platform support (linux, macos, windows, etc.)
- Language override support
- Custom page editing with `--edit-page`
- Raw markdown output via `--raw`
- Color output control (`--color always/auto/never`)
