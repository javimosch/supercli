# zerobox - Process Sandbox

## Overview
zerobox is a lightweight, cross-platform process sandboxing tool with file, network, and credential controls. Run commands safely with granular permissions.

## Quick Start

### Run command with no writes or network
```bash
sc zerobox run command "node -e \"console.log('hello')\""
```

### Allow writes to specific directory
```bash
sc zerobox run command --allow-write=. "npm install"
```

### List filesystem snapshots
```bash
sc zerobox snapshot list
```

### Passthrough to zerobox CLI
```bash
sc zerobox _ <zerobox-args>
```

## Key Features

- **File Controls**: Allow/deny file and directory writes
- **Network Controls**: Restrict network access to specific domains
- **Credential Management**: Pass secrets securely without exposing them to the sandbox
- **Snapshot & Restore**: Record filesystem changes and undo them
- **Environment Control**: Control which environment variables are passed
- **Cross-Platform**: Works on Linux, macOS, and Windows

## Installation

```bash
cargo install zerobox
```

Or via package managers:
- npm: `npm install -g zerobox`
- pip: `pip install zerobox`
- curl: `curl -fsSL https://raw.githubusercontent.com/afshinm/zerobox/main/install.sh | sh`

## Usage Examples

### Basic sandboxing
```bash
zerobox -- node script.js
```

### Allow specific directory writes
```bash
zerobox --allow-write=./build -- npm run build
```

### Allow network to specific domain
```bash
zerobox --allow-net=api.openai.com -- node agent.js
```

### Pass secrets securely
```bash
zerobox --secret OPENAI_API_KEY=sk-proj-123 --secret-host OPENAI_API_KEY=api.openai.com -- node app.js
```

### Record and restore filesystem changes
```bash
zerobox --snapshot --allow-write=. -- npm install
zerobox snapshot restore <session-id>
```

## Notes

- Secrets are passed as placeholders and substituted at the network proxy level
- Use `--allow-env` to pass all parent environment variables
- Use `--deny-env` to block specific environment variables
- Snapshots can be inspected and restored later
