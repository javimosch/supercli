---
name: s-tui
description: Use this skill when the user wants terminal-based CPU monitoring and stress testing — view temperature, frequency, power, and utilization graphs, or run a CPU stress test without leaving the shell.
---

# s-tui Plugin

Terminal UI for CPU stress testing and monitoring. Graphical display of temperature, frequency, power draw, and utilization — useful on laptops and servers when diagnosing thermal throttling or benchmarking.

## Installation

```bash
pip install s-tui --user
# or
apt install s-tui
```

## Basic Usage

```bash
# Launch the interactive TUI
s-tui

# Run a stress test (from within the TUI, toggle Stress mode)
# Navigate with arrow keys; q to quit
```

## Key Features

- Real-time CPU frequency and temperature graphs
- Built-in stress test to push CPU load
- Power consumption display (where supported)
- Works over SSH — no GUI required

## Usage Examples

- "Monitor CPU temperature while compiling"
- "Stress test my CPU from the terminal"
- "Check if my laptop is thermal throttling"

## SuperCLI

```bash
sc s-tui _ _
sc plugins learn s-tui
```
