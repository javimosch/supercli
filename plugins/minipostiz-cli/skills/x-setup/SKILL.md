---
name: minipostiz-x-setup
description: X/Twitter OAuth 1.0a setup for minipostiz-cli — create developer app, get all 4 keys, store credentials
type: setup
---

# minipostiz-cli — X (Twitter) Setup

X uses OAuth 1.0a for posting. You need 4 keys: API Key, API Secret, Access Token, Access Token Secret.

## What you need

| Credential | Flag |
|------------|------|
| API Key (Consumer Key) | `--apiKey` |
| API Secret (Consumer Secret) | `--apiSecret` |
| Access Token | `--accessToken` |
| Access Token Secret | `--accessSecret` |

---

## Step 1 — Create a Developer App

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Sign in with your X account → click **+ Create Project**
3. Fill in project name, use case, description → create
4. Create an **App** inside the project
5. In App Settings → **User authentication settings** → click Edit:
   - App permissions: **Read and Write**
   - Type of App: **Web App, Automated App or Bot**
   - Callback URI: `http://localhost` (required, not actually used)
   - Website URL: any valid URL
6. Save

> **Read and Write** permission is required — Read-only tokens cannot post.

---

## Step 2 — Get API Keys

In your app → **Keys and Tokens** tab:

1. **API Key and Secret** section → click **Regenerate** → copy both values immediately (secret shown once)
2. **Access Token and Secret** section → click **Generate** → copy both values immediately

> If you already generated them and lost the secret, regenerate — old tokens are invalidated.

---

## Step 3 — Store in minipostiz-cli

```bash
minipostiz auth --platform x \
  --apiKey "YOUR_API_KEY" \
  --apiSecret "YOUR_API_SECRET" \
  --accessToken "YOUR_ACCESS_TOKEN" \
  --accessSecret "YOUR_ACCESS_SECRET"

# Or via supercli
sc minipostiz auth set-x \
  --apiKey "YOUR_API_KEY" \
  --apiSecret "YOUR_API_SECRET" \
  --accessToken "YOUR_ACCESS_TOKEN" \
  --accessSecret "YOUR_ACCESS_SECRET"
```

---

## Step 4 — Test

```bash
minipostiz publish --platform x --message "Hello from minipostiz-cli"
minipostiz history --platform x --limit 5
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Wrong keys or Read-only permission | Check all 4 keys; ensure app has Read+Write |
| `403 Forbidden` | App not approved for write access | Set app permissions to Read and Write, regenerate tokens |
| `187 Status is a duplicate` | Identical tweet already posted | Change the message text |
| `453 App not allowed` | Free tier restriction | Basic tier ($100/mo) required for v2 posting |

## Free tier limits (as of 2025)

- Free tier: **500 tweets/month**, no media upload
- Basic tier: 3,000 tweets/month, media upload supported
- minipostiz uses Twitter API v2 for posting and v1.1 for media upload

## Token lifetime

OAuth 1.0a tokens **do not expire** unless you regenerate them or revoke app access.
