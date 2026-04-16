---
name: humanenv-usage
description: Use humanenv to retrieve sensitives/envs. Never log/read sensitives from humanenv. They are envs for humans only.
---

# HumanEnv Plugin

Secure environment variable injection. Secrets exist in memory only when explicitly requested — never in `.env` files, never in process environment, never persistent on disk.

## Commands

### Local Mode (Serverless - Recommended for Agents)

- `supercli humanenv local init` — Initialize local database (generates mnemonic)
- `supercli humanenv local get <key>` — Retrieve secret from local database
- `supercli humanenv local set <key> <value>` — Set secret in local database
- `supercli humanenv local projects` — List projects in local database
- `supercli humanenv local envs` — List environment variables
- `supercli humanenv local export <file>` — Export local database
- `supercli humanenv local import <file>` — Import database

### Remote Mode (Requires Server)

- `supercli humanenv env get <key>` — Retrieve secret from server
- `supercli humanenv env set <key> <value>` — Set secret on server

### Advanced

- `supercli humanenv _ _ auth --project-name <name> --server-url <url>` — Authenticate with server
- `supercli humanenv _ _ server --port <port>` — Start admin server
- `supercli humanenv _ _ <args...>` — Passthrough to humanenv CLI

## Local Mode Quick Start

```bash
# Initialize local database (one-time setup)
supercli humanenv local init

# Set a secret
supercli humanenv local set API_KEY "my-secret-value"

# Get a secret
supercli humanenv local get API_KEY

# Export for backup
supercli humanenv local export backup.json
```

**Important:** After `local init`, the mnemonic is displayed. The human must save it securely — it's needed to recover the database.

## Authentication (Remote Mode)

If not authenticated, tell the human:

> "I need humanenv configured to retrieve secrets safely. Run `humanenv server` once, create a project in the UI, then I can authenticate with the project name and API key."

## Security Rules

- **ALWAYS** null values after use: `value = null`
- Never log, echo, or store secret values
- Never write secrets to files
- Never pass secrets as command-line arguments to other processes
- Request only the specific key needed — never bulk access

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `NOT_AUTHENTICATED` | No credentials found | Run auth first |
| `CLIENT_NOT_WHITELISTED` | Fingerprint not approved | Ask human to approve at admin UI |
| `ENV_KEY_NOT_FOUND` | Key does not exist | Create via set command |
| `LOCAL_INIT_FAILED` | Local database error | Check if database exists, use --force |
| `LOCAL_GET_FAILED` | Failed to get local secret | Check mnemonic is set in HUMANENV_LOCAL_MNEMONIC |

## Installation

```bash
npm install -g humanenv
```

Verify: `humanenv` (should show credentials status)

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `HUMANENV_LOCAL_MNEMONIC` | 12-word mnemonic for local mode authentication |
| `HUMANENV_PROJECT_NAME` | Default project name |
| `HUMANENV_SERVER_URL` | Default server URL |

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
