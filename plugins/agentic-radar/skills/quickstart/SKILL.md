# agentic-radar Skill

Use the agentic-radar plugin when analyzing or assessing agentic AI systems for security vulnerabilities and operational risks.

## Commands
- `agentic-radar <resource> <action>` — Execute agentic-radar commands
- `agentic-radar self version` — Show agentic-radar version
- `agentic-radar scan run` — Scan agentic workflow for security issues
- `agentic-radar test run` — Run security tests on agentic system
- `agentic-radar report show` — Show security assessment report

## Quick Start

### 1. Check Installation
```bash
dcli agentic-radar self version
```

### 2. Scan a Workflow
```bash
dcli agentic-radar scan run --target /path/to/workflow
```

### 3. Run Security Tests
```bash
dcli agentic-radar test run --target your-agentic-system
```

### 4. View Report
```bash
dcli agentic-radar report show --scan-id <scan-id>
```

## Agent Notes

- agentic-radar scans agentic workflows for security vulnerabilities
- Use `test` for running targeted security test suites
- Reports can be output in JSON, YAML, or HTML formats
- Regular scanning of agentic systems is recommended for security posture
