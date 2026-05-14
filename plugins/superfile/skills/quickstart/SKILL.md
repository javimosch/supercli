# Superfile Quickstart

Pretty fancy and modern terminal file manager.

## Installation

```bash
# Via Homebrew (macOS/Linux)
brew install superfile

# Via Go
go install github.com/yorukot/superfile@latest

# Download binary from releases
# https://github.com/yorukot/superfile/releases
```

## Basic Usage

```bash
# Open superfile in current directory
spf

# Open at specific path
spf /path/to/directory

# Get help
spf --help
```

## Key Bindings

- `q` / `Ctrl+C` - Quit
- `j/k` or `↓/↑` - Navigate
- `h/l` or `←/→` - Parent/enter directory
- `Enter` - Open file/directory
- `Space` - Select item
- `y` - Copy
- `p` - Paste
- `d` - Delete
- `r` - Rename
- `/` - Search
- `:` - Command mode
- `?` - Help

## Features

- Beautiful modern UI with customizable themes
- File preview (text, images, PDFs)
- Multi-panel layout
- Fast file operations
- Syntax highlighting in previews
- Vim-like key bindings
- Plugin system
- Mouse support

## Configuration

Config directory: `~/.config/superfile/`

Main config file: `config.toml`

Themes directory: `~/.config/superfile/theme/`

### Example config changes

```toml
# ~/.config/superfile/config.toml
[theme]
theme = "catppuccin"

[panel]
show_hidden_files = true
```

## Tips

- Use mouse for quick navigation alongside keyboard
- Customize themes to match your terminal
- Enable hidden files to see dotfiles
- Use multiple panels for efficient file operations
