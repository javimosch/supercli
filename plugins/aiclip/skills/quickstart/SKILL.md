# Aiclip Plugin Quickstart

## Overview
Aiclip is an AI-powered CLI that translates natural language into safe, reviewable ffmpeg commands.

## Commands

### Version
- `aiclip command version` — Show version information

### Describe
- `aiclip command describe` — Get AI-generated description of a media file

### Generate
- `aiclip command generate` — Generate a safe ffmpeg command from natural language

## Usage Examples

```bash
# Show version
supercli aiclip command version

# Describe a media file
supercli aiclip command describe --input video.mp4

# Generate an ffmpeg command from natural language
supercli aiclip command generate --prompt "Convert video to 720p MP4"

# More complex example
supercli aiclip command generate --prompt "Extract audio and reduce quality to 128kbps"
```

## Arguments

| Command | Argument | Required | Description |
|---------|----------|----------|-------------|
| describe | `--input` | Yes | Media file to describe |
| generate | `--prompt` | Yes | Natural language description of desired ffmpeg operation |

## Notes
- Generated ffmpeg commands are safe and reviewable before execution
- aiclip requires an AI backend (configured via environment variables)
- Commands are meant to be reviewed before running with actual ffmpeg
