---
name: notion-cli
description: Use this skill when the user wants to search, create, read, update, or manage Notion pages, databases, blocks, comments, files, and users.
---

# Notion CLI Plugin

Like `gh` for GitHub, but for Notion. Manage the full Notion API from a single Go binary.

## Prerequisites

Requires a Notion API token (integration token). Create one at https://www.notion.so/profile/integrations

```bash
# Authenticate via stdin
echo "ntn_xxxxx" | notion auth login --with-token
# or
export NOTION_TOKEN=ntn_xxxxx
```

## Commands

### Version
- `notion self version` — Print notion-cli version

### Auth
- `notion auth status` — Check authentication status
- `notion auth doctor` — Check authentication and API connectivity
- `notion auth logout` — Log out of Notion

### Search
- `notion search run "query"` — Search pages and databases

### Pages
- `notion page view <pageId>` — View page details
- `notion page list` — List recent pages
- `notion page create <parentId> --title "My Page" --body "Body text"` — Create page under a page
- `notion page create <dbId> "Name=Task" "Status=Todo" --db` — Create page in a database (place `--db` after property pairs)
- `notion page archive <pageId>` — Archive (soft-delete) a page
- `notion page restore <pageId>` — Restore an archived page
- `notion page move <pageId> --to <parentId>` — Move a page to a new parent
- `notion page open <pageId>` — Open a page in the browser
- `notion page set <pageId> Status=Done Priority=High` — Set page properties
- `notion page props <pageId>` — Show page properties
- `notion page link <pageId> --prop "Project" --to <pageId>` — Link a page via a relation property
- `notion page unlink <pageId> --prop "Project" --from <pageId>` — Remove a relation link

### Databases
- `notion db list` — List databases
- `notion db view <dbId>` — Show database schema
- `notion db query <dbId> --filter 'Status=Done' --sort 'Date:desc'` — Query with filters
- `notion db add <dbId> "Name=Task" "Status=Todo"` — Add a row to a database
- `notion db add-bulk <dbId> --file items.json` — Bulk add rows from a JSON file
- `notion db create <parentId> --title "Tasks" --props "Status:select,Date:date"` — Create a database
- `notion db update <dbId> --title "New Title" --add-prop "Priority:select"` — Update a database
- `notion db open <dbId>` — Open a database in the browser
- `notion db export <dbId> --format csv --output report.csv` — Export database rows

### Blocks (Content)
- `notion block list <pageId> --md --depth 3` — Read page as Markdown
- `notion block get <blockId>` — Get a specific block
- `notion block append <parentId> "Hello world" --type h1` — Append blocks to a page
- `notion block append <parentId> --file document.md` — Append Markdown from a file
- `notion block insert <parentId> "New paragraph" --after <blockId>` — Insert after a block
- `notion block update <blockId> --text "Updated content"` — Update a block
- `notion block delete <blockId> ...` — Delete one or more blocks
- `notion block move <blockId> --after <blockId>` — Move a block

### Comments
- `notion comment list <pageId>` — List comments on a page
- `notion comment add <pageId> "This looks great"` — Add a comment
- `notion comment get <commentId>` — Get a comment by ID
- `notion comment reply <commentId> "Thanks"` — Reply to a comment
- `notion comment update <commentId> --text "Fixed typo"` — Update a comment
- `notion comment delete <commentId> ...` — Delete comments

### Users
- `notion user me` — Show current bot user
- `notion user list` — List workspace members
- `notion user get <userId>` — Get a user by ID

### Files
- `notion file list` — List file uploads
- `notion file upload <file-path|url|->` — Upload a file to Notion
- `notion file get <uploadId>` — Retrieve a file upload by ID

### Raw API
- `notion api request GET /v1/users/me` — Raw Notion API request

### Full Access
- `notion _ _` — Passthrough for any notion command not covered above

## Usage Examples
- "Search my Notion for meeting notes"
- "Show me the content of that Notion page as Markdown"
- "Create a new page in my Tasks database with status Todo"
- "Query the Projects database for items with Status = Done"
- "List all my Notion databases"
- "Append notes.md to my Weekly Review page"
- "Archive the page with ID abc123"
- "Move page abc123 under parent def456"
- "Export my Tasks database to CSV"

## Installation

The recommended install is with `go install`. The resulting binary is named `notion-cli`, so symlink or rename it to `notion` before running any commands:

```bash
go install github.com/4ier/notion-cli@latest
GOBIN=$(go env GOBIN); GOPATH=$(go env GOPATH); ln -sf "${GOBIN:-$GOPATH/bin}/notion-cli" "${GOBIN:-$GOPATH/bin}/notion"
```

Or install with Homebrew:

```bash
brew install 4ier/tap/notion-cli
```

Or install with npm:

```bash
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
