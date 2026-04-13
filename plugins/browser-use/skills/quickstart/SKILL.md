---
name: browser-use.quickstart
description: Agent workflow to install, configure, and run Browser Use MCP tools quickly via SuperCLI.
tags: browser-use,mcp,automation,agents
---

# Browser Use Quickstart

Use this when you need browser automation through Browser Use MCP.

## 1) Ensure API key is available

```bash
export BROWSER_USE_API_KEY=<your_key>
```

## 2) Install plugin

```bash
supercli plugins learn browser-use
supercli plugins install browser-use --json
```

This auto-registers the `browser-use` MCP server and binds direct commands under `browseruse.tool.*`.

## 3) Verify health and discover tools

```bash
supercli mcp doctor --mcp-server browser-use --json
supercli mcp tools --mcp-server browser-use --json
```

## 4) Call tools directly

```bash
supercli mcp call --mcp-server browser-use --tool list_skills --input-json '{}' --timeout-ms 180000 --json
supercli mcp call --mcp-server browser-use --tool browser_task --input-json '{"task":"Search Google for the latest iPhone reviews and summarize the top 3 results"}' --timeout-ms 180000 --json
```

For long-running tasks, use `monitor_task` with the returned `task_id`.

## 5) Use bound tool commands (faster)

```bash
supercli browseruse tool list-skills --json
supercli browseruse tool browser-task --task "Open example.com and summarize the home page" --json
```
