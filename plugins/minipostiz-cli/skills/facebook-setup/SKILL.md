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
2. Select **Business** type → **Next**
3. Fill in app name and contact email → **Create App**
4. In the dashboard → **Add Product** → find **Facebook Login** → **Set Up**

---

## Step 2 — Add Pages API permissions

1. In your app → **App Review** → **Permissions and Features**
2. Request (or for development, use directly):
   - `pages_manage_posts`
   - `pages_read_engagement`
3. For development/testing: these permissions work without review on pages you admin

---

## Step 3 — Get your Page Access Token

**Easiest method — Graph API Explorer:**

1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app in the **Application** dropdown
3. Click **Generate Access Token** → authorize
4. In the **User or Page** dropdown → select your **Page** (not "User")
5. In **Permissions** → add `pages_manage_posts` and `pages_read_engagement`
6. Click **Generate Access Token** → copy the Page Access Token

**Get a long-lived token (60 days instead of ~1 hour):**

```bash
# Exchange short-lived token for long-lived
curl "https://graph.facebook.com/v19.0/oauth/access_token?\
  grant_type=fb_exchange_token&\
  client_id=YOUR_APP_ID&\
  client_secret=YOUR_APP_SECRET&\
  fb_exchange_token=YOUR_SHORT_LIVED_PAGE_TOKEN"
```

---

## Step 4 — Get your Page ID

**Option A** — from the Graph API Explorer:
After getting the page token, call: `GET /<page-name>?fields=id,name`

**Option B** — from your Page URL:
Go to your Facebook Page → **About** → scroll to find Page ID
(or check `facebook.com/pg/YOUR_PAGE/about/`)

**Option C** — via curl:
```bash
curl "https://graph.facebook.com/v19.0/me?access_token=YOUR_PAGE_TOKEN&fields=id,name"
```

---

## Step 5 — Store in minipostiz-cli

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

## Step 6 — Test

```bash
minipostiz auth verify --platform facebook
minipostiz publish --platform facebook --message "Hello from minipostiz-cli"
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `190 Invalid OAuth access token` | Token expired or wrong type | Regenerate — ensure you selected the **Page** token, not User token |
| `200 Permission error` | Missing `pages_manage_posts` | Add permission in Graph API Explorer before generating token |
| `100 Invalid parameter` | Wrong pageId | Verify pageId via `GET /me?access_token=TOKEN&fields=id` |
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
