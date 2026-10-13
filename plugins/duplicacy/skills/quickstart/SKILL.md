---
name: duplicacy
description: Use this skill when the user wants to back up directories with deduplicated incremental snapshots, restore files, or manage backup storages with duplicacy.
---

# duplicacy Plugin

Duplicacy makes deduplicated, incremental, optionally encrypted snapshots. Lock-free design → multiple hosts can share one storage safely. Storages: local disk, SFTP, S3-compatible, B2, GCS, Azure, Dropbox, OneDrive. All commands run inside the repo dir (the dir where `init` was run).

## Commands

### Lifecycle
- `duplicacy repo init <id> <storage_url>` — Mark CWD as a repo for a storage (`-e` encrypts)
- `duplicacy backup run` — Incremental snapshot (`-stats`, `-threads`, `-limit-rate`)
- `duplicacy snapshots list` — Revisions in storage
- `duplicacy files restore` — Restore (`-r N`, `-- <patterns>`)
- `duplicacy storage check` — Integrity check
- `duplicacy _ _` — Passthrough (`prune`, `copy`, `diff`, `history`, `cat`, `add`, `set`...)

## Usage Examples

- "Back up this folder to the NAS over SFTP"
- "Restore yesterday's version of this file"
- "Set retention: keep daily for a week, monthly for 6 months"
- "Copy snapshots from local storage to S3"

## Installation

```bash
# Single static binary — rename the arch-specific download to 'duplicacy'
curl -sSfL "$(curl -s https://api.github.com/repos/gilbertchen/duplicacy/releases/latest \
  | grep -o 'https://[^"]*linux_x64_[0-9.]*' | head -1)" -o ~/.local/bin/duplicacy && chmod +x ~/.local/bin/duplicacy
# or: brew install duplicacy
```

## Examples

```bash
# Init + encrypt (prompts for password)
duplicacy init -e laptop-docs sftp://user@nas/backups/docs

# Backup with stats, 4 threads
duplicacy backup -stats -threads 4

# List revisions / files inside a revision
duplicacy list
duplicacy list -files -r 12

# Restore everything from r12, or one file
duplicacy restore -r 12
duplicacy restore -r 12 -- "docs/report.pdf"

# Retention pruning
duplicacy prune -keep 0:180 -keep 30:30 -keep 7:7 -keep 1:1

# Mirror one storage to another
duplicacy add offsite default s3://bucket/backups
duplicacy copy -from default -to offsite
```

## Key Features

- Lock-free dedup → concurrent backups from many machines to one storage
- Content-defined chunking; AES-256 encryption (`init -e`)
- Include/exclude via `filters` file in `.duplicacy/`
- `copy` replicates snapshots between storages; `prune` applies retention
