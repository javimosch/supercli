---
name: wiremix
description: Use this skill when the user wants to control PipeWire audio from the terminal — volumes, mute, default devices, and stream routing.
---

# wiremix Plugin

wiremix is a ratatui TUI mixer for PipeWire — a terminal pavucontrol. Adjust device and stream volumes, mute endpoints, pick defaults, and reroute streams between nodes.

## Commands

- `wiremix tui open` — Launch the mixer TUI
- `wiremix self version` — Show version
- `wiremix _ _` — Passthrough (`--config-file <path>` to use a custom config)

## Usage Examples

- "Open a terminal audio mixer"
- "Reroute this app's audio to my headphones"
- "Adjust microphone gain in a TUI"

## Installation

```bash
cargo install wiremix
# or: sudo dnf install wiremix (Fedora)
# Requires PipeWire + wireplumber running (default on modern desktops)
```

## Examples

```bash
# Open the mixer
supercli wiremix tui open

# Custom config
supercli wiremix _ _ --config-file ./wiremix.toml
```

## Key Features

- Three tabs: playback streams, recording streams, and endpoint devices
- `h`/`l` or `←`/`→` adjusts volume in configurable steps, `m` mutes
- `d` sets default sink/source; `Enter` on a stream opens the route picker
- Live VU meters per stream; scroll with mouse or keys
- Optional TOML config (`~/.config/wiremix/wiremix.toml`): keybindings, theme, step sizes, name filters
- Lightweight alternative to pavucontrol for Wayland/X11 terminals and SSH sessions
