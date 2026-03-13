# Copilot Plugin

`copilot` wraps GitHub Copilot CLI for scriptable, non-interactive workflows in supercli.

## Install

```bash
supercli plugins install copilot --json
npm install -g @github/copilot
```

## Commands

- `supercli copilot cli version`
- `supercli copilot task ask --prompt "..."`
- `supercli copilot task ask-json --prompt "..."`
- `supercli copilot <any upstream args...>`

## Notes

- `task ask` runs prompt mode with default Copilot output.
- `task ask-json` is a compatibility alias that currently runs non-stream text mode (`--stream off`) because the installed CLI build does not expose JSON output flags.
- Login and plan entitlements are required before automation (`copilot login`).
- Wrapper commands do not force permissive tool flags; use passthrough for advanced autonomy controls.
