---
name: jta
description: Use this skill when the user wants to translate JSON i18n files to multiple languages, manage translation terminology, or set up CI/CD for localization.
---

# jta Plugin

AI-powered JSON Translation Agent.

## Commands

### Translation
- `jta file translate` — Translate a JSON i18n file

## Usage Examples
- "Translate en.json to Chinese"
- "Translate to multiple languages"
- "Incremental translation update"

## Installation

```bash
brew install hikanner/jta/jta
```

Or:
```bash
go install github.com/hikanner/jta/cmd/jta@latest
```

## Examples

```bash
# Translate to single language
jta en.json --to zh

# Translate to multiple languages
jta en.json --to zh,ja,ko

# Incremental translation
jta en.json --to zh --incremental

# CI/CD mode
jta en.json --to zh,ja,ko -y

# List languages
jta --list-languages
```

## Key Features
- Agentic reflection: AI translates, evaluates, and refines its own work
- Automatic terminology detection
- Format preservation for placeholders, HTML, URLs
- Incremental translation
- RTL language support
- OpenAI, Anthropic, Gemini support
