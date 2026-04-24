---
name: treefmt
description: Use this skill when the user wants to format code with multiple formatters, run all formatters on a codebase, or use a formatter multiplexer.
---

# treefmt Plugin

The formatter multiplexer. Run multiple formatters on a codebase with a single command. Format all files using configured formatters.

## Commands

### Code Formatting
- `treefmt format run` — Format code with multiple formatters

### Utility
- `treefmt _ _` — Passthrough to treefmt CLI

## Usage Examples
- "Format code"
- "Run all formatters"
- "Format project"
- "Check formatting"

## Installation

```bash
brew install treefmt
```

Or via Go:
```bash
go install github.com/numtide/treefmt/cmd/treefmt@latest
```

## Examples

```bash
# Format current directory
treefmt format run

# Format specific path
treefmt format run ./src

# Check formatting
treefmt format run --check

# Use config file
treefmt format run --config treefmt.toml

# Any treefmt command with passthrough
treefmt _ _ run
treefmt _ _ run --check --fail-on-change
```

## Key Features
- **Multiplexer** - Multiple formatters
- **Configurable** - Config file support
- **Fast** - Parallel execution
- **Check** - Check without changes
- **Formatters** - Supports many formatters
- **Easy** - Single command
- **Consistent** - Consistent formatting
- **CI/CD** - Pipeline friendly
- **Tree** - Tree-wide formatting
- **Flexible** - Custom configurations

## Notes
- Great for polyglot projects
- Supports many formatters
- Configurable via treefmt.toml
- Perfect for CI/CD pipelines
