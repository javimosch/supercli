# duplicacy Plugin for SuperCLI

[Duplicacy](https://github.com/gilbertchen/duplicacy) is a lock-free deduplication backup
tool. It creates incremental, encrypted snapshots to local disk, SFTP, S3, B2, GCS, Azure
and Dropbox — and thanks to lock-free chunking, several machines can share one storage
without coordination.

## Installation

```bash
# Install duplicacy binary (single static binary per platform)
curl -sSfL "$(curl -s https://api.github.com/repos/gilbertchen/duplicacy/releases/latest \
  | grep -o 'https://[^"]*linux_x64_[0-9.]*' | head -1)" \
  -o ~/.local/bin/duplicacy && chmod +x ~/.local/bin/duplicacy
# or: brew install duplicacy

# Install supercli plugin
supercli plugins install ./plugins/duplicacy
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli duplicacy self version` | Show duplicacy version |
| `supercli duplicacy repo init <id> <url>` | Initialize repo against a storage |
| `supercli duplicacy backup run` | Create an incremental snapshot |
| `supercli duplicacy snapshots list` | List revisions in storage |
| `supercli duplicacy files restore` | Restore files from a revision |
| `supercli duplicacy storage check` | Verify storage integrity |
| `supercli duplicacy <any>` | Passthrough to duplicacy CLI |

## Usage

```bash
cd ~/documents

# Point this directory at a storage (encrypted)
supercli duplicacy repo init laptop-docs /mnt/backups/docs -e

# Snapshot it
supercli duplicacy backup run

# List / restore / prune
supercli duplicacy snapshots list
supercli duplicacy files restore -r 5 -- "*"
supercli duplicacy _ _ _args="prune -keep 0:180 -keep 30:30 -keep 7:7"
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
