---
name: gitlogue
description: Use this skill when the user wants to visualize Git commit history in a cinematic animated way, use gitlogue as a terminal screensaver, or replay commits with syntax highlighting.
---

# Gitlogue Plugin

A cinematic Git commit replay tool for the terminal, turning your Git history into a living, animated story.

## Commands

### Screensaver / Replay
- `gitlogue replay screensaver` — Start cinematic commit replay

### Diff View
- `gitlogue diff view` — View staged/unstaged changes with animation

### Theme Management
- `gitlogue theme list` — List available themes

## Usage Examples

Start screensaver mode:
```
gitlogue
gitlogue --loop
```

Replay specific commits:
```
gitlogue --commit abc123
gitlogue --commit HEAD~5..HEAD
gitlogue --commit HEAD~10 --loop
```

Filter and customize:
```
gitlogue --author "john"
gitlogue --after "2024-01-01" --before "2024-12-31"
gitlogue --theme dracula --speed 20
gitlogue --ignore "*.ipynb" --ignore "poetry.lock"
```

View diffs:
```
gitlogue diff
gitlogue diff --unstaged
```

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/unhappychoice/gitlogue/main/install.sh | bash
```

Or via package manager:
```bash
brew install gitlogue        # macOS/Linux
cargo install gitlogue       # Rust
pacman -S gitlogue           # Arch
```

## Key Features
- Cinematic commit replay with typing animations
- Tree-sitter syntax highlighting (29 languages)
- Project file tree visualization
- Screensaver mode for ambient display
- 9 built-in themes + customization
- Filter by author, date range
- Adjustable typing speed
- Git diff visualization