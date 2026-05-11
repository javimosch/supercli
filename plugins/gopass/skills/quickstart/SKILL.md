---
name: gopass
description: Use this skill when the user wants to store, retrieve, or manage credentials and secrets — API keys, passwords, tokens, certificates — using an encrypted password store versioned with git.
---

# gopass Plugin

The slightly more awesome standard UNIX password manager for teams. Encrypted with GPG, versioned with git.

## Security Notice

**IMPORTANT:** For security reasons, the AI assistant should NEVER handle or view the user's master password. All password operations should be done interactively by the user or via secure piping.

When the user needs to set up gopass or change their master password, direct them to:

```bash
# Get setup instructions (works for any installation type)
supercli gopass self setup
```

This command provides location-specific instructions for finding and running the setup script manually. The setup script must be run manually to ensure the AI never sees the master password.

## Prerequisites

### Quick Setup (Recommended for New Users)

Get location-specific setup instructions via supercli:

```bash
supercli gopass self setup
```

The command will detect your installation type and provide the exact path to run the setup script. This works for:
- Global npm installations (`npm install -g supercli`)
- Local npm installations (`npm install supercli`)
- Development repository setups

Follow the provided instructions to run the setup script manually from your gopass plugin directory.

### Manual Setup

If you prefer manual setup or already have GPG keys:

```bash
# Install gopass
brew install gopass

# Initialize with existing GPG key
gopass init <your-gpg-key-id>

# Or let gopass generate a key (interactive)
gopass setup --crypto gpg
```

### Environment Configuration

After setup, ensure these environment variables are configured (the setup script handles this automatically):

```bash
# Add to ~/.zshrc or ~/.bashrc
export GPG_TTY=$(tty)
export PATH="$HOME/.local/bin:$PATH"
```

Then restart your shell or source the config file.

## Commands

### Secure Password Retrieval

**IMPORTANT:** When retrieving passwords, the user must provide their master password. Never include the master password in commands or responses.

**Correct pattern for password retrieval:**

```bash
# User provides their password via pipe (AI never sees it)
echo "USER_PASSWORD" | supercli gopass secret show --path <secret-name>
```

**Incorrect patterns to avoid:**
```bash
# ❌ Never include password in command
supercli gopass secret show --path dnipass gtf

# ❌ Never store password in files or environment
export GOPASS_PASSWORD="gtf"
```

### Secrets
- `gopass secret show api/github/token` — Show a secret (requires password via pipe)
- `gopass secret create api/stripe/key` — Create a new secret (interactive)
- `gopass secret generate api/aws/secret 32` — Generate a random password
- `gopass secret delete api/old/key` — Delete a secret

### Listing
- `gopass secrets list` — List all secrets (tree view)
- `gopass secrets list --flat` — Flat list (one per line)

### Store
- `gopass store status` — Show store configuration and status

### Git
- `gopass git sync` — Sync with remote git repository

### Full Access
- `gopass _ _` — Passthrough for any gopass command (fsck, git, mounts, audit, etc.)

### Daemon (Remote Web UI - Optional)
- `gopass daemon start` — Start the remote daemon for web UI access (optional)
- `gopass daemon stop` — Stop the remote daemon
- `gopass daemon status` — Check daemon status

**Note:** The web UI is completely optional. All gopass operations can be done via CLI commands listed above. The daemon/web UI provides a convenient browser-based interface but is not required for gopass functionality.

## Usage Examples

When helping users with gopass, follow these security-conscious patterns:

- "Run the setup command: supercli gopass self setup"
- "List all stored credentials: supercli gopass secrets list"
- "To show a secret, you'll need to provide your password: echo \"YOUR_PASSWORD\" | supercli gopass secret show --path <secret-name>"
- "Generate a 32-character password: supercli gopass secret generate --path api/aws/secret-key 32"
- "Sync your password store: supercli gopass git sync"

**Never ask for or handle the user's master password.** Direct them to use the setup command or provide it via pipe when retrieving secrets.

## Remote Access (Daemon - Optional Web UI)

The gopass plugin includes an optional remote daemon that can connect to a gopassui web control panel, allowing you to manage your local gopass passwords via a web UI from anywhere.

**Important:** This is completely optional. All gopass functionality works via CLI commands. The web UI is a convenience feature for those who prefer a browser interface.

### Architecture

- **gopassui**: Standalone web UI (Node.js/Express) that can be deployed to any server
- **gopass daemon**: Runs locally, connects to gopassui via WebSocket
- **Local gopass**: Executes commands on your local machine
- **Security**: All password operations happen locally, only results are transmitted

### Deployment

The gopassui web UI is a separate open-source project that can be deployed to any server. It requires:
- Node.js runtime
- WebSocket support
- HTTP server (can be behind reverse proxy with SSL)

To deploy gopassui, see the [gopassui GitHub repository](https://github.com/javimosch/gopassui) for setup instructions.

### Starting the Daemon

```bash
# Start the daemon (connects to configured gopassui server)
supercli gopass daemon start

# Check status
supercli gopass daemon status

# Stop the daemon
supercli gopass daemon stop
```

The daemon connects to a pre-configured gopassui server URL (set in daemon.js). By default, it uses a static authentication token for daemon-to-server communication.

### Accessing the Web UI

1. Deploy gopassui to your server (or use an existing deployment)
2. Start the daemon: `supercli gopass daemon start`
3. Open browser to your gopassui URL
4. The daemon will automatically appear in the "Connected Daemons" list
5. Click on your daemon to select it
6. Use the web interface to manage your local gopass passwords
7. All gopass operations execute on your local machine

### Security Benefits

- **Local execution**: All password operations happen on your local machine
- **No password transmission**: Master passwords never leave your machine
- **Encrypted storage**: GPG encryption happens locally
- **Remote UI only for control**: The UI only sends commands and displays results
- **Static authentication**: Pre-configured shared secret for daemon-to-server auth
- **Session-based**: Each daemon connection uses a unique session ID
- **Optional password storage**: Web UI can optionally store master password in browser localStorage (user-controlled)

### Web UI Features

- **Connected daemons list**: Shows all available gopass daemons with hostname and platform
- **Click to manage**: Select a daemon by clicking its card
- **List secrets**: View all stored passwords from your local gopass
- **Show secrets**: Reveal individual passwords (requires master password)
- **Add secrets**: Create new password entries in local gopass
- **Generate passwords**: Create random secure passwords in local gopass
- **Real-time updates**: WebSocket-based communication
- **Auto-refresh**: Daemon list refreshes every 10 seconds
- **Optional password storage**: Remember master password in browser (localStorage, user-controlled)
- **Forget password**: Clear saved password from browser storage

## Installation

### Quick Install with Setup Script (Recommended)

```bash
# From supercli repository
cd ~/ai/supercli/plugins/gopass
./setup.sh
```

This handles everything: gopass installation check, GPG key generation, and configuration.

### Manual Installation

```bash
# Install gopass
brew install gopass

# Run the setup script for secure configuration
cd ~/ai/supercli/plugins/gopass
./setup.sh
```

## Key Features
- **Encrypted**: All secrets encrypted with GPG (or age)
- **Versioned**: Git-backed — full history of changes
- **Team-ready**: Share secrets via shared git repos
- **Password generation**: Built-in random password generator
- **Offline-capable**: No network required for local access
- **Go binary**: Single file, no heavy runtime deps
- **Optional web UI**: Browser-based interface for remote access (requires separate gopassui deployment)
- **CLI-first**: All functionality available via command line
