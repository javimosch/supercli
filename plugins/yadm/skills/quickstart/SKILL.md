---
name: yadm
description: Use this skill when the user wants to manage dotfiles, initialize a dotfiles repository, clone dotfiles, encrypt/decrypt private config files, or use alternative file templates.
---

# yadm Plugin

Yet Another Dotfiles Manager — manage dotfiles with Git, encryption, Jinja2 templates, and per-machine alternative files.

## Commands

### Repository Management
- `yadm repo init` — Initialize a new dotfiles repository
- `yadm repo clone` — Clone an existing dotfiles repository

### File Management
- `yadm file add` — Add files to the repository
- `yadm file list` — List tracked files

### Encryption
- `yadm crypto encrypt` — Encrypt private files
- `yadm crypto decrypt` — Decrypt private files

### Configuration
- `yadm config bootstrap` — Run bootstrap script
- `yadm alt create` — Create alternative file symlinks

### Utility
- `yadm _ _` — Passthrough to yadm CLI

## Usage Examples
- "Initialize a dotfiles repo"
- "Clone my dotfiles from GitHub"
- "Add .bashrc to my dotfiles"
- "Encrypt my SSH keys"
- "Run the bootstrap script"

## Installation

```bash
brew install yadm
```

Or on Linux:
```bash
sudo apt install yadm
```

Or manually:
```bash
curl -fsSL https://github.com/yadm-dev/yadm/raw/master/yadm -o /usr/local/bin/yadm && chmod +x /usr/local/bin/yadm
```

## Examples

```bash
# Initialize a new dotfiles repository
yadm repo init

# Clone an existing dotfiles repo
yadm repo clone https://github.com/user/dotfiles.git

# Add files
yadm file add ~/.bashrc ~/.gitconfig ~/.vimrc

# Commit and push (passthrough to git)
yadm _ _ commit -m "Add shell config"
yadm _ _ push

# List tracked files
yadm file list

# Encrypt private files (reads ~/.config/yadm/encrypt for patterns)
yadm crypto encrypt

# Decrypt private files
yadm crypto decrypt

# Create alternative file symlinks (for per-OS configs)
yadm alt create

# Run bootstrap
yadm config bootstrap

# Show status
yadm _ _ status

# View version
yadm _ _ version
```

## Key Features
- **Git-based** — Full Git feature set for dotfiles
- **Alternative files** — Per-machine, per-OS, per-host configs with `##` suffix syntax
- **Templates** — Jinja2 template processing for dynamic configs
- **Encryption** — Private data via GPG, OpenSSL, transcrypt, or git-crypt
- **Bootstrap** — Customizable first-time setup script
- **Hooks** — Before/after hook support for any operation
- **Portable** — Single file, no dependencies beyond Git and Bash
