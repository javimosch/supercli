# easyredmine-cli Quickstart

## Overview

easyredmine-cli interacts with EasyRedmine (Simpliciti) via the Redmine API. JSON output by default. No interactive prompts. Auth via config file or `EASYREDMINE_API_KEY` env var.

## Commands

### `sc easyredmine issue show <id>`
Read issue details (JSON output by default).

```bash
# JSON (default) — agent-friendly
sc easyredmine issue show 61809

# Human-readable
sc easyredmine issue show 61809 --human
```

### `sc easyredmine issue comment <id> --text "<text>"`
Add a comment. JSON response by default.

```bash
sc easyredmine issue comment 61809 --text "Comment from agent"
```

### `sc easyredmine issue edit <id> --description "<text>"`
Edit description. JSON response by default.

```bash
sc easyredmine issue edit 61809 --description "<p>Updated</p>"
```

## Auth

Three ways, highest precedence first:

1. `EASYREDMINE_API_KEY` env var (best for agents — no config file needed)
2. `EASYREDMINE_BASE_URL` env var overrides base URL
3. Config file at `~/.config/easyredmine-cli/config.json`

```bash
# Config file approach
easyredmine-cli config set --api-key <key>

# Env var approach (no file needed)
EASYREDMINE_API_KEY=<key> sc easyredmine issue show 61809
```

## Semantic exit codes

Errors on stderr as structured JSON. Agents use exit code to decide next action:
- `85` → fix input/args
- `92` → resource not found, try different ID
- `105` → transient API error, retry with backoff
