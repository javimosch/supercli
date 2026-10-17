---
name: minipostiz-discord-setup
description: Discord webhook setup for minipostiz-cli — create webhook in a channel, store URL
type: setup
---

# minipostiz-cli — Discord Setup

Discord uses webhooks for posting — no OAuth app or bot required. One URL is all you need.

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
| Webhook URL | `--webhookUrl` |

---

## Step 1 — Create a Webhook

**In Discord desktop or browser:**

1. Open your server → right-click the target channel → **Edit Channel**
2. Go to **Integrations** → **Webhooks** → **New Webhook**
3. Set a name (e.g. `minipostiz`) and optionally upload an avatar
4. Click **Copy Webhook URL** → save it
5. Click **Save**

**Shortcut:** Channel Settings gear icon → Integrations → Webhooks

---

## Step 2 — Store in minipostiz-cli

```bash
minipostiz auth --platform discord \
  --webhookUrl "https://discord.com/api/webhooks/CHANNEL_ID/TOKEN"

# Or via supercli
sc minipostiz auth set-discord \
  --webhookUrl "https://discord.com/api/webhooks/CHANNEL_ID/TOKEN"
```

---

## Step 3 — Test

```bash
minipostiz auth verify --platform discord
minipostiz publish --platform discord --message "Hello from minipostiz-cli"
```

---

## Multiple channels

To post to multiple Discord channels, use multiple webhook credentials under different platform aliases — or use comma-separated platforms with separate auth entries per server/channel.

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `404 Unknown Webhook` | Webhook was deleted | Create a new webhook |
| `401 Invalid Webhook Token` | URL was regenerated | Copy the new URL from channel settings |
| `400 Cannot send empty message` | Empty message string | Ensure `--message` is non-empty |

## Token lifetime

Webhook URLs **do not expire** but can be deleted or regenerated from Channel Settings → Integrations.
