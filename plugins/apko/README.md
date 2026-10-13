# apko Plugin for SuperCLI

[apko](https://github.com/chainguard-dev/apko) builds minimal OCI container images
declaratively from APK packages — no Dockerfile needed. It produces reproducible
multi-arch images with automatic SBOMs, and works with Alpine, Wolfi, and Chainguard
repositories.

## Installation

```bash
# Install apko (pick one)
go install chainguard.dev/apko@latest
# or: brew install apko
# or: mise use -g apko@latest

# Install supercli plugin
supercli plugins install ./plugins/apko
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli apko self version` | Show apko version |
| `supercli apko image build` | Build OCI tarball from config |
| `supercli apko image publish` | Build and push to registry |
| `supercli apko config show` | Print resolved config |
| `supercli apko lock generate` | Write apko.lock.json |
| `supercli apko <any>` | Passthrough to apko CLI |

## Usage

```bash
supercli apko image build -- apko.yaml app:latest output.tar
docker load < output.tar
supercli apko config show -- apko.yaml
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
