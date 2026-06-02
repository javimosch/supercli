---
name: stow
description: GNU Stow — symlink farm manager for dotfiles
---

# stow Plugin

GNU Stow manages packages of software and their associated config files from a central directory using symlinks.

## Commands

- `stow _ _` — Passthrough to stow CLI

## Usage

### Basic Commands

```bash
# Stow a package (create symlinks from target to stow dir)
stow _ _ <package>

# Unstow a package (remove symlinks)
stow _ _ -D <package>

# Restow (unstow then stow again)
stow _ _ -R <package>

# Target a specific directory
stow _ _ -t /target/dir <package>

# Dry run (show what would happen)
stow _ _ -n <package>

# Verbose output
stow _ _ -v <package>
```

### Dotfile Management Example

```bash
# ~/dotfiles/
# ├── bash/
# │   └── .bashrc
# ├── git/
# │   ├── .gitconfig
# │   └── .gitignore_global
# └── nvim/
#     ├── .config/
#     │   └── nvim/
#     │       └── init.lua

# Stow specific package
stow _ _ bash
stow _ _ git
stow _ _ nvim

# Unstow a package
stow _ _ -D bash

# Restow all
stow _ _ -R bash git nvim
```

## Key Features
- **Symlink management** — Create and remove symlink farms
- **Dotfile management** — Organized dotfile deployment
- **Package management** — Manage installed packages
- **Conflict detection** — Detects conflicting symlinks
- **Dry run mode** — Preview changes before applying
- **Selective targeting** — Stow to specific directories
- **Adopt mode** — Move existing files into stow directory

## Notes
- Stow NEVER touches files outside the target directory
- Works with any directory structure (not just dotfiles)
- Uses relative symlinks when possible (stow directory under target)
- Default target is parent of the stow directory
