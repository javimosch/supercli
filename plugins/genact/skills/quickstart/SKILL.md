---
name: genact
description: Use this skill when the user wants to generate fake terminal activity, create demo screenshots, or look busy in the terminal.
---

# genact Plugin

A nonsense activity generator. Generate fake activity for demos, screenshots, or to look busy in the terminal.

## Commands

### Activity Generation
- `genact activity generate` — Generate fake activity

### Utility
- `genact _ _` — Passthrough to genact CLI

## Usage Examples
- "Generate fake terminal activity"
- "Create a demo screenshot"
- "Look busy in terminal"
- "Show random activity modules"

## Installation

```bash
brew install genact
```

Or via Cargo:
```bash
cargo install genact
```

## Examples

```bash
# Generate activity with default settings
genact activity generate

# List available modules
genact activity generate --list

# Run specific modules
genact activity generate --modules boot,composer,cargo

# Randomize modules
genact activity generate --random

# Set speed multiplier
genact activity generate --speed 2.0

# Set duration
genact activity generate --duration 30

# Combine options
genact activity generate --modules boot,cargo --speed 1.5 --duration 60

# Any genact command with passthrough
genact _ _ --list
genact _ _ --random --speed 2
```

## Key Features
- **Multiple modules** - Boot, cargo, composer, npm, webpack, etc.
- **Random mode** - Randomize activity modules
- **Speed control** - Adjust activity speed
- **Duration limit** - Set how long to run
- **Module selection** - Choose specific activities
- **Cross-platform** - Linux, macOS, Windows
- **WebAssembly** - Browser version available
- **Color output** - Terminal colors supported
- **Realistic** - Looks like real terminal work
- **Perfect for demos** - Great for screenshots

## Notes
- Default runs indefinitely until interrupted
- Use Ctrl+C to stop
- Great for making screenshots look active
- Can be used in videos for effect
- Multiple modules available for variety
