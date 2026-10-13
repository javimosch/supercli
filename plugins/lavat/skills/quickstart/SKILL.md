---
name: lavat
description: Use this skill when the user wants terminal eye-candy — an animated lava lamp to fill idle panes, pretty screenshots, or a relaxing demo backdrop.
---

# lavat Plugin

lavat draws an animated lava lamp in the terminal — metaball simulation with tunable color, shape, radius and speed. Eye-candy, not a utility.

## Commands

### Eye candy
- `lavat lamp run` — Run the lava lamp (q to quit)
- `lavat lamp color <color>` — Choose lava color
- `lavat self version` — Show version
- `lavat _ _` — Passthrough (`-r` radius, `-s` speed, `-S` shape)

## Usage Examples

- "Put something pretty in this spare tmux pane"
- "Show a lava lamp animation"
- "Terminal eye-candy for a demo"

## Installation

```bash
cargo install lavat
# or: cargo binstall lavat
# or: brew install lavat
```

## Examples

```bash
lavat                       # default red lava lamp
lavat -c blue               # blue lava
lavat -c magenta -r 8 -s 5  # bigger, faster blobs
lavat -S square             # square blobs
```

## Key Features

- Metaball/blob physics rendered to the terminal framebuffer
- Colors: red, blue, green, yellow, cyan, magenta, white, black, random
- Tunable blob radius, speed, shape; minimal dependencies
