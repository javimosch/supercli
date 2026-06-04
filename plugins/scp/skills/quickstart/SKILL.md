---
name: scp
description: Secure copy for file transfer over SSH
---
# scp Plugin

Secure copy for transferring files over SSH.

## Quickstart

```bash
# Copy local file to remote host
scp /path/to/local/file user@host:/path/to/remote/

# Copy remote file to local
scp user@host:/remote/path/to/file /local/path/

# Copy with specific port
scp -P 2222 /local/file user@host:/remote/path/

# Copy entire directory recursively
scp -r /local/dir user@host:/remote/path/

# Preserve file attributes
scp -p /local/file user@host:/remote/path/

# Verbose output for debugging
scp -v /local/file user@host:/remote/path/
```

## Common Flags

| Flag | Description |
|------|-------------|
| `-r` | Recursively copy entire directories |
| `-P` | Specify SSH port |
| `-p` | Preserve modification times, access times, and modes |
| `-v` | Verbose output |
| `-C` | Enable compression |
| `-i` | Specify identity file (private key) |
| `-q` | Quiet mode (suppress progress) |

## Tips

- SCP uses the same authentication as SSH (keys, ssh-agent)
- For large transfers, compression (`-C`) can speed things up
- Use `-i /path/to/key` for non-default SSH keys
