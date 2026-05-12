---
name: minipostiz-devto-setup
description: Dev.to API setup for minipostiz-cli — generate API key, store credentials, posting format
type: setup
---

# minipostiz-cli — Dev.to Setup

Dev.to has a simple REST API. One API key is all you need.

## What you need

| Credential | Flag |
|------------|------|
| API Key | `--apiKey` |
| Tags (optional) | `--tags` (comma-separated, max 4) |
| Series (optional) | `--series` |

---

## Step 1 — Generate an API Key

1. Go to https://dev.to → sign in
2. Click your avatar → **Settings**
3. **Extensions** → **DEV Community API Keys**
4. Enter a description (e.g. `minipostiz`) → **Generate API Key**
5. Copy the key — it's shown once (but you can generate multiple)

---

## Step 2 — Store in minipostiz-cli

```bash
minipostiz auth --platform devto --apiKey "YOUR_API_KEY"

# With optional defaults
minipostiz auth --platform devto \
  --apiKey "YOUR_API_KEY" \
  --tags "webdev,productivity,tools" \
  --series "My Series Name"

# Or via supercli
sc minipostiz auth set-devto --apiKey "YOUR_API_KEY"
```

---

## Step 3 — Test

```bash
minipostiz auth verify --platform devto
minipostiz publish --platform devto --message "# My First Post

This is the body of the article published via minipostiz-cli."
```

---

## Post format

Dev.to posts are **articles**. minipostiz-cli maps:
- **First line** of `--message` → article title (markdown heading stripped)
- **Remaining lines** → article body (markdown supported)

```bash
minipostiz publish --platform devto --message "# Article Title

## Introduction

Body content here. Supports **bold**, *italic*, \`code\`, etc."
```

---

## Optional: tags and series

Tags and series can be set at auth time (applied to all posts) or overridden:

```bash
# Update auth to set default tags
minipostiz auth --platform devto --apiKey "KEY" --tags "javascript,node,cli"
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Invalid API key | Regenerate key at dev.to → Settings → Extensions |
| `422 Unprocessable` | Article validation failed | Ensure title (first line) is non-empty |
| Post published but no tags | Tags not in auth | Add `--tags` to `minipostiz auth --platform devto` |

## Token lifetime

Dev.to API keys **do not expire** unless deleted from Settings → Extensions.
