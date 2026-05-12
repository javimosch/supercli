---
name: minipostiz-mastodon-setup
description: Mastodon API setup for minipostiz-cli — create application, get access token, store instance URL + token
type: setup
---

# minipostiz-cli — Mastodon Setup

Mastodon is federated — your instance URL matters. Each instance has its own API.

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
