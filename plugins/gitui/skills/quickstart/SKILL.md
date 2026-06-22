---
name: gitui
description: Use this skill when the user wants a fast terminal UI for git — to stage, commit, branch, stash, or review diffs without leaving the keyboard.
---

# gitui Plugin

A blazing-fast terminal UI for git, written in Rust.

## Commands

### Self
- `gitui self version` — Print gitui version

### Passthrough
- `gitui _ _` — Run any gitui command or launch the interactive TUI

## Usage Examples
- "Open a terminal UI for this git repo"
- "Stage and commit changes interactively"
- "Browse branches and diffs without the mouse"

## Notes
Launch `gitui` inside any git repository to open the interactive interface.
Install with `cargo install gitui` (also available via brew, pacman, scoop, winget, nix).
