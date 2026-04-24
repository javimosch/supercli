---
name: venom
description: Use this skill when the user wants to run integration tests, execute test suites, or perform automated testing with multiple executors.
---

# venom Plugin

Manage and run your integration tests with efficiency. Venom runs executors (script, HTTP Request, web, imap, etc.) and assertions for testing.

## Commands

### Test Execution
- `venom test run` — Run integration tests

### Utility
- `venom _ _` — Passthrough to venom CLI

## Usage Examples
- "Run integration tests"
- "Execute test suite"
- "Run venom tests"
- "Integration testing"

## Installation

```bash
brew install venom
```

Or via Go:
```bash
go install github.com/ovh/venom/cmd/venom@latest
```

## Examples

```bash
# Run tests
venom test run tests/

# Specify output format
venom test run tests/ --format json

# Set output directory
venom test run tests/ --output-dir results

# Pass variables
venom test run tests/ --var key=value

# Any venom command with passthrough
venom _ _ run tests/
venom _ _ run tests/ --format xml
```

## Key Features
- **Multi-executor** - Script, HTTP, web, imap, and more
- **Assertions** - Test result validation
- **Variables** - Variable substitution
- **CI/CD** - Perfect for pipelines
- **XUnit** - XUnit output format
- **Parallel** - Parallel test execution
- **Globstar** - Glob pattern support
- **Integration** - Integration testing focus
- **Flexible** - Custom executors
- **Powerful** - Advanced test scenarios

## Notes
- Great for integration testing
- Supports multiple executors
- Perfect for CI/CD pipelines
- Flexible and extensible
