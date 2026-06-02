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

### `sc easyredmine issue search "<phrase>"`
Smart search across all open issues. Breaks phrase into words, matches each word against issue subjects, deduplicates, and ranks by number of word matches.

```bash
# JSON (default)
sc easyredmine issue search "correction statut message"

# Human-readable with custom limit
sc easyredmine issue search "correction statut" --limit 5 --human
```

| Flag | Default | Purpose |
|------|---------|---------|
| `--limit` | 20 | Max results |
| `--offset` | 0 | Result offset |
| `--status` | `open` | Status filter (`open`, `*`, or numeric ID) |
| `--current-month` | false | Only issues updated this month (API-side filter, **~3s**) |
| `--current-year` | false | Only issues updated this year (API-side filter, **~15s**) |
| `--after` | — | Only issues updated after YYYY-MM-DD (API-side filter) |
| `--min-matches` | 1 | Minimum word matches to include |

**Performance tip**: Use `--current-month` when possible. It fetches ~100 issues (1 page) instead of 3,630 (37 pages) — 30x faster. Progress events on stderr.

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
