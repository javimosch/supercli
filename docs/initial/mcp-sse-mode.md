# MCP SSE/HTTP Demo

This demo runs a remote MCP server over HTTP with an SSE event stream and executes it from local-first DCLI.

## Start Demo Server

```bash
node examples/mcp-sse/server.js
```

Server endpoints:

- `POST /tool` (tool execution)
- `GET /events` (SSE stream)

## Install Demo Command Locally

In a second terminal:

```bash
node examples/mcp-sse/install-demo.js
```

This updates local cache (`~/.dcli/config.json`) with:

- MCP registry entry: `summarize-sse -> http://127.0.0.1:8787`
- command: `ai.text.summarize_remote`

## Execute Demo Command

```bash
dcli ai text summarize_remote --text "Hello world from remote mcp" --json
```

Expected output includes:

- `tool: summarize`
- `mode: sse-http`
- `result: ...`

## Watch SSE Events

```bash
curl -N http://127.0.0.1:8787/events
```

Then run the command above and observe `tool_called` / `tool_done` events.

## Cleanup Optional Stale Entries

```bash
dcli mcp list
dcli mcp remove test-mcp
```
