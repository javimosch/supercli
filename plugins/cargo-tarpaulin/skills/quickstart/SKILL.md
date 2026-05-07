---
name: cargo-tarpaulin
description: Use this skill when the user wants to run code coverage analysis on Rust projects, generate coverage reports, or measure test coverage.
---

# cargo-tarpaulin Plugin

Code coverage reporting tool for Rust/Cargo projects.

## Commands

### Coverage
- `cargo-tarpaulin coverage run` — Run code coverage analysis
- `cargo-tarpaulin coverage html` — Generate HTML coverage report
- `cargo-tarpaulin coverage xml` — Generate XML (Cobertura) report

## Usage Examples
- "Run code coverage on my Rust project"
- "Generate a coverage report"
- "Check test coverage percentage"
- "Create an HTML coverage report"

## Installation

```bash
cargo install cargo-tarpaulin
```

## Examples

```bash
# Basic coverage
cargo tarpaulin

# HTML report
cargo tarpaulin --out Html

# XML for CI
cargo tarpaulin --out Xml

# JSON output
cargo tarpaulin --out Json

# With timeout
cargo tarpaulin --timeout 120

# Exclude files
cargo tarpaulin --exclude-files "tests/*"
```

## Key Features
- Line coverage analysis
- HTML, XML, JSON, LCOV output formats
- CI integration (CircleCI, Travis, GitHub Actions)
- Coveralls.io and Codecov.io upload support
- Config file support (.tarpaulin.toml)
