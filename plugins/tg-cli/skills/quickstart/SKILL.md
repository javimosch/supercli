---
name: tg-cli
description: Use this skill when the user wants to interact with Telegram — sync chats, search messages, browse recent activity, export conversations, or check account status.
---

# tg-cli Plugin

Telegram CLI for local-first sync, search, export via MTProto.

## Commands

### Account
- `tg-cli self version` — Print version
- `tg-cli self status` — Check account and sync status

### Chats
- `tg-cli chats list` — List Telegram chats

### Messages
- `tg-cli search run` — Search messages by keyword
- `tg-cli recent list` — List recent messages
- `tg-cli refresh run` — Refresh local Telegram cache

## Usage Examples
- "Refresh my Telegram cache"
- "Search for messages about Rust"
- "Show recent messages from last 24 hours"
- "List my Telegram chats"

## Installation

```bash
uv tool install kabi-tg-cli
```

## Examples

```bash
# Login and sync
tg chats
tg refresh

# Search messages
tg search "Rust" --hours 48 --yaml
tg recent --hours 24 --limit 20 --yaml

# Export
tg export "GroupName" -f yaml -o messages.yaml

# Today's messages
tg today --sync-first
```

## Notes
- Requires Telegram API credentials (TG_API_ID, TG_API_HASH)
- First run prompts for phone number and verification code
- Messages cached locally in SQLite for fast retrieval
- Use --sync-first to refresh before querying
