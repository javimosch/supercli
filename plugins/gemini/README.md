# Gemini Plugin

`gemini` wraps the Gemini CLI for agent-safe, non-interactive usage in supercli.

## Install

```bash
supercli plugins install gemini --json
npm install -g @google/gemini-cli
```

## Commands

- `supercli gemini cli version`
- `supercli gemini task text --prompt "..."`
- `supercli gemini task ask --prompt "..."`
- `supercli gemini task stream --prompt "..."`
- `supercli gemini <any upstream args...>`

## Notes

- `task ask` uses `--output-format json`.
- `task stream` uses `--output-format stream-json` and emits JSONL events.
- For unattended automation, prefer API-key auth (`GEMINI_API_KEY`) instead of interactive login.
