---
name: systemctl-tui
description: Use this skill when the user wants to manage systemd services interactively — browse units, start/stop/restart, view logs and unit files in a TUI.
---

# systemctl-tui Plugin

systemctl-tui is a fast TUI for systemd units and services — the interactive replacement for typing `systemctl`/`journalctl` incantations.

## Commands

### TUI
- `systemctl-tui tui run` — Launch the units TUI
- `systemctl-tui self version` — Show version
- `systemctl-tui _ _` — Passthrough to systemctl-tui CLI

## Usage Examples

- "Restart the nginx service"
- "Show me all failed units"
- "Browse the logs of docker.service"

## Installation

```bash
cargo install systemctl-tui
# or: cargo binstall systemctl-tui
# or: brew install systemctl-tui
```

## Examples

```bash
systemctl-tui          # browse all units
sudo systemctl-tui     # manage system services as root
```

## Key Features

- Fuzzy-search units by name; filter by state/type
- Start/stop/restart/enable/disable/mask with single keys
- Built-in log view (journald) and unit-file preview/editor
- Vim-style keybindings, very fast — Rust + ratatui
