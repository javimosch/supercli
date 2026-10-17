# cspell Quickstart

Check files for spelling errors:
```bash
sc cspell file check "src/**/*.ts"
```

Check with a custom config:
```bash
sc cspell file check "src/**/*.ts" --config .cspell.json
```

Initialize a cspell config:
```bash
sc cspell config init
```

Add words to dictionary:
```bash
sc cspell words add "mycustomword"
```

## Commands
- `cspell <resource> <action>` — Execute cspell commands
- `cspell file check` — Check files for spelling errors
- `cspell file lint` — Lint files and output spelling issues (alias for check)
- `cspell config init` — Initialize a cspell configuration file
- `cspell words add` — Add words to project dictionary
- `cspell _ _` — Passthrough to cspell CLI
