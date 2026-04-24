---
name: gws
description: Use this skill when the user wants to interact with Google Workspace services (Drive, Gmail, Calendar, Sheets, Docs, Chat, Admin, etc.) from the command line. Supports structured JSON output, dry-run previews, and headless CI authentication.
---

# gws Plugin

Official Google Workspace CLI for Drive, Gmail, Calendar, Sheets, Docs, Chat, Admin, and more. Dynamically built from Google Discovery Service with structured JSON output and headless CI authentication support.

## Commands

### Google Workspace Operations
- `gws _ _` — Passthrough to gws CLI for any Google Workspace command

### Utility
- `gws self version` — Print gws version

## Usage Examples
- "List my Google Drive files"
- "Create a new Google Sheet"
- "Send a message in Google Chat"
- "List upcoming Calendar events"
- "Get admin user list"
- "Check Gmail labels"
- "Create a Google Doc"

## Installation

```bash
npm install -g @googleworkspace/cli
```

## Authentication

### Interactive (laptop)
```bash
gws auth setup    # walks you through Google Cloud project config
gws auth login     # subsequent OAuth login
```

### Headless / CI
Use Service Account credentials or the export flow:
```bash
export GWS_CLIENT_ID=...
export GWS_CLIENT_SECRET=...
export GWS_REFRESH_TOKEN=...
gws drive files list --params '{"pageSize": 10}'
```

## Examples

```bash
# List Drive files (dry-run to preview)
gws _ _ drive files list --params '{"pageSize": 5}' --dry-run

# List Drive files (execute)
gws _ _ drive files list --params '{"pageSize": 10}'

# Stream paginated results as NDJSON
gws _ _ drive files list --params '{"pageSize": 100}' --page-all | jq -r '.files[].name'

# Create a spreadsheet
gws _ _ sheets spreadsheets create --json '{"properties": {"title": "Q1 Budget"}}'

# Send a Chat message
gws _ _ chat spaces messages create --params '{"parent": "spaces/xyz"}' --json '{"text": "Deploy complete."}' --dry-run

# Get a file's metadata
gws _ _ drive files get --params '{"fileId": "FILE_ID"}'

# List Calendar events
gws _ _ calendar events list --params '{"calendarId": "primary", "maxResults": 10}'

# List Gmail labels
gws _ _ gmail users labels list --params '{"userId": "me"}'

# Admin: list users
gws _ _ admin directory users list --params '{"customer": "my_customer", "maxResults": 10}'

# Introspect any method's request/response schema
gws _ _ schema drive.files.list
```

## Key Features
- **Unified CLI** — One tool for all Google Workspace APIs
- **Dynamic discovery** — Built from Google Discovery Service, always up-to-date
- **Structured JSON** — Every response is structured JSON, ideal for AI agents
- **Auto-pagination** — `--page-all` streams paginated results
- **Dry-run mode** — `--dry-run` previews requests without executing
- **Schema introspection** — `gws schema <resource.method>` shows request/response schemas
- **Multiple auth modes** — Interactive, browser-assisted, headless/CI, Service Account
- **NDJSON streaming** — Pipe paginated results to `jq` or other tools

## Authentication Methods
- **Interactive** — `gws auth setup` + `gws auth login`
- **Browser-assisted** — For human or agent workflows
- **Headless / CI** — Export flow with env vars (`GWS_CLIENT_ID`, `GWS_CLIENT_SECRET`, `GWS_REFRESH_TOKEN`)
- **Service Account** — Server-to-server with JSON key file (`GOOGLE_APPLICATION_CREDENTIALS`)
- **Pre-obtained Access Token** — `GWS_ACCESS_TOKEN`

## Notes
- Requires a Google Cloud project with OAuth 2.0 credentials
- Enable relevant APIs in Google Cloud Console (Drive, Gmail, Calendar, etc.)
- Use `--help` on any command to see available flags and parameters
- `--dry-run` is useful for testing complex operations before executing
- `--page-all` automatically handles pagination and outputs NDJSON
- The CLI supports multipart uploads, custom headers, and advanced parameters
