---
name: cargo-audit
description: Use this skill when the user wants to audit Rust project dependencies for security vulnerabilities, check Cargo.lock for known CVEs, or run security scans on Rust projects.
---

# cargo-audit Plugin

Audit Cargo.lock for crates with security vulnerabilities using the RustSec Advisory Database.

## Commands

### Audit
- `cargo-audit audit run` — Audit Cargo.lock for vulnerabilities
- `cargo-audit audit json` — Audit with JSON output

## Usage Examples
- "Audit my Rust project for vulnerabilities"
- "Check for security issues in Cargo.lock"
- "Run a security audit on this project"

## Installation

```bash
cargo install cargo-audit
```

## Examples

```bash
# Basic audit
cargo audit

# JSON output
cargo audit --json

# Ignore certain advisories
cargo audit --ignore RUSTSEC-2020-0001

# Deny warnings (fail on warnings)
cargo audit --deny warnings
```

## Key Features
- Scans Cargo.lock against RustSec Advisory Database
- JSON output for CI integration
- Configurable severity thresholds
- Supports yarn.lock files too
