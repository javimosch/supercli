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
