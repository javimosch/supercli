---
name: container-diff
description: Use this skill when the user wants to compare Docker container images to see what packages, files, or changes exist between versions.
---

# container-diff Plugin

container-diff analyzes differences between container images.

## Commands
- `container-diff <resource> <action>` — Execute container-diff commands
- `container-diff self version` — Print container-diff version
- `container-diff _ _` — Passthrough to container-diff CLI

## Usage Examples

- "compare packages between two images"
- "diff filesystem contents of containers"
- "check what dependencies changed in new image version"

## Installation

```bash
npm install -g container-diff
```

## Key Features
- Package-level diff (pip, npm, apt)
- Filesystem comparison
- Multi-architecture image support
- Image change analysis
- Container image auditing
