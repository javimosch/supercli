---
name: x
description: Use this skill when the user wants to post tweets from the terminal, check Twitter/X authentication status, or send tweets with optional media attachments.
---

# x CLI Plugin

Post tweets directly from terminal via browser-based OAuth.

## Commands

### Authentication
- `x auth status` — Verify authentication status

### Posting
- `x tweet post` — Post a tweet with the message

## Usage Examples
- "Post a tweet saying Hello World"
- "Check if x CLI is authenticated"
- "Send a tweet with a link"

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