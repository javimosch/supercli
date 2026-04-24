---
name: vhs
description: Use this skill when the user wants to record terminal sessions, create CLI demos, or generate terminal videos/GIFs.
---

# vhs Plugin

Your CLI home video recorder. Record terminal sessions as GIFs or videos using simple tape files. Perfect for demos, tutorials, and documentation.

## Commands

### Recording
- `vhs tape record` — Record terminal session from tape file
- `vhs tape validate` — Validate tape file syntax

### Utility
- `vhs _ _` — Passthrough to vhs CLI

## Usage Examples
- "Record this terminal session"
- "Create a demo video of this CLI tool"
- "Validate the tape file"
- "Record terminal as GIF"

## Installation

```bash
brew install vhs
```

Or via Go:
```bash
go install github.com/charmbracelet/vhs@latest
```

Requires ffmpeg for video output.

## Examples

```bash
# Record from tape file
vhs tape record demo.tape

# Specify output file
vhs tape record demo.tape --output demo.gif

# Record as MP4
vhs tape record demo.tape --output demo.mp4 --format mp4

# Record as WebM
vhs tape record demo.tape --output demo.webm --format webm

# Disable audio
vhs tape record demo.tape --no-audio

# Validate tape file
vhs tape validate demo.tape

# Any vhs command with passthrough
vhs _ _ demo.tape --output demo.gif
vhs _ _ validate demo.tape
```

## Tape File Example

```tape
Output demo.gif
Set FontSize 32
Set Width 1200
Set Height 600
Set Loop 3
Type "echo 'Hello, World!'"
Enter
Sleep 500ms
```

## Key Features
- **Simple syntax** — Declarative tape files for recording
- **Multiple formats** — GIF, MP4, WebM output
- **Customizable** — Font size, window size, colors
- **Looping** — Set loop count for GIFs
- **Typing simulation** — Realistic typing effects
- **Sleep commands** — Control timing
- **Screenshots** — Capture specific frames
- **Copy/paste** — Simulate clipboard operations
- **Environment variables** — Set environment for recording
- **Validation** — Check tape file syntax

## Notes
- Requires ffmpeg for video output
- Tape files use .tape extension
- Can be used in CI/CD for automated demos
- Supports all major platforms
- Configuration file at ~/.config/vhs/config.yml
