---
name: git-lfs
description: Git LFS — large file storage extension for Git with pattern-based tracking
---

# git-lfs Plugin

Git LFS — large file storage extension for Git with pattern-based tracking

## Installation

```bash
brew install git-lfs
git lfs install
```

Also available via apt, pacman, and direct download from GitHub releases.

## Commands

### `sc git-lfs track add <pattern> [--filename <value>]`

Track file patterns with Git LFS

- `pattern` (string, required) — File pattern to track (e.g., *.psd, *.zip)
- `--filename` (string, optional) — Record the filename as the pattern

### `sc git-lfs track list`

List all tracked file patterns

### `sc git-lfs pull run [--remote <value>] [--include <value>] [--exclude <value>]`

Pull LFS files from remote

- `remote` (string, optional) — Remote name (default: origin)
- `--include` (string, optional) — Include patterns
- `--exclude` (string, optional) — Exclude patterns

### `sc git-lfs fetch run [--remote <value>] [--all] [--recent]`

Fetch LFS files from remote

- `remote` (string, optional) — Remote name
- `--all` (boolean, optional) — Fetch all LFS files
- `--recent` (boolean, optional) — Fetch recently accessed files

### `sc git-lfs status show`

Show LFS file status

### `sc git-lfs ls-files list [--all] [--long] [--size]`

List LFS files in the repository

- `--all` (boolean, optional) — Show all versions
- `--long` (boolean, optional) — Show full object details
- `--size` (boolean, optional) — Show file sizes

### `sc git-lfs env show`

Show Git LFS environment info

### `sc git-lfs migrate run [--include <value>] [--exclude <value>] [--everything] [--yes]`

Migrate existing files to LFS

- `--include` (string, optional) — Include patterns
- `--exclude` (string, optional) — Exclude patterns
- `--everything` (boolean, optional) — Migrate all local refs
- `--yes` (boolean, optional) — Skip confirmation

## Passthrough

```bash
sc git-lfs _ _ <args...>
```

## SuperCLI

```bash
sc git-lfs _ _ --help
sc plugins learn git-lfs
```
