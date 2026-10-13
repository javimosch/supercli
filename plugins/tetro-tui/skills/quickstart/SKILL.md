---
name: tetro-tui
description: Use this skill when the user wants to play a Tetris-like tetromino game in the terminal with tetro-tui.
---

# tetro-tui Plugin

tetro-tui is a modern terminal tetromino stacker in Rust (formerly `tetrs`): guideline mechanics (SRS kicks, hold, ghost piece), customizable boards/themes, descent/combo/custom modes, a replay-analysis engine, and a bot.

## Commands

- `tetro-tui game play` — Launch the game (`-d` descent, `-c <bits>` custom combo layout, `-e` bot mode)
- `tetro-tui self version` — Print version
- `tetro-tui _ _` — Passthrough to tetro-tui CLI

## Usage Examples

- "Play tetris in the terminal"
- "Run the tetro-tui bot so I can watch it play"

## Installation

```bash
cargo install tetro-tui
# or: https://github.com/Strophox/tetro-tui/releases
# or: nix run github:Strophox/tetro-tui
```

## Examples

```bash
tetro-tui          # start in default mode
tetro-tui -d       # descent mode (endless dig)
tetro-tui -e       # engine bot plays combo mode
```

## Key Features

- Modern stacker mechanics: SRS rotation/kicks, hold, ghost, lock delay
- Customizable keybinds, colors, and board rendering (ASCII or braille/blocks)
- Built-in tetrs_engine with analysis and bot mode
- Best on terminals supporting progressive keyboard enhancement (kitty, wezterm)
