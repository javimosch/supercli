---
name: ship-safe
description: Use this skill when the user wants to scan for security vulnerabilities, secrets, CI/CD misconfigs, or agentic AI risks in their codebase.
---

# Ship Safe Plugin

CLI security scanner built for the agentic era. Detects CI/CD misconfigs, agent permission risks, MCP tool injection, hardcoded secrets, and DMCA-flagged AI dependencies.

## Commands

### Security Scanning
- `ship-safe audit <path>` — Full security audit with 22 agents, secrets scan, deps audit, and remediation plan
- `ship-safe scan <path>` — Quick scan for hardcoded secrets with entropy detection
- `ship-safe ci <path>` — CI/CD pipeline mode with compact output and exit codes

### Analysis & Scoring
- `ship-safe score <path>` — Security health score (0-100, A-F grade)
- `ship-safe diff` — Scan only changed files (fast pre-commit/PR scanning)
- `ship-safe diff --staged` — Scan only staged changes

### Additional Commands
- `ship-safe doctor` — Environment diagnostics
- `ship-safe baseline` — Accept current findings as baseline
- `ship-safe vibe-check` — Fun emoji security grade with shareable badge
- `ship-safe watch` — Continuous file watching with re-scans

## Usage Examples

- "Run a full security audit"
- "Scan for secrets in this project"
- "Check CI/CD security posture"
- "Get a security score for my codebase"
- "Scan only changed files in this PR"

## Installation

```bash
npm install -g ship-safe
```

## Key Features
- 22 specialized security agents running in parallel
- Secrets detection with entropy scoring and provider API verification
- OWASP Top 10 2025 and Agentic AI Top 10 coverage
- Live OSV.dev advisory feed with EPSS exploit probability
- LLM-powered deep analysis for critical findings
- CI/CD pipeline optimization with SARIF/JSON output
