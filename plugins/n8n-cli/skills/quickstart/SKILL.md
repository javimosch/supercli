---
name: n8n-cli
description: Use this skill when the user needs to manage n8n workflows — list, pull, push, test, verify, convert, or debug workflow executions.
---

# n8n CLI — n8n Workflow Management for AI Agents

Wrapper around [n8n-as-code](https://github.com/EtienneLescot/n8n-as-code) (n8nac CLI). Manage n8n workflows programmatically.

## Quick Start

```bash
sc n8n-cli self setup          # Configure n8n workspace (interactive)
sc n8n-cli self mcp            # Register MCP server (optional)
sc n8n-cli workflow list       # List all workflows
```

## Commands

### Workflow Management
- `sc n8n-cli workflow list` — list all workflows with status
- `sc n8n-cli workflow pull <id>` — download workflow from n8n
- `sc n8n-cli workflow push <path>` — upload workflow to n8n

### Passthrough (advanced)
- `sc n8n-cli find <query>` — search workflows by name or ID
- `sc n8n-cli test <id>` — trigger workflow and report outcome
- `sc n8n-cli verify <id>` — validate workflow against schema
- `sc n8n-cli convert <file>` — convert between JSON and TypeScript
- `sc n8n-cli credentials` — manage credential readiness
- `sc n8n-cli execution <id>` — inspect workflow executions
- `sc n8n-cli skills` — AI tools: search nodes, docs, validate

## MCP Integration

Once registered with `sc n8n-cli self mcp`, agents can interact with n8n via MCP tools (stdio).

## Requirements

- Node.js 18+ (for npx)
- n8n instance URL and API key (configured via `self setup`)
- First run downloads n8nac (~1MB)

## Tips

- Use `workflow list` to discover workflow IDs before pulling
- After editing workflows locally, use `workflow push` to deploy
- The `find` command searches by partial name or ID
- `verify` checks node schemas before pushing
- Combine with playwright-mcp for browser-based n8n testing
