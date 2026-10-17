---
name: json_pp
description: JSON pretty-printer and converter for command-line use
---
# json_pp Plugin
Pretty-print and convert JSON data from the command line.

## Commands
- `json_pp <resource> <action>` — Execute json_pp commands
- `json_pp self version` — Print json_pp version
- `json_pp _ _` — Passthrough to json_pp CLI

## Usage
- `json_pp self version` — Print version
- `json_pp _ _ < file.json` — Pretty-print JSON from stdin
- `json_pp _ _ --json_opt pretty:1 file.json` — Pretty-print a JSON file
- `echo '{"key":"val"}' | json_pp _ _` — Format inline JSON
