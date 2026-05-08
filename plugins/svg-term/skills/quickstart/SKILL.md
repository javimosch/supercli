# SVG Term Quickstart

Create beautiful animated SVG recordings of terminal sessions.

## Installation

```bash
npm install -g svg-term-cli

# Optional: Install asciinema for recording
brew install asciinema  # macOS
```

## Basic Workflow

### 1. Record Terminal Session

```bash
# Start recording
asciinema rec demo.cast

# Do your terminal work...

# Stop recording (Ctrl+D or type 'exit')
```

### 2. Convert to SVG

```bash
# From local file
svg-term --in demo.cast --out demo.svg

# From asciinema.org (replace CAST_ID with actual ID)
svg-term --cast CAST_ID --out demo.svg
```

## Styling Options

```bash
# Set window frame style
svg-term --in demo.cast --out demo.svg --window

# Set theme
svg-term --in demo.cast --out demo.svg --theme monokai

# Available themes: dracula, monokai, solarized-dark, etc.
```

## Embedding

The generated SVG can be:
- Embedded directly in README.md
- Used in blog posts
- Added to documentation
- Viewed in any modern browser

```markdown
![Demo](demo.svg)
```

## Tips

- Keep recordings short for smaller file sizes
- Use `--window` flag for a realistic terminal frame
- Test different themes for better contrast
- Consider using `--padding` for breathing room
