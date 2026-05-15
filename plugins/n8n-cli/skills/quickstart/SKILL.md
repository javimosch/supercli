---
name: n8n-cli
description: Use this skill when the user needs to manage n8n workflows — list, pull, push, test, verify, convert, or debug workflow executions via the n8nac CLI.
---

# n8n CLI — n8n Workflow Management for AI Agents

Wrapper around [n8n-as-code](https://github.com/EtienneLescot/n8n-as-code) (n8nac CLI v2.2.1). Manage n8n workflows programmatically from the terminal.

## Quick Start

```bash
# 1. Start n8n if not running:
docker run -d --name n8n --restart unless-stopped -p 5678:5678 \
  -e N8N_SECURE_COOKIE=false \
  -v ~/.n8n:/home/node/.n8n n8nio/n8n:latest

# 2. Create owner account at http://localhost:5678
#    Or via API:
curl -X POST http://localhost:5678/rest/owner/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local.dev","firstName":"Admin","lastName":"User","password":"Password123!"}'

# 3. Login to get session cookie:
curl -c /tmp/n8n-cookies.txt -X POST http://localhost:5678/rest/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrLdapLoginId":"admin@local.dev","password":"Password123!"}'

# 4. Create API key:
curl -X POST http://localhost:5678/rest/api-keys \
  -H "Content-Type: application/json" -b /tmp/n8n-cookies.txt \
  -d '{"label":"n8n-cli","scopes":["workflow:list","workflow:read","workflow:create","workflow:update"],"expiresAt":null}'

# 5. Configure n8nac workspace:
echo "<rawApiKey>" | npx n8nac env add local \
  --base-url http://localhost:5678 \
  --sync-folder ~/n8n-workspace/workflows --api-key-stdin

# 6. Use the plugin:
sc n8n-cli self version        # Verify version
sc n8n-cli workflow list       # List all workflows
sc n8n-cli workflow pull <id>  # Download workflow
```

## Commands

### Instance & Config
- `sc n8n-cli self version` — Print n8nac version
- `sc n8n-cli self setup` — Configure n8n workspace (interactive — runs `n8nac setup`)
- `sc n8n-cli self mcp` — Register MCP server in ~/.supercli/mcp.json

### Workflow Management
- `sc n8n-cli workflow list` — List all workflows with status (tracked, remote-only, conflicts)
- `sc n8n-cli workflow pull <id>` — Download workflow from n8n to local (uses bash wrapper to capture stderr)
- `sc n8n-cli workflow push <path>` — Upload local workflow to n8n

### Passthrough (advanced, use raw n8nac flags)
- `sc n8n-cli find <query>` — Search workflows by name or ID
- `sc n8n-cli test <id>` — Trigger workflow via webhook and report outcome
- `sc n8n-cli verify <id>` — Validate workflow nodes against local schema
- `sc n8n-cli convert <file>` — Convert between JSON and TypeScript formats
- `sc n8n-cli credentials` — Manage credential readiness inventory
- `sc n8n-cli execution <id>` — Inspect workflow executions for debugging
- `sc n8n-cli skills` — AI tools: search nodes, docs, validate workflows

## Setting Up an n8n Instance

### Docker (quickest)
```bash
docker run -d --name n8n --restart unless-stopped -p 5678:5678 \
  -e N8N_SECURE_COOKIE=false \
  -v ~/.n8n:/home/node/.n8n n8nio/n8n:latest
```

### First-Time Setup
1. Open http://localhost:5678
2. Create owner account (email + password)
3. Go to Settings → API Keys → Create API key with workflow scopes
4. Or use the API (see Quick Start above)

### Reset Owner (if needed)
```bash
docker exec n8n n8n user-management:reset
docker restart n8n
```
Then recreate the owner account.

## MCP Integration

Register the MCP server so agents can talk to n8n directly:
```bash
sc n8n-cli self mcp
```
This adds a stdio MCP server to `~/.supercli/mcp.json` running `npx n8nac mcp`.
Agents get direct MCP tools for n8n operations without going through the CLI.

## Working with Workflows

### Creating a Workflow via API
```bash
curl -s -X POST http://localhost:5678/rest/workflows \
  -H "Content-Type: application/json" -b /tmp/n8n-cookies.txt \
  -d '{"name":"My Workflow","nodes":[{"id":"1","name":"Manual","type":"n8n-nodes-base.manualTrigger","typeVersion":1,"position":[250,300]}],"connections":{},"active":false}'
```

### Pulling Workflows
```bash
sc n8n-cli workflow pull <workflow-id>
```
After pulling, the workflow appears as TRACKED in `workflow list`. Files are saved to the sync folder.

### Telegram Workflow Example
Create a workflow with Manual Trigger → Telegram node:
```bash
curl -X POST http://localhost:5678/rest/workflows \
  -H "Content-Type: application/json" -b /tmp/n8n-cookies.txt \
  -d '{"name":"Telegram Notif","nodes":[{"id":"t1","name":"Manual","type":"n8n-nodes-base.manualTrigger","typeVersion":1,"position":[250,300]},{"id":"t2","name":"Send Telegram","type":"n8n-nodes-base.telegram","typeVersion":1,"position":[550,300],"parameters":{"resource":"message","operation":"sendMessage","chatId":{"value":""},"text":{"value":"=Hello from n8n at {{ $now }}"}},"credentials":{"telegramApi":{"id":null,"name":"Telegram Bot"}}}],"connections":{"Manual":{"main":[[{"node":"Send Telegram","type":"main","index":0}]]}},"active":false}'
```
Then configure the Telegram bot token in the n8n UI under Credentials.

## Caveats & Pitfalls

### 1. n8nac Output Goes to stderr
All n8nac commands (pull, push, list) output progress to **stderr**, not stdout. The plugin uses a bash wrapper with `2>&1` for pull/push to capture it. Other commands may show empty `data.raw` if executed without the wrapper — use `workflow list` afterward to verify changes.

### 2. n8nac Has No --json Flag
n8nac does not support machine-readable output. All output is human-readable with ANSI escape codes. The `parseJson: false` adapter setting preserves raw text.

### 3. Demo/AI Agent Workflows May Fail to Pull
Some pre-installed demo workflows (like "My first AI Agent in n8n") may return "not found on remote" when pulling. This is an upstream n8n-as-code issue with project-scoped workflows. Create your own workflows for reliable pull testing.

### 4. Workspace Environment Required
n8nac requires a configured workspace environment. Without it, commands fail with "CLI not configured". Use `n8nac env add` to set one up. The default env name is `local` — use `--env local` for commands that need it.

### 5. API Key Creation Requires Specific Fields
The n8n API expects `label`, `scopes` (array), and `expiresAt` (null for no expiry) when creating API keys. Valid workflow scopes: `workflow:list`, `workflow:read`, `workflow:create`, `workflow:update`.

### 6. n8n Owner Reset
If you forget the password or get locked out, use `docker exec n8n n8n user-management:reset && docker restart n8n` to reset the owner state.

### 7. MCP Server Requires Running n8n
The n8n-as-code MCP server (`npx n8nac mcp`) requires the n8n instance to be reachable. It does not start n8n automatically — start n8n first with Docker.

## Environment Detection
The n8nac config is stored globally (in `~/.config/n8n-as-code/`). The default environment is marked with `*` in `n8nac env list`. Commands that don't specify `--env` use the default.

## Best Practices

1. Use `workflow list` to discover workflow IDs before pulling
2. Pull workflows before editing locally, push after changes
3. Use `verify` to check node schemas before pushing to avoid runtime errors
4. Combine with playwright-mcp for browser-based n8n testing
5. Keep n8n and n8nac versions in sync — node schemas are built against the latest stable n8n release
