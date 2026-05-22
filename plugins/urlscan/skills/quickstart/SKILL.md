---
name: urlscan
description: Use this skill when the user wants to extract URLs from email messages, text files, or MIME content — or view/reply to email threads directly from the terminal.
---

# urlscan Plugin

urlscan extracts and retrieves URLs from email messages, MIME parts, and text files. Integrates with mutt/neomutt for viewing and replying to email threads.

## Commands

- `urlscan _ _ <args>` — Passthrough

## Usage Examples

- "extract URLs from an email file"
- "list URLs in my mailbox"
- "view URLs from MIME encoded email"

## Installation

```bash
pip install urlscan
```

## Key Features
- URL extraction from plain text and MIME-encoded email
- HTML rendering extraction via w3m/lynx
- Regex-based custom URL pattern matching
- Mailcap integration for opening URLs in preferred browser
- Email thread viewer and reply functionality
- Customizable output formatting
