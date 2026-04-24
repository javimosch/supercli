---
name: httm
description: Use this skill when the user wants to browse ZFS/btrfs snapshots, restore previous file versions, or view file history on snapshot-enabled filesystems.
---

# httm Plugin

Interactive, file-level Time Machine-like tool for ZFS/btrfs. Browse and restore file snapshots directly from the terminal.

## Commands

### Snapshot Management
- `httm snapshot list` — List file snapshots
- `httm snapshot restore` — Restore file from snapshot

### Utility
- `httm _ _` — Passthrough to httm CLI

## Usage Examples
- "List file snapshots"
- "Restore previous version"
- "Browse file history"
- "View snapshot versions"

## Installation

```bash
brew install httm
```

Or via Cargo:
```bash
cargo install httm
```

Requires ZFS or btrfs filesystem with snapshots enabled.

## Examples

```bash
# List snapshots for a file
httm snapshot list myfile.txt

# List snapshots for directory
httm snapshot list ./my-project/

# Show deleted files
httm snapshot list ./my-project/ --deleted

# Restore file from snapshot
httm snapshot restore myfile.txt

# Any httm command with passthrough
httm _ _ myfile.txt
httm _ _ --deleted .
httm _ _ --restore myfile.txt
```

## Key Features
- **ZFS** - ZFS snapshot support
- **Btrfs** - Btrfs snapshot support
- **Browse** - Browse snapshots
- **Restore** - Restore files
- **Deleted** - Find deleted files
- **Compare** - Compare versions
- **Interactive** - Interactive mode
- **Fast** - Fast operations
- **File-level** - Per-file granularity
- **Time Machine** - Time Machine-like

## Notes
- Requires ZFS or btrfs
- Snapshots must be enabled
- Great for file recovery
- Perfect for versioned files
