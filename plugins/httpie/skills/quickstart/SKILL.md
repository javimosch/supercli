# httpie Plugin

## Overview
The httpie plugin provides a user-friendly command-line HTTP client for the API era. HTTPie makes CLI interaction with web services as human-friendly as possible.

## What is httpie?
`httpie` is a command-line HTTP client. Its goal is to make CLI interaction with web services as human-friendly as possible. It provides a simple `http` command that allows sending HTTP requests with sensible defaults.

## Quick Start

### 1. Install httpie
```bash
pip install httpie
# or with Homebrew
brew install httpie
# or with apt
sudo apt install httpie
```

### 2. Make a request
```bash
# GET request
http GET https://api.github.com/repos/httpie/httpie

# POST with JSON
http POST https://httpbin.org/post name=JohnDoe

# PUT request
http PUT https://httpbin.org/put name=JaneDoe
```

### 3. Verify installation
```bash
sc httpie self version
```

## Common Use Cases

### GET Request
```bash
# Simple GET
sc httpie request get https://api.github.com/users/httpie

# With headers
sc httpie request get https://api.example.com/data --header "Authorization: Bearer token"

# With basic auth
sc httpie request get https://api.example.com/data --auth user:pass
```

### POST Request
```bash
# JSON data
sc httpie request post https://httpbin.org/post --json '{"name":"John","age":30}'

# Form data
sc httpie request post https://httpbin.org/post --form 'name=John'

# With headers
sc httpie request post https://api.example.com/data --json '{"key":"value"}' --header "Content-Type: application/json"
```

### PUT Request
```bash
sc httpie request put https://api.example.com/data/123 --json '{"name":"Updated"}'
```

### DELETE Request
```bash
sc httpie request delete https://api.example.com/data/123 --header "Authorization: Bearer token"
```

## Features
- **Intuitive Syntax**: `http METHOD URL [ITEM]`
- **JSON Support**: Automatic JSON parsing and formatting
- **Syntax Highlighting**: Colorized output
- **Persistent Sessions**: Save and reuse sessions
- **Authentication**: Basic auth, digest, OAuth
- **File Upload**: Multipart file uploads
- **HTTPS**: SSL verification by default

## Useful Commands
- `sc httpie self version` - Print version
- `sc httpie request get [url]` - GET request
- `sc httpie request post [url] --json` - POST with JSON
- `sc httpie request put [url] --json` - PUT with JSON
- `sc httpie request delete [url]` - DELETE request

## Authentication
```bash
# Basic auth
sc httpie request get https://api.example.com --auth user:pass

# Bearer token
sc httpie request get https://api.example.com --header "Authorization: Bearer token"
```

## Tips
- Use `--json` flag for JSON data
- Use `--form` for form-encoded data
- Use `--verify=no` to disable SSL verification (not recommended)
- Use `--pretty all` for formatted output
- Use `--print` to customize output

## Resources
- Website: https://httpie.io
- GitHub: https://github.com/httpie/httpie
