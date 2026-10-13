---
name: nfpm
description: Use this skill when the user wants to package a binary into deb, rpm, apk, or archlinux packages with nfpm — no distro toolchain required.
---

# nfpm Plugin

nfpm builds Linux packages (`.deb`, `.rpm`, `.apk`, `.arch`, `.ipk`) from one YAML file.
No `dpkg-deb`, `rpmbuild`, or fpm needed — it writes packages in pure Go. Used by
GoReleaser to ship CLI releases.

## Commands

### Packaging
- `nfpm config init` — Create starter `nfpm.yaml`
- `nfpm pkg build` — Build a package (`-p deb|rpm|apk -f nfpm.yaml -t out/`)
- `nfpm config schema` — Print the config JSON schema
- `nfpm _ _` — Passthrough

## Usage Examples

- "Package my binary as a deb and rpm"
- "Create an nfpm.yaml for this CLI"
- "Build an apk for Alpine"
- "Show the nfpm config schema"

## Installation

```bash
go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest
# or: brew install nfpm
```

## Examples

```bash
# Minimal config, then build
nfpm init
nfpm package -f nfpm.yaml -p deb -t dist/

# Multiple formats
nfpm package -f nfpm.yaml -p rpm -t dist/
nfpm package -f nfpm.yaml -p apk -t dist/

# Environment-templated config (NFPM_* vars)
nfpm package --config <(envsubst < nfpm.yaml) -p deb -t dist/
```

## Key Features

- One config → deb, rpm, apk, archlinux, ipk, termux.deb
- Supports dependencies, conflicts, pre/post-install scripts, systemd units
- Signs packages (RPM GPG, APK RSA)
- Env-var templating keeps config static in CI
