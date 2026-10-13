# nfpm Plugin for SuperCLI

[nfpm](https://github.com/goreleaser/nfpm) (nFPM) builds real Linux packages — `.deb`,
`.rpm`, `.apk`, Arch and ipk — from a single YAML config, without needing the distro's
packaging toolchain. It's the packager that powers GoReleaser.

## Installation

```bash
# Install nfpm binary (pick one)
go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest
# or: brew install nfpm

# Install supercli plugin
supercli plugins install ./plugins/nfpm
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli nfpm self version` | Show nfpm version |
| `supercli nfpm config init` | Create starter nfpm.yaml |
| `supercli nfpm pkg build` | Build a package (`-p deb -t out/`) |
| `supercli nfpm config schema` | Print nfpm.yaml JSON schema |
| `supercli nfpm <any>` | Passthrough to nfpm CLI |

## Usage

```bash
# Scaffold config
supercli nfpm config init

# Build packages
supercli nfpm pkg build -f nfpm.yaml -p deb -t dist/
supercli nfpm pkg build -f nfpm.yaml -p rpm -t dist/
supercli nfpm pkg build -f nfpm.yaml -p apk -t dist/
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
