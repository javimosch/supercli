# comby Quickstart

Search for a pattern with holes:
```bash
sc comby code search "if :[condition] { :[body] }" --extensions .js,.ts --directory src/
```

Replace with named hole references:
```bash
sc comby code replace "console.log(:[msg])" "logger.info(:[msg])" --extensions .js --dry-run
```

Search in a specific directory:
```bash
sc comby code search ":[fn](:[args])" --directory lib/ --extensions .go --json
```

Apply replacements in-place:
```bash
sc comby code replace "let :[name] = :[val]" "const :[name] = :[val]" --extensions .js --in-place
```

## Commands
- `comby <resource> <action>` — Execute comby commands
- `comby code search` — Search code using structural patterns with hole syntax
- `comby code replace` — Replace code matching structural patterns using hole syntax
- `comby code rewrite` — Rewrite entire file using a structural template
- `comby _ _` — Passthrough to comby CLI
