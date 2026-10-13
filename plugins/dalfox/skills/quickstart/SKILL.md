---
name: dalfox
description: Use this skill when the user wants to scan URLs or endpoints for XSS vulnerabilities with dalfox.
---

# dalfox Plugin

dalfox is a fast open-source XSS scanner written in Go. It mines parameters, applies context-aware payload encoding, verifies findings to suppress false positives, and detects reflected, stored, and DOM-based XSS.

## Commands

### Scanning
- `dalfox scan url <url>` — Scan a single URL
- `dalfox scan file <file>` — Scan targets from a file (one URL per line)
- `dalfox scan pipe` — Read target URLs from stdin
- `dalfox payload list` — Show built-in XSS payloads
- `dalfox _ _` — Passthrough (sxss blind mode, server REST API, --mining-dom)

## Usage Examples

- "Scan this URL for XSS"
- "Fuzz the search endpoint parameters"
- "Batch-scan this list of URLs"

## Installation

```bash
go install github.com/hahwul/dalfox/v2@latest
# or: brew install dalfox
# or: snap install dalfox
```

## Examples

```bash
dalfox url "https://target.com/search?q=test"
dalfox url "https://target.com/x" -b https://your-callback.io  # blind XSS
cat urls.txt | dalfox pipe --skip-bav
dalfox file targets.txt -o result.json --format json
```

## Key Features

- Parameter mining + DOM XSS verification via headless rendering (`--mining-dom`)
- Blind XSS callback mode (`-b`) for stored-XSS testing
- WAF evasion (`--waf-evasion`), custom payloads, GREP/pattern checks
- Output: console, JSON (`--format json`), or REST API server mode (`dalfox server`)

Only scan targets you are authorized to test.
