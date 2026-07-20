---
name: bats
description: Use this skill when the user wants to write or run Bash shell tests — TAP-compliant test suites, CI integration, mocking, and parallel test execution.
---

# bats Plugin

Bash Automated Testing System. Write unit and integration tests for shell scripts with readable syntax, TAP output, and first-class CI support.

## Installation

```bash
npm install -g bats
# or
brew install bats-core
# Debian/Ubuntu: apt install bats
```

## Basic Usage

```bash
# Run a single test file
bats test/example.bats

# Run all tests in a directory
bats test/

# Count tests without running
bats --count test/
```

## Common Patterns

```bash
# Filter tests by name pattern
bats --filter "login" test/

# Parallel execution
bats --jobs 4 test/

# TAP output for CI
bats --tap test/

# JUnit XML for reporting
bats --formatter junit test/ > report.xml
```

## Writing Tests

```bash
# example.bats
@test "addition works" {
  result=$(echo $((2 + 2)))
  [ "$result" -eq 4 ]
}
```

## Usage Examples

- "Run all Bash tests in the test/ directory"
- "Filter bats tests matching 'deploy'"
- "Output bats results in TAP format for CI"

## SuperCLI

```bash
sc bats test run test/example.bats
sc bats _ _ --filter "auth" test/
sc plugins learn bats
```
