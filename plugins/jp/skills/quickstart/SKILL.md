---
name: jp
description: JMESPath JSON processor
---
# jp Plugin

Query and transform JSON data using JMESPath expressions.

## Basic Usage

```bash
# Query JSON from stdin
echo '{"foo": {"bar": "hello"}}' | sc jp data query --expression "foo.bar"

# Query from file
sc jp data query "foo.bar" data.json

# Passthrough
sc jp _ _ -- --pretty data.json
```

## Common Patterns

- `foo.bar` - Nested field access
- `foo[*].bar` - Project list field
- `foo[?bar==\`baz\`]` - Filter
- `foo.{x: bar, y: baz}` - Multi-select
