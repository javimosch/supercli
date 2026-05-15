---
name: ntn
description: Use this skill when the user wants to interact with the Notion API, upload files to Notion, or manage Notion Workers from the terminal.
---

# ntn — The Notion CLI

Official Notion CLI for API access, Workers management, and file uploads.

## Commands

- `ntn api fetch` — Make Notion API requests
- `ntn files upload` — Upload files to Notion
- `ntn _ _` — Passthrough to ntn CLI

## Installation

```bash
npm i -g ntn
```

## Authentication

```bash
ntn login
# or set NOTION_API_TOKEN
```

## Usage Examples

- "Create a page in Notion"
- "Query a Notion database"
- "Upload a file to Notion"
- "List Notion API endpoints"

## Key Commands

```bash
# List API endpoints
ntn api ls

# Create a page
ntn api v1/pages parent[page_id]=abc123

# Upload a file
ntn files create < file.png

# Inline request syntax
ntn api v1/users page_size==100

# List workers
ntn workers list
```

## Key Features
- **Full API** - Access entire Notion API
- **File Uploads** - Upload files directly
- **Workers** - Deploy & manage Workers
- **Inline Syntax** - Compact request format
- **Official** - Built by Notion
