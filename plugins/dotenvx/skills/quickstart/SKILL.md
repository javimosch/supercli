---
name: dotenvx
description: Use this skill when the user wants to manage environment variables securely.
---

# Dotenvx Plugin

A secure dotenv from the creator of dotenv. Advanced .env file management with encryption and interpolation.

## Commands

### Environment Management
- `dotenvx env run` — Run command with environment variables from .env file

## Usage Examples
- "dotenvx env run --command 'node index.js' --env_file .env"
- "dotenvx env run --command 'npm start' --debug"

## Installation

```bash
npm install -g dotenvx
```

## Examples

```bash
# Run command with .env file
dotenvx run -- node index.js

# Run with debug output
dotenvx run --debug -- node index.js

# Set env variable inline
dotenvx run --env="API_KEY=xxx" -- node index.js

# Use specific .env file
dotenvx run --env-file .env.production -- node index.js

# Variable interpolation in .env
# DATABASE_URL="postgres://${USERNAME}@localhost/mydb"

# Default values
# DATABASE_HOST=${DB_HOST:-localhost}

# Alternate values
# DEBUG_MODE=${NODE_ENV:+false}
```

## Key Features
- Variable interpolation (reference other env vars)
- Default values with fallback
- Alternate values
- Command substitution (output of commands as values)
- Multiline values
- Encryption support
- Multiple environments
- Debug mode for troubleshooting
