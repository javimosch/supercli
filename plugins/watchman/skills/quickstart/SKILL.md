---
name: watchman
description: Use this skill when the user wants to watch files for changes, set up file triggers, or query file change history.
---

# watchman Plugin

Watchman -- a file watching service by Facebook for tracking changes and triggering actions when files change.

## Commands

### Watching
- `watchman watch start` — Start watching a directory for changes
- `watchman watch list` — List all watched directories

### Changes
- `watchman changes since` — Query changes since a given timestamp

### Triggers
- `watchman trigger add` — Set up a trigger to run a command on file changes
- `watchman trigger list` — List triggers for a watched directory

### Utility
- `watchman self version` — Print watchman version
- `watchman _ _` — Passthrough to watchman CLI

## Usage Examples
- "Watch this directory for changes"
- "What files have changed since yesterday?"
- "Set up a trigger to rebuild when source files change"
- "List all directories being watched"

## Installation

```bash
brew install watchman
```

Or on Linux:
```bash
apt-get install watchman
```

## Examples

```bash
# Print watchman version
watchman self version

# Start watching a directory
watchman watch start /path/to/project

# List watched directories
watchman watch list

# Query changes since a timestamp
watchman changes since /path/to/project 2024-01-01T00:00:00

# Set up a trigger
watchman trigger add /path/to/project rebuild "*.js" -- npm run build

# List triggers
watchman trigger list /path/to/project

# Any watchman command with passthrough
watchman _ _ log
watchman _ _ shutdown
```

## Key Features
- **File watching** — Efficient recursive directory watching
- **Change tracking** — Query changes by timestamp or subscription
- **Triggers** — Run commands automatically on file changes
- **Cross-platform** — Works on macOS, Linux, and Windows
- **Efficient** — Uses OS-native file watching (inotify, FSEvents, etc.)

## Notes
- Watchman daemon must be running for most commands
- Start daemon with `watchman watch /path` (auto-starts daemon)
- Used by React Native, Buck, and other large build systems
- Configuration stored in ~/.watchman/
