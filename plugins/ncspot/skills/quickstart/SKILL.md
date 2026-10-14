---
name: ncspot
description: Use this skill when the user wants to play Spotify from the terminal with a lightweight keyboard-driven ncurses client.
---

# ncspot Plugin

ncspot is a terminal Spotify client — search, playlists, and playback control with vim keys, without the Electron app.

## Commands

- `ncspot self version` — Print ncspot version
- `ncspot player start` — Launch the ncspot TUI (ncspot; flags: -b config dir, -u user, -p password). Interactive
- `ncspot _ _` — Passthrough to ncspot CLI

## Usage Examples

- "Play my Discover Weekly playlist from the terminal"
- "Control Spotify playback with keyboard only"
- "Use a light Spotify client on a low-RAM box"

## Installation

```bash
cargo install ncspot
# or: brew install ncspot
```

## Examples

```bash
ncspot                    # launch the TUI
ncspot -b ~/.config/ncspot-work  # separate profile dir
# inside: :search, :playlists, Shift+P pause, arrows+Enter navigate
```

## Key Features

- Vim-style keybindings and a command line (:search, :playlists, :queue)
- Streams audio itself via librespot — no Spotify app needed
- Tiny footprint vs the official Electron client
