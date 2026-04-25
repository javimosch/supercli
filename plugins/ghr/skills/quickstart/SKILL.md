# ghr - Repository Management

## Overview
ghr is repository management with auto-attaching profiles. Clone, manage, and sync git repositories with profiles.

## Quick Start

### Clone a repository
```bash
sc ghr clone repo <url>
```

### Passthrough to ghr CLI
```bash
sc ghr _ <ghr-args>
```

## Key Features

- **Repository Management**: Clone and manage repositories
- **Auto-attaching Profiles**: Automatically attach profiles
- **Directory Changing**: Change to repository directory
- **Profile Configuration**: Configure application profiles
- **Path Finding**: Find repository paths
- **Sync Repositories**: Sync repository state

## Installation

```bash
cargo install ghr
```

Also available via:
- Nix
- Homebrew
- Scoop

## Usage Examples

### Clone repository
```bash
ghr clone https://github.com/user/repo
```

### Change directory
```bash
ghr cd user/repo
```

### Attach profile
```bash
ghr attach profile
```

### Find repository path
```bash
ghr find user/repo
```

### Sync repositories
```bash
ghr sync
```

## Notes

- Run `ghr --help` to see all available options
