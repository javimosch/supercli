---
name: grex
description: Use this skill when the user wants to generate regular expressions from test cases, convert patterns to character classes, or automate regex creation from examples.
---

# grex Plugin

Generate regular expressions from user-provided test cases. Supports digit, whitespace, word character conversions, repetition detection, case-insensitive matching, and capturing groups.

## Commands

### Regex Generation
- `grex regex generate` — Generate regex from test cases

### Utility
- `grex _ _` — Passthrough to grex CLI

## Usage Examples
- "Generate a regex from these strings"
- "Create a pattern matching these examples"
- "Convert these test cases to a regex"
- "Generate regex with character classes"

## Installation

```bash
brew install grex
```

Or via Cargo:
```bash
cargo install grex
```

## Examples

```bash
# Basic regex generation from test cases
grex regex generate a b c

# Read test cases from file
grex regex generate --file test_cases.txt

# Use Unix pipeline
cat test_cases.txt | grex regex generate -

# Convert digits to \\d
grex regex generate --digits 123 456 789

# Convert non-digits to \\D
grex regex generate --non-digits abc def ghi

# Convert whitespace to \\s
grex regex generate --spaces "hello world" "foo bar"

# Convert non-whitespace to \\S
grex regex generate --non-spaces helloworld foobar

# Convert word characters to \\w
grex regex generate --words hello_world foo_bar

# Convert non-word characters to \\W
grex regex generate --non-words hello@world foo#bar

# Escape non-ASCII characters
grex regex generate --escape "café" "naïve"

# Detect repeated substrings
grex regex generate --repetitions abcabc xyzxyz

# Specify minimum repetitions
grex regex generate --repetitions --min-repetitions 2 abcabc xyzxyz

# Specify minimum substring length
grex regex generate --repetitions --min-substring-length 2 abcabc xyzxyz

# Remove anchors
grex regex generate --no-anchors abc xyz

# Verbose mode for nicer regex
grex regex generate --verbose abc xyz

# Colorize output
grex regex generate --colorize abc xyz

# Case-insensitive matching
grex regex generate --ignore-case abc ABC xyz

# Use capturing groups
grex regex generate --capture-groups abc xyz

# Multiple options combined
grex regex generate --digits --words --verbose 123abc 456def

# Any grex command with passthrough
grex _ _ --digits --spaces abc 123
```

## Key Features
- **Test case input** — Pass test cases directly or from file
- **Pipeline support** — Receive input from Unix pipes
- **Character classes** — Convert digits, whitespace, word characters
- **Repetition detection** — Detect repeated substrings automatically
- **Anchor control** — Add or remove start/end anchors
- **Case options** — Case-insensitive matching support
- **Group options** — Non-capturing or capturing groups
- **Unicode support** — Escape non-ASCII characters
- **Syntax highlighting** — Colorize output for readability
- **Verbose mode** — Generate nicer-looking regex

## Notes
- Default includes both ^ and $ anchors
- Can read from stdin with `-` argument
- Supports Python library bindings
- Detects repetitions by default with min 1 repetition
- Useful for learning regex or automating pattern creation
