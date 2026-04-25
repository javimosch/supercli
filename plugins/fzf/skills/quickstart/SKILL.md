# fzf Plugin

## Overview
The fzf plugin provides a command-line fuzzy finder. An interactive Unix filter that can be used with any list: files, command history, processes, hostnames, bookmarks, git commits, and more.

## What is fzf?
`fzf` is a general-purpose command-line fuzzy finder. It's an interactive Unix filter that works with any command that produces output. Search through lists with a fuzzy matching algorithm.

## Quick Start

### 1. Install fzf
```bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
# or with Homebrew
brew install fzf
```

### 2. Basic usage
```bash
# Find files
find . -type f | fzf

# Search git branches
git branch | fzf

# Search command history
history | fzf
```

### 3. Verify installation
```bash
sc fzf self version
```

## Common Use Cases

### File Selection
```bash
# Interactive file selection
find . -type f | fzf

# With preview
find . -type f | fzf --preview 'cat {}'
```

### Git Integration
```bash
# Select branch to checkout
git branch | fzf | xargs git checkout

# Select commit to view
git log --oneline | fzf
```

### Command History
```bash
# Search and execute from history
history | fzf +s | tac | sed 's/ *[0-9]* *//' | sh
```

### Process Management
```bash
# Select and kill process
ps aux | fzf | awk '{print $2}' | xargs kill
```

## Keybindings
- `Ctrl+J` / `Ctrl+K`: Move down/up
- `Enter`: Select
- `Esc`: Cancel
- `Ctrl+T`: Toggle selection
- `Ctrl+R`: Toggle sort
- `Ctrl+A`: Select all
- `Ctrl+D`: Deselect all

## Useful Commands
- `sc fzf files select` - Interactive file selection
- `sc fzf files select --multi` - Enable multi-select
- `sc fzf files select --preview 'cat {}'` - With preview
- `sc fzf history search` - Search command history

## Shell Integration
Add to your shell config for better integration:
```bash
# Use fzf for Ctrl+T (file search)
source ~/.fzf/shell/key-bindings.bash

# Use fzf for Ctrl+R (history search)
source ~/.fzf/shell/key-bindings.bash
```

## Options
- `--height`: Set height (e.g., 40%)
- `--multi`: Enable multi-select with Tab
- `--preview`: Show preview window
- `--query`: Set initial query
- `--filter`: Filter by exact match
- `--exact`: Enable exact matching

## Requirements
- Terminal with color support
- Unix-like system

## Tips
- Use `--multi` with Tab to select multiple items
- Add `--preview` for file previews
- Pipe any command output into fzf
- Use with `xargs` to execute on selection

## Resources
- GitHub: https://github.com/junegunn/fzf
