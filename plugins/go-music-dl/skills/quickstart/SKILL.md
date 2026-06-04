---
name: go-music-dl
description: Use this skill when the user wants to search and download music
---

# Go-music-dl Plugin

search and download music

## Commands
- `go-music-dl self version` — Print go-music-dl version
- `go-music-dl _ _` — Passthrough to go-music-dl CLI

## Usage Examples
- "Download this song"
- "Search for music by artist"
- "Download playlist"

## Installation

```bash
go install github.com/nicholasgasior/go-music-dl@latest
```

## Examples
```bash
go-music-dl search "Artist Name"
go-music-dl download "Song Title"
go-music-dl batch playlist.txt
```

## Key Features
- Multi-source music search
- High quality downloads
- Metadata extraction
- Batch download support
