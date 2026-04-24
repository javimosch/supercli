---
name: cherrybomb
description: Use this skill when the user wants to audit API specifications, validate OpenAPI specs, or perform API security testing.
---

# cherrybomb Plugin

Cherrybomb is a CLI tool that helps you avoid undefined user behaviour by auditing your API specifications, validating them and running API security tests.

## Commands

### API Auditing
- `cherrybomb api audit` — Audit API specification

### Utility
- `cherrybomb _ _` — Passthrough to cherrybomb CLI

## Usage Examples
- "Audit API specification"
- "Validate OpenAPI spec"
- "API security testing"
- "Check API best practices"

## Installation

```bash
brew install cherrybomb
```

Or via Go:
```bash
go install github.com/blst-security/cherrybomb@latest
```

## Examples

```bash
# Audit API spec
cherrybomb api audit openapi.yaml

# Specify output format
cherrybomb api audit openapi.yaml --format json

# Set severity level
cherrybomb api audit openapi.yaml --severity high

# Output to file
cherrybomb api audit openapi.yaml --output report.json

# Any cherrybomb command with passthrough
cherrybomb _ _ audit openapi.yaml
cherrybomb _ _ audit openapi.yaml --format json
```

## Key Features
- **OpenAPI** - OpenAPI specification support
- **Security** - API security testing
- **Validation** - Spec validation
- **Best practices** - API best practices
- **Auditing** - Comprehensive audits
- **Reports** - Detailed reports
- **Fast** - Quick analysis
- **Easy** - Simple interface
- **Standards** - Industry standards
- **Integration** - CI/CD ready

## Notes
- Great for API development
- Supports OpenAPI 3.x
- Identifies security issues
- Validates API specifications
