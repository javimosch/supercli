# gator Plugin for SuperCLI

[gator](https://github.com/open-policy-agent/gatekeeper) is the Gatekeeper policy CLI: evaluate ConstraintTemplates, Constraints and object manifests locally with `gator test`, or run declarative `suite.yaml` test suites with `gator verify` — no cluster required.

## Installation

```bash
# Download the gator archive for your platform from https://github.com/open-policy-agent/gatekeeper/releases (asset: gator-<ver>-<os>-<arch>.tar.gz) and extract to PATH
# Or: go install github.com/open-policy-agent/gatekeeper/v3/cmd/gator@latest
# Verify: gator version

# Install supercli plugin
supercli plugins install ./plugins/gator
```

## Commands

- `gator self version` — Print gator version
- `gator suites verify` — Run declarative Gatekeeper test suites (gator verify ./suite.yaml). Asserts allowed/denied outcomes per template+constraint
- `gator constraints test` — Evaluate manifests against ConstraintTemplates+Constraints in a directory (gator test --path ./policies --image dep.yaml)
- `gator _ _` — Passthrough to gator CLI

All commands pass extra flags through to the underlying `gator` CLI.
