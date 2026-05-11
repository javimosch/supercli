# gopass Plugin for SuperCLI

The slightly more awesome standard UNIX password manager for teams. Store, retrieve, and manage credentials encrypted with GPG and versioned with git.

## Features

- **Encrypted**: All secrets encrypted with GPG (or age)
- **Versioned**: Git-backed — full history of changes
- **Team-ready**: Share secrets via shared git repos
- **Password generation**: Built-in random password generator
- **Offline-capable**: No network required for local access
- **Go binary**: Single file, no heavy runtime deps

## Quick Start

### 1. Install gopass

```bash
# macOS
brew install gopass

# Linux
# Download from https://github.com/gopasspw/gopass/releases
# Or use your package manager
```

### 2. Run the Setup Script

Get location-specific setup instructions via supercli:

```bash
supercli gopass self setup
```

This command provides installation-specific instructions for finding and running the setup script. It works for:
- **Global npm installations**: `npm install -g supercli`
- **Local npm installations**: `npm install supercli`  
- **Development setups**: Running from the repository

The instructions will include the exact commands to find your gopass plugin directory based on your installation type.

The setup script will:
- Prompt you for your name and email (for GPG key)
- Ask you to set a master password (never stored in plain text)
- Generate a GPG key encrypted with your master password
- Initialize gopass with the new key
- Configure environment variables in your shell config
- Set up proper GPG_TTY configuration

### 3. Restart Your Shell

After setup, restart your terminal or source your shell config:

```bash
# For zsh
source ~/.zshrc

# For bash
source ~/.bashrc
```

## Usage

### List All Secrets

```bash
# Via supercli
supercli gopass secrets list

# Direct gopass
gopass list
```

### Store a Password

```bash
# Via supercli (interactive)
supercli gopass secret create --path myservice/api-key

# Direct gopass
echo "my-password" | gopass insert --force myservice/api-key
```

### Retrieve a Password

**Important:** You must provide your master password to decrypt secrets.

```bash
# Via supercli
echo "YOUR_MASTER_PASSWORD" | supercli gopass secret show --path myservice/api-key

# Direct gopass
echo "YOUR_MASTER_PASSWORD" | gopass show myservice/api-key
```

### Generate a Random Password

```bash
# Via supercli
supercli gopass secret generate --path myservice/new-key 32

# Direct gopass
gopass generate myservice/new-key 32
```

### Delete a Secret

```bash
# Via supercli
supercli gopass secret delete --path myservice/old-key

# Direct gopass
gopass delete myservice/old-key
```

### Sync with Remote Git Repository

```bash
# Via supercli
supercli gopass git sync

# Direct gopass
gopass sync
```

## Security Best Practices

### Master Password Security

- **Never share your master password** with anyone, including AI assistants
- **Use a strong, memorable password** (at least 12 characters recommended)
- **Don't store it in plain text** files, environment variables, or chat logs
- **The setup script keeps it secure** by prompting interactively

### Backup Your Keys

Your GPG keys and password store contain sensitive data. Back them up regularly:

```bash
# Backup GPG keys
tar -czf ~/backup/gpg-backup.tar.gz ~/.gnupg/

# Backup password store
tar -czf ~/backup/gopass-backup.tar.gz ~/.local/share/gopass/
```

Store backups in a secure location (encrypted USB drive, secure cloud storage, etc.).

### Environment Configuration

The setup script automatically adds these to your shell config:

```bash
export GPG_TTY=$(tty)
export PATH="$HOME/.local/bin:$PATH"
```

If you need to add them manually:

```bash
# For zsh
echo 'export GPG_TTY=$(tty)' >> ~/.zshrc
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc

# For bash
echo 'export GPG_TTY=$(tty)' >> ~/.bashrc
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

## Troubleshooting

### "decryption failed" Error

If you get a decryption error, ensure:

1. You're providing the correct master password
2. GPG_TTY is set: `echo $GPG_TTY` should show a tty path
3. Your GPG agent is running: `gpg-agent --daemon`

### Command Hangs or Prompts for Password

If gopass hangs or prompts interactively:

1. Use pipe to provide password: `echo "PASSWORD" | gopass show secret-name`
2. Ensure GPG_TTY is set in your shell config
3. Restart your shell after configuration changes

### "gopass: command not found"

If gopass isn't found:

1. Ensure it's installed: `which gopass`
2. Add to PATH if installed in custom location
3. The setup script adds `~/.local/bin` to PATH automatically

## Advanced Usage

### Using with Git Remote

Share your password store with a team via git:

```bash
# Add remote
gopass git remote add origin git@github.com:yourorg/passwords.git

# Push initial store
gopass git push

# Pull changes from teammates
gopass git pull
```

### Multiple Recipients

For team password stores, you can add multiple GPG keys:

```bash
# Add a teammate's GPG key
gopass recipients add teammate@email.com

# Remove a teammate
gopass recipients remove teammate@email.com
```

### Custom Store Location

By default, gopass uses `~/.local/share/gopass/stores/root`. You can customize this:

```bash
export GOPASS_HOME=/custom/path
```

## Remote Access (Daemon)

The gopass plugin includes a remote daemon that connects to a deployed gopassui control panel, allowing you to manage your local gopass passwords via a web UI from anywhere.

### Architecture

- **gopassui**: Standalone web UI deployed to remote server (dk1: 92.113.145.178:8768)
- **gopass daemon**: Connects to remote gopassui via WebSocket (pre-configured)
- **Local gopass**: Executes commands on your local machine
- **Security**: All password operations happen locally, only results are transmitted

### Deployment

The gopassui control panel is deployed to dk1 VM:
- **URL**: `http://92.113.145.178:8768`
- **WebSocket**: `ws://92.113.145.178:8768`
- **Status**: Running and ready for daemon connections

### Starting the Daemon

```bash
# Start the daemon (auto-connects to dk1 gopassui)
supercli gopass daemon start

# Check status
supercli gopass daemon status

# Stop the daemon
supercli gopass daemon stop
```

**No configuration needed** - the daemon is pre-configured to connect to dk1 gopassui with static authentication.

### Accessing the Web UI

1. Start the daemon: `supercli gopass daemon start`
2. Open browser to: `http://92.113.145.178:8768`
3. The daemon will automatically appear in the "Connected Daemons" list
4. Click on your daemon to select it
5. Use the web interface to manage your local gopass passwords
6. All gopass operations execute on your local machine

### Security Benefits

- **Local execution**: All password operations happen on your local machine
- **No password transmission**: Master passwords never leave your machine
- **Encrypted storage**: GPG encryption happens locally
- **Remote UI only for control**: The UI only sends commands and displays results
- **Static authentication**: Pre-configured shared secret, no manual token management
- **Session-based**: Each daemon connection uses a unique session ID

## Plugin Commands via SuperCLI

The plugin provides these SuperCLI commands:

- `gopass secret show --path <name>` — Show a secret
- `gopass secret create --path <name>` — Create a new secret
- `gopass secret generate --path <name> <length>` — Generate random password
- `gopass secret delete --path <name>` — Delete a secret
- `gopass secrets list` — List all secrets
- `gopass store status` — Show store configuration
- `gopass git sync` — Sync with remote git repository
- `gopass _ _` — Passthrough for any gopass command

## Support

- **gopass documentation**: https://www.gopass.pw/
- **SuperCLI documentation**: https://github.com/javimosch/supercli
- **Issues**: Report issues in the SuperCLI repository

## License

This plugin follows the same license as SuperCLI. gopass itself is licensed under the MIT License.
