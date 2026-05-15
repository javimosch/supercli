---
name: composio-cli
description: Use this skill when the user wants to search, authenticate, or execute tools across 1000+ SaaS apps from the terminal.
---

# Composio CLI

Search, authenticate, and execute tools across 1000+ apps. Type-safe code generation, trigger listeners, and structured JSON output.

## Commands

- `composio-cli tools search` — Search tools across 1000+ apps
- `composio-cli apps list` — List all available apps
- `composio-cli _ _` — Passthrough to composio CLI

## Installation

```bash
curl -fsSL https://composio.dev/install | bash
```

## Authentication

```bash
composio login
```

## Usage Examples

- "Search for GitHub star tool"
- "What apps are available?"
- "Execute a tool to star a repo"
- "List triggers for Slack"

## Key Commands

```bash
# Search for tools
composio search "star a github repo"

# Execute a tool
composio execute GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER -d '{"owner":"composiohq","repo":"composio"}'

# List apps
composio apps list

# List triggers
composio triggers list
```

## Key Features
- **1000+ Apps** - Tools across all major SaaS
- **JSON Output** - Structured for agents
- **Non-Interactive** - Agent-safe execution
- **Code Gen** - Type-safe code generation
- **Triggers** - Webhook-based listeners
