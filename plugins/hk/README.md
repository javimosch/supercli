# hk Plugin for SuperCLI

[hk](https://github.com/jdx/hk) is a fast git hooks manager and lint/format orchestrator
written in Rust by jdx (author of mise). It runs linters in parallel over modified files
with file locks, and shares the same `hk.pkl` configuration between git hooks, local
runs, and CI.

## Installation

```bash
# Install hk binary (pick one)
cargo install hk --locked
# or: mise use hk
# or: brew install hk

# Install supercli plugin
supercli plugins install ./plugins/hk
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli hk self version` | Show hk version |
| `supercli hk project init` | Generate hk.pkl by detecting project linters |
| `supercli hk check run` | Run linters in check mode |
| `supercli hk fix run` | Run linters and apply fixes |
| `supercli hk hooks install` | Install hk git hooks in current repo |
| `supercli hk config validate` | Validate hk.pkl |
| `supercli hk builtins list` | List built-in linter steps |
| `supercli hk <any>` | Passthrough to hk CLI |

## Usage

```bash
# Setup in an existing repo
supercli hk project init
supercli hk hooks install

# Check/fix modified files
supercli hk check run
supercli hk check run --all        # all files, for CI
supercli hk check run --plan --json  # preview as JSON
supercli hk fix run

# Run a git hook manually
supercli hk run pre-commit

# Single-file utilities (no config needed)
supercli hk util trailing-whitespace --fix .
supercli hk util end-of-file-fixer --fix .
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
