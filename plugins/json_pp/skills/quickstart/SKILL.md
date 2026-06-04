---
name: json_pp
description: JSON pretty-printer and converter for command-line use
---
# json_pp Plugin
Pretty-print and convert JSON data from the command line.
## Usage
- `json_pp self version` — Print version
- `json_pp _ _ < file.json` — Pretty-print JSON from stdin
- `json_pp _ _ --json_opt pretty:1 file.json` — Pretty-print a JSON file
- `echo '{"key":"val"}' | json_pp _ _` — Format inline JSON
