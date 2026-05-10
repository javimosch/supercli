---
name: translate-shell
description: Use this skill when the user wants to translate text between languages, look up word definitions, get phonetic pronunciation, check available translation engines, or list language codes.
---

# Translate Shell Plugin

CLI translator using Google Translate, Bing, Yandex, and more. 40+ languages, pipe-friendly, no API key needed.

## Commands

### Self
- `translate-shell self version` — Print version

### Text
- `translate-shell text translate` — Translate text (example: `trans :es 'Hello'` or `trans fr:en 'Bonjour'`)
- `translate-shell text brief` — Brief translation, no extras

### Reference
- `translate-shell list languages` — List all language codes
- `translate-shell list engines` — List available translation engines

### Passthrough
- `translate-shell _ _` — Passthrough for any trans command

## Usage Examples
- "Translate 'Hello world' to Spanish"
- "Translate this error message from French to English"
- "List all available language codes"
- "What translation engines are available?"

## Installation

```bash
brew install translate-shell
# or: sudo apt-get install translate-shell
```

## Examples

```bash
# Basic translation
trans 'Hello world'
trans :es 'Hello world'
trans fr:en 'Bonjour le monde'

# Brief output (just the translation)
trans -b :de 'Hello'

# Pipe input
echo 'Hello' | trans :ja

# Use a specific engine
trans -engine bing :zh 'Hello'

# List languages and engines
trans -R
trans -S

# Phonetic display
trans -show-translation-phonetics y :ko 'Hello'

# Dictionary mode (includes definitions)
trans :en 'Guten Tag'
```

## Key Features
- 40+ languages supported
- Multiple translation engines (Google, Bing, Yandex, Apertium)
- Pipe-friendly: `echo "text" | trans :fr`
- Brief mode for clean output
- Phonetic pronunciation display
- Dictionary mode with definitions
- Interactive shell mode
- No API key required
