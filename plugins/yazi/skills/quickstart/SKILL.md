# Yazi Quickstart

Blazing fast terminal file manager written in Rust, based on async I/O.

## Installation

```bash
# Via cargo (Rust toolchain required)
cargo install --locked yazi-fm yazi-cli

# Via Homebrew (macOS)
brew install yazi

# Via Pacman (Arch Linux)
pacman -S yazi
```

## Basic Usage

```bash
# Open yazi in current directory
yazi

# Open yazi at specific path
yazi /path/to/directory

# Use ya for command-line operations
ya --help
```

## Key Bindings

- `q` - Quit
- `j/k` or `↓/↑` - Navigate down/up
- `h/l` or `←/→` - Go to parent/enter directory
- `Enter` - Open file/directory
- `Space` - Select item
- `y` - Yank (copy) selected
- `p` - Paste yanked items
- `d` - Cut selected items
- `D` - Delete selected items
- `r` - Rename
- `/` - Search
- `!` - Open shell
- `~` - Show help

## Features

- Asynchronous I/O for responsive navigation
- Built-in preview for images, code, PDFs
- Scrollable preview
- Multi-selection
- Fast directory scanning
- Unicode support
- Customizable keymap and theme

## Configuration

Config files are stored in:
- Linux/macOS: `~/.config/yazi/`
- Windows: `%AppData%\yazi\config\`

Key files:
- `yazi.toml` - Main configuration
- `keymap.toml` - Key bindings
- `theme.toml` - Colors and appearance

## ya CLI

The `ya` command provides scripting capabilities:

```bash
# Open file picker and output selection
ya pub --list

# Execute command in yazi
ya pub cd -- "~/Documents"
```
