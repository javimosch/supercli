---
name: apropos
description: apropos — search the manual page names and descriptions for a keyword
---

# apropos Plugin

Search the manual page names and descriptions for keywords.

## Commands

- `apropos self version` — Print apropos version
- `apropos keyword search <keyword>` — Search man pages for a keyword
- `apropos keyword search-all <keyword>` — Search with full output (no pager)
- `apropos keyword search-exact <keyword>` — Exact keyword match only
- `apropos keyword search-section <section> <keyword>` — Search within a specific section
- `apropos _ _ [args]` — Passthrough to apropos

## Usage Examples

- Find all commands related to a topic: `apropos keyword search compress`
- Search in section 3 (C functions): `apropos keyword search-section 3 printf`
- Exact search for a specific command: `apropos keyword search-exact ls`
- Full description output: `apropos keyword search-all network`

## Installation

Part of man-db, pre-installed on most Linux systems.
