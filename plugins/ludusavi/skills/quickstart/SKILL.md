---
name: ludusavi
description: Use this skill when the user wants to back up game saves, restore game saves, or manage PC game save files.
---

# ludusavi Plugin

Backup tool for PC game saves. Automatically back up and restore game save files across different platforms and cloud storage services.

## Commands

### Game Backup
- `ludusavi backup run` — Run game save backup

### Utility
- `ludusavi _ _` — Passthrough to ludusavi CLI

## Usage Examples
- "Backup game saves"
- "Restore game saves"
- "Backup Steam saves"
- "Backup game progress"

## Installation

```bash
brew install ludusavi
```

Or via Cargo:
```bash
cargo install ludusavi
```

## Examples

```bash
# Run backup with default settings
ludusavi backup run

# Set backup path
ludusavi backup run --path ~/backups

# Force overwrite existing backups
ludusavi backup run --force

# Dry run without changes
ludusavi backup run --dry-run

# Unlimited backup size
ludusavi backup run --unlimited

# Any ludusavi command with passthrough
ludusavi _ _ --path ~/backups
ludusavi _ _ --dry-run
```

## Key Features
- **Multi-platform** - Steam, Epic Games, and more
- **Automatic detection** - Finds game save locations
- **Cloud support** - Backup to cloud services
- **Restore** - Restore from backups
- **Cross-platform** - Linux, macOS, Windows
- **Steam Deck** - Support for Steam Deck
- **Proton** - Linux Proton support
- **Custom paths** - Custom backup locations
- **Filtering** - Select specific games
- **Dry run** - Preview before backup

## Notes
- Supports Steam, Epic Games, and other platforms
- Can backup to local or cloud storage
- Great for migrating to new systems
- Supports Steam Deck and Proton
- Configurable backup locations
