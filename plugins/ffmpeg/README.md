# FFmpeg Plugin for SuperCLI

Semantic commands for FFmpeg — video/audio manipulation made simple.

## Installation

```bash
# Install FFmpeg first (if not installed)
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Install the plugin
supercli plugins install ./plugins/ffmpeg --on-conflict replace --json
```

## Commands

### Video Operations

| Command | Description |
|---------|-------------|
| `ffmpeg video convert` | Convert between formats (mp4, mkv, avi, webm, mov) |
| `ffmpeg video resize` | Scale to specific dimensions |
| `ffmpeg video trim` | Cut time range (lossless with `-c copy`) |
| `ffmpeg video thumbnail` | Extract a single frame |
| `ffmpeg video gif` | Create animated GIF |
| `ffmpeg video concat` | Join multiple videos |

### Audio Operations

| Command | Description |
|---------|-------------|
| `ffmpeg audio extract` | Extract audio track from video |

### Media Inspection

| Command | Description |
|---------|-------------|
| `ffmpeg media inspect` | Get detailed metadata as JSON |

## Usage Examples

```bash
# Get media info as JSON
supercli ffmpeg media inspect --input video.mp4 --json

# Convert to H.264 MP4
supercli ffmpeg video convert --input video.avi --output video.mp4

# Convert with custom settings
supercli ffmpeg video convert --input video.mkv --output video.mp4 \
  --codec libx265 --crf 28 --preset slow

# Resize to 720p
supercli ffmpeg video resize --input video.mp4 --output 720p.mp4 \
  --width 1280 --height 720

# Trim first 30 seconds
supercli ffmpeg video trim --input video.mp4 --output clip.mp4 \
  --start 0 --duration 30

# Extract thumbnail at 5 seconds
supercli ffmpeg video thumbnail --input video.mp4 --output frame.jpg \
  --timestamp 5

# Create GIF (10fps, 480px width)
supercli ffmpeg video gif --input video.mp4 --output animated.gif --fps 10

# Extract audio as MP3
supercli ffmpeg audio extract --input video.mp4 --output audio.mp3

# Join videos together
supercli ffmpeg video concat --inputs '["intro.mp4","main.mp4"]' --output combined.mp4
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--codec` | libx264 | Video codec (libx264, libx265, copy) |
| `--audio_codec` | aac | Audio codec (aac, mp3, copy) |
| `--preset` | medium | Encoding preset (ultrafast → veryslow) |
| `--crf` | 23 | Quality (0-51, lower = better) |
| `--width` | - | Target width in pixels |
| `--height` | - | Target height in pixels |
| `--start` | 0 | Start time (seconds or HH:MM:SS) |
| `--duration` | - | Duration (seconds or HH:MM:SS) |
| `--timestamp` | 1 | Thumbnail capture time (seconds) |
| `--fps` | 10 | GIF frame rate |

## Notes

- All commands use `-y` flag — outputs are overwritten without prompting
- Trim and concat use `-c copy` for fast, lossless operations
- Use `--codec copy` for instant processing without re-encoding
- GIF uses palette generation for better color quality (256 colors)
- JSON output available with `--json` flag

## Requirements

- `ffmpeg` CLI tool
- `ffprobe` CLI tool (included with FFmpeg)
