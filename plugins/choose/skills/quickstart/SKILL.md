---
name: choose
description: Use this skill when the user wants to extract fields from text, cut columns from output, or process structured text data in shell pipelines.
---

# choose Plugin

A human-friendly and fast alternative to cut and sometimes awk. Extract fields from lines of text with intuitive syntax.

## Commands

### Text Processing
- `choose text extract` — Extract fields from text input

### Utility
- `choose _ _` — Passthrough to choose CLI

## Usage Examples
- "Extract fields from text"
- "Cut columns from output"
- "Select specific fields"
- "Process text data"

## Installation

```bash
brew install choose-rust
```

Or via Cargo:
```bash
cargo install choose
```

## Examples

```bash
# Extract first field
echo "a:b:c" | choose text extract 0 --field-separator ":"

# Extract range of fields
echo "a b c d e" | choose text extract 1:3

# Extract last field
echo "a b c" | choose text extract -1

# Custom separators
cat data.csv | choose text extract 0,2 --field-separator ","

# Any choose command with passthrough
echo "a b c" | choose _ _ 1
echo "a,b,c" | choose _ _ -1 --field-separator ","
```

## Key Features
- **Intuitive** - Human-friendly syntax
- **Fast** - Rust-powered speed
- **Negative** - Negative indices
- **Ranges** - Range selection
- **Separators** - Custom separators
- **Multiple** - Multiple fields
- **Pipes** - Pipe-friendly
- **Cut** - cut alternative
- **Awk** - awk alternative
- **Simple** - Simple syntax

## Notes
- Supports negative indices
- Great for shell pipelines
- Faster than cut for many cases
- Pipe-friendly design
