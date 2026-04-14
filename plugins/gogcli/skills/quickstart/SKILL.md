---
name: gogcli
description: Use this skill when the user wants to manage Gmail emails, Google Calendar events, Drive files, Contacts, or other Google Suite services via CLI.
---

# gogcli Plugin

Google Suite CLI for Gmail, Calendar, Drive, Tasks, Contacts, and more.

## Commands

### Authentication
- `gogcli auth status` — Show current auth state and services

### Gmail
- `gogcli gmail search` — Search threads/messages (use query like "newer_than:7d")
- `gogcli gmail send` — Send an email (requires --to, --subject)
- `gogcli gmail labels` — List all labels

### Calendar
- `gogcli calendar events` — List events (use --today for today, --calendar for specific)
- `gogcli calendar create` — Create event (requires --summary, --from, --to)

### Drive
- `gogcli drive list` — List files (optional --query filter)

### Tasks
- `gogcli tasks list` — List tasks

### Contacts
- `gogcli contacts search` — Search contacts by query

## Usage Examples
- "Search my Gmail for emails from last week"
- "Send an email to test@example.com with subject Hi"
- "List today's calendar events"
- "Create a meeting tomorrow at 2pm"
- "List files in Drive named report"

## Setup

```bash
brew install gogcli
gog auth credentials ~/Downloads/client_secret.json
gog auth add you@gmail.com
```

## Environment Variables
- `GOG_ACCOUNT` — Default account email
- `GOG_JSON` — Default JSON output
- `GOG_TIMEZONE` — Default timezone (e.g., America/New_York)