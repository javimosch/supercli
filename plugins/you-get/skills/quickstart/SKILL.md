---
name: you-get
description: Use this skill when the user wants to download video, audio, or images from YouTube and other media sites, or inspect available stream formats.
---

# you-get Plugin

you-get downloads media from hundreds of sites with one command — point it at a page URL and it extracts the best stream, with -i to preview formats first.

## Commands

- `you-get self version` — Print you-get version
- `you-get media info` — Show available streams/qualities for a URL without downloading (you-get -i <url>)
- `you-get media download` — Download media from a URL (you-get <url>; -o output dir, -O filename, --format=, -x proxy)
- `you-get _ _` — Passthrough to you-get CLI

## Usage Examples

- "List the available qualities for this YouTube video"
- "Download this video to ~/Videos"
- "Grab just the audio stream of this clip"

## Installation

```bash
pip install you-get
# or: pipx install you-get
# or: brew install you-get
```

## Examples

```bash
you-get -i 'https://www.youtube.com/watch?v=...'   # list streams
you-get 'https://www.youtube.com/watch?v=...'       # download best
you-get -o ~/Videos -O clip 'https://vimeo.com/...' # dir + filename
you-get --player vlc 'https://...'                  # stream, don't save
```

## Key Features

- Hundreds of supported sites: YouTube, Vimeo, Twitter/X, Bilibili, Instagram...
- -i shows every stream/quality so you can pick with --format
- Proxy support (-x/-s), cookies (-c), resume, and --player streaming mode
