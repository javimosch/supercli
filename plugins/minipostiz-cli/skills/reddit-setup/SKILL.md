---
name: minipostiz-reddit-setup
description: Reddit OAuth setup for minipostiz-cli — create script app, get client credentials, store with username/password/subreddit
type: setup
---

# minipostiz-cli — Reddit Setup

Reddit uses OAuth2 password grant for script-type apps. You need app credentials + your account credentials + a target subreddit.

## What you need

| Credential | Flag |
|------------|------|
| Client ID | `--clientId` |
| Client Secret | `--clientSecret` |
| Reddit Username | `--username` |
| Reddit Password | `--password` |
| Target Subreddit | `--subreddit` |

---

## Step 1 — Create a Reddit App

1. Go to https://www.reddit.com/prefs/apps
2. Scroll down → click **Create another app...**
3. Fill in:
   - **Name:** `minipostiz` (or any name)
   - **Type:** select **script** (important — other types won't work with password grant)
   - **Description:** optional
   - **Redirect URI:** `http://localhost` (required, not used)
4. Click **Create app**
5. Note:
   - **Client ID** — the string under your app name (looks like `abc123xyz`)
   - **Client Secret** — shown as "secret" field

---

## Step 2 — Check posting permissions

- Your Reddit account must have sufficient karma to post to most subreddits
- Some subreddits require account age minimums
- Test with a subreddit you own or moderate first (e.g. `u_yourname` — your profile subreddit)

---

## Step 3 — Store in minipostiz-cli

```bash
minipostiz auth --platform reddit \
  --clientId "abc123xyz" \
  --clientSecret "YOUR_CLIENT_SECRET" \
  --username "your_reddit_username" \
  --password "your_reddit_password" \
  --subreddit "test"

# Or via supercli
sc minipostiz auth set-reddit \
  --clientId "abc123xyz" \
  --clientSecret "YOUR_CLIENT_SECRET" \
  --username "your_reddit_username" \
  --password "your_reddit_password" \
  --subreddit "test"
```

> Use your own subreddit `u_yourusername` (profile posts) or a subreddit you own for testing.

---

## Step 4 — Test

```bash
minipostiz auth verify --platform reddit
minipostiz publish --platform reddit --message "# Test Post

This is a test post via minipostiz-cli."
```

---

## Post format

Reddit posts are **self (text) posts**. minipostiz-cli maps:
- **First line** → post title (markdown heading stripped)
- **Remaining lines** → post body (markdown supported)

```bash
minipostiz publish --platform reddit --message "# Post Title

Post body with **markdown** support."
```

---

## Posting to different subreddits

The `subreddit` stored in auth is the default. To override:

```bash
# Store multiple reddit auth entries by adding extra credentials
# (minipostiz stores one per platform — change subreddit in auth to switch)
minipostiz auth --platform reddit --clientId ID --clientSecret S \
  --username U --password P --subreddit "anothersubreddit"
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid_grant` | Wrong username/password, or 2FA enabled | Disable 2FA or use password without special chars |
| `403 Forbidden` | Subreddit posting restricted | Try your profile subreddit `u_yourusername` |
| `RATELIMIT` | Too many requests | Reddit limits to ~1 post per 10 minutes |
| `SUBREDDIT_NOTALLOWED` | Account karma/age too low | Post to your own subreddit first |
| `invalid_client` | Wrong app type | Ensure app type is **script**, not web/installed |

## Token lifetime

Reddit password-grant tokens expire after **24 hours**. minipostiz-cli re-authenticates automatically on each post using your stored credentials.

## Security note

Storing your Reddit password in minipostiz-cli's SQLite DB (`~/.minipostiz/minipostiz.db`) is safe for personal use. For shared environments, use a dedicated alt account.
