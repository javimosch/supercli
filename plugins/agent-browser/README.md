# agent-browser Plugin Harness

This plugin integrates `agent-browser` into supercli with a few human-friendly wrappers and full passthrough for the entire upstream CLI.

## What You Get

- quick wrappers for common setup and workflow steps
- full passthrough for every upstream `agent-browser` command
- learn content via `supercli plugins learn agent-browser`

## Prerequisites

Install the upstream CLI globally (recommended for speed):

```bash
npm install -g agent-browser
agent-browser install
```

## Install Plugin

```bash
supercli plugins learn agent-browser
supercli plugins install agent-browser --json
```

## Wrapper Commands

```bash
supercli agent-browser cli version
supercli agent-browser browser install
supercli agent-browser browser open --url https://example.com
supercli agent-browser browser snapshot
supercli agent-browser browser close
```

## Full Passthrough Examples

```bash
supercli agent-browser open example.com
supercli agent-browser snapshot -i --json
supercli agent-browser click @e1
supercli agent-browser fill @e2 "test@example.com"
supercli agent-browser screenshot --annotate
supercli agent-browser close
```

## Recommended Human Workflow

1. Open page: `supercli agent-browser open <url>` or `supercli agent-browser browser open --url <url>`
2. Capture refs: `supercli agent-browser snapshot -i`
3. Interact with refs: `click @eN`, `fill @eN "..."`
4. Re-snapshot after page changes
5. Close when done: `supercli agent-browser close`

## Important Caveats

- `browser open` wrapper requires `--url` (named argument). Check schema with `supercli inspect agent-browser browser open --json`.
- Wrappers are intentionally minimal. Use passthrough (`supercli agent-browser <upstream args...>`) for full upstream options.
- Ref ids (`@e1`, `@e2`, etc.) are snapshot-scoped and can change after navigation or refresh. Run a fresh `snapshot -i` before using refs.
- `browser snapshot` returns a full accessibility tree; `snapshot -i` returns a compact refs map and is better for click/fill automation loops.
- Real pages may expose noisy or translated link labels (social embeds, widgets). Prefer ref-based actions over brittle text matching.
- After `browser close`, `browser snapshot` may return a minimal empty document. Re-open a URL before continuing automation.

## Notes

- The plugin uses long timeouts (`180000ms`) because browser tasks can take longer than standard CLI commands.
- Use `--json` on passthrough commands when you need machine-readable output.
- If you see missing dependency errors, ensure `agent-browser` is on your `PATH` and rerun `agent-browser install`.
