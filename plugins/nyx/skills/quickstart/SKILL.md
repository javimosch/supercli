# nyx Quickstart

Nyx is a lightweight Rust CLI vulnerability scanner with cross-language taint analysis. Use this skill when you need to:

- Scan codebases for security vulnerabilities (SAST)
- Perform taint analysis across 10 programming languages
- Integrate security scanning into CI/CD pipelines
- Use browser UI for interactive security triage
- Generate SARIF reports for GitHub Actions

## Installation

```bash
cargo install nyx-scanner
nyx --version
```

## Core Commands

### Scan Current Directory

```bash
nyx scan
```

Default scan with balanced engine profile (AST + CFG + taint).

### Scan Specific Path

```bash
nyx scan /path/to/code
```

### Scan with Engine Profile

```bash
# Fastest: AST-only pattern matching
nyx scan --mode ast

# Default: Balanced (AST + CFG + taint)
nyx scan --mode balanced

# Most thorough: Deep analysis
nyx scan --mode deep
```

### Scan with Output Format

```bash
# SARIF for CI/CD
nyx scan --format sarif --output results.sarif

# JSON for programmatic parsing
nyx scan --format json --output results.json

# Console output (default)
nyx scan --format console
```

### Scan with Severity Threshold

```bash
# Fail on HIGH or CRITICAL only
nyx scan --fail-on HIGH

# Fail on MEDIUM and above
nyx scan --fail-on MEDIUM
```

### Scan with Advanced Options

```bash
# Enable symbolic execution
nyx scan --symex

# Enable backwards taint analysis
nyx scan --backwards-analysis

# Disable indexing (slower, less memory)
nyx scan --index off
```

## Browser UI

Start the browser UI for interactive security analysis:

```bash
nyx serve
```

Options:
- `--port <port>`: Server port (default: 9700)
- `--host <host>`: Server host (default: 127.0.0.1)
- `--no-browser`: Don't open browser automatically

```bash
# Custom port
nyx serve --port 8080

# Bind to all interfaces
nyx serve --host 0.0.0.0

# No auto-open
nyx serve --no-browser
```

## Supported Languages

Nyx supports 10 programming languages:
- Rust
- C
- C++
- Java
- Go
- PHP
- Python
- Ruby
- TypeScript
- JavaScript

## Engine Profiles

1. **ast** (fastest): AST-level pattern matching only
2. **balanced** (default): AST + CFG + taint analysis
3. **deep**: Most thorough analysis with all features

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run nyx security scan
  run: |
    cargo install nyx-scanner
    nyx scan --format sarif --output results.sarif --fail-on HIGH

- name: Upload SARIF results
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: results.sarif
```

## Key Features

- **Cross-language taint analysis**: Track data flow across files and languages
- **AST-level pattern matching**: Fast vulnerability detection
- **Control-flow graph analysis**: Understand code execution paths
- **Cross-file taint tracking**: Follow data across function boundaries
- **Browser UI**: Interactive triage with flow visualizer
- **SARIF output**: Standard format for CI/CD integration
- **Persistent triage state**: Save and restore analysis results

## Common Use Cases

### Quick security check before commit

```bash
nyx scan --mode ast --fail-on CRITICAL
```

### Full security audit

```bash
nyx scan --mode deep --format sarif --output audit.sarif
```

### Interactive investigation

```bash
nyx serve
# Open http://localhost:9700 in browser
```

### CI pipeline integration

```bash
nyx scan --format sarif --output results.sarif --fail-on HIGH
```

## Tips

- Use `--mode ast` for fast pre-commit checks
- Use `--mode balanced` for regular development
- Use `--mode deep` for security audits
- Enable `--symex` for more precise results (slower)
- Use browser UI for complex vulnerability investigation
- Set appropriate `--fail-on` threshold for your CI pipeline
