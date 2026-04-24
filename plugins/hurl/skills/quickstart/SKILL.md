---
name: hurl
description: Use this skill when the user wants to test HTTP requests, run API tests, or perform integration testing with a simple text format.
---

# hurl Plugin

Run and test HTTP requests with plain text. An HTTP testing tool that uses a simple text format for defining requests and assertions. Perfect for API testing, integration testing, and CI/CD.

## Commands

### HTTP Testing
- `hurl request run` — Run HTTP request from hurl file

### Utility
- `hurl _ _` — Passthrough to hurl CLI

## Usage Examples
- "Test this API endpoint"
- "Run HTTP requests from hurl file"
- "Perform integration tests"
- "Generate test reports"

## Installation

```bash
brew install hurl
```

Or via Cargo:
```bash
cargo install hurl
```

## Examples

```bash
# Run hurl file
hurl request run api_test.hurl

# Run in test mode
hurl request run --test api_test.hurl

# Verbose output
hurl request run --verbose api_test.hurl

# Output response to file
hurl request run --output response.json api_test.hurl

# Suppress response output
hurl request run --no-output api_test.hurl

# Generate HTML report
hurl request run --report report.html api_test.hurl

# Generate JSON report
hurl request run --report report.json api_test.hurl

# Generate JUnit report
hurl request run --report junit.xml api_test.hurl

# Generate TAP report
hurl request run --report tap.txt api_test.hurl

# Run multiple files with glob
hurl request run --glob "**/*.hurl"

# Continue on error
hurl request run --continue-on-error api_test.hurl

# Any hurl command with passthrough
hurl _ _ api_test.hurl --test
hurl _ _ --glob "**/*.hurl" --report report.html
```

## Hurl File Example

```hurl
GET https://api.example.com/users
HTTP 200
[Asserts]
header "Content-Type" contains "application/json"
jsonpath "$.users" count > 0
```

## Key Features
- **Simple syntax** — Plain text format for requests
- **Multiple methods** — GET, POST, PUT, DELETE, PATCH
- **Assertions** — Test status, headers, body, JSON
- **JSONPath** — Query JSON responses
- **XPath** — Query XML responses
- **Variables** — Use and capture values
- **Templating** — Dynamic request generation
- **Reports** — HTML, JSON, JUnit, TAP formats
- **CI/CD ready** — Exit codes for test results
- **Powered by curl** — Uses curl under the hood

## Notes
- Hurl files use .hurl extension
- Supports all HTTP methods
- Can test status codes, headers, cookies, body
- Supports basic auth, OAuth, and custom headers
- Perfect for API testing and integration tests
- Can be used in CI/CD pipelines
