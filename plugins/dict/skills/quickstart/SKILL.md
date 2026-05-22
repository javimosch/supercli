---
name: dict
description: Use this skill when the user wants to look up word definitions, synonyms, translations, or etymologies using the DICT protocol.
---

# dict Plugin

dict queries dictionary databases via the DICT protocol (RFC 2229). Look up definitions, synonyms, translations, and etymologies from remote dictionary servers.

## Commands

- `dict _ _ <args>` — Passthrough

## Usage Examples

- "define the word serendipity"
- "look up synonyms for happy"
- "find the etymology of algorithm"
- "translate hello from English to French"

## Installation

```bash
brew install dict
```

## Key Features
- DICT protocol client (RFC 2229)
- Multiple dictionary server support
- Word definitions, synonyms, and etymologies
- Translation between languages
- Regex pattern matching across dictionaries
- Customizable dictionary server and database selection
