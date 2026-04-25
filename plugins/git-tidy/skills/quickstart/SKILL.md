# git-tidy - Git Branch Cleanup

## Overview
git-tidy tidies up stale git branches. Automatically clean up old and merged branches.

## Quick Start

### Tidy up branches
```bash
sc git-tidy tidy branches
```

### Passthrough to git-tidy CLI
```bash
sc git-tidy _ <git-tidy-args>
```

## Key Features

- **Branch Cleanup**: Remove stale branches
- **Auto Detection**: Identifies old branches
- **Safe Mode**: Interactive confirmation
- **Force Delete**: Option for force deletion
- **Git Integration**: Works with git repositories
- **CLI Tool**: Command-line interface

## Installation

```bash
cargo install git-tidy
```

Also available via:
- Homebrew

## Usage Examples

### Tidy branches interactively
```bash
git-tidy
```

### Force delete stale branches
```bash
git-tidy --force
```

### Dry run
```bash
git-tidy --dry-run
```

### With specific branch pattern
```bash
git-tidy --pattern "feature/*"
```

## Notes

- Run `git-tidy --help` to see all available options
