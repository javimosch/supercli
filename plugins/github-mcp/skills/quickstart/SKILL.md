---
name: github-mcp
description: Use this skill when the user needs GitHub operations — issues, PRs, repos, code search, file management via MCP.
---

# GitHub MCP — GitHub API for AI Agents

Official GitHub MCP server (29.8k⭐). Exposes GitHub API as MCP tools over stdio.

## Quick Start

```bash
sc github-mcp self mcp      # Register MCP server
export GITHUB_TOKEN=ghp_... # Set auth token
```

## MCP Tools Available

Once registered, agents get tools for:
- **Issues**: list, create, update, search, comment
- **PRs**: list, create, review, merge
- **Repos**: list, create, search, get details
- **Code**: search code, get file contents
- **Actions**: list workflows, trigger runs

## Requirements

- Node.js 18+
- GITHUB_TOKEN with appropriate scopes
- First run downloads @github/github-mcp-server

## Setup GITHUB_TOKEN

```bash
# GitHub CLI token (automatic):
gh auth token

# Or create a fine-grained token at:
# https://github.com/settings/tokens
export GITHUB_TOKEN=github_pat_...
```

## Notes

- Without GITHUB_TOKEN, only public repo reads work
- Token scopes determine available operations
- Works alongside `sc gh` CLI commands
