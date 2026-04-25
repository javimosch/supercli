# lazygit Plugin

## Overview
The lazygit plugin provides a terminal UI for git commands. Interact with git repositories through a visual interface without leaving the terminal.

## What is lazygit?
`lazygit` is a terminal UI for git operations. It provides an intuitive interface for staging files, committing, pushing, pulling, managing branches, and resolving conflicts.

## Quick Start

### 1. Install lazygit
```bash
curl https://raw.githubusercontent.com/jesseduffield/lazygit/master/scripts/install_update_linux.sh | bash
# or with Homebrew
brew install lazygit
```

### 2. Open the UI
```bash
sc lazygit ui open
```

### 3. Verify installation
```bash
sc lazygit self version
```

## Features
- **File Staging**: Stage/unstage files with visual feedback
- **Commit**: Create commits with message editor
- **Branch Management**: Create, checkout, delete branches
- **Merge/Rebase**: Handle merges and rebases visually
- **Stashing**: Stash and pop changes
- **Log View**: View commit history with diff
- **Conflict Resolution**: Resolve merge conflicts
- **Push/Pull**: Sync with remote repositories

## Keybindings (in UI)
- `q`: Quit
- `x`: Remove selected item
- `space`: Stage/unstage file
- `c`: Commit
- `P`: Push
- `p`: Pull
- `b`: Checkout branch
- `F`: Fetch
- `enter`: View details
- `]` and `[`: Navigate panels

## Useful Commands
- `sc lazygit ui open` - Open lazygit in current directory
- `sc lazygit ui open --path /path/to/repo` - Open in specific repository
- `sc lazygit log view` - View git log in lazygit
- `sc lazygit ui open --filter "*.js"` - Filter files by pattern

## Requirements
- Git installed
- Git repository (lazygit auto-detects)

## Configuration
Create `~/.config/lazygit/config.yml` to customize:
```yaml
gui:
  theme:
    activeBorderColor:
      - green
      - bold
```

## Tips
- Use arrow keys or vim-style navigation (j/k)
- Press `?` in the UI for help
- Use `/` to search/filter lists
- Press `space` to stage/unstage files
- Use `c` then `c` to commit with message

## Resources
- GitHub: https://github.com/jesseduffield/lazygit
- Documentation: https://github.com/jesseduffield/lazygit
