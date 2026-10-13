# oasdiff Plugin for SuperCLI

[oasdiff](https://github.com/oasdiff/oasdiff) compares two OpenAPI specifications and
reports every difference — added/removed endpoints, schema changes, parameter changes —
classified as breaking or non-breaking. Ideal as a PR gate to prevent shipping API
breaking changes, and for generating API changelogs.

## Installation

```bash
# Install oasdiff binary (pick one)
go install github.com/oasdiff/oasdiff@latest
# or: brew install oasdiff

# Install supercli plugin
supercli plugins install ./plugins/oasdiff
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli oasdiff self version` | Show oasdiff version |
| `supercli oasdiff spec diff <base> <rev>` | Full diff between two specs |
| `supercli oasdiff spec breaking <base> <rev>` | Only breaking changes |
| `supercli oasdiff spec changelog <base> <rev>` | Changelog of all changes |
| `supercli oasdiff spec summary <base> <rev>` | Change summary |
| `supercli oasdiff checks list` | List available checks |
| `supercli oasdiff <any>` | Passthrough to oasdiff CLI |

## Usage

```bash
# Break-the-build on breaking changes (CI gate)
supercli oasdiff spec breaking old.yaml new.yaml --fail-on ERR

# Machine-readable changelog
supercli oasdiff spec changelog old.yaml new.yaml --format json
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
