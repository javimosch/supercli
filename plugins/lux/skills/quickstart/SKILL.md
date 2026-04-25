---
name: lux
description: Use this skill when the user wants to download videos from YouTube and other supported sites.
---

# lux Plugin

Fast and simple video download library and CLI tool written in Go.

## Commands

### Downloading
- `lux self version` — Print lux version
- `lux download video <url>` — Download video from URL
- `lux _ _` — Passthrough to lux CLI

## Usage Examples

- "Download this YouTube video"
- "Download a video playlist"
- "Download video with specific quality"

## Installation

```bash
go install github.com/iawia002/lux@latest
```

## Examples

```bash
# Download a video
lux https://youtube.com/watch?v=example

# Download multiple videos
lux url1 url2 url3

# Download with options
lux --url-only --info https://youtube.com/watch?v=example
```

## Key Features
- Fast concurrent downloads
- Support for multiple video sites
- Playlist downloads
- Resume capability
- Multiple format options
