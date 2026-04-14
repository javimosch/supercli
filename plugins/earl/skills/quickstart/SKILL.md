---
name: earl
description: Use this skill when the user wants to securely call APIs from AI agents, manage secrets in OS keychain, or set up MCP tools for Claude Code/Cursor.
---

# earl Plugin

Secure CLI proxy for AI agents — secrets stay in OS keychain, never in tool arguments.

## Commands

### Templates
- `earl template import` — Import a provider template

### Secrets
- `earl secret set` — Store a secret in OS keychain

### Calling
- `earl call --yes --json` — Call a template command

## Usage Examples
- "Import GitHub template and call search_repos"
- "Store API token securely"
- "Set up MCP tools for Claude Code"

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/mathematic-inc/earl/main/scripts/install.sh | bash
```

## Examples

```bash
# Import a template
earl templates import https://raw.githubusercontent.com/mathematic-inc/earl/main/examples/github.hcl

# Store a secret
earl secrets set github.token

# Call a command
earl call --yes --json github.search_repos --query "language:rust stars:>100"

# MCP setup for Claude Code
# Add to MCP config:
# { "mcpServers": { "earl": { "command": "earl", "args": ["mcp", "stdio"] } } }
```

## Key Features
- HCL-defined operation templates
- OS keychain secrets storage
- MCP integration
- Prompt injection protection
- Supports HTTP, GraphQL, gRPC, Bash, SQL
