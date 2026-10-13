# noseyparker Plugin for SuperCLI

[noseyparker](https://github.com/praetorian-inc/noseyparker) is a deep secrets
scanner for filesystems and git history, written in Rust by Praetorian. It
finds credentials, keys, and tokens with 160+ rules, stores findings in a
deduplicating datastore, and emits human or JSON reports.

## Installation

```bash
# Install noseyparker binary (pick one)
cargo install noseyparker-cli
# or: brew install noseyparker
# or: download a release zip from GitHub

# Install supercli plugin
supercli plugins install ./plugins/noseyparker
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli noseyparker self version` | Show noseyparker version |
| `supercli noseyparker scan run` | Scan files/repos into a datastore |
| `supercli noseyparker report generate` | Report findings (-f json supported) |
| `supercli noseyparker rules list` | List detection rules |
| `supercli noseyparker datastore export` | Export datastore findings |
| `supercli noseyparker <any>` | Passthrough to noseyparker CLI |

## Usage

```bash
# Scan a directory or repo into a datastore
supercli noseyparker scan run -d scan.ds ./my-repo

# JSON findings for tooling
supercli noseyparker report generate -d scan.ds -f json

# Enumerate a GitHub org's repos (needs NP_GITHUB_TOKEN)
supercli noseyparker github repos list --all-user-members some-org

# List detection rules
supercli noseyparker rules list
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
