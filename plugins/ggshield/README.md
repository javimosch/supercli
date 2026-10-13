# ggshield Plugin for SuperCLI

[ggshield](https://github.com/GitGuardian/ggshield) is GitGuardian's CLI for
detecting secrets (API keys, tokens, credentials) in code, git history, and CI
pipelines. It also scans infrastructure-as-code for misconfigurations and
manages honeytokens.

## Installation

```bash
# Install ggshield binary (pick one)
pipx install ggshield
# or: pip install ggshield
# or: brew install gitguardian/tap/ggshield

# Install supercli plugin
supercli plugins install ./plugins/ggshield
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli ggshield self version` | Show ggshield version |
| `supercli ggshield secret scan-path <path>` | Scan files/directories for secrets |
| `supercli ggshield secret scan-repo <repo_url>` | Scan a remote repo's history |
| `supercli ggshield secret scan-ci` | Scan commits in CI context |
| `supercli ggshield iac scan <path>` | Scan IaC files for vulnerabilities |
| `supercli ggshield auth login` | Authenticate with GitGuardian |
| `supercli ggshield <any>` | Passthrough to ggshield CLI |

## Usage

```bash
supercli ggshield secret scan-path .
supercli ggshield secret scan-repo https://github.com/org/repo.git
supercli ggshield iac scan terraform/
export GITGUARDIAN_API_KEY=...   # unlocks full quota/features
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
