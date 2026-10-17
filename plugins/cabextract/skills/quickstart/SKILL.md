---
name: cabextract
description: Use this skill when the user needs to extract files from Microsoft Cabinet (.cab) archives.
---

# cabextract Plugin

cabextract extracts files from Microsoft CAB archives.

## Commands
- `cabextract <resource> <action>` — Execute cabextract commands
- `cabextract self version` — Print cabextract version
- `cabextract _ _` — Passthrough to cabextract CLI

## Usage Examples

- "extract a .cab file to current directory"
- "list contents of a CAB file"
- "test CAB archive integrity"
- "extract with full path preservation"

## Installation

```bash
brew install cabextract
```

## Key Features
- Microsoft CAB archive extraction
- Multiple CAB format support
- Archive listing without extraction
- Integrity testing
- Directory structure preservation
- Filename encoding handling
