# pstree Quickstart

pstree displays running processes as a tree hierarchy, showing parent-child relationships.

## Basic Usage

```bash
# Show full process tree
pstree

# Show process tree with PIDs
pstree -p

# Show tree with command line arguments
pstree -a

# Show tree for a specific PID
pstree 1234

# Show tree with UID transitions
pstree -u
```

## Common Flags

| Flag | Description |
|------|-------------|
| `-p` | Show PIDs |
| `-a` | Show command line arguments |
| `-n` | Sort processes by PID |
| `-s` | Show parent processes |
| `-u` | Show UID transitions |
| `-h` | Highlight current process |
| `-Z` | Show SELinux contexts |
| `-C type` | Color output (auto, always, none) |

## Related Tools

- `ps` — snapshot of current processes
- `top` / `htop` — interactive process monitoring
- `pgrep` / `pkill` — process search and signal
