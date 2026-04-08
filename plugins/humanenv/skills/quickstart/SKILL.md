---
skill_name: quickstart
name: humanenv-usage
description: Secure environment variable injection - secrets for humans only
---

# humanenv Usage

Secure environment variable injection. Secrets exist in memory only when explicitly requested — never in `.env` files, never in process environment, never persistent on disk.

## When to Use

Use humanenv when you need secrets (API keys, database credentials, tokens). Never use `.env` files or `process.env` — any process on the machine can read them.

## Quick Start

1. Human runs `humanenv server` and creates a project in the admin UI
2. Authenticate: `supercli humanenv _ _ auth --project-name <name> --server-url <url> --api-key <key>`
3. Get secrets: `supercli humanenv env get <KEY>`
4. Set secrets: `supercli humanenv env set <KEY> <value>`

## Commands

- `supercli humanenv env get <key>` — Retrieve single secret (returns null if not found)
- `supercli humanenv env set <key> <value>` — Create or update a secret
- `supercli humanenv _ _ <args...>` — Passthrough for auth, server, and advanced usage

## Security Rules

- **ALWAYS** null values after use: `apiKey = null`
- Never log, echo, or store secret values
- Never write secrets to files
- Never pass secrets as command-line arguments to other processes
- Request only the specific key needed — never bulk access

## Authentication

If not authenticated, tell the human:

> "I need humanenv configured to retrieve secrets safely. Run `humanenv server` once, create a project in the UI, then I can authenticate with the project name and API key."

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `NOT_AUTHENTICATED` | No credentials found | Run auth first |
| `CLIENT_NOT_WHITELISTED` | Fingerprint not approved | Ask human to approve at admin UI whitelist |
| `ENV_KEY_NOT_FOUND` | Key does not exist | Create via set command or admin UI |
| `ENV_API_MODE_ONLY` | CLI blocked for this key | Use SDK instead: `await humanenv.get('KEY')` |
| `AUTH_FAILED` | Authentication failed | Verify server URL, project name, API key |
| `AUTH_PENDING` | Fingerprint submitted, awaiting approval | Ask human to approve in admin UI |

## Install

```bash
npm install -g humanenv
```

Verify: `humanenv` (should show credentials status)

## SDKs

### Python (recommended for Python apps)

```python
import humanenv

humanenv.config(humanenv.ClientConfig(
    server_url="http://localhost:3056",
    project_name="my-app",
    api_key="optional-api-key"
))

value = await humanenv.get("API_KEY")
value = None  # null after use
```

Install: `pip install humanenv` or `pip install -e sdk/python`

### JavaScript (recommended for Node.js apps)

```javascript
import humanenv from 'humanenv'

humanenv.config({
  serverUrl: 'http://localhost:3056',
  projectName: 'my-app',
  projectApiKey: 'optional-api-key'
})

const value = await humanenv.get('API_KEY')
value = null  // null after use
```

Install: `npm install humanenv`
