---
name: sshpass
description: Non-interactive SSH password authentication utility
---
# sshpass Plugin

Non-interactive SSH password authentication for automated remote operations.

## Quickstart

```bash
# SSH with password from environment variable
export SSHKEYPASS="your_password"
sshpass -e ssh user@host

# SCP with password authentication
sshpass -e scp file.txt user@host:/path/

# rsync over SSH with password
sshpass -e rsync -avz /src/ user@host:/dst/

# Specify password directly (less secure)
sshpass -p "password" ssh user@host "command"
```

## Security Best Practices

- **Always use `-e` (environment variable)** over `-p` for passwords
- Set `SSHKEYPASS` env var instead of passing passwords as CLI args
- For production, prefer SSH key-based authentication
- Never hardcode passwords in scripts or commit them to version control

## Common Use Cases

| Command | Description |
|---------|-------------|
| `sshpass -e ssh user@host` | Interactive SSH session |
| `sshpass -e ssh user@host "cmd"` | Remote command execution |
| `sshpass -e scp file user@host:/path/` | File copy |
| `sshpass -e rsync -avz src/ user@host:/dst/` | Directory sync |

## Environment Variable

```
SSHKEYPASS=your_password
```

Set this env var and use `sshpass -e` instead of passing passwords on the command line.
