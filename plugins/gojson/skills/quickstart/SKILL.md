---
name: gojson
description: Use this skill when the user wants to convert JSON to Go structs, generate Go struct definitions, or work with JSON in Go.
---

# gojson Plugin

Automatically generate Go (golang) struct definitions from example JSON. Convert JSON to Go structs instantly.

## Commands

### JSON Conversion
- `gojson json convert` — Convert JSON to Go struct

### Utility
- `gojson _ _` — Passthrough to gojson CLI

## Usage Examples
- "Convert JSON to Go struct"
- "Generate Go struct from JSON"
- "Create Go type from JSON"
- "JSON to struct definition"

## Installation

```bash
brew install gojson
```

Or via Go:
```bash
go install github.com/ChimeraCoder/gojson@latest
```

## Examples

```bash
# Convert JSON to struct
gojson json convert input.json

# Specify struct name
gojson json convert input.json --name MyStruct

# Output to file
gojson json convert input.json --output output.go

# Add omitempty tags
gojson json convert input.json --omitempty

# Any gojson command with passthrough
gojson _ _ input.json
gojson _ _ '{"key":"value"}'
```

## Key Features
- **Auto-generate** - Automatic struct generation
- **Nested** - Handles nested structures
- **Arrays** - Supports arrays and slices
- **Tags** - JSON struct tags
- **Fast** - Instant conversion
- **Easy** - Simple command interface
- **API** - Perfect for API work
- **Types** - Correct type inference
- **Custom** - Custom struct names
- **Go** - Go-specific output

## Notes
- Great for API integration
- Handles complex JSON structures
- Preserves type information
- Perfect for data serialization
