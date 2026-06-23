---
name: rustic
description: rustic — fast encrypted deduplicated backup tool (restic-compatible)
---
# rustic Plugin

Rustic is a fast, encrypted, deduplicated backup tool written in Rust. It is compatible with the restic repository format and can back up to local disks, SFTP, S3, and other cloud storage.

## Quickstart

```bash
# Initialize a new backup repository
rustic init -r /backups/my-repo

# Back up a directory
rustic backup ~/Documents -r /backups/my-repo

# List snapshots
rustic snapshots -r /backups/my-repo

# Restore a snapshot to a target directory
rustic restore latest:/ /tmp/restored -r /backups/my-repo

# Remove old snapshots by retention policy
rustic forget --keep-daily 7 --keep-weekly 4 -r /backups/my-repo
```
