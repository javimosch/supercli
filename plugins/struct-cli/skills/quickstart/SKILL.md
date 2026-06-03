---
name: struct-cli
description: Use this skill when the user wants a smarter alternative to the tree command for directory visualization.
---

# Struct CLI Plugin

Smarter tree command, written in Rust.

## Commands

### Tree
- `struct-cli tree show` — Show directory tree structure
- `struct-cli tree stats` — Show directory statistics

## Usage Examples

```bash
struct-cli tree show
struct-cli tree show --depth 3
struct-cli tree stats --path ./src
struct-cli --help
```

## Installation

```bash
cargo install struct-cli
```

## Key Features
- Enhanced directory tree visualization
- Configurable depth and filters
- Directory statistics and summaries
- Rust-based speed
