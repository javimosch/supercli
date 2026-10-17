---
name: minipostiz-bluesky-setup
description: Bluesky AT Protocol setup for minipostiz-cli — create app password, store handle + password
type: setup
---

# minipostiz-cli — Bluesky Setup

Bluesky uses the AT Protocol. Authentication is a handle + app password (never your main account password).

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
| Handle | `--handle` (e.g. `yourname.bsky.social`) |
| App Password | `--password` |

---

## Step 1 — Create an App Password

1. Go to https://bsky.app → **Settings** (bottom-left)
2. **Privacy and Security** → **App Passwords**
3. Click **Add App Password**
4. Give it a name (e.g. `minipostiz`) → **Create App Password**
5. Copy the generated password — format: `xxxx-xxxx-xxxx-xxxx`

> **Never use your main account password.** App passwords are scoped and revocable.

---

## Step 2 — Find your handle

Your handle is visible on your profile: `@yourname.bsky.social`
Custom domains (e.g. `yourname.com`) also work as handles.

---

## Step 3 — Store in minipostiz-cli

```bash
minipostiz auth --platform bluesky \
  --handle "yourname.bsky.social" \
  --password "xxxx-xxxx-xxxx-xxxx"

# Or via supercli
sc minipostiz auth set-bluesky \
  --handle "yourname.bsky.social" \
  --password "xxxx-xxxx-xxxx-xxxx"
```

---

## Step 4 — Test

```bash
minipostiz auth verify --platform bluesky
minipostiz publish --platform bluesky --message "Hello from minipostiz-cli"
```

---

## Custom / self-hosted instance

If you run your own PDS (Personal Data Server):

```bash
minipostiz auth --platform bluesky \
  --handle "yourname.example.com" \
  --password "xxxx-xxxx-xxxx-xxxx" \
  --host "https://your-pds.example.com"
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Authentication Required` | Wrong handle or password | Double-check handle format (no `@`); use app password not main password |
| `Invalid identifier` | Handle format wrong | Use full handle: `name.bsky.social` not just `name` |
| `Token has been revoked` | App password deleted | Create a new app password at bsky.app → Settings |

## Token lifetime

App passwords **do not expire** but can be revoked at any time from Settings → App Passwords.
