---
name: chezmoi
description: Use this skill when the user wants to manage their dotfiles with chezmoi — init, add, diff, apply, update, and encrypt dotfiles across multiple machines.
---

# chezmoi Plugin

chezmoi manages your dotfiles across multiple machines. It supports templates, encryption, and local/remote source directories.

## Commands

### Self
- `chezmoi self version` — Print chezmoi version
- `chezmoi self doctor` — Check for common problems
- `chezmoi self upgrade` — Upgrade chezmoi

### Source Management
- `chezmoi source init <repo>` — Initialize source directory from a dotfile repo
- `chezmoi source add <path>` — Add a file to the source directory
- `chezmoi source diff [path]` — Show pending changes
- `chezmoi source apply [path]` — Apply source state to home directory
- `chezmoi source update` — Pull remote changes and apply
- `chezmoi source status [path]` — Show status of managed files
- `chezmoi source forget <path>` — Stop tracking a file without deleting it
- `chezmoi source re-add <path>` — Re-add a modified destination file

### Data & Inspection
- `chezmoi data dump [path]` — Dump computed file contents as JSON
- `chezmoi data show` — Show template data as JSON
- `chezmoi data list` — List all managed entries as JSON
- `chezmoi data verify [path]` — Verify target state matches source

### Encryption
- `chezmoi secret encrypt <path>` — Encrypt a file
- `chezmoi secret decrypt <path>` — Decrypt a file

### Passthrough
- `chezmoi _ _ <args>` — Raw passthrough (cd, merge, edit, chattr, execute-template, etc.)

## Usage Examples

- "chezmoi init --apply $GITHUB_USERNAME"
- "chezmoi add ~/.gitconfig"
- "chezmoi diff"
- "chezmoi apply --dry-run --verbose"
- "chezmoi update"
- "chezmoi status"
- "chezmoi data --format=json"
- "chezmoi add --template ~/.config/starship.toml"
- "chezmoi add --encrypt ~/.ssh/config"

## Installation

```bash
brew install chezmoi
# or one-liner:
sh -c "$(curl -fsLS https://get.chezmoi.io)"
```

## Key Features
- Declarative dotfile management
- Go template support with machine-specific variables
- Age/GPG encryption for secrets
- Multiple machine support with machine-specific configs
- JSON output for scripting and automation
- Cross-platform (macOS, Linux, Windows, FreeBSD, OpenBSD)

## Workflow

Typical bootstrap on a new machine:
```bash
chezmoi init --apply $GITHUB_USERNAME
```

Typical daily workflow:
```bash
chezmoi add ~/.someconfig
chezmoi diff
chezmoi apply
```

Typical sync:
```bash
chezmoi update
```
