# pack Plugin for SuperCLI

[pack](https://github.com/buildpacks/pack) is the Cloud Native Buildpacks CLI.
It builds production-ready OCI images directly from source — language
detection, layer caching, SBOMs, reproducible builds — with no Dockerfile.

## Installation

```bash
brew install buildpacks/tap/pack
# or download from https://github.com/buildpacks/pack/releases
# requires a running Docker daemon

# Install supercli plugin
supercli plugins install ./plugins/pack
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli pack self version` | Show pack version |
| `supercli pack image build` | Build an OCI image from source |
| `supercli pack image inspect` | Inspect image buildpacks/BOM |
| `supercli pack image rebase` | Rebase onto a patched run image |
| `supercli pack builder suggest` | List suggested builders |
| `supercli pack <any>` | Passthrough to pack CLI |

## Usage

```bash
# Build the current directory with the Paketo builder
supercli pack image build myapp --builder paketobuildpacks/builder-jammy-base

# Push straight to a registry
supercli pack image build registry.example.com/myapp:latest --publish
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
