---
name: json2env
description: Convert JSON to env var format.
---
# json2env Plugin
Read JSON from stdin, output KEY=VALUE pairs.
## Usage
- `echo '{"KEY":"val"}' | json env convert` → KEY=val
- `echo '{"KEY":"val"}' | json env convert PREFIX` → PREFIX_KEY=val
