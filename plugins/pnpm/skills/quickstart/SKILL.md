---
name: pnpm
description: Use this skill when the user wants a faster, disk-efficient alternative to npm for managing Node.js packages, especially in monorepo setups.
---

# pnpm Plugin

pnpm is a fast Node.js package manager using content-addressable storage.

## Usage Examples

- "install dependencies with pnpm"
- "add a package to a monorepo workspace"
- "run tests using pnpm filter for specific package"
- "check disk space saved by pnpm store"

## Installation

```bash
npm install -g pnpm
```

## Key Features
- Content-addressable package storage
- Hard-linked deduplication across projects
- Monorepo workspace support
- Strict dependency isolation
- Fast installation speed
- Lockfile with integrity verification
- Store pruning and management
- Compatible with npm and Yarn lockfiles
