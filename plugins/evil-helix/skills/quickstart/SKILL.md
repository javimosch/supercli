---
name: evil-helix
description: Use this skill when the user wants to use the Helix editor with Vim keybindings, or needs a modal text editor combining Vim and Helix features.
---

# evil-helix Plugin

Vim-inspired modal editing for Helix editor. A compatibility layer adding Vim keybindings and modes to the Helix terminal editor.

## Commands

### File Editing
- `evil-helix file edit` — Open file with evil-helix editor

### Utility
- `evil-helix _ _` — Passthrough to evil-helix CLI

## Usage Examples
- "Open file in evil-helix"
- "Edit with Vim-like Helix"
- "Use modal editor"
- "Helix with Vim bindings"

## Installation

```bash
brew install evil-helix
```

## Examples

```bash
# Open a file
evil-helix file edit myfile.rs

# Open directory
evil-helix file edit ./my-project/

# Check language support
evil-helix file edit --health rust

# Any helix command with passthrough
evil-helix _ _ myfile.rs
evil-helix _ _ --health python
```

## Key Features
- **Vim** - Vim keybindings
- **Helix** - Helix editor base
- **Modal** - Modal editing
- **Multi-cursor** - Multi-cursor support
- **Treesitter** - Tree-sitter support
- **LSP** - Language server support
- **Fuzzy** - Fuzzy finder
- **Registers** - Vim registers
- **Macros** - Vim macros
- **Commands** - Vim commands

## Notes
- Drop-in replacement for hx
- Supports all Helix features
- Great for Vim users
- Active community fork
