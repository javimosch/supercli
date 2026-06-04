---
name: readelf
description: readelf — display information about ELF format files
---

# readelf Plugin

Display information about ELF format files (executables, shared libraries, object files).

## Commands

- `readelf self version` — Print version
- `readelf file header <elf-file>` — Display ELF file header
- `readelf file sections <elf-file>` — Display section headers
- `readelf file symbols <elf-file>` — Display symbol table
- `readelf file relocations <elf-file>` — Display relocations
- `readelf file dynamic <elf-file>` — Display dynamic section
- `readelf file segments <elf-file>` — Display program headers/segments
- `readelf file notes <elf-file>` — Display notes section
- `readelf file version-info <elf-file>` — Display version sections
- `readelf file demangle <elf-file>` — Display symbols with demangled C++/Rust names
- `readelf file all <elf-file>` — Display all information
- `readelf _ _ [args]` — Passthrough to readelf

## Usage Examples

### Examine a binary

Check ELF header: `readelf file header /bin/ls`

List sections: `readelf file sections /bin/ls`

Find symbols: `readelf file symbols /usr/lib/libc.so.6`

With demangled names: `readelf file demangle /usr/lib/libstdc++.so.6`

### Debug linking

Check dependencies: `readelf file dynamic /usr/bin/gcc`

### Quick overview

All info at once: `readelf file all /bin/bash`

## Installation

Part of GNU Binutils, pre-installed on most Linux distributions.
