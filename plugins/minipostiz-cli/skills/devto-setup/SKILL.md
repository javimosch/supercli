---
name: minipostiz-devto-setup
description: Dev.to API setup for minipostiz-cli — generate API key, store credentials, posting format
type: setup
---

# minipostiz-cli — Dev.to Setup

Dev.to has a simple REST API. One API key is all you need.

## Commands
- `minipostiz-cli <resource> <action>` — Execute minipostiz-cli commands
- `minipostiz auth set-x` — Store X/Twitter OAuth 1.0a credentials (apiKey, apiSecret, accessToken, accessSecret)
- `minipostiz auth set-bluesky` — Store Bluesky credentials (handle + app password)
- `minipostiz auth set-discord` — Store Discord webhook URL
- `minipostiz auth set-telegram` — Store Telegram bot token and chat ID
- `minipostiz auth set-mastodon` — Store Mastodon instance URL and access token
- `minipostiz auth set-devto` — Store Dev.to API key
- `minipostiz auth set-linkedin` — Store LinkedIn access token and person URN
- `minipostiz auth set-reddit` — Store Reddit OAuth credentials and target subreddit
- `minipostiz auth set-facebook` — Store Facebook page access token and page ID
- `minipostiz auth list` — List all configured social media platform credentials
- `minipostiz auth remove` — Remove stored credentials for a platform
- `minipostiz auth verify` — Verify stored credentials for a platform are valid
- `minipostiz post publish` — Publish a message immediately to one or more social media platforms
- `minipostiz post schedule` — Schedule a post for future publication on a social media platform
- `minipostiz schedule list` — List scheduled posts, optionally filtered by platform
- `minipostiz schedule cancel` — Cancel a scheduled post by ID
- `minipostiz history list` — Show post history with optional platform and status filters
- `minipostiz platforms list` — List all supported platforms and their auth requirements
- `minipostiz daemon start` — Start the background scheduler daemon
- `minipostiz daemon stop` — Stop the background scheduler daemon
- `minipostiz daemon status` — Check if the scheduler daemon is running
- `minipostiz self status` — Show minipostiz-cli system status: version, db path, platforms, daemon

## What you need

| Credential | Flag |
|------------|------|
| API Key | `--apiKey` |
| Tags (optional) | `--tags` (comma-separated, max 4) |
| Series (optional) | `--series` |

---

## Step 1 — Generate an API Key

1. Go to https://dev.to → sign in
2. Click your avatar → **Settings**
3. **Extensions** → **DEV Community API Keys**
4. Enter a description (e.g. `minipostiz`) → **Generate API Key**
5. Copy the key — it's shown once (but you can generate multiple)

---

## Step 2 — Store in minipostiz-cli

```bash
minipostiz auth --platform devto --apiKey "YOUR_API_KEY"

# With optional defaults
minipostiz auth --platform devto \
  --apiKey "YOUR_API_KEY" \
  --tags "webdev,productivity,tools" \
  --series "My Series Name"

# Or via supercli
sc minipostiz auth set-devto --apiKey "YOUR_API_KEY"
```

---

## Step 3 — Test

```bash
minipostiz auth verify --platform devto
minipostiz publish --platform devto --message "# My First Post

This is the body of the article published via minipostiz-cli."
```

---

## Post format

Dev.to posts are **articles**. minipostiz-cli maps:
- **First line** of `--message` → article title (markdown heading stripped)
- **Remaining lines** → article body (markdown supported)

```bash
minipostiz publish --platform devto --message "# Article Title

## Introduction

Body content here. Supports **bold**, *italic*, \`code\`, etc."
```

---

## Optional: tags and series

Tags and series can be set at auth time (applied to all posts) or overridden:

```bash
# Update auth to set default tags
minipostiz auth --platform devto --apiKey "KEY" --tags "javascript,node,cli"
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Invalid API key | Regenerate key at dev.to → Settings → Extensions |
| `422 Unprocessable` | Article validation failed | Ensure title (first line) is non-empty |
| Post published but no tags | Tags not in auth | Add `--tags` to `minipostiz auth --platform devto` |

## Token lifetime

Dev.to API keys **do not expire** unless deleted from Settings → Extensions.
