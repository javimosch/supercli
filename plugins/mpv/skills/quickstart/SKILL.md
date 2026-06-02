---
name: mpv
description: Free, open-source, cross-platform media player with powerful CLI
---

# mpv Plugin

mpv is a free, open-source, cross-platform media player with a powerful CLI interface and extensive format support via FFmpeg.

## Commands

- `mpv _ _` — Passthrough to mpv CLI

## Usage

### Play Media

```bash
# Play a local file
mpv _ _ video.mp4
mpv _ _ audio.mp3

# Play with no video (audio only)
mpv _ _ --no-video video.mp4

# Play from URL
mpv _ _ https://example.com/stream.m3u8

# Play a YouTube video (requires yt-dlp)
mpv _ _ https://youtube.com/watch?v=...
```

### Playback Control

```bash
# Start at specific position (seconds)
mpv _ _ --start=60 video.mp4

# Loop playback
mpv _ _ --loop=inf video.mp4
mpv _ _ --loop=3 video.mp4

# Set volume (0-100)
mpv _ _ --volume=50 audio.mp3

# Play in fullscreen
mpv _ _ --fullscreen video.mp4

# Play at specific speed
mpv _ _ --speed=1.5 video.mp4
```

### Subtitle and Audio Tracks

```bash
# Select subtitle track by ID
mpv _ _ --sid=1 video.mkv

# Select audio track by ID
mpv _ _ --aid=2 video.mkv

# Load external subtitle
mpv _ _ --sub-file=subtitles.srt video.mp4

# Load external audio
mpv _ _ --audio-file=audio.ac3 video.mp4
```

### Screenshots and Recording

```bash
# Take screenshot
mpv _ _ --screenshot-format=png --screenshot-template='%f-%p' video.mp4
# Press 's' during playback to capture screenshot

# Record to file
mpv _ _ --record-file=output.mp4 video.mp4
```

## Key Features
- **Wide format support** — Plays virtually any media format via FFmpeg
- **URL streaming** — Play media directly from URLs
- **YouTube integration** — Watch YouTube videos with yt-dlp
- **Subtitle support** — Multiple subtitle formats and external subtitles
- **Audio track selection** — Switch between audio tracks
- **Playback speed** — Adjustable playback speed (0.01x - 100x)
- **Screenshots** — Capture frames during playback
- **Scripting** — Extend with Lua and JavaScript scripts
- **Minimal UI** — Clean, distraction-free interface
- **Hardware decoding** — GPU-accelerated video decoding
- **Shaders** — Custom video filters and shaders
- **Config file** — ~/.config/mpv/mpv.conf for defaults

## Notes
- Interactive keys: Space (pause), f (fullscreen), s (screenshot), 9/0 (volume), [/] (speed), q (quit)
- Use yt-dlp (also a supercli plugin) for YouTube and streaming site support
- Config at ~/.config/mpv/mpv.conf
- OSC (On Screen Controller) shows by default, toggle with 'I' (maj i)
