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
