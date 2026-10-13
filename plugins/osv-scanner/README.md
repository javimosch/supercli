# OSV-Scanner Plugin for SuperCLI

[OSV-Scanner](https://github.com/google/osv-scanner) is Google's official vulnerability
scanner for the [OSV.dev](https://osv.dev) database. It scans lockfiles, SBOMs, source
directories, and container images for known vulnerabilities across 11+ language
ecosystems. No API key required.

## Installation

```bash
# Prebuilt binary (Linux amd64)
curl -sSL https://github.com/google/osv-scanner/releases/latest/download/osv-scanner_linux_amd64 \
  -o ~/.local/bin/osv-scanner && chmod +x ~/.local/bin/osv-scanner

# or: go install github.com/google/osv-scanner/v2/cmd/osv-scanner@latest
# or: brew install osv-scanner

# Install supercli plugin
supercli plugins install ./plugins/osv-scanner
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli osv-scanner self version` | Show osv-scanner version |
| `supercli osv-scanner scan source` | Scan source dir (`-r` recursive, `-L` lockfile, `--format json`) |
| `supercli osv-scanner scan image <img>` | Scan a container image |
| `supercli osv-scanner licenses check` | Check dependency licenses |
| `supercli osv-scanner fix run` | Guided remediation (experimental) |
| `supercli osv-scanner <any>` | Passthrough to osv-scanner CLI |

## Usage

```bash
# Recursive source scan with JSON output
supercli osv-scanner scan source -r .

# Specific lockfile
supercli osv-scanner scan source -L package-lock.json

# Container image
supercli osv-scanner scan image ubuntu:24.04

# License allowlist
supercli osv-scanner --licenses=MIT,Apache-2.0 .

# Fully offline scan
supercli osv-scanner --offline --download-offline-databases -r .
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
