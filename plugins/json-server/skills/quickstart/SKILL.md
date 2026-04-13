---
name: json-server.quickstart
description: Agent workflow for background json-server lifecycle with deterministic JSON outputs.
tags: json-server,mock-api,rest,agent-friendly,automation
---

# json-server Quickstart

Use this when you need a local fake REST API that an agent can start, inspect, and stop non-interactively.

## 1) Install plugin and dependency

```bash
supercli plugins learn json-server
supercli plugins install json-server --json
npm install -g @javimosch/json-server
```

## 2) Validate setup

```bash
supercli json-server cli version
```

## 3) Agent-friendly lifecycle flow

```bash
supercli json-server server start --file fixtures/db.json --port 43111 --state-dir .json-server-test
supercli json-server server status --state-dir .json-server-test
supercli json-server server logs --state-dir .json-server-test --lines 50
supercli json-server server stop --state-dir .json-server-test
```

## 3.1) Readiness wait (avoid startup race)

`server start` is non-blocking. The first HTTP probe can fail if the process is still binding the port.

```bash
for i in 1 2 3 4 5 6 7 8 9 10; do
  curl -sS http://localhost:43111/posts >/dev/null && break
  sleep 0.2
done
```

## 4) Full passthrough for all CLI commands

```bash
supercli json-server fixtures/db.json --json --no-interactive --no-color
supercli json-server server start fixtures/db.json --json
```

## 5) Caveats

- Use wrapper command args as flags (for example `--file`) for reliable invocation.
- `server start` is non-blocking and returns immediately; always use a short readiness retry loop before API calls.
- Default state location is `./.json-server`; use `--state-dir` to isolate concurrent local environments.
- Always stop background servers after tasks to avoid stale PID/log state and port conflicts.
