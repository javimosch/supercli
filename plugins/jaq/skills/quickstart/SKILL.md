# jaq Quickstart Guide

jaq is a high-performance JSON processor written in Rust. It's designed as a faster, more correct alternative to jq while maintaining compatibility with jq syntax.

## Installation

```bash
cargo install --locked jaq
```

Or via Homebrew:
```bash
brew install jaq
```

## Basic Usage

### Pretty-print JSON
```bash
echo '{"name":"alice","age":30}' | jaq
```

### Extract a field
```bash
echo '{"name":"alice","age":30}' | jaq '.name'
```

### Array processing
```bash
echo '[1,2,3,4,5]' | jaq 'map(. * 2)'
```

### Filtering
```bash
echo '[{"name":"alice","age":30},{"name":"bob","age":25}]' | jaq '.[] | select(.age > 26)'
```

### Multiple operations
```bash
echo '{"users":[{"id":1,"name":"alice"},{"id":2,"name":"bob"}]}' | jaq '.users | map(.name) | join(",")'
```

## Key Features

- **Performance**: Significantly faster than jq 1.6 with better startup time
- **Multiple Formats**: Supports JSON, YAML, TOML, CBOR, and XML (via input flags)
- **Correctness**: Fixes edge cases and ambiguities in jq
- **Compatibility**: Maintains high compatibility with existing jq programs

## Common Flags

- `-r`: Raw output (no JSON quotes for strings)
- `-s`: Slurp entire input into array
- `-M`: Monochrome output (no colors)
- `-c`: Compact output (no pretty-printing)
- `-n`: Use null as input
- `-e`: Set exit status based on output
- `--tab`: Use tabs for indentation
- `--arg name value`: Set variable `$name` to `value`
- `--slurpfile var file`: Set variable `$var` to array of JSON values from file

## Examples

### Extract multiple fields
```bash
jaq '{name: .name, age: .age}' input.json
```

### Recursive descent
```bash
jaq '.. | objects | select(.type == "user")'
```

### Combine objects
```bash
jaq 'add' <<<'[{"a":1},{"b":2}]'
```

### Conditional logic
```bash
jaq 'if .age >= 18 then "adult" else "minor" end'
```

## Real-world Use Cases

### Parse API responses
```bash
curl -s https://api.example.com/users | jaq '.data[] | {id, email}'
```

### Transform data formats
```bash
jaq -r '.[] | [.id, .name, .email] | @csv'
```

### Batch processing
```bash
find . -name "*.json" -exec sh -c 'jaq "keys" "$1"' _ {} \;
```

## Performance Tips

- Use `jaq` instead of `jq` for faster processing of large JSON files
- Combine operations to avoid multiple passes
- Use `-c` for compact output if you don't need pretty-printing
- jaq-3.0+ includes significant performance improvements

## Resources

- [Official Repository](https://github.com/01mf02/jaq)
- [jaq on crates.io](https://crates.io/crates/jaq)
- [jq Documentation](https://jqlang.github.io/jq/) (most features apply to jaq)
