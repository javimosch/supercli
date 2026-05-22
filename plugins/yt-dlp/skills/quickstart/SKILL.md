---
name: yt-dlp
description: Use this skill when the user wants to download videos/audio, extract metadata, or work with media from YouTube and 1000+ other sites using yt-dlp.
---

# yt-dlp Plugin

Feature-rich command-line audio/video downloader with support for thousands of sites. Fork of youtube-dl with active development and enhanced features.

## Commands
- `yt-dlp self version` — Print yt-dlp version
- `yt-dlp _ _` — Passthrough to yt-dlp CLI for all operations

## Installation

```bash
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod +x /usr/local/bin/yt-dlp
```

Alternative methods:
- `pip install yt-dlp`
- `brew install yt-dlp`

## Usage Examples

```bash
# Get video metadata as JSON
sc yt-dlp _ _ -- -j --no-warnings "https://www.youtube.com/watch?v=xxx"

# Download video (quiet mode)
sc yt-dlp _ _ -- --quiet --no-warnings "https://www.youtube.com/watch?v=xxx"

# Get playlist metadata as JSON
sc yt-dlp _ _ -- -J --no-warnings "https://www.youtube.com/playlist?list=xxx"

# Download best quality with subtitles
sc yt-dlp _ _ -- -f "best" --write-subs "URL"

# Download audio only
sc yt-dlp _ _ -- -x --audio-format mp3 "URL"
```

## Key Features
- Supports 1000+ sites (YouTube, Vimeo, Twitch, etc.)
- JSON output for metadata extraction (`-j` for single video, `-J` for playlists)
- Format selection and conversion
- Subtitle and metadata download
- Playlist handling
- Non-interactive, scriptable operation

## Common yt-dlp Options
- `-j` / `--dump-json` - Print JSON for each video
- `-J` / `--dump-single-json` - Print JSON for playlist
- `--quiet` - Silent mode
- `--no-warnings` - Suppress warnings
- `-f FORMAT` - Select format
- `-x` - Extract audio
- `--write-subs` - Download subtitles
