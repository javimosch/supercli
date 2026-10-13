# kingfisher Plugin for SuperCLI

[Kingfisher](https://github.com/mongodb/kingfisher) is MongoDB's open-source secret
detection engine (Rust). It scans files, directories, git history, GitHub/GitLab
organizations, Slack, Jira, and S3 for exposed credentials — then live-validates
findings against provider APIs to separate dead keys from live ones.

## Installation

```bash
# Install kingfisher binary (pick one)
curl -sSL https://raw.githubusercontent.com/mongodb/kingfisher/main/scripts/install-kingfisher.sh | bash
# or: brew install kingfisher
# or: mise use --global github:mongodb/kingfisher

# Install supercli plugin
supercli plugins install ./plugins/kingfisher
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli kingfisher self version` | Show kingfisher version |
| `supercli kingfisher scan run <path>` | Scan a path for secrets |
| `supercli kingfisher scan github-org <org>` | Scan a GitHub org (needs `KF_GITHUB_TOKEN`) |
| `supercli kingfisher rules list` | List detection rules |
| `supercli kingfisher <any>` | Passthrough to kingfisher CLI |

## Usage

```bash
supercli kingfisher scan run .
supercli kingfisher scan run . --only-valid
supercli kingfisher scan run . --format json
KF_GITHUB_TOKEN=ghp_... supercli kingfisher scan github-org my-org
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
