---
name: typeshare
description: Use this skill when the user wants to synchronize type definitions between languages, share Rust types with other languages, or work with FFI.
---

# typeshare Plugin

Typeshare is the ultimate tool for synchronizing your type definitions between Rust and other languages for seamless FFI. Share types across languages easily.

## Commands

### Type Synchronization
- `typeshare type sync` — Synchronize type definitions

### Utility
- `typeshare _ _` — Passthrough to typeshare CLI

## Usage Examples
- "Sync Rust types to TypeScript"
- "Generate types from Rust"
- "Share types across languages"
- "FFI type definitions"

## Installation

```bash
brew install typeshare
```

Or via Cargo:
```bash
cargo install typeshare-cli
```

## Examples

```bash
# Sync types to TypeScript
typeshare type sync typescript types.rs

# Sync with output directory
typeshare type sync swift types.rs --output ./swift

# Sync to Kotlin
typeshare type sync kotlin types.rs

# Any typeshare command with passthrough
typeshare _ _ typescript types.rs
typeshare _ _ swift types.rs --output ./swift
```

## Key Features
- **Multi-language** - TypeScript, Swift, Kotlin, Dart, and more
- **Rust-first** - Designed for Rust types
- **FFI** - Perfect for foreign function interface
- **Auto-sync** - Automatic type conversion
- **Type-safe** - Maintains type safety
- **Easy** - Simple command interface
- **Cross-platform** - Linux, macOS, Windows
- **Fast** - Quick type generation
- **Maintainable** - Keep types in sync
- **Flexible** - Custom type mappings

## Notes
- Great for cross-language projects
- Maintains type safety across languages
- Perfect for FFI development
- Supports many target languages
