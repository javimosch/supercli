---
name: mprocs
description: Use this skill when the user wants to run multiple commands in parallel, manage processes with a TUI, or use mprocs for development workflows.
---

# mprocs Plugin

Run multiple commands in parallel with a terminal multiplexer interface. Switch between process outputs and interact with each one.

## Commands

### Run
- `mprocs run commands` — Run multiple commands in parallel
- `mprocs run config` — Run from mprocs.yaml config
- `mprocs run npm` — Run npm scripts from package.json
- `mprocs run procfile` — Run processes from a Procfile

## Usage Examples
- "Run webpack serve and jest watch together"
- "Start my dev servers with mprocs"
- "Run npm scripts in parallel"

## Installation

```bash
cargo install mprocs
# or
brew install mprocs
# or
npm install -g mprocs
```

## Examples

```bash
# Run commands directly
mprocs "npm run dev" "npm test -- --watch"

# Run from config file
mprocs

# Run npm scripts
mprocs --npm

# Run from Procfile
mprocs --procfile ./Procfile.dev

# Custom config
mprocs --config ./cfg/mprocs.yaml

# Remote control
mprocs --server 127.0.0.1:4050
mprocs --ctl '{c: quit}'

# On-init command
mprocs --on-init '{c: restart-all}'
```

## Default Keymap

- `q` — Quit (soft kill)
- `Q` — Force quit
- `x` — Kill selected process
- `s` — Start selected process
- `r` — Restart selected process

## Key Features
- Multiple commands with separate output panes
- Interactive terminal for each process
- Config-driven via mprocs.yaml
- Supports npm scripts and Procfiles
- Remote control via TCP
