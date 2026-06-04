# ssh (OpenSSH Client) Quickstart

OpenSSH client for secure remote login, command execution, and port forwarding.

## Common Operations

```bash
# Connect to remote host
ssh user@hostname

# Execute a command
ssh user@hostname "command"

# Connect on a non-standard port
ssh -p 2222 user@hostname

# Local port forwarding
ssh -L local_port:remote_host:remote_port user@gateway

# Use specific identity file
ssh -i ~/.ssh/key user@hostname

# Verbose mode (debugging)
ssh -vvv user@hostname
```
