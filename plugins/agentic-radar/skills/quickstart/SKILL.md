# agentic-radar Skill

Use the agentic-radar plugin when analyzing or assessing agentic AI systems for security vulnerabilities and operational risks.

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
