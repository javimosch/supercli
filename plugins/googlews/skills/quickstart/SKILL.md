# Google Workspace CLI (googlews) — Agent Usage Guide

## Overview

The `googlews` plugin provides access to Google Workspace services via the official CLI tool.

## Authentication

Before using, authenticate with:
```bash
googlews auth login
```

## Available Commands

| Command | Description |
|---------|-------------|
| `googlews version` | Display CLI version |
| `googlews drive` | Manage Google Drive files |
| `googlews gmail` | Gmail operations |
| `googlews calendar` | Calendar management |
| `googlews sheets` | Spreadsheet operations |
| `googlews docs` | Document management |
| `googlews chat` | Google Chat messaging |
| `googlews admin` | Admin operations |

## Usage Examples

### Drive
- List files: `googlews drive list`
- Upload file: `googlews drive upload <path>`
- Share file: `googlews drive share <file-id>`

### Gmail
- Send email: `googlews gmail send --to <email> --subject "<subject>" --body "<text>"`
- Search: `googlews gmail search "<query>"`
- List labels: `googlews gmail labels`

### Calendar
- List events: `googlews calendar events list`
- Create event: `googlews calendar events create <title> --start <ISO-date> --end <ISO-date>`

### Sheets
- Read spreadsheet: `googlews sheets read <spreadsheet-id>`
- Update cell: `googlews sheets update <spreadsheet-id> --sheet <name> --cell <cell> --value <value>`

### Docs
- Create document: `googlews docs create <title>`
- Read document: `googlews docs read <document-id>`

### Chat
- Send message: `googlews chat send --space <space-id> --text "<message>"`

### Admin
- List users: `googlews admin users list`
- Create user: `googlews admin users create <email> --first-name <name> --last-name <name>`

## Agent Notes

- All `googlews` commands require authentication via `googlews auth login`
- Use `--json` flag for machine-readable output when parsing is needed
- Operations are scoped to the authenticated user's permissions
- Rate limits apply to API calls; use batching where available
