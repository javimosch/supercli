# gogcli Plugin Quickstart

## Overview

gogcli provides Google Suite CLI access: Gmail, Calendar, Drive, Tasks, Contacts, Sheets, Docs, and more.

## Commands

### Authentication
- `gogcli auth status` — Show current auth state and services

### Gmail
- `gogcli gmail search` — Search threads/messages
- `gogcli gmail send` — Send an email
- `gogcli gmail labels` — List labels

### Calendar
- `gogcli calendar events` — List events (--today flag)
- `gogcli calendar create` — Create event

### Drive
- `gogcli drive list` — List files

### Tasks
- `gogcli tasks list` — List tasks

### Contacts
- `gogcli contacts search` — Search contacts

### Passthrough
- `gogcli _ _` — Run any gog command directly

## Setup

```bash
# Install
brew install gogcli

# OAuth setup
gog auth credentials ~/Downloads/client_secret.json
gog auth add you@gmail.com

# Verify
gog auth status
```

## Usage Examples

```bash
# Search Gmail
supercli gogcli gmail search --query "newer_than:7d"

# Send email
supercli gogcli gmail send --to "a@b.com" --subject "Hi" --body "Hello"

# Today's calendar
supercli gogcli calendar events --calendar primary --today

# Create event
supercli gogcli calendar create --calendar primary --summary "Meeting" --from 2026-04-15T10:00:00Z --to 2026-04-15T11:00:00Z

# List Drive files
supercli gogcli drive list --query "name contains 'report'"

# Search contacts
supercli gogcli contacts search --query "John"

# Raw passthrough
supercli gogcli _ _ -- gmail labels list
```

## Environment Variables

- `GOG_ACCOUNT` — Default account email
- `GOG_JSON` — Default JSON output
- `GOG_TIMEZONE` — Default timezone (e.g., America/New_York)

## Notes

- All commands return JSON with `--json` flag
- Uses system keychain for secure token storage
- Supports multiple accounts via `--account` flag
- Headless auth available with `--manual` flag