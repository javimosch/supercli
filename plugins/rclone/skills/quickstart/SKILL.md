---
name: rclone
description: Use this skill when the user wants to sync files to/from cloud storage.
---

# Rclone Plugin

rsync for cloud storage - sync files to/from Google Drive, S3, Dropbox, and 70+ other providers.

## Commands

### File Operations
- `rclone file copy` — Copy files to/from cloud storage
- `rclone file sync` — Sync source to destination (one-way)
- `rclone file list` — List files in remote

### Configuration
- `rclone config list` — List configured remotes

## Usage Examples
- "rclone file copy --source local/path --destination remote:path"
- "rclone file sync --source local/dir --destination gdrive:backup"
- "rclone file list --path gdrive:documents"

## Installation

```bash
curl https://rclone.org/install.sh | sudo bash
# or
brew install rclone
```

## Examples

```bash
# Copy files to remote
rclone copy /local/path remote:path

# Sync directory (make destination identical to source)
rclone sync /local/dir remote:backup

# List files in remote
rclone ls remote:path

# List configured remotes
rclone config list

# Copy from remote to local
rclone copy remote:path /local/path

# Check files are identical
rclone check source dest

# Mount remote as filesystem
rclone mount remote:path /mnt/point
```

## Key Features
- Supports 70+ cloud storage providers
- MD5/SHA-1 hash checking for file integrity
- Timestamps preserved
- Multi-threaded downloads
- Optional encryption (Crypt)
- Optional compression (Compress)
- FUSE mount support
- HTTP/WebDAV/FTP/SFTP serving
- Bandwidth limiting
- Partial syncs supported
