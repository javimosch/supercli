# buildctl Plugin for SuperCLI

[buildctl](https://github.com/moby/buildkit) is the low-level client for the BuildKit build engine: drive reproducible image builds through frontends like dockerfile.v0, manage cache with prune/du, and control a remote buildkitd.

## Installation

```bash
# Download the buildkit release tarball for your platform from https://github.com/moby/buildkit/releases — it contains buildctl and buildkitd — and extract to PATH
# Or: brew install buildkit
# Verify: buildctl --version (requires a reachable buildkitd for build/prune commands)

# Install supercli plugin
supercli plugins install ./plugins/buildctl
```

## Commands

- `buildctl self version` — Print buildctl version
- `buildctl images build` — Run a build against buildkitd (buildctl build --frontend dockerfile.v0 --local context=. --local dockerfile=. --output type=image,name=app,push=true)
- `buildctl cache du` — Show build cache disk usage (buildctl du). Requires a running buildkitd
- `buildctl cache prune` — Prune build cache (buildctl prune). Add --all to remove everything
- `buildctl _ _` — Passthrough to buildctl CLI (debug workers, dial-stdio, and all build flags)

All commands pass extra flags through to the underlying `buildctl` CLI.
