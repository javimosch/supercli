---
name: http-check
description: HTTP endpoint health checker with JSON output.
---
# http-check Plugin
Check HTTP endpoint health. Returns status code and response time as JSON.

## Commands
- `http-check <resource> <action>` — Execute http-check commands
- `http check health` — Check HTTP endpoint health

## Usage
- `http check health https://example.com` → {"status":200,"ms":42}
