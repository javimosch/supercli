---
name: jo
description: Use this skill when the user wants to create JSON output from the command line, format data as JSON, build API payloads, or serialize shell variables into JSON structures.
---

# Jo Plugin

JSON output from a shell — create JSON objects, arrays, and nested structures from key=value pairs.

## Commands

### Self
- `jo self version` — Print version

### JSON
- `jo json create` — Create JSON from key=value pairs (passthrough)

### Passthrough
- `jo _ _` — Passthrough for any jo command

## Usage Examples
- "Create a JSON object with name and age"
- "Build a JSON array from a list of values"
- "Convert shell variables to JSON format"
- "Create a nested JSON structure for an API request"

## Installation

```bash
brew install jo
```

## Examples

```bash
# Simple object
jo name=John age=30 active=true

# Nested objects
jo name=John address="city=New York zip=10001"

# Arrays
jo -a name=John name=Jane

# Reading from stdin
echo 'name=Doe' | jo

# Boolean and numbers
jo enabled=true count=42 ratio=3.14

# Empty value (null)
jo name=John title=

# Combine with jq for complex pipelines
jo name=John items="$(jo -a apple banana)" | jq '.items'
```

## Key Features
- Simple key=value syntax for JSON creation
- Automatic type detection (strings, numbers, booleans)
- Nested objects and arrays
- stdin input support
- Pretty-print option
- Array forcing with -a flag
- Null value support via empty values
