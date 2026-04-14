---
name: xh
description: Use this skill when the user wants to send HTTP requests, test APIs, download files, or needs an HTTPie replacement for making HTTP calls.
---

# xh Plugin

Friendly and fast HTTP client — drop-in replacement for HTTPie.

## Commands

### Requests
- `xh request get` — Send GET request
- `xh request post` — Send POST request
- `xh request download` — Download file

## Usage Examples
- "GET a URL"
- "POST JSON data"
- "Download a file"
- "Send request with headers"

## Installation

```bash
curl -sfL https://raw.githubusercontent.com/ducaale/xh/master/install.sh | sh
# or
cargo install xh
# or
brew install xh
```

## Examples

```bash
# GET request
xh httpbin.org/json

# POST with JSON body
xh post httpbin.org/post name=ahmed age:=24

# GET with query params
xh get httpbin.org/json id==5

# With headers
xh get httpbin.org/json x-api-key:12345

# Download file
xh -d httpbin.org/json -o res.json

# Follow redirects
xh get httpbin.org/json -F
```

## Key Syntax

- `=` — String field in body
- `:=` — Non-string JSON field
- `==` — Query parameter
- `:` — Header
- `@` — File upload

## Features
- HTTP/2 support
- JSON and form data
- File uploads
- Basic/Bearer auth
- Follow redirects
- `--curl` flag to print equivalent curl command