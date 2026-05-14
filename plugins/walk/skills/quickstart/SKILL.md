# Walk Quickstart

Terminal file manager - Navigate directories and execute files.

## Installation

```bash
# Via Go
go install github.com/antonmedv/walk@latest

# Via Homebrew
brew install walk

# Download from releases
# https://github.com/antonmedv/walk/releases
```

## Basic Usage

```bash
# Open walk in current directory
walk

# Open at specific path
walk /path/to/directory

# Exit and cd to last directory (use with alias)
walk --help
```

## Key Bindings

- `j/k` or `↓/↑` - Navigate down/up
- `h/l` or `←/→` - Parent directory/enter
- `Enter` - Open file or directory
- `Space` - Toggle preview
- `q` / `Esc` - Quit
- `/` - Search
- `~` - Go to home directory
- `-` - Go to previous directory

## Features

- Minimal and fast
- Works with any shell
- Preview mode for files
- Search functionality
- Integrates with cd (see below)
- No configuration needed

## Shell Integration (cd on exit)

To change directory when exiting walk, add this to your shell config:

### Bash/Zsh

```bash
function w() {
  walk "$@" && cd "$(walk --print-path)"
}
```

### Fish

```fish
function w
  walk $argv && cd (walk --print-path)
end
```

Then use `w` instead of `walk` to navigate and auto-cd.

## Tips

- Keep it simple - walk is designed to be minimal
- Use with shell aliases for common directories
- The `--print-path` flag outputs the last visited directory for scripting
