---
name: minipostiz-mastodon-setup
description: Mastodon API setup for minipostiz-cli — create application, get access token, store instance URL + token
type: setup
---

# minipostiz-cli — Mastodon Setup

Mastodon is federated — your instance URL matters. Each instance has its own API.

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
| Instance URL | `--instanceUrl` (e.g. `https://mastodon.social`) |
| Access Token | `--accessToken` |

---

## Step 1 — Create an Application on your instance

1. Log in to your Mastodon instance (e.g. https://mastodon.social)
2. Go to **Preferences** → **Development** → **New application**
3. Fill in:
   - Application name: `minipostiz`
   - Website: any URL
   - Redirect URI: leave as `urn:ietf:wg:oauth:2.0:oob`
   - Scopes: check **`write:statuses`** and **`write:media`** (uncheck everything else)
4. Click **Submit**
5. Click the app name → copy **Your access token**

> The access token shown on the app page is already authorized for your account — no OAuth flow needed.

---

## Step 2 — Store in minipostiz-cli

```bash
minipostiz auth --platform mastodon \
  --instanceUrl "https://mastodon.social" \
  --accessToken "YOUR_ACCESS_TOKEN"

# Or via supercli
sc minipostiz auth set-mastodon \
  --instanceUrl "https://mastodon.social" \
  --accessToken "YOUR_ACCESS_TOKEN"
```

Replace `mastodon.social` with your actual instance domain.

---

## Step 3 — Test

```bash
minipostiz auth verify --platform mastodon
minipostiz publish --platform mastodon --message "Hello from minipostiz-cli"
```

---

## Visibility options

Store a default visibility by adding it to auth:

```bash
minipostiz auth --platform mastodon \
  --instanceUrl "https://mastodon.social" \
  --accessToken "TOKEN" \
  --visibility "unlisted"   # public | unlisted | private | direct
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Invalid token | Regenerate token in Preferences → Development |
| `422 Unprocessable` | Missing `write:statuses` scope | Recreate app with correct scopes |
| `Connection refused` | Wrong instance URL | Verify URL includes `https://` and no trailing slash issues |

## Token lifetime

Mastodon access tokens **do not expire** unless the application is deleted or access is revoked.
