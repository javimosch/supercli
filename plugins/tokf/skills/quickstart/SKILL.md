# tokf - LLM Context Compressor

## Overview
tokf is a config-driven CLI tool that compresses command output before it reaches an LLM context. Reduces token usage for AI tools.

## Quick Start

### Run command with filtering
```bash
sc tokf run command <command>
```

### Passthrough to tokf CLI
```bash
sc tokf _ <tokf-args>
```

## Key Features

- **Context Compression**: Reduce LLM token usage
- **Config-Driven**: TOML configuration
- **Filter Library**: Built-in filter library
- **Task Runner Integration**: Works with make, just
- **Error Extraction**: Extract errors from output
- **Test Failure Extraction**: Extract test failures

## Installation

```bash
cargo install tokf
```

Also available via:
- Homebrew
- Build from source

## Usage Examples

### Run command with filtering
```bash
tokf make test
```

### Apply filter to fixture
```bash
tokf --filter error-filter fixture.txt
```

### Verify filter test suites
```bash
tokf test
```

### Explore available filters
```bash
tokf discover
```

## Notes

- Run `tokf --help` to see all available options
