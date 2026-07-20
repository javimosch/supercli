---
name: atac
description: Use this skill when the user wants to send HTTP requests from the terminal — test REST APIs, manage collections and environments, or replace Postman/Insomnia with a TUI client.
---

# atac Plugin

Arc-inspired API client for the terminal. Send HTTP requests, manage collections, and switch environments without leaving the shell.

## Installation

```bash
cargo install atac
```

Download binaries from [GitHub Releases](https://github.com/Julien-cpsn/ATAC/releases).

## Basic Usage

```bash
# Launch the TUI
atac

# Import existing collections
atac import postman collection.json
atac import insomnia collection.json
```

## Features

- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Request headers, query params, and body editing
- Environment variables for base URLs and tokens
- Collection and folder organization
- Postman and Insomnia collection import

## Usage Examples

- "Test this API endpoint from the terminal"
- "Import my Postman collection and send a GET request"
- "Switch to the staging environment and hit /health"

## SuperCLI

```bash
sc atac _ _
sc plugins learn atac
```
