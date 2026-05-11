# svg-term-cli Quickstart

Share terminal sessions as razor-sharp animated SVG everywhere.

## Installation

```bash
npm install -g svg-term-cli
```

**Note:** Also install asciinema for recording:
```bash
# macOS
brew install asciinema

# Linux
sudo apt-get install asciinema
```

## Basic Workflow

1. Record a terminal session:
```bash
asciinema rec demo.cast
```

2. Convert to SVG:
```bash
svg-term --cast demo.cast --out demo.svg
```

## Using asciinema.org Casts

Generate SVG from an online cast:
```bash
svg-term --cast 113643 --out demo.svg
```

## Common Options

Add window frame:
```bash
svg-term --cast demo.cast --out demo.svg --window
```

Hide cursor:
```bash
svg-term --cast demo.cast --out demo.svg --no-cursor
```

Set start/end time (ms):
```bash
svg-term --cast demo.cast --out demo.svg --from=4500 --to=9000
```

Change terminal size:
```bash
svg-term --cast demo.cast --out demo.svg --width 80 --height 24
```

## Complete Example

```bash
# Record
asciinema rec mysession.cast

# Convert with styling
svg-term --cast mysession.cast --out mysession.svg --window --no-cursor --from=1000

# Use in README.md
![Demo](mysession.svg)
```

## Tips

- SVGs work great in GitHub READMEs
- Use `--window` for a realistic terminal look
- Trim dead time with `--from` and `--to`
- Optimized file sizes for web use
