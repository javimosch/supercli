---
name: vulnx
description: Use this skill when the user wants to explore vulnerability data (CVEs) with advanced filtering.
---
# vulnx Plugin
Explore vulnerability data with JSON output.
## Commands
- `vulnx self version` — Print vulnx version
- `vulnx _ _` — Passthrough to vulnx CLI
## Installation
```bash
go install github.com/projectdiscovery/vulnx/cmd/vulnx@latest
```
## Examples
```bash
vulnx --help
echo "CVE-2024-1234" | vulnx
```
## Key Features
- **CVE exploration** — Advanced vulnerability filtering
- **JSON output** — Structured data for pipelines
- **KEV/EPSS support** — Known exploited vulnerabilities
- **ProjectDiscovery** — Part of the security toolkit ecosystem
