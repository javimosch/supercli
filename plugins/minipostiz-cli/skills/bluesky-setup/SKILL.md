---
name: minipostiz-bluesky-setup
description: Bluesky AT Protocol setup for minipostiz-cli — create app password, store handle + password
type: setup
---

# minipostiz-cli — Bluesky Setup

Bluesky uses the AT Protocol. Authentication is a handle + app password (never your main account password).

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
