# FFmpeg Plugin Quickstart

## Overview
FFmpeg plugin provides semantic commands for video/audio manipulation. All arguments use `--flag value` syntax (supercli convention).

## Commands

### Video Operations
- `ffmpeg video convert` — Convert between formats
- `ffmpeg video resize` — Scale to specific dimensions
- `ffmpeg video trim` — Cut time range (lossless)
- `ffmpeg video thumbnail` — Extract a single frame
- `ffmpeg video gif` — Create animated GIF
- `ffmpeg video concat` — Join multiple videos

### Audio Operations
- `ffmpeg audio extract` — Pull audio from video

### Media Inspection
- `ffmpeg media inspect` — Get metadata as JSON

## Usage Examples

```bash
# Inspect media (JSON metadata)
supercli ffmpeg media inspect --input video.mp4 --json

# Convert video
supercli ffmpeg video convert --input video.avi --output video.mp4

# Convert with options
supercli ffmpeg video convert --input video.mkv --output video.mp4 \
  --codec libx265 --crf 28 --preset slow

# Resize video
supercli ffmpeg video resize --input video.mp4 --output 720p.mp4 \
  --width 1280 --height 720

# Trim video (seconds or HH:MM:SS)
supercli ffmpeg video trim --input video.mp4 --output clip.mp4 \
  --start 5 --duration 30

# Extract thumbnail
supercli ffmpeg video thumbnail --input video.mp4 --output thumb.jpg \
  --timestamp 5

# Create GIF
supercli ffmpeg video gif --input video.mp4 --output animated.gif \
  --fps 10 --duration 5

# Extract audio
supercli ffmpeg audio extract --input video.mp4 --output audio.m4a

# Join videos
supercli ffmpeg video concat \
  --inputs '["intro.mp4","main.mp4"]' \
  --output combined.mp4
```

## Options

| Command | Option | Default | Description |
|---------|--------|---------|-------------|
| convert | `--codec` | libx264 | Video codec (libx264, libx265, copy) |
| convert | `--audio_codec` | aac | Audio codec (aac, mp3, copy) |
| convert | `--preset` | medium | Encoding speed |
| convert | `--crf` | 23 | Quality (0-51, lower = better) |
| resize | `--width` | - | Target width |
| resize | `--height` | - | Target height |
| trim | `--start` | - | Start time (seconds or HH:MM:SS) |
| trim | `--duration` | - | Duration (seconds or HH:MM:SS) |
| thumbnail | `--timestamp` | 1 | Capture time (seconds or HH:MM:SS) |
| gif | `--fps` | 10 | Frame rate |
| gif | `--start` | - | Start time |
| gif | `--duration` | - | Duration |

## Pitfalls Discovered

1. **Videos without audio**: `audio extract` will fail on video-only files (no audio stream)
2. **HH:MM:SS format**: Both `start` and `timestamp` accept seconds OR HH:MM:SS format
3. **Concat requires identical codecs**: All input videos must have same codec/resolution for lossless concat
4. **Overwrite protection disabled**: All commands use `-y` flag — outputs are overwritten silently
5. **Timeout limit**: Max timeout is 180s (3 min) for process adapter
6. **Paths with spaces**: Wrap paths in quotes for best compatibility

## Notes
- All commands use `-y` flag — outputs are overwritten
- Trim/concat use `-c copy` for fast lossless operations
- Audio extract re-encodes to AAC for container compatibility
- JSON output available with `--json` flag on inspect
