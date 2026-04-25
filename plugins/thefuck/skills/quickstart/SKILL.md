---
name: thefuck
description: Use this skill when the user wants to correct mistyped console commands.
---

# Thefuck Plugin

Magnificent app which corrects your previous console command by analyzing common mistakes.

## Commands

### Command Correction
- `thefuck command correct` — Correct the previous console command
- `thefuck command alias` — Print shell alias for thefuck

## Usage Examples
- "thefuck command correct"
- "thefuck command correct --yes"
- "thefuck command alias --shell zsh"

## Installation

```bash
brew install thefuck
# or
pip install thefuck

# Add to .bashrc or .zshrc:
eval $(thefuck --alias)
```

## Examples

```bash
# After typing a wrong command
$ puthon
No command 'puthon' found, did you mean 'python'?

$ fuck
python

# Execute correction without confirmation
$ fuck --yes

# Get shell alias
$ fuck --alias
# Add this to your .bashrc or .zshrc:
eval $(thefuck --alias)

# Common corrections:
# - Missing sudo
$ apt install python
E: Could not open lock file

$ fuck
sudo apt install python

# - Wrong flag
$ git push --force-with-lease
fatal: --force-with-lease is not a valid option

$ fuck
git push --force-with-lease origin main

# - Typo in command
$ grut init
No command 'grut' found

$ fuck
git init
```

## Key Features
- Corrects typos in command names
- Adds missing sudo
- Fixes wrong flags
- Corrects path issues
- Supports custom rules
- Shell aliases for quick access
- Multi-language support
- Configurable behavior
