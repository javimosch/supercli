---
name: n-m3u8dl-re
description: Use this skill when the user wants to download or record HLS/DASH/MSS streaming media (m3u8/mpd) with N_m3u8DL-RE.
---

# n-m3u8dl-re Plugin

N_m3u8DL-RE downloads adaptive streams (HLS m3u8, DASH mpd, MSS) — encrypted or not — with track selection, live recording, and muxing to mp4/mkv. Binary name is `N_m3u8DL-RE` (case-sensitive).

## Commands

### Downloading
- `n-m3u8dl-re download run <url>` — Download a stream manifest
- `n-m3u8dl-re download best <url>` — Auto-select best audio/video (`--auto-select`)
- `n-m3u8dl-re live record <url>` — Live recording with real-time merge
- `n-m3u8dl-re _ _` — Passthrough (`--key`, `-M format=mp4`, `--thread-count`, ...)

## Usage Examples

- "Download this m3u8 video to my downloads folder"
- "Record this live stream"
- "Grab the best-quality track from this mpd manifest"

## Installation

```bash
# GitHub releases — self-contained binary per platform
curl -s https://api.github.com/repos/nilaoda/N_m3u8DL-RE/releases/latest \
  | grep -o 'https://[^"]*linux_x64[^"]*\.tar\.gz' | head -1 \
  | xargs curl -sSfL | tar xz -C ~/.local/bin
# Optional: apt install ffmpeg  (muxing), mp4decrypt/mp4box (decryption output)
```

## Examples

```bash
# Basic download
N_m3u8DL-RE "https://site.com/master.m3u8" --save-dir ./out --save-name movie

# Best tracks + mux to mp4 via ffmpeg
N_m3u8DL-RE "https://site.com/video.mpd" --auto-select -M format=mp4

# Supply AES/decryption key
N_m3u8DL-RE "https://site.com/enc.m3u8" --key KID:KEY

# Select specific tracks (video res <= 1080p, one audio lang)
N_m3u8DL-RE "https://site.com/master.m3u8" --select-video "res=1080*" --select-audio "for=best"

# Live recording
N_m3u8DL-RE --live-real-time-merge "https://site.com/live.m3u8"

# Custom headers / thread count
N_m3u8DL-RE "URL" -H "Referer: https://site.com" --thread-count 16
```

## Key Features

- HLS, DASH, and MSS support; local manifest files too
- AES-128/SAMPLE-AES decryption with `--key`; DRM-track skip or decrypt via supplied keys
- `--select-video/-audio/-subtitle` filters, `--drop-video`, auto-select best
- Live mode (`--live-real-time-merge`, `--live-record-limit`, `--live-keep-segments`)
- Mux output with `-M format=mp4|mkv muxer=ffmpeg|mp4box`; resume with `--check-segments-count`
