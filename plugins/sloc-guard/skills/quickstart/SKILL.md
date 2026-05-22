---
name: sloc-guard
description: Use this skill when the user wants to enforce code quality by setting SLOC limits and directory structure rules to prevent code bloat and architectural decay.
---

# Sloc-Guard Plugin

High-performance Rust CLI that enforces Source Lines of Code (SLOC) limits and directory structure rules to prevent code bloat. Actively prevents architectural decay by failing builds when thresholds are exceeded.

## Commands

### Configuration
- `sloc-guard config init` — Initialize config with project type detection
- `sloc-guard config init --detect` — Auto-detect project type and generate config

### Codebase Checking
- `sloc-guard codebase check` — Check codebase against SLOC and structure rules
- `sloc-guard codebase check --diff main` — Check only files changed since main branch
- `sloc-guard codebase check --staged` — Check only staged files (pre-commit hooks)
- `sloc-guard codebase check --baseline` — Use baseline to grandfather existing violations
- `sloc-guard codebase check --suggest` — Provide split suggestions for large files

### Statistics & Analysis
- `sloc-guard stats summary` — Show project-level summary statistics
- `sloc-guard stats files` — Show top files by code lines
- `sloc-guard stats breakdown` — Show language or directory breakdown
- `sloc-guard stats trend` — Show trend comparison with history
- `sloc-guard stats history` — View historical snapshots
- `sloc-guard stats report` — Generate comprehensive report

### History & Snapshots
- `sloc-guard snapshot record` — Record current state to history

### Debugging
- `sloc-guard explain rules <path>` — Debug which rules apply to a specific path

## Usage Examples

```bash
# Initial setup
sloc-guard config init --detect
sloc-guard codebase check

# Regular checking
sloc-guard codebase check
sloc-guard codebase check --format json

# CI integration (check only changed files)
sloc-guard codebase check --diff main
sloc-guard codebase check --staged

# Handle existing codebases with baseline
sloc-guard codebase check --update-baseline
sloc-guard codebase check --baseline
sloc-guard codebase check --baseline --ratchet strict

# Get actionable suggestions
sloc-guard codebase check --suggest

# Statistics and analysis
sloc-guard stats summary
sloc-guard stats files --top 10 --sort code
sloc-guard stats breakdown --by-dir --depth 2
sloc-guard stats trend --since 7d
sloc-guard stats history --limit 20

# Generate comprehensive report
sloc-guard stats report --format html -o report.html

# Record historical snapshot
sloc-guard snapshot record

# Debug rules
sloc-guard explain rules src/components/Button.tsx

# Different output formats
sloc-guard codebase check --format sarif
sloc-guard codebase check --format markdown
sloc-guard codebase check --format html -o output.html
```

## Installation

```bash
cargo install sloc-guard
```

Or download pre-built binary from GitHub Releases and add to PATH.

## Configuration

Create `.sloc-guard.toml` in project root:

```toml
[content]
extensions = ["rs", "go", "py", "js", "ts"]
max_lines = 500
skip_comments = true
skip_blank = true

[structure]
max_files = 30
max_dirs = 10
max_depth = 8

[baseline]
ratchet = "warn"
```

## Key Features

- **SLOC Limits**: Enforce maximum lines per file (comments/blanks excluded by default)
- **Structure Guards**: Enforce directory organization (max files/dirs, naming conventions)
- **Git-Aware**: Check only changed files with `--diff` and `--staged` for fast CI
- **Trend Tracking**: Monitor codebase growth over time with historical snapshots
- **Baseline Grandfathering**: Adopt in existing projects without fixing everything at once
- **Ratchet Mode**: Violations can only decrease over time (warn, auto, strict)
- **Split Suggestions**: Get actionable suggestions when files exceed limits
- **Multiple Output Formats**: text, json, sarif, markdown, html
- **Path-based Rules**: Override limits for specific paths with patterns
- **Config Inheritance**: Extend from presets or remote configs
- **Explain Command**: Debug which rules apply to specific paths

## Perfect for AI-Assisted Development

In the age of AI coding assistants, hard constraints work better than reminders:
- When sloc-guard fails the build, AI automatically responds by refactoring
- No need to endlessly remind AI to keep files small
- Let it hit the wall and fix itself

## Common Workflows

### CI Integration
```bash
# Pre-commit hook
sloc-guard codebase check --staged

# Main branch comparison
sloc-guard codebase check --diff main
```

### Legacy Codebase Adoption
```bash
# Create baseline from current state
sloc-guard codebase check --update-baseline

# Check with grandfathering
sloc-guard codebase check --baseline

# Enable strict ratchet over time
sloc-guard codebase check --baseline --ratchet strict
```

### Development Monitoring
```bash
# Regular statistics
sloc-guard stats summary
sloc-guard stats trend --since 7d

# Identify problematic files
sloc-guard stats files --top 10 --sort code
```

## Output Formats

- **text**: Human-readable (default)
- **json**: Machine-readable for automation
- **sarif**: IDE integration (VS Code, GitHub)
- **markdown**: Documentation generation
- **html**: Rich reports with charts

## Supported Languages

Built-in comment-aware parsing for: Rust, Go, Python, JavaScript, TypeScript, Java, C, C++, C#, Ruby, PHP, Swift, Kotlin, and more.