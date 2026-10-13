---
name: sbomqs
description: Use this skill when the user wants to score or compliance-check an SBOM file (SPDX/CycloneDX) with sbomqs.
---

# sbomqs Plugin

sbomqs (Interlynk) measures the quality of a software bill of materials. It scores completeness, identification, provenance, and license coverage, and checks compliance against NTIA minimum elements, BSI TR-03183-2, OpenChain Telco, and FDA premarket profiles.

## Commands

### Evaluation
- `sbomqs score run <sbom_file>` — Quality-score an SBOM (`--json`, `--category`, `--feature` for detail)
- `sbomqs compliance check <sbom_file>` — Compliance check (`--ntia`, `--bsi-v2`, `--fsct`, `--oct`)
- `sbomqs _ _` — Passthrough (generate, list, share, enrich)

## Usage Examples

- "Score the quality of this SBOM"
- "Is this SBOM NTIA-compliant?"
- "Which fields is this CycloneDX SBOM missing?"

## Installation

```bash
go install github.com/interlynk-io/sbomqs@latest
# or: brew install interlynk-io/interlynk/sbomqs
# or: sbomqs-linux-amd64 from GitHub releases
```

## Examples

```bash
sbomqs score bom.cdx.json --json
sbomqs score bom.spdx --category          # per-category breakdown
sbomqs compliance --ntia bom.cdx.json
sbomqs compliance --bsi-v2 bom.cdx.json
sbomqs generate --image alpine:latest     # needs companion SBOM tooling
```

## Key Features

- Single quality score (0–10) plus per-category and per-feature drilldown
- Compliance profiles: NTIA, BSI TR-03183-2, FSCT, OpenChain Telco
- Works with both SPDX and CycloneDX formats
- JSON output for CI gates on SBOM quality
