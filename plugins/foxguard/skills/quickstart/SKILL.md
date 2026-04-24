---
name: foxguard
description: Use this skill when the user wants to scan code for security vulnerabilities, run a post-quantum crypto audit, detect leaked secrets, generate a CBOM, or diff-scan against a branch.
---

# foxguard Plugin

Security scanner as fast as a linter with post-quantum crypto audit, diff scans, secrets detection, and CycloneDX CBOM export. Tree-sitter based with Semgrep/OpenGrep compatible rules.

## Commands

### Scanning
- `foxguard scan run` — Scan the target path for security issues
- `foxguard scan diff` — Show new findings compared to a target branch or commit
- `foxguard scan secrets` — Scan for leaked credentials and private keys
- `foxguard scan pqc` — Post-quantum crypto audit (NSA CNSA 2.0 compliance)

### Configuration
- `foxguard config init` — Install local pre-commit hook

### Utility
- `foxguard self version` — Print foxguard version
- `foxguard _ _` — Passthrough to foxguard CLI

## Usage Examples
- "Scan the current directory for security issues"
- "Diff scan against main branch to find new issues"
- "Check for leaked secrets in the repo"
- "Run a post-quantum crypto audit"
- "Generate a CycloneDX CBOM for compliance"
- "Scan only modified files"

## Installation

```bash
curl -fsSL https://foxguard.dev/install.sh | sh
```

## Examples

```bash
# Scan the current directory
foxguard scan run .

# Scan and generate SARIF output
foxguard scan run . --format sarif

# Generate a CycloneDX 1.6 CBOM
foxguard scan run . --format cbom

# Scan only modified files
foxguard scan run . --changed

# Include source-to-sink dataflow traces
foxguard scan run . --explain

# Diff scan against main branch
foxguard scan diff main .

# Scan for leaked credentials and private keys
foxguard scan secrets .

# Scan for leaked secrets with SARIF output
foxguard scan secrets . --format sarif

# Post-quantum crypto audit
foxguard scan pqc .

# PQ audit with CBOM output
foxguard scan pqc . --format cbom

# Post findings as PR review comments
foxguard scan run . --github-pr 42

# Install pre-commit hook
foxguard config init
```

## Key Features

- **Four scan modes**: Full scan, diff scan, secrets scan, post-quantum crypto audit
- **Post-quantum crypto audit**: Annotates PQ-vulnerable algorithms with NSA CNSA 2.0 migration deadlines
- **Diff scanning**: Find only new issues compared to a target branch or commit
- **Secrets detection**: Leaked credentials, API keys, private keys, tokens
- **CycloneDX CBOM export**: Cryptographic bill of materials for compliance
- **Source-to-sink dataflow traces**: `--explain` flag shows how vulnerabilities flow
- **PR review integration**: Post findings directly as GitHub PR comments
- **Pre-commit hook**: `foxguard init` installs a local pre-commit hook
- **Tree-sitter based**: Accurate parsing across Python, JavaScript/TypeScript, Go, Java, Rust
- **Semgrep/OpenGrep compatible**: Custom rules via `--rules` flag
- **TUI triage**: Run `foxguard tui .` directly for interactive review, baseline, ignore, severity overrides

## Output Formats

- **Default** — Human-readable terminal output
- **SARIF** — Static Analysis Results Interchange Format for CI integration
- **CBOM** — CycloneDX 1.6 Cryptographic Bill of Materials
- **JSON** — Structured JSON for programmatic consumption

## Supported Languages

- Python
- JavaScript / TypeScript
- Go
- Java
- Rust
- TLS configuration files (OpenSSL, nginx, Apache)

## Notes

- Post-quantum rules ship for all supported languages plus TLS configs
- Each PQ finding carries the matching CNSA 2.0 deadline (2030 for software signing, 2033 for traditional networking)
- Remediation guidance surfaces ML-KEM-1024 / ML-DSA-87 for NSS workloads and ML-KEM-768 / ML-DSA-65 for commercial use
- The `foxguard tui .` command opens an interactive TUI and should be run directly, not via supercli
- `npx foxguard` works without any installation for one-off scans
