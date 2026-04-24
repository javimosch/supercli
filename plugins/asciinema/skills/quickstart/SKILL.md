---
name: asciinema
description: Use this skill when the user wants to record terminal sessions, play back asciicasts, or share terminal recordings online.
---

# asciinema Plugin

Terminal session recorder, streamer and player. Record terminal sessions and share them as asciicasts. Perfect for tutorials, demos, and bug reports.

## Commands

### Session Management
- `asciinema session record` — Record terminal session
- `asciinema session play` — Play recorded session
- `asciinema session upload` — Upload session to asciinema.org

### Utility
- `asciinema _ _` — Passthrough to asciinema CLI

## Usage Examples
- "Record this terminal session"
- "Play back the asciicast"
- "Upload recording to asciinema.org"
- "Record specific command"

## Installation

```bash
brew install asciinema
```

Or via Cargo:
```bash
cargo install asciinema-cli
```

## Examples

```bash
# Record terminal session
asciinema session record

# Record to specific file
asciinema session record demo.cast

# Record specific command
asciinema session record --command "npm test"

# Set recording title
asciinema session record --title "API Demo" demo.cast

# Set idle time limit
asciinema session record --idle-time-limit 2 demo.cast

# Overwrite existing file
asciinema session record --overwrite demo.cast

# Append to existing file
asciinema session record --append demo.cast

# Play recording
asciinema session play demo.cast

# Play with idle time limit
asciinema session play demo.cast --idle-time-limit 1

# Play at 2x speed
asciinema session play demo.cast --speed 2.0

# Upload to asciinema.org
asciinema session upload demo.cast

# Any asciinema command with passthrough
asciinema _ _ rec demo.cast --title "Demo"
asciinema _ _ play demo.cast --speed 1.5
```

## Key Features
- **Simple recording** — Record with `asciinema rec`
- **Playback control** — Adjust speed and idle time
- **Sharing** — Upload to asciinema.org
- **Asciicast format** — Lightweight JSON format
- **Custom commands** — Record specific commands
- **Title support** — Add titles to recordings
- **Idle time limiting** — Skip idle periods
- **Append mode** — Add to existing recordings
- **Streaming** — Real-time streaming support
- **Cross-platform** — Works on Linux, macOS, Windows

## Notes
- Default uploads to asciinema.org for sharing
- Local recordings saved as .cast files
- Can be embedded in websites
- Supports terminal colors and escape codes
- Configuration file at ~/.config/asciinema/config
- Can be used for tutorials and bug reports
