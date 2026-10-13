# scorecard Plugin for SuperCLI

[OpenSSF Scorecard](https://github.com/ossf/scorecard) runs ~20 automated
security health checks against a repository — branch protection, code review,
signed releases, dependency pinning, fuzzing, dangerous workflows — and produces
a 0–10 aggregate score.

## Installation

```bash
# Install scorecard binary (pick one)
go install github.com/ossf/scorecard/v5/cmd/scorecard@latest
# or: brew install scorecard
# or: scorecard_*_linux_amd64.tar.gz from GitHub releases

# Install supercli plugin
supercli plugins install ./plugins/scorecard
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli scorecard self version` | Show scorecard version |
| `supercli scorecard repo audit <repo_url>` | Audit a remote repository |
| `supercli scorecard local audit <dir>` | Audit a local directory |
| `supercli scorecard <any>` | Passthrough to scorecard CLI |

## Usage

```bash
supercli scorecard repo audit github.com/ossf/scorecard
supercli scorecard repo audit github.com/org/repo --format json --show-details
supercli scorecard local audit .
export GITHUB_TOKEN=...   # raises API rate limits
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
