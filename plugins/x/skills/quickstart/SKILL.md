# x CLI Plugin Quickstart

## Overview

x CLI plugin provides Twitter/X posting capability. Uses browser-based OAuth for authentication.

## Commands

### Authentication
- `x auth status` — Verify authentication status

### Posting
- `x tweet post` — Post a tweet

### Passthrough
- `x _ _` — Run any x command directly

## Usage Examples

```bash
# Post a tweet
supercli x tweet post --message "Hello from supercli!"

# Verify auth status
supercli x auth status

# Raw passthrough
supercli x _ _ -- -t "Direct tweet"
```

## Setup

1. Download from https://github.com/devhindo/x/releases/latest
2. Extract and add to PATH
3. Run `x auth` on a machine with browser access
4. Verify with `x auth -v`
5. Copy config to server if needed (typically `~/.config/x/config.json`)

## Notes

- Auth config stored at `~/.config/x/config.json`
- Requires browser for initial OAuth flow
- Config must be present on server for posting to work