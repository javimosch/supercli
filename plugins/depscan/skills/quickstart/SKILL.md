---
name: depscan
description: Use this skill when the user wants to audit project dependencies, source trees, or container images for vulnerabilities with OWASP dep-scan.
---

# depscan Plugin

depscan (OWASP dep-scan) is a fully open-source dependency and container vulnerability auditor. It auto-generates a CycloneDX SBOM via cdxgen, then matches components against NVD, OSV, and GitHub advisories — with VEX support and reachability analysis to cut noise.

## Commands

### Scanning
- `depscan scan run <path>` — Audit a source directory's dependencies
- `depscan scan bom <sbom_file>` — Audit an existing CycloneDX/SPDX SBOM
- `depscan _ _` — Passthrough (--src-image-dir, --profile, --deep, --reports-dir)

## Usage Examples

- "Audit this project's dependencies for CVEs"
- "Scan this SBOM for vulnerable packages"
- "Produce a VEX report for this repo"

## Installation

```bash
pipx install owasp-depscan
# or: pip install owasp-depscan
# or: npm i -g @cyclonedx/depscan
```

## Examples

```bash
depscan --src . --reports-dir reports
depscan --src . --profile research --explain
depscan --bom bom.json --reports-dir reports
depscan --src-image-dir ./image-fs --reports-dir reports
GITHUB_TOKEN=... depscan --src .      # better advisory coverage
```

## Key Features

- SBOM-first: generates CycloneDX BOMs automatically (bundled cdxgen)
- Works on source trees, lockfiles, containers, and OS package lists
- VEX output (`--vex`) and reachability slices (`--deep` / `--profile research`) to prioritize exploitable findings
- Suggests package-level fixes and tracks CVE age/exploit availability
