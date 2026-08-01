---
name: notion-cli
description: Use this skill when the user wants to search, create, read, or manage Notion pages and databases — search workspace, query databases, create pages, read/write page content as Markdown, manage blocks, users, and files.
---

# Notion CLI Plugin

Like `gh` for GitHub, but for Notion. 39 commands. One binary. Full Notion API coverage.

## Prerequisites

Requires a Notion API token (Integration token). Create one at https://www.notion.so/profile/integrations

```bash
# Authenticate
echo "ntn_xxxxx" | notion auth login --with-token
# or
export NOTION_TOKEN=ntn_xxxxx
```

## Commands

### Auth
- `notion auth status` — Check authentication status

### Search
- `notion search run "query"` — Search pages and databases

### Pages
- `notion page view <pageId>` — View page details
- `notion page list` — List recent pages
- `notion page create <dbId> --db "Name=Task" "Status=Todo"` — Create page in database

### Databases
- `notion db list` — List databases
- `notion db query <dbId> --filter 'Status=Done' --sort 'Date:desc'` — Query with filters

### Blocks (Content)
- `notion block list <pageId> --md --depth 3` — Read page as Markdown
- `notion block append <pageId> --file document.md` — Append Markdown content

### Users
- `notion user list` — List workspace members

### API
- `notion api request GET /v1/users/me` — Raw Notion API request

### Full Access
- `notion _ _` — Passthrough for any notion command (comment, file, block insert/update, etc.)

## Usage Examples
- "Search my Notion for meeting notes"
- "Show me the content of that Notion page as Markdown"
- "Create a new page in my Tasks database with status Todo"
- "Query the Projects database for items with Status = Done"
- "List all my Notion databases"
- "Append notes.md to my Weekly Review page"

## Installation

```bash
go install github.com/4ier/notion-cli@latest
```

Or use one of the other supported methods:

```bash
# Homebrew
brew install 4ier/tap/notion-cli

# npm
npm install -g @4ier/notion-cli
```

Or download a binary from [GitHub Releases](https://github.com/4ier/notion-cli/releases).

## Key Features
- **Agent-friendly**: JSON output auto-detected when piped, schema-aware, URL or ID support
- **Full API coverage**: 39 subcommands across pages, databases, blocks, comments, users, files
- **Human-friendly filters**: `--filter 'Status=Done'` — no JSON needed for 90% of queries
- **Markdown I/O**: Read pages as Markdown, write Markdown to pages
- **Smart output**: Colored tables in terminal, clean JSON when piped
- **Single Go binary**: No runtime dependencies
