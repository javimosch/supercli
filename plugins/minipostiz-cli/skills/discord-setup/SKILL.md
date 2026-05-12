---
name: minipostiz-discord-setup
description: Discord webhook setup for minipostiz-cli — create webhook in a channel, store URL
type: setup
---

# minipostiz-cli — Discord Setup

Discord uses webhooks for posting — no OAuth app or bot required. One URL is all you need.

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
