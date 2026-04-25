# dot-http - Scriptable HTTP Client

## Overview
dot-http is a text-based scriptable HTTP client. Define HTTP requests in text files and execute them.

## Quick Start

### Send HTTP request
```bash
sc dot-http request http <request-file>
```

### Passthrough to dot-http CLI
```bash
sc dot-http _ <dot-http-args>
```

## Key Features

- **Scriptable**: Define requests in text files
- **HTTP Client**: Full HTTP/HTTPS support
- **Variables**: Use variables in requests
- **Environment Files**: Load environment from files
- **Response Handlers**: Process responses
- **Vim Integration**: Vim support for editing requests

## Installation

```bash
cargo install dot-http
```

Also available via:
- Binary releases
- Script

## Usage Examples

### Execute request file
```bash
dot-http request.http
```

### With variables
```bash
dot-http --var name=value request.http
```

### With environment file
```bash
dot-http --env .env request.http
```

### Response handler
```bash
dot-http --response-handler script.sh request.http
```

## Notes

- Run `dot-http --help` to see all available options
