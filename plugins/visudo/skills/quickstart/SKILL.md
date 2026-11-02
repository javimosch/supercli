---
name: visudo
description: Safely edit the sudoers file with syntax validation
---
# visudo Plugin

Safely edit the sudoers file with built-in syntax validation and file locking.

## Commands
- `visudo <resource> <action>` — Execute visudo commands
- `visudo self version` — Print visudo version
- `visudo file check` — Check sudoers file syntax without editing
- `visudo file edit` — Edit a specific sudoers file
- `visudo _ _` — Passthrough to visudo CLI

## Quickstart

```bash
# Edit the default sudoers file
visudo

# Check a sudoers file for syntax errors without editing
visudo -c -f /etc/sudoers.d/custom

# Edit a specific sudoers file
visudo -f /etc/sudoers.d/custom

# Print version
visudo --version
```

## Common Flags

| Flag | Description |
|------|-------------|
| `-c` | Check-only mode (syntax validation) |
| `-f` | Specify an alternate sudoers file |
| `-s` | Strict mode (more syntax checks) |
| `-q` | Quiet mode |
| `--version` | Show version and exit |

## Tips

- Always use `visudo` instead of editing `/etc/sudoers` directly — it prevents lockouts
- Keep custom rules in `/etc/sudoers.d/` for easier management
- Run `visudo -c` before deploying sudoers changes to production
