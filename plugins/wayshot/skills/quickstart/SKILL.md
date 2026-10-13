---
name: wayshot
description: Use this skill when the user wants to take a screenshot on a wlroots Wayland compositor (sway, river, Hyprland) — full screen, region, or piped to stdout.
---

# wayshot Plugin

wayshot captures screenshots on Wayland via the zwlr_screencopy_v1 protocol. It writes png files to cwd, streams to `--stdout`, supports `-s/--slurp` geometry regions, `-o` output picker, `--cursor`, and jpeg/webp/png extensions.

## Commands

### Capture
- `wayshot screen capture` — All outputs → png file in cwd
- `wayshot screen stdout` — png bytes to stdout (pipe to file or wl-copy)
- `wayshot screen region` — Region from a slurp geometry string
- `wayshot screen output` — Interactively pick an output
- `wayshot _ _` — Passthrough (`--file`, `--extension`, `--cursor`, `-l` list outputs)

## Usage Examples

- "Take a screenshot of all my monitors"
- "Screenshot just this region: 100,200 800x600"
- "Pipe a screenshot straight into the clipboard"
- "Save a jpeg screenshot to a file"

## Installation

```bash
cargo install wayshot
```

## Examples

```bash
wayshot                                  # ./<timestamp>.png
wayshot -s "$(slurp)"                    # interactive region
wayshot --stdout > /tmp/shot.png
wayshot --stdout | wl-copy               # straight to clipboard
wayshot --extension jpeg -f shot.jpeg
wayshot -o                               # pick an output
```

## Key Features

- Fast, dependency-light Rust implementation for wlroots compositors
- `--stdout` streaming makes it pipe/script friendly
- slurp integration for region selection; `-o` for multi-monitor picking
- Multiple output formats: png, jpeg, webp, ppm, qoi
