---
name: feluda
description: Use this skill when the user wants to analyze project dependencies for license compliance, generate SBOMs, check for restrictive licenses, or create compliance files.
---

# Feluda Plugin

Detect license usage restrictions in your project. Written in Rust.

## Commands

### License Scanning
- `feluda scan licenses` — Analyze project dependencies and their licenses

### SBOM Generation
- `feluda sbom generate` — Generate Software Bill of Materials (SBOM)
- `feluda sbom validate` — Validate SBOM files

### Compliance Files
- `feluda generate compliance` — Generate NOTICE and THIRD_PARTY_LICENSES files

### Cache Management
- `feluda cache manage` — View or clear cache

## Usage Examples

Basic license scan:
```
feluda
feluda --path ./myproject
feluda --language rust
```

Output formats:
```
feluda --json
feluda --yaml
feluda --gist
feluda --verbose
```

Filter by OSI status:
```
feluda --osi approved
feluda --osi not-approved
feluda --osi unknown
```

Check license compatibility:
```
feluda --project-license MIT
feluda --incompatible
feluda --fail-on-incompatible
```

Generate SBOM:
```
feluda sbom
feluda sbom spdx --output sbom.json
feluda sbom cyclonedx --output sbom.json
```

Validate SBOM:
```
feluda sbom validate sbom.json
feluda sbom validate sbom.json --json --output report.json
```

Generate compliance files:
```
feluda generate
feluda generate --language rust --project-license MIT
```

## Installation

```bash
cargo install feluda
```

Or via package manager:
```bash
brew install feluda        # macOS
apt install feluda         # Debian/Ubuntu
paru -S feluda            # Arch Linux
```

## Key Features
- License analysis for multiple languages (Rust, Node, Go, Python, C/C++, R)
- Flags restrictive licenses (GPL, AGPL, LGPL, etc.)
- Checks license compatibility with project license
- Generates SBOM in SPDX and CycloneDX formats
- Validates SBOM files
- Creates compliance files (NOTICE, THIRD_PARTY_LICENSES)
- CI/CD integration with GitHub Actions and Jenkins support
- TUI mode for visual browsing
- GitHub API rate limit handling with token support