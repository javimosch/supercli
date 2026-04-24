---
name: viking
description: Use this skill when the user wants to manage remote machines, execute commands across multiple servers, copy files to/from machines, or manage SSH keys.
---

# viking Plugin

Simple way to manage your remote machines and SSH keys. Execute commands in parallel across machines, copy files, manage SSH keys, and handle SSH connections easily.

## Commands

### Machine Management
- `viking machine add` — Add a remote machine
- `viking machine exec` — Execute command on machines

### File Operations
- `viking file copy` — Copy files/directories to/from machines

### SSH Key Management
- `viking key add` — Add SSH key from file
- `viking key generate` — Generate new SSH key
- `viking key copy` — Copy public SSH key to clipboard

### Configuration
- `viking config show` — Show current config folder

### Utility
- `viking _ _` — Passthrough to viking CLI

## Usage Examples
- "Add a new remote machine"
- "Execute command on all machines"
- "Copy file to remote machines"
- "Generate SSH key"
- "Connect to machine with TTY"

## Installation

```bash
go install github.com/d3witt/viking@latest
```

Or download pre-built binaries from: https://github.com/d3witt/viking/releases

## Examples

```bash
# Add a machine with multiple addresses
viking machine add --name deathstar --key starkey 168.112.216.50 root@61.22.128.69:3000 73.30.62.32:3001

# Add machine using SSH Agent (no key specified)
viking machine add --name deathstar 168.112.216.50 root@61.22.128.69:3000

# Execute command on all machines in parallel
viking machine exec deathstar echo 1234

# Execute command with TTY for interactive shell
viking machine exec --tty deathstar /bin/bash

# Copy file to all machines in parallel
viking file copy /tmp/file.txt deathstar:/tmp/

# Add SSH key from file
viking key add --name starkey --passphrase dart ./id_rsa_star

# Generate new SSH key
viking key generate --name starkey2

# Copy public key to clipboard
viking key copy starkey2

# Check config folder
viking config show

# Set custom config directory
export VIKING_CONFIG_DIR=/custom/path
```

## Key Features
- **Parallel execution** — Run commands on multiple machines simultaneously
- **SSH key management** — Add, generate, and copy SSH keys easily
- **File operations** — Copy files/directories to/from all machines in parallel
- **SSH Agent support** — Uses SSH Agent if key not specified
- **TTY mode** — Interactive shell access with `--tty` flag
- **Local data storage** — Saves configuration locally
- **Custom config directory** — Set `VIKING_CONFIG_DIR` for custom storage
- **Simple CLI** — Easy-to-use commands for common operations

## Notes
- Machine addresses support multiple IPs/ports
- If key is not specified, SSH Agent is used for authentication
- Commands execute in parallel across all machine addresses
- File copy operations work in parallel for efficiency
- Public keys can be copied to clipboard for easy sharing
- Configuration stored locally, can be customized with environment variable
