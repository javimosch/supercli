---
name: vmstat
description: Report virtual memory and system statistics
---
# vmstat Plugin

Report virtual memory, processes, CPU, I/O, and system statistics.

## Quickstart

```bash
# One-shot system statistics
vmstat

# Continuous monitoring (every 2 seconds, 5 times)
vmstat 2 5

# Show active/inactive memory
vmstat -a

# Disk statistics
vmstat -d

# Disk summary
vmstat -D

# Partition read/write stats
vmstat -p sda1

# Slab allocator statistics
vmstat -s

# Show version
vmstat --version
```

## Common Flags

| Flag | Description |
|------|-------------|
| `-a` | Show active/inactive memory |
| `-d` | Disk statistics (read/write per disk) |
| `-D` | Disk summary statistics |
| `-p` | Partition-specific statistics |
| `-s` | Slab allocator statistics |
| `-t` | Timestamp on each line |
| `-S` | Unit (k/K/m/M) |
| `-w` | Wide output |

## Fields Explained

| Field | Description |
|-------|-------------|
| r | Processes waiting for CPU |
| b | Processes in uninterruptible sleep |
| swpd | Used swap memory |
| free | Free memory |
| buff | Buffer cache |
| cache | Page cache |
| si/so | Swap in/out |
| bi/bo | Block in/out |
| us/sy/id/wa | CPU time percentages |

## Tips

- First line of output shows averages since boot; subsequent lines show delta
- Use `delay` and `count` for real-time monitoring
- High `wa` (wait) indicates I/O bottleneck
- High `si`/`so` indicates swapping pressure (needs more RAM)
