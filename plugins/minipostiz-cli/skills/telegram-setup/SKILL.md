---
name: minipostiz-telegram-setup
description: Telegram Bot API setup for minipostiz-cli — create bot via BotFather, get token + chat ID, store credentials
type: setup
---

# minipostiz-cli — Telegram Setup

Telegram posting uses a Bot. You need a bot token and the ID of the chat/channel to post to.

## What you need

| Credential | Flag |
|------------|------|
| Bot Token | `--botToken` |
| Chat ID | `--chatId` |

---

## Step 1 — Create a Bot via BotFather

1. Open Telegram → search for **@BotFather**
2. Send `/newbot`
3. Follow prompts: enter a display name, then a username (must end in `bot`)
4. Copy the **token** — format: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`

> Store the token securely — it gives full control over your bot.

---

## Step 2 — Get the Chat ID

The chat ID depends on where you want to post:

### Option A — Post to a group or supergroup

1. Add your bot to the group (search bot username → Add to Group)
2. Send any message in the group
3. Open in browser: `https://api.telegram.org/botTOKEN/getUpdates`
   (replace `TOKEN` with your bot token)
4. Find `"chat": {"id": -XXXXXXXXXX}` — that negative number is your chat ID

### Option B — Post to a channel

1. Add your bot as an **admin** of the channel (Manage Channel → Administrators → Add Admin)
2. Forward any message from the channel to @username_to_id_bot (or use getUpdates)
3. Channel chat IDs are negative numbers starting with `-100`

### Option C — Post to yourself (DM)

1. Send any message to your bot from your personal account
2. Open: `https://api.telegram.org/botTOKEN/getUpdates`
3. Find `"from": {"id": XXXXXXXXX}` — that positive number is your personal chat ID

---

## Step 3 — Store in minipostiz-cli

```bash
minipostiz auth --platform telegram \
  --botToken "123456789:ABCdefGHIjklMNOpqrSTUvwxYZ" \
  --chatId "-1001234567890"

# Or via supercli
sc minipostiz auth set-telegram \
  --botToken "123456789:ABCdefGHIjklMNOpqrSTUvwxYZ" \
  --chatId "-1001234567890"
```

---

## Step 4 — Test

```bash
minipostiz auth verify --platform telegram
minipostiz publish --platform telegram --message "Hello from minipostiz-cli"
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `chat not found` | Bot not in chat, or wrong chatId | Add bot to group/channel; re-check chatId from getUpdates |
| `Forbidden: bot can't send messages to the bot` | chatId is the bot's own ID | Use a group/channel ID, not the bot's ID |
| `Forbidden: bot is not a member` | Bot not added to channel | Add bot as admin in channel settings |
| `Unauthorized` | Invalid bot token | Regenerate via BotFather: `/token` → select your bot |

## Token lifetime

Bot tokens **do not expire** unless revoked via BotFather (`/revoke`).
