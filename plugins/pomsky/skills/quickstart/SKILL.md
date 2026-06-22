---
name: pomsky
description: pomsky — regex DSL that compiles to regular expressions
---
# pomsky Plugin

pomsky is a regular expression DSL that compiles regex-like syntax into standard regular expressions.

## Quickstart

```bash
# Compile a pomsky pattern to regex
pomsky '([word]+) is "cool"'

# Test a pattern against input
pomsky 'start "hello" end' --test "hello world"

# Output as JSON
pomsky 'start .+ end' --json
```
