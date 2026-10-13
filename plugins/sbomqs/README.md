# sbomqs Plugin for SuperCLI

[sbomqs](https://github.com/interlynk-io/sbomqs) from Interlynk scores the
quality of SPDX and CycloneDX SBOMs — completeness, identification, provenance,
license coverage — and checks compliance against NTIA minimum elements, BSI
TR-03183-2, FSCT, and OpenChain Telco profiles.

## Installation

```bash
# Install sbomqs binary (pick one)
go install github.com/interlynk-io/sbomqs@latest
# or: brew install interlynk-io/interlynk/sbomqs
# or: sbomqs-linux-amd64 from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/sbomqs
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli sbomqs self version` | Show sbomqs version |
| `supercli sbomqs score run <sbom_file>` | Quality-score an SBOM |
| `supercli sbomqs compliance check <sbom_file>` | Check NTIA/BSI/FSCT compliance |
| `supercli sbomqs <any>` | Passthrough to sbomqs CLI |

## Usage

```bash
supercli sbomqs score run bom.cdx.json --json
supercli sbomqs score run bom.spdx --category
supercli sbomqs compliance check bom.cdx.json --ntia
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
