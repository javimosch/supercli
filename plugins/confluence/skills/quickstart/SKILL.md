---
name: confluence
description: Use this skill when the user wants to read, search, or manage Confluence pages from the command line.
---

# confluence Plugin

A powerful command-line interface for Atlassian Confluence. Read, search, and manage Confluence content from the terminal.

## Commands

### Version
- `confluence self version` — Print confluence-cli version

### Page Operations
- `confluence page get` — Get a Confluence page by ID
- `confluence page search` — Search Confluence pages
- `confluence page create` — Create a new Confluence page
- `confluence page update` — Update an existing Confluence page

## Usage Examples
- "Get a Confluence page by ID"
- "Search for pages in Confluence"
- "Create a new wiki page"
- "Update an existing page content"

## Installation

```bash
npm install -g confluence-cli
```

## Configuration

Requires environment variables:
- `CONFLUENCE_BASE_URL` — Your Confluence instance URL
- `CONFLUENCE_USER_EMAIL` — Your Atlassian email
- `CONFLUENCE_API_TOKEN` — Your Atlassian API token

## Examples

```bash
# Get a page
confluence page get <page-id>

# Search pages
confluence page search "search term"

# Create a page
confluence page create --space KEY --title "Page Title" --body "<p>Content</p>"

# Update a page
confluence page update <page-id> --title "New Title" --body "<p>New content</p>"
```
