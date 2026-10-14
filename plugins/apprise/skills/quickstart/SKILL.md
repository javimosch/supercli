---
name: apprise
description: Use this skill when the user wants to send push notifications to Discord, Slack, Telegram, email, or 100+ other services from a script or pipeline.
---

# apprise Plugin

apprise abstracts 100+ notification services behind URL-style endpoints. Give it a title, a body, and one or more service URLs — it handles each provider's API for you.

## Commands

- `apprise self version` — Print apprise version
- `apprise notify send` — Send a notification: apprise -t 'Title' -b 'Body' <urls>. The URL scheme picks the service (tgram://, discord://, mailto://, ntfy://, ...)
- `apprise _ _` — Passthrough to apprise CLI

## Usage Examples

- "Ping my Discord webhook when the deploy finishes"
- "Broadcast an alert to Telegram and email at once"
- "Attach a log file to a notification"

## Installation

```bash
pip install apprise
# or: pipx install apprise
# or: brew install apprise
```

## Examples

```bash
apprise -t "Build" -b "Deploy finished" discord://webhook_id/token
apprise -b "Alert" tgram://bot_token/chat_id mailto://user:pass@smtp.host
apprise -t "Report" -b "See attached" -a report.pdf ntfy://ntfy.sh/mytopic
apprise -c ~/.apprise -T ops -b "tagged notification"
```

## Key Features

- One URL scheme per service — swap providers without changing code
- Broadcasts to multiple URLs, with tagging/filtering via config files
- Supports attachments, HTML/Markdown bodies, and notification types (info/success/warning/failure)
