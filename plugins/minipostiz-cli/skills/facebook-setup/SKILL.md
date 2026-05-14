---
name: minipostiz-facebook-setup
description: Facebook Graph API setup for minipostiz-cli — create app, get page access token + page ID, store credentials
type: setup
---

# minipostiz-cli — Facebook Setup

minipostiz-cli posts to **Facebook Pages** (not personal profiles — the Graph API doesn't support personal timeline posts). You need a Page Access Token and the Page ID.

## What you need

| Credential | Flag |
|------------|------|
| Page Access Token | `--pageAccessToken` |
| Page ID | `--pageId` |

---

## Step 1 — Create a Facebook App

1. Go to https://developers.facebook.com/apps → **Create App**
2. Choose **"Authenticate and request data from users"** use case (Consumer type) → **Next**
   - ⚠️ Do NOT pick Business type — it won't show `pages_manage_posts` in Graph Explorer
3. Fill in app name and contact email → **Create App**

---

## Step 2 — Add Pages permissions via Use Cases

The new Facebook developer dashboard (2024+) uses **use cases** instead of individual permission requests:

1. In your app dashboard → click **"Customize the Manage everything on your Page use case"**
2. Add the following permissions to that use case:
   - `pages_manage_posts`
   - `pages_read_engagement`
3. Save — these are available in development mode without App Review for pages you admin

> **Note:** There is no longer an "App Review → Permissions and Features" link in the dashboard. The use case customization screen is the replacement.

---

## Step 3 — Get your Page Access Token

**Via Graph API Explorer (recommended):**

1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app in the **Application** dropdown
3. Click the blue **Generate Access Token** button (opens a Facebook Login popup — NOT "Get App Token")
4. In the **Permissions** list, add `pages_manage_posts` and `pages_read_engagement`
5. Authorize → in the **User or Page** dropdown → switch to your **Page** (e.g. "Savoie Tech")
6. Copy the Page Access Token shown

**Get your Page ID and a proper Page Token via curl (alternative):**

```bash
# Use the User token to list all pages you manage + their page tokens
curl "https://graph.facebook.com/v21.0/me/accounts?access_token=YOUR_USER_TOKEN"
# Response includes each page's id and access_token — use those directly
```

**Get a long-lived token (60 days instead of ~1 hour):**

```bash
curl "https://graph.facebook.com/v21.0/oauth/access_token?\
  grant_type=fb_exchange_token&\
  client_id=YOUR_APP_ID&\
  client_secret=YOUR_APP_SECRET&\
  fb_exchange_token=YOUR_SHORT_LIVED_PAGE_TOKEN"
```

---

## Step 4 — Store in minipostiz-cli

```bash
minipostiz auth --platform facebook \
  --pageAccessToken "YOUR_PAGE_ACCESS_TOKEN" \
  --pageId "123456789012345"

# Or via supercli
sc minipostiz auth set-facebook \
  --pageAccessToken "YOUR_PAGE_ACCESS_TOKEN" \
  --pageId "123456789012345"
```

---

## Step 5 — Test

```bash
minipostiz auth verify --platform facebook
minipostiz publish --platform facebook --message "Hello from minipostiz-cli"
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `190 Invalid OAuth access token` | Token expired or wrong type | Regenerate — ensure you clicked **Generate Access Token** (not "Get App Token") and switched to the **Page** token |
| `283 Requires pages_read_engagement` | Missing permission on token | Re-generate token with `pages_read_engagement` added; ensure use case is configured in app dashboard |
| `200 Permission error` | Missing `pages_manage_posts` | Add permission via use case customization in app dashboard |
| `100 Object does not exist` | Token is a User token, not Page token | Switch to Page in the User/Page dropdown in Graph Explorer |
| `368 Blocked` | Page or account restricted | Check Page Quality in Facebook Business Suite |

## Token lifetime

- **Short-lived Page Token:** ~1-2 hours
- **Long-lived Page Token:** ~60 days (use the exchange flow above)
- **Never-expiring Page Token:** possible for some page roles — check Meta docs

## Re-generating tokens

When your token expires, repeat Step 3 (Graph API Explorer) and update:
```bash
minipostiz auth --platform facebook \
  --pageAccessToken "NEW_TOKEN" \
  --pageId "YOUR_PAGE_ID"
```
