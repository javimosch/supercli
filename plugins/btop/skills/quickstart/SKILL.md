# btop Plugin

## Overview
The btop plugin provides a resource monitor that shows usage and stats for processor, memory, disks, network and processes. A modern, colorful terminal UI replacement for htop.

## What is btop?
`btop` is a modern resource monitor with a beautiful terminal UI. It displays processor, memory, disks, network, and process usage with mouse support and customizable themes.

## Quick Start

### 1. Install btop
```bash
sudo apt install btop
# or with Homebrew
brew install btop
# or with pacman
sudo pacman -S btop
```

### 2. Open the UI
```bash
sc btop ui open
```

### 3. Verify installation
```bash
sc btop self version
```

## Features
- **CPU Monitoring**: Per-core usage, frequency, temperature
- **Memory Usage**: RAM and swap usage with detailed breakdown
- **Disk I/O**: Read/write speeds per disk
- **Network**: Upload/download speeds per interface
- **Process List**: Sortable, filterable process list with tree view
- **Graphs**: Real-time graphs for all metrics
- **Themes**: Multiple color themes
- **Mouse Support**: Full mouse navigation

## Keybindings (in UI)
- `q` or `Esc`: Quit
- `Tab`: Switch between boxes
- `F1` to `F10`: Menu options
- `Enter`: Select item
- `+` / `-`: Zoom graphs
- `e`: Toggle process tree
- `r`: Reverse sort order
- `p`: Process menu
- `s`: Select sorting

## Useful Commands
- `sc btop ui open` - Open btop UI
- `sc btop ui open --preset default` - Use specific preset
- `sc btop process tree` - Show process tree view

## Configuration
Config file: `~/.config/btop/btop.conf`
Themes: `~/.config/btop/themes/`

Customize colors, update intervals, and displayed metrics in the config file.

## Requirements
- Linux, macOS, or BSD system
- Terminal with 24-bit color support (recommended)

## Tips
- Use mouse for quick navigation
- Press `F2` for configuration menu
- Use `F5` to switch between process views
- Enable tree view with `e` for process hierarchy
- Use themes for better visibility in different terminals

## Resources
- GitHub: https://github.com/aristocratos/btop
