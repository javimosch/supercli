---
name: stargaze
description: Use this skill when the user wants to cache, search, and manage GitHub stars from the terminal using a local embedded database.
---

# Stargaze Plugin

Cache and search your GitHub stars from the terminal using a local embedded database. Turns starred repos into a queryable local corpus that survives across machines and runs offline.

## Commands

### Sync & Cache
- `stargaze stars sync` — Fetch all starred repos via GitHub API and upsert into local cache
- `stargaze readmes fetch` — Fetch READMEs for already-cached repos
- `stargaze stars sync --with-readmes` — Fetch stars and READMEs in one operation

### Search & Query
- `stargaze stars search <query>` — Substring match across full_name, description, language, topics, and README text
- `stargaze stars show <repo>` — Pretty-print full cached JSON record for a repo (owner/name format)
- `stargaze stars list` — List all cached repos sorted by stargazer count
- `stargaze stars stats` — Show total cached count, last sync time, and top languages

### Server Modes
- `stargaze serve mcp` — Run Model Context Protocol stdio server for AI agents
- `stargaze api serve` — Run HTTP JSON API over the cache

## Usage Examples

```bash
# Initial setup - set GitHub token and sync stars
export GH_TOKEN=$(gh auth token)
stargaze stars sync --with-readmes

# Search for specific tools or topics
stargaze stars search postgres
stargaze stars search 'vector db' --lang rust --limit 10
stargaze stars search cli --topic hacktoberfest

# Show details for a specific repo
stargaze stars show rust-lang/rust

# List top repos and get statistics
stargaze stars list --limit 20
stargaze stars stats

# Run as MCP server for Claude/Cursor agents
stargaze serve mcp

# Run HTTP API for web integration
stargaze api serve --bind 127.0.0.1:7879
```

## Installation

```bash
cargo install stargaze
```

Requires Rust 1.76+. The release binary is fully static (aside from libc).

## Key Features

- **Local embedded database** using redb (pure-Rust key-value store with ACID transactions)
- **Offline search** across repo metadata and cached README text
- **Multi-surface access** - CLI, MCP server, and HTTP API
- **Semantic search** using vector embeddings (with --semantic flag)
- **Scheduled sync** support via systemd timers, launchd, or GitHub Actions
- **Cross-platform** - Linux, macOS, Windows prebuilt binaries available

## Authentication

Requires GitHub token (classic PAT or fine-grained token with read access to public metadata). Resolution order:
1. `--token` flag
2. `GH_TOKEN` environment variable
3. `GITHUB_TOKEN` environment variable

## Storage

Single database file at platform-specific locations:
- Linux: `~/.local/share/stargaze/stars.redb`
- macOS: `~/Library/Application Support/com.bkataru.stargaze/stars.redb`
- Windows: `%APPDATA%\bkataru\stargaze\data\stars.redb`