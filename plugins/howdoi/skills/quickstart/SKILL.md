---
name: howdoi
description: Use this skill when the user wants to get coding answers, ask programming questions, look up syntax, or find code examples from Stack Overflow.
---

# howdoi Plugin

howdoi provides instant coding answers from the command line. It scrapes Stack Overflow and returns concise answers with code examples.

## Commands

### Self
- `howdoi self version` — Print howdoi version
- `howdoi self clear-cache` — Clear the cached answers

### Query
- `howdoi query ask <question> [-n N] [-p POS] [-a] [-c]` — Ask a question and get answers
- `howdoi query json <question> [-n N]` — Ask a question and get JSON answers

### Passthrough
- `howdoi _ _ <args>` — Raw passthrough (--save, --view, --remove, --empty, etc.)

## Usage Examples

- "howdoi format date in bash"
- "howdoi reverse a list in python with json"
- "howdoi parse json in javascript getting 3 answers"
- "howdoi clear cache"

## Installation

```bash
pip install howdoi
```

## Key Features
- Instant answers from Stack Overflow
- JSON output for machine readability (--json)
- Multiple answers at once (-n N)
- Colorized output (-c)
- Answer position selection (-p POS)
- Search engine selection (Google, Bing, DuckDuckGo)
- Offline caching of answers
- Stash support for saving favorites

## Options

| Flag | Description |
|------|-------------|
| `-n N` | Number of answers to return |
| `-p POS` | Answer position (default: 1) |
| `-j`, `--json` | Return answers as JSON |
| `-a`, `--all` | Display full answer text |
| `-c`, `--color` | Colorize output |
| `-C`, `--clear-cache` | Clear cache |
| `-e ENGINE` | Search engine (google, bing, duckduckgo) |
