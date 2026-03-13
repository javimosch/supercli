---
skill_name: agent-browser.quickstart
description: Agent workflow to install and run agent-browser through supercli with snapshot-ref automation.
tags: agent-browser,browser,automation,playwright,agents
---

# agent-browser Quickstart

Use this when you need deterministic browser automation for agent tasks.

## 1) Install plugin and dependency

```bash
supercli plugins learn agent-browser
supercli plugins install agent-browser --json
supercli agent-browser browser install
```

If the binary is missing, install globally first:

```bash
npm install -g agent-browser
agent-browser install
```

## 2) Validate setup

```bash
supercli agent-browser cli version
```

## 3) Recommended agent workflow

```bash
supercli agent-browser browser open --url https://example.com
supercli agent-browser browser snapshot
supercli agent-browser click @e1
supercli agent-browser fill @e2 "test@example.com"
supercli agent-browser wait --load networkidle
supercli agent-browser screenshot --annotate
supercli agent-browser browser close
```

## 4) Use passthrough for full command coverage

```bash
supercli agent-browser find role button click --name "Submit"
supercli agent-browser get url
supercli agent-browser diff snapshot
```

## 5) Structured output for tool chains

```bash
supercli agent-browser snapshot --json
supercli agent-browser get text @e1 --json
```

## 6) Important caveats

- `browser open` wrapper requires `--url` (named arg). Use `supercli inspect agent-browser browser open --json` to confirm the active schema.
- Wrapper commands are intentionally minimal. For advanced flags and full upstream coverage, use passthrough commands like `supercli agent-browser <upstream args...>`.
- Ref ids (`@e1`, `@e2`, etc.) are snapshot-scoped and can change after navigation or refresh. Run a new `snapshot -i` before acting on refs.
- `browser snapshot` returns the full accessibility tree text; `snapshot -i` returns a compact refs map that is easier for reliable click/fill automation.
- Link labels may be verbose, translated, or indirect on real sites (for example social widgets). Prefer refs over brittle text matching.
- After `browser close`, a snapshot may still return a minimal empty document. Always `open` a target URL again before continuing task steps.
