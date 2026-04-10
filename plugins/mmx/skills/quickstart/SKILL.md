# mmx Usage Skill

Use the mmx plugin to generate text, images, video, speech, music, and search via the MiniMax AI Platform CLI.

## 1) Install and Authenticate

```bash
# Check if mmx is installed
mmx --version

# Install globally if needed
npm install -g mmx-cli

# Authenticate with API key
mmx auth login --api-key sk-xxxxx

# Or use environment variable
export MINIMAX_API_KEY=sk-xxxxx
```

Get API key: https://platform.minimax.io/subscribe/token-plan

## 2) Validate Setup

```bash
# Check authentication status
sc mmx auth status

# Show remaining quota
sc mmx quota show
```

## 3) Text / Chat

```bash
# Simple chat
sc mmx text chat --message "What is MiniMax?"

# With system prompt and streaming
sc mmx text chat --system "You are a coding assistant" --message "Write fizzbuzz in Go" --stream

# Multi-turn conversation
sc mmx text chat --message "user:Hi" --message "assistant:Hey!" --message "How are you?"

# JSON output for parsing
sc mmx text chat --message "Hello" --output json
```

## 4) Image Generation

```bash
# Simple image
sc mmx image generate --prompt "A cat in a spacesuit on Mars"

# Multiple images with aspect ratio
sc mmx image generate --prompt "Mountain landscape" --n 3 --aspect-ratio 16:9

# Custom dimensions (512-2048, multiple of 8)
sc mmx image generate --prompt "Wide landscape" --width 1920 --height 1080

# With prompt optimizer and watermark
sc mmx image generate --prompt "sunset" --prompt-optimizer --aigc-watermark

# Reproducible output with seed
sc mmx image generate --prompt "A castle" --seed 42
```

## 5) Video Generation

```bash
# Simple video (async - returns immediately)
sc mmx video generate --prompt "Ocean waves at sunset" --async --quiet

# Wait for completion and download
sc mmx video generate --prompt "A robot painting" --download robot.mp4

# I2V: First frame image-to-video
sc mmx video generate --prompt "Walk forward" --first-frame start.jpg

# S2V: Subject reference for character consistency
sc mmx video generate --prompt "A detective walking" --subject-image character.jpg

# SEF: Start-end frame interpolation (requires Hailuo-02)
sc mmx video generate --prompt "Walk forward" --first-frame start.jpg --last-frame end.jpg

# Check task status
sc mmx video task-get --task-id <task-id>

# Download completed video
sc mmx video download --file-id <file-id> --out video.mp4
```

## 6) Speech Synthesis

```bash
# Simple TTS
sc mmx speech synthesize --text "Hello, world!" --out hello.mp3

# With voice and speed control
sc mmx speech synthesize --text "Hi" --voice English_magnetic_voiced_man --speed 1.2

# List available voices
sc mmx speech voices

# Filter by language
sc mmx speech voices --language english

# Streaming audio (pipe to media player)
sc mmx speech synthesize --text "Stream me" --stream | mpv --no-terminal -

# From stdin
echo "Breaking news" | sc mmx speech synthesize --text-file - --out news.mp3
```

## 7) Music Generation

```bash
# Generate with lyrics
sc mmx music generate --prompt "Upbeat pop" --lyrics "[verse] La da dee, sunny day" --out song.mp3

# Auto-generate lyrics from prompt
sc mmx music generate --prompt "Indie folk, melancholic, rainy night" --lyrics-optimizer --out song.mp3

# Instrumental (no vocals)
sc mmx music generate --prompt "Cinematic orchestral" --instrumental --out bgm.mp3

# Detailed music parameters
sc mmx music generate \
  --prompt "Warm morning folk" \
  --vocals "male and female duet, harmonies in chorus" \
  --instruments "acoustic guitar, piano" \
  --bpm 95 \
  --lyrics-file song.txt \
  --out duet.mp3

# Cover generation from reference audio
sc mmx music cover --prompt "Jazz, piano, warm female vocal" --audio https://example.com/song.mp3 --out cover.mp3

# Local audio file
sc mmx music cover --prompt "Indie folk" --audio-file original.mp3 --out cover.mp3
```

## 8) Vision / Image Understanding

```bash
# Describe local image
sc mmx vision describe --image photo.jpg

# From URL
sc mmx vision describe --image https://example.com/photo.jpg --prompt "What breed is this dog?"

# With specific question
sc mmx vision describe --image photo.jpg --prompt "Extract all text from this image"

# Using pre-uploaded file ID
sc mmx vision describe --file-id file-123456789 --prompt "What is in this image?"
```

## 9) Web Search

```bash
# Simple search
sc mmx search query --q "MiniMax AI latest news"

# JSON output for parsing
sc mmx search query --q "latest AI developments" --output json
```

## 10) Configuration

```bash
# Show current config
sc mmx config show

# Set region (global or cn)
sc mmx config set --key region --value cn

# Export config schema
sc mmx config export-schema
```

## 11) Passthrough Mode

Use the passthrough command for options not explicitly mapped:

```bash
sc mmx _ _ --help
sc mmx _ _ text chat --message "Hello" --dry-run
```

## Common Workflows

### Agent-CI Mode (non-interactive)
```bash
# Set env var and run non-interactively
export MINIMAX_API_KEY=sk-xxxxx
sc mmx text chat --message "Hello" --output json --non-interactive
```

### Streaming Responses
```bash
# For real-time output in terminal
sc mmx text chat --message "Tell me a story" --stream

# Stream audio
sc mmx speech synthesize --text "Hello" --stream | mpv -
```

## Error Handling

mmx uses standard exit codes:
- 0: Success
- 1: General error
- 130: Interrupted (Ctrl+C)

For authentication issues, re-authenticate:
```bash
mmx auth logout
mmx auth login --api-key sk-xxxxx
```

## Dual Region Support

MiniMax supports two regions:
- Global: `--region global` (default) → api.minimax.io
- CN: `--region cn` → api.minimaxi.com

```bash
# Use CN region
sc mmx config set --key region --value cn

# Or via CLI flag
sc mmx text chat --message "Hello" --region cn
```
