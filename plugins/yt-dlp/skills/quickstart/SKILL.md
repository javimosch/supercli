---
name: yt-dlp
description: Use this skill when the user wants to download videos/audio, extract metadata, or work with media from YouTube and 1000+ other sites using yt-dlp.
---

# yt-dlp Plugin

Feature-rich command-line audio/video downloader with support for thousands of sites. Fork of youtube-dl with active development and enhanced features.

## Commands
- `yt-dlp self version` — Print yt-dlp version
- `yt-dlp download video <args>` — Download video (passthrough: yt-dlp --quiet --no-warnings <URL> [options])
- `yt-dlp info video <args>` — Get video metadata as JSON (passthrough: yt-dlp -j --no-warnings <URL>)

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
sc yt-dlp info video "https://www.youtube.com/watch?v=xxx"

# Download video (quiet mode)
sc yt-dlp download video "https://www.youtube.com/watch?v=xxx"

# Download with specific format
sc yt-dlp download video "-f best https://www.youtube.com/watch?v=xxx"

# Download audio only
sc yt-dlp download video "-x --audio-format mp3 https://www.youtube.com/watch?v=xxx"
```

## Key Features
- Supports 1000+ sites (YouTube, Vimeo, Twitch, etc.)
- JSON output for metadata extraction
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
