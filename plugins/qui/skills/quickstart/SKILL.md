---
name: qui
description: Use this skill when the user wants to manage qBittorrent via web UI
---

# Qui Plugin

manage qBittorrent via web UI

## Commands
- `qui self version` — Print qui version
- `qui _ _` — Passthrough to qui CLI

## Usage Examples
- "Start the qBittorrent web interface"
- "Add a torrent via the web UI"
- "Monitor downloads"

## Installation

```bash
go install github.com/nicholasgasior/qui@latest
```

## Examples
```bash
qui --port 8080
qui add torrent_file.torrent
qui status
```

## Key Features
- Single binary web UI
- Lightweight and fast
- Full qBittorrent control
- Mobile-friendly interface
