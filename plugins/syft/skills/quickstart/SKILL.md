---
name: syft
description: Use this skill when the user wants to generate a Software Bill of Materials (SBOM) from container images or filesystems.
---

# syft Plugin

CLI tool for generating Software Bill of Materials from container images and filesystems.

## Commands

### Scanning
- `syft self version` — Print syft version
- `syft scan image <image>` — Scan container image for SBOM
- `syft scan directory <path>` — Scan directory for SBOM
- `syft _ _` — Passthrough to syft CLI

## Usage Examples

- "Generate SBOM for my Docker image"
- "Scan current directory for dependencies"
- "Export SBOM in CycloneDX JSON format"

## Installation

```bash
curl -sSfL https://get.anchore.io/syft | sudo sh -s -- -b /usr/local/bin
```

## Examples

```bash
# Scan container image
syft alpine:latest

# Scan directory
syft ./my-project

# Export to CycloneDX JSON
syft <image> -o cyclonedx-json

# Export to SPDX JSON
syft <image> -o spdx-json

# Multiple SBOMs to files
syft <image> -o spdx-json=./spdx.json -o cyclonedx-json=./cdx.json
```

## Key Features
- Supports container images, filesystems, archives
- Dozens of packaging ecosystems (Alpine, Debian, RPM, Go, Python, Java, etc.)
- Multiple output formats (CycloneDX, SPDX, Syft JSON)
- Works with Grype for vulnerability scanning
- OCI, Docker, Singularity support
