---
name: mailpit
description: Use this skill when the user wants to test email sending locally, catch outgoing mail from an app, or inspect messages in a web UI instead of hitting real inboxes.
---

# mailpit Plugin

Mailpit is an SMTP catch-all for development. Point your app at port 1025 and every message lands in Mailpit's web UI (port 8025) and REST API — nothing reaches real inboxes.

## Commands

- `mailpit self version` — Print mailpit version and update info
- `mailpit server start` — Start Mailpit SMTP server + web UI (defaults: SMTP :1025, UI :8025; flags --smtp, --listen, --database). Long-running
- `mailpit mail sendmail` — Send mail via the sendmail-compatible command (mailpit sendmail -t to@x -f from@y < msg.eml)
- `mailpit _ _` — Passthrough to mailpit CLI

## Usage Examples

- "Start a local SMTP catcher and web UI for my app's outgoing mail"
- "Verify the welcome email my app sends without a real mailbox"
- "Send a test message through the sendmail-compatible CLI"

## Installation

```bash
brew install mailpit
# or: go install github.com/axllent/mailpit@latest
# or: docker run -p 1025:1025 -p 8025:8025 axllent/mailpit
```

## Examples

```bash
mailpit                                    # SMTP :1025 + UI :8025
mailpit --smtp 0.0.0.0:1025 --listen 0.0.0.0:8025
mailpit --smtp-auth-accept-any             # accept any SMTP credentials
mailpit sendmail -t user@test -f me@test < message.eml
```

## Key Features

- Single static binary — no services or database needed (SQLite optional for persistence)
- Web UI + REST API + POP3 for CI assertions on subject/body/attachments
- HTML link checks, spam score report, and message tagging/search
