# depscan Plugin for SuperCLI

[dep-scan](https://github.com/owasp-dep-scan/dep-scan) is OWASP's fully
open-source dependency and container vulnerability auditor. It generates a
CycloneDX SBOM via cdxgen, matches components against NVD/OSV/GitHub advisories,
and supports VEX attestation and reachability slicing to cut noise.

## Installation

```bash
# Install depscan binary (pick one)
pipx install owasp-depscan
# or: pip install owasp-depscan
# or: npm i -g @cyclonedx/depscan

# Install supercli plugin
supercli plugins install ./plugins/depscan
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli depscan self version` | Show depscan version |
| `supercli depscan scan run <path>` | Audit a source directory |
| `supercli depscan scan bom <sbom_file>` | Audit an existing SBOM |
| `supercli depscan <any>` | Passthrough to depscan CLI |

## Usage

```bash
supercli depscan scan run . --reports-dir reports
supercli depscan scan run . --profile research --explain
supercli depscan scan bom bom.json
supercli depscan _ _ --src-image-dir ./image-fs --reports-dir reports
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
