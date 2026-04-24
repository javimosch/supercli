---
name: glow
description: Use this skill when the user wants to render markdown files in the terminal, view README files with formatting, or display markdown with syntax highlighting.
---

# glow Plugin

Render markdown on the CLI with pizzazz. A markdown renderer with syntax highlighting, automatic paging, and support for multiple output styles.

## Commands

### Markdown Rendering
- `glow markdown render` — Render markdown file
- `glow markdown stdin` — Render markdown from stdin

### Utility
- `glow _ _` — Passthrough to glow CLI

## Usage Examples
- "Render this README file"
- "View markdown with formatting"
- "Display README in terminal"
- "Render markdown from stdin"

## Installation

```bash
brew install glow
```

Or via Go:
```bash
go install github.com/charmbracelet/glow@latest
```

## Examples

```bash
# Render markdown file
glow markdown render README.md

# Render with specific style
glow markdown render --style dark README.md
glow markdown render --style light README.md

# Set wrap width
glow markdown render --width 80 README.md

# Disable pager
glow markdown render --no-pager README.md

# Render from stdin
cat README.md | glow markdown stdin

# Render multiple files
glow markdown render README.md CONTRIBUTING.md

# Any glow command with passthrough
glow _ _ README.md
glow _ _ --style dark --width 100 README.md
```

## Key Features
- **Syntax highlighting** — Code blocks with syntax highlighting
- **Automatic paging** — Page large files automatically
- **Multiple styles** — Auto, dark, light themes
- **Wrap control** — Configure text wrapping
- **Pipeline support** — Read from stdin
- **TUI mode** — Interactive terminal UI with -a flag
- **Configurable** — Custom configuration file
- **Fast rendering** — Efficient markdown parsing
- **Link support** — Clickable links in supported terminals
- **Emoji support** — Render emojis in markdown

## Notes
- Uses less as pager by default
- Can be used as git pager
- Configuration file at ~/.config/glow/glow.yml
- Supports GitHub Flavored Markdown
- TUI mode available with glow -a
