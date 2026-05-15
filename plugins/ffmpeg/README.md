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
| `ffmpeg video speed` | Change playback speed (slow-mo / fast-forward) |
| `ffmpeg video jump-cut` | Remove selected time ranges (jump cuts) |
| `ffmpeg video overlay` | Overlay logo/image with position and timing |
| `ffmpeg video subtitle` | Burn subtitles into video (ASS/SRT) |
| `ffmpeg video slideshow` | Create video slideshow from images with audio |
| `ffmpeg video hw-encode` | Hardware-accelerated encoding (NVENC/QSV) |

### Audio Operations

| Command | Description |
|---------|-------------|
| `ffmpeg audio extract` | Extract audio track from video |
| `ffmpeg audio mix` | Mix background music under original audio |

### Media Inspection

| Command | Description |
|---------|-------------|
| `ffmpeg media inspect` | Get detailed metadata as JSON |
| `ffmpeg media storyboard` | Generate storyboard thumbnails from scene changes |

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

# Speed up to 2x
supercli ffmpeg video speed --input video.mp4 --output fast.mp4 --speed 2.0

# Slow motion (0.5x)
supercli ffmpeg video speed --input video.mp4 --output slomo.mp4 --speed 0.5

# Jump cut — keep only selected time ranges
supercli ffmpeg video jump-cut --input video.mp4 --output cut.mp4 \
  --timestamps '["0-5.7","11-18"]'

# Overlay a logo (bottom-right, first 10 seconds)
supercli ffmpeg video overlay --input video.mp4 --output branded.mp4 \
  --overlay logo.png --position bottomright --start_time 0 --end_time 10

# Burn subtitles
supercli ffmpeg video subtitle --input video.mp4 --output subbed.mp4 \
  --subtitle captions.srt --font_size 28

# Create slideshow with audio and fade transitions
supercli ffmpeg video slideshow \
  --images '["photo1.jpg","photo2.jpg","photo3.jpg"]' \
  --audio background.mp3 --output slideshow.mp4 --duration 4

# Hardware-accelerated encoding (auto-detect GPU)
supercli ffmpeg video hw-encode --input video.mp4 --output gpu.mp4

# Hardware encoding with Nvidia NVENC / HEVC
supercli ffmpeg video hw-encode --input video.mp4 --output gpu_265.mp4 \
  --encoder nvenc --codec hevc

# Mix background music under original audio
supercli ffmpeg audio mix --input video.mp4 --output mixed.mp4 \
  --music background.mp3 --volume 0.15

# Generate storyboard tile (scene changes in 3x3 grid)
supercli ffmpeg media storyboard --input video.mp4 \
  --output storyboard.jpg --mode tile --tile_cols 3 --tile_rows 3

# Extract keyframes as tiled image
supercli ffmpeg media storyboard --input video.mp4 \
  --output keyframes.jpg --mode keyframes
```

## Options

| Command | Option | Default | Description |
|---------|--------|---------|-------------|
| convert | `--codec` | libx264 | Video codec (libx264, libx265, copy) |
| convert | `--audio_codec` | aac | Audio codec (aac, mp3, copy) |
| convert | `--preset` | medium | Encoding preset (ultrafast → veryslow) |
| convert | `--crf` | 23 | Quality (0-51, lower = better) |
| resize | `--width` | - | Target width in pixels |
| resize | `--height` | - | Target height in pixels |
| trim | `--start` | 0 | Start time (seconds or HH:MM:SS) |
| trim | `--duration` | - | Duration (seconds or HH:MM:SS) |
| thumbnail | `--timestamp` | 1 | Thumbnail capture time (seconds) |
| gif | `--fps` | 10 | GIF frame rate |
| gif | `--start` | - | GIF start time |
| gif | `--duration` | - | GIF duration |
| speed | `--speed` | 1.0 | Speed multiplier (0.5 = half, 2.0 = double) |
| jump-cut | `--timestamps` | - | JSON array of ranges to KEEP |
| overlay | `--overlay` | - | Overlay image path |
| overlay | `--position` | bottomright | Position: topleft, topright, bottomleft, bottomright, center |
| overlay | `--start_time` | - | Overlay start time (seconds) |
| overlay | `--end_time` | - | Overlay end time (seconds) |
| subtitle | `--subtitle` | - | Subtitle file path (.srt, .ass) |
| subtitle | `--font_size` | 24 | Subtitle font size |
| subtitle | `--font_name` | Poppins | Subtitle font name |
| slideshow | `--images` | - | JSON array of image paths |
| slideshow | `--duration` | 5 | Duration per image (seconds) |
| slideshow | `--transition` | fade | xfade transition type |
| hw-encode | `--encoder` | auto | Encoder: nvenc, qsv, auto |
| hw-encode | `--codec` | h264 | Codec: h264, hevc/h265 |
| hw-encode | `--quality` | medium | Software fallback preset |
| audio mix | `--music` | - | Background music file |
| audio mix | `--volume` | 0.2 | Music volume (0.0-1.0) |
| storyboard | `--mode` | single | Mode: single, tile, keyframes |
| storyboard | `--sensitivity` | 0.4 | Scene change sensitivity (0-1) |
| storyboard | `--tile_cols` | 4 | Tile grid columns |
| storyboard | `--tile_rows` | 4 | Tile grid rows |

## Notes

- All commands use `-y` flag — outputs are overwritten without prompting
- Trim and concat use `-c copy` for fast, lossless operations
- Use `--codec copy` for instant processing without re-encoding
- GIF uses palette generation for better color quality (256 colors)
- JSON output available with `--json` flag
- Speed command requires `bc` or `python3` for math
- Hardware encoding auto-detects Nvidia → Intel QSV → software fallback
- Storyboard `scene` mode detects scene changes; `keyframes` mode uses I-frames

## Requirements

- `ffmpeg` CLI tool
- `ffprobe` CLI tool (included with FFmpeg)
- `python3` (required by slideshow, jump-cut, and speed commands)
- `bc` or `awk` (fallback for speed command math)
