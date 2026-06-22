---
name: frawk
description: frawk — fast AWK-like CLI for processing CSV/TSV/text with structured JSON output
---
# frawk Plugin

frawk is a fast AWK-like language for processing CSV, TSV, and text files with typed columns and structured JSON output.

## Quickstart

```bash
# Process a CSV file with typed columns
frawk -F, '{print $1, $2}' data.csv

# Use typed column syntax
frawk -F, 'cols=string:symbol,float:price; {print symbol, price}' data.csv

# Output JSON
frawk -F, '{print json($0)}' data.csv
```
