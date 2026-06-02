---
name: btm
description: Use this skill when the user wants to monitor system resources, view processes, check CPU/memory/disk usage, or use a graphical TUI alternative to htop/top.
---

# btm Plugin

A cross-platform graphical process/system monitor — a customizable TUI alternative to htop/top.

## Commands

### System Monitoring
- `btm system monitor` — Launch the bottom system monitor TUI
- `btm system basic` — Launch with basic mode (CPU, memory, disk, network only)
- `btm system battery` — Launch showing battery widget

### Utility
- `btm self version` — Print btm version
- `btm _ _` — Passthrough to btm CLI

## Usage Examples
- "Show me the system monitor"
- "Monitor CPU and memory usage"
- "Check what processes are running"
- "View disk I/O in real time"

## Installation

```bash
brew install bottom
```

Or via Cargo:
```bash
cargo install bottom
```

## Examples

```bash
# Launch bottom TUI
btm system monitor

# Basic mode (CPU, memory, disk, network)
btm system basic

# With specific color scheme
btm system monitor --color nord

# With tree view for processes
btm system monitor --tree

# Show process commands
btm system monitor --process_command

# Set custom refresh rate (500ms)
btm system monitor --rate 500

# Passthrough any btm option
btm _ _ --help
btm _ _ --color gruvbox --tree --rate 2000
```

## Key Features
- **CPU monitoring** — Per-core usage with graphs
- **Memory monitoring** — RAM and swap usage
- **Disk I/O** — Read/write speeds per device
- **Network monitoring** — Upload/download speeds
- **Process management** — Tree view, filtering, killing
- **GPU monitoring** — NVIDIA GPU support
- **Temperature** — Sensor readings
- **Theming** — Nord, gruvbox, dracula, catppuccin, custom themes
- **Mouse support** — Click to navigate, resize widgets
- **Custom layouts** — Rearrange widgets interactively

## Keybindings (inside TUI)
- `?` — Help
- `q` / `Esc` — Quit
- `Tab` — Cycle focus
- `1-9` — Switch widget groups
- `/` — Search processes
- `k` — Kill process
- `t` — Toggle tree view
- `+` / `-` — Zoom in/out time scale
- `Up` / `Down` — Scroll

## Notes
- Requires a terminal emulator with color support
- Supports NVIDIA GPU monitoring via nvidia-smi
- Configuration file at ~/.config/bottom/bottom.toml
- Custom theming via TOML files

## Resources
- GitHub: https://github.com/ClementTsang/bottom
