---
name: pokete
description: Use this skill when the user wants to play pokete, the terminal-based Pokemon-like adventure game.
---

# pokete Plugin

pokete is a terminal Pokemon-like game in Python: explore an ASCII world, catch Poketes, battle trainers, complete quests. Interactive TUI — needs a real TTY.

## Commands

- `pokete game play` — Start the game (`--no_audio` to disable sound)
- `pokete self help` — Show CLI options
- `pokete _ _` — Passthrough to pokete CLI

## Usage Examples

- "Play pokete"
- "Launch the terminal pokemon game without audio"

## Installation

```bash
pip install pokete
# or: pipx install pokete
```

## Examples

```bash
pokete                # start the game
pokete --no_audio     # without sound
```

## Key Features

- 60+ catchable Poketes, trainer battles, NPCs, quests, achievements
- Moddable world data (custom Poketes, maps, attacks via `--load_mods`)
- Save games stored under `~/.cache/pokete/`
- Cross-platform (Linux, macOS, BSD; AUR package `pokete-git`)
