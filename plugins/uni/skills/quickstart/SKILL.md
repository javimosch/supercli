---
name: uni
description: Use this skill when the user wants to identify Unicode characters, search codepoints by name, list blocks/categories, or find emojis from the CLI.
---

# uni Plugin

uni is a single-binary Unicode 15.1 database query tool. Commands have one-letter shortcuts: `i` identify, `s` search, `p` print, `e` emoji. `-f` format templates and `-json` make output scriptable.

## Commands

- `uni unicode identify` — Dump codepoints of a string or stdin (names, UTF-8, HTML entities)
- `uni unicode search` — AND-matched description search (`-o` for OR)
- `uni unicode print` — Print codepoints, ranges (`2042..2044`), categories (`Po`), or blocks (`arrows`)
- `uni unicode emoji` — Search emojis by CLDR name/keywords
- `uni self help` — Full usage incl. `-format` placeholders
- `uni _ _` — Passthrough (`-c` compact, `-f` format, `-as table`)

## Usage Examples

- "What are these weird characters in this string?"
- "Find the codepoint for the euro sign"
- "Give me a snowflake emoji"
- "List all box-drawing characters"

## Installation

```bash
go install zgo.at/uni/v2@latest
```

## Examples

```bash
uni i 'h€ý'                      # identify chars
echo 'text' | uni i              # from stdin
uni s globe earth                # AND search
uni s -o globe milky             # OR search
uni p U+2042 0x2500..0x257f      # codepoints and ranges
uni p -as table box              # pretty block table
uni e cry                        # emoji search
uni i -f '%unicode %name' a€     # custom format
```

## Key Features

- Full Unicode 15.1 database in one static binary — no lookups, works offline
- Reads args or stdin; pipe-friendly everywhere
- `-format` templating (e.g. generate X11 keysym maps) and `-json` output
- Blocks, categories, named sequences, emoji CLDR data all queryable
