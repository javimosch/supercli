---
name: whatis
description: whatis — display one-line manual page descriptions
---

# whatis Plugin

Display one-line manual page descriptions for commands and topics.

## Commands

- `whatis self version` — Print whatis version
- `whatis name lookup <name>` — Display description for a command
- `whatis name lookup-all <name>` — Display all matching descriptions across sections
- `whatis name lookup-section <section> <name>` — Lookup in a specific section
- `whatis _ _ [args]` — Passthrough to whatis

## Usage Examples

- Describe a command: `whatis name lookup ls`
- Check all sections for a name: `whatis name lookup-all printf`
- Lookup in section 3 (C library): `whatis name lookup-section 3 printf`
- Multiple names: `whatis _ _ ls cp mv`

## Installation

Part of man-db, pre-installed on most Linux systems.
