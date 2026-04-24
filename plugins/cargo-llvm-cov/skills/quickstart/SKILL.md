---
name: cargo-llvm-cov
description: Use this skill when the user wants to generate code coverage reports for Rust projects, measure test coverage, or export coverage data in various formats.
---

# cargo-llvm-cov Plugin

Cargo subcommand for LLVM source-based code coverage for Rust. Generate and report code coverage for Rust projects with minimal configuration.

## Commands

### Coverage Reporting
- `cargo-llvm-cov coverage report` — Generate code coverage report

### Utility
- `cargo-llvm-cov _ _` — Passthrough to cargo llvm-cov CLI

## Usage Examples
- "Generate coverage report"
- "Rust code coverage"
- "Export LCOV coverage"
- "Measure test coverage"

## Installation

```bash
cargo install cargo-llvm-cov
```

Requires Rust toolchain with cargo and rustc.

## Examples

```bash
# Generate coverage report
 cargo-llvm-cov coverage report

# Generate HTML report
 cargo-llvm-cov coverage report --html --output-path coverage/

# Generate LCOV report
 cargo-llvm-cov coverage report --lcov --output-path lcov.info

# Coverage for specific package
 cargo-llvm-cov coverage report --package my-package

# Any cargo llvm-cov command with passthrough
 cargo-llvm-cov _ _ --html
 cargo-llvm-cov _ _ test
 cargo-llvm-cov _ _ --json
```

## Key Features
- **LLVM** - LLVM source-based coverage
- **HTML** - HTML reports
- **LCOV** - LCOV format
- **JSON** - JSON output
- **Text** - Text output
- **Package** - Per-package coverage
- **Workspace** - Workspace support
- **CI/CD** - CI/CD friendly
- **Minimal** - Minimal config
- **Fast** - Fast instrumentation

## Notes
- Requires Rust toolchain
- Uses LLVM instrumentation
- Great for CI coverage gates
- Supports workspace projects
