# starship Plugin

## Overview
The starship plugin provides the minimal, blazing-fast, and infinitely customizable prompt for any shell. Written in Rust for speed and efficiency.

## What is starship?
`starship` is a cross-shell prompt that displays information from your system, git status, and more. It's written in Rust for maximum speed and works with bash, zsh, fish, and more.

## Quick Start

### 1. Install starship
```bash
curl -sS https://starship.rs/install.sh | sh
```

### 2. Initialize for your shell
Add to your shell config:
```bash
# For bash
eval "$(starship init bash)"

# For zsh
eval "$(starship init zsh)"

# For fish
starship init fish | source
```

### 3. Verify installation
```bash
sc starship self version
```

## Features
- **Git Integration**: Branch, status, commit info
- **Language Info**: Node, Python, Rust, Go, etc.
- **System Info**: OS, hostname, battery
- **Directory Info**: Current path, duration
- **Package Info**: Package version when in project
- **Customizable**: Modules, colors, symbols
- **Blazing Fast**: Written in Rust
- **Cross-Shell**: Works with bash, zsh, fish, ion, elvish

## Useful Commands
- `sc starship self version` - Print version
- `sc starship prompt print` - Print the prompt
- `sc starship config print --default` - Print default config
- `sc starship module explain` - Explain active modules
- `sc starship session init bash` - Get init code for bash

## Configuration
Config file: `~/.config/starship.toml`

Example config:
```toml
[git_branch]
symbol = "🌱 "

[git_status]
conflicted = "⚡️ "
untracked = "🤷‍ "

[nodejs]
symbol = "⬢ "

[python]
symbol = "🐍 "
```

## Available Modules
- aws - AWS region/profile
- gcloud - GCP account
- kubernetes - Kubernetes context
- git_branch - Git branch
- git_commit - Git commit hash
- git_state - Git operation state
- git_status - Git status
- hg_branch - Mercurial branch
- docker - Docker context
- golang - Go version
- nodejs - Node.js version
- python - Python version
- ruby - Ruby version
- rust - Rust version
- And many more...

## Requirements
- Shell (bash, zsh, fish, ion, elvish)
- Terminal with color support

## Tips
- Customize symbols for your preference
- Disable unused modules for speed
- Use `starship explain` to debug
- Check docs for all module options

## Resources
- Website: https://starship.rs
- GitHub: https://github.com/starship/starship
