---
name: serpl
description: Use this skill when the user wants to search and replace text across files interactively in the terminal — refactor code, rename symbols, or batch-edit with ripgrep-powered preview.
---

# serpl Plugin

Terminal UI for search and replace across files, powered by ripgrep. A TUI alternative to VS Code's find-and-replace with per-match preview before applying changes.

## Prerequisites

Requires [ripgrep](https://github.com/BurntSushi/ripgrep) (`rg`) installed and on PATH.

## Installation

```bash
cargo install serpl
```

Download binaries from [GitHub Releases](https://github.com/yassinebridi/serpl/releases).

## Basic Usage

```bash
# Launch interactive search/replace in current directory
serpl

# Limit to a path or glob
serpl ./src
```

## Features

- Regex, case-sensitive, and whole-word matching
- Per-match preview before replace
- Ripgrep-speed file scanning
- Interactive confirmation for each replacement

## Usage Examples

- "Find and replace this function name across the repo"
- "Rename this import in all TypeScript files"
- "Search for a regex pattern and preview matches before replacing"

## SuperCLI

```bash
sc serpl _ _
sc plugins learn serpl
```
