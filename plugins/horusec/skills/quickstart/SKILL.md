---
name: horusec
description: Use this skill when the user wants to scan for security vulnerabilities, perform SAST analysis, or check code for security issues.
---

# horusec Plugin

Horusec is an open source tool that improves identification of vulnerabilities in your project with just one command. Security vulnerability scanner.

## Commands

### Security Scanning
- `horusec scan start` — Start security vulnerability scan

### Utility
- `horusec _ _` — Passthrough to horusec CLI

## Usage Examples
- "Scan for vulnerabilities"
- "Security analysis"
- "SAST scan"
- "Check security issues"

## Installation

```bash
brew install horusec
```

Or via Go:
```bash
go install github.com/ZupIT/horusec/cmd/horusec@latest
```

## Examples

```bash
# Scan project
horusec scan start ./myproject

# JSON output
horusec scan start ./myproject --json-output

# Skip folders
horusec scan start ./myproject --skip-folder node_modules

# Remote analysis
horusec scan start ./myproject --remote

# Any horusec command with passthrough
horusec _ _ start ./myproject
horusec _ _ start ./myproject --json-output
```

## Key Features
- **Multi-language** - Go, Python, Java, Kotlin, Ruby, and more
- **SAST** - Static application security testing
- **Fast** - Quick vulnerability detection
- **CI/CD** - Pipeline integration
- **Comprehensive** - Multiple vulnerability types
- **Remote** - Cloud-based analysis
- **Customizable** - Configurable rules
- **Reports** - Detailed security reports
- **Cross-platform** - Linux, macOS, Windows
- **Open source** - Free and extensible

## Notes
- Great for security scanning
- Supports many programming languages
- Perfect for CI/CD pipelines
- Identifies security flaws early
