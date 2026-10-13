---
name: kid3-cli
description: Use this skill when the user wants to read, edit, or batch-update audio file metadata (title, artist, album, track numbers, artwork) across MP3/FLAC/OGG/M4A files.
---

# kid3-cli Plugin

kid3-cli is the CLI of the Kid3 tag editor. It edits ID3v1/v2, Vorbis comments, MP4 and APE tags across many audio formats, driven by non-interactive -c command sequences - ideal for batch metadata fixes.

## Commands

### Tagging
- `kid3-cli tags read` — Print all tags: sc kid3-cli tags read song.mp3
- `kid3-cli tags run` — Run commands: sc kid3-cli tags run -c 'set artist "X"' -c save song.flac

### General
- `kid3-cli self version` — Print kid3-cli version
- `kid3-cli _ _` — Passthrough to kid3-cli

## Usage Examples
- "Show the tags of this mp3"
- "Set artist and album on all flac files in this folder"
- "Copy ID3v1 tags to ID3v2"

## Installation

```bash
sudo apt-get install -y kid3-cli
```

## Examples

```bash
kid3-cli -c get song.mp3
kid3-cli -c 'set title "New Title"' -c 'set artist "Someone"' -c save song.mp3
kid3-cli -c 'select *.flac' -c 'set genre Rock' -c save
```

## Key Features
- ID3v1/v2, Vorbis, MP4, APE tags
- Batch edits via -c sequences
- Works on mp3/flac/ogg/m4a/wma
- No GUI required
