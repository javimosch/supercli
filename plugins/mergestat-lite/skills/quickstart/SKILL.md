# mergestat-lite Plugin Quickstart

## Overview

mergestat-lite runs SQL queries on git repositories. Query commits, files, authors, and more using familiar SQL syntax.

## Commands

### Query Execution
- `mergestat-lite query run` — Execute a SQL query on a repo
- `mergestat-lite query commits` — Query commits table

### Reports
- `mergestat-lite summarize commits` — Summarize commits with stats

### Passthrough
- `mergestat-lite _ _` — Run any mergestat command directly

## Installation

```bash
brew tap mergestat/mergestat && brew install mergestat
```

## Usage Examples

```bash
# Count commits by author
mergestat-lite query run --repo . --sql "SELECT author_email, count(*) FROM commits GROUP BY author_email"

# Get recent commits
mergestat-lite query run --repo . --sql "SELECT * FROM commits ORDER BY author_when DESC LIMIT 10"

# Summarize commits
mergestat-lite summarize commits --repo . --start 2024-01-01

# Output as CSV
mergestat-lite -f csv "SELECT * FROM commits LIMIT 5" --repo .
```

## SQL Tables Available

- `commits` — Git commits with hash, author, message, files
- `files` — Files in the repository
- `refs` — Branches and tags
- `blobs` — File contents

## Output Formats

- `-f json` — JSON array
- `-f ndjson` — Newline-delimited JSON
- `-f csv` — CSV
- Default — Pretty table format

## Notes

- Local repos: use path to repo
- Remote repos: use GitHub/GitLab URL
- SQLite-powered under the hood