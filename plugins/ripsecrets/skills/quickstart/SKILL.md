# ripsecrets Quickstart Guide

ripsecrets is a command-line tool designed to scan source code for accidentally committed secrets and API keys. It's 95x faster than comparable tools and uses intelligent pattern detection to find sensitive data before it reaches your repository.

## Installation

```bash
cargo install --git https://github.com/sirwart/ripsecrets --branch main
```

Or via Homebrew:
```bash
brew install ripsecrets
```

## Basic Usage

### Scan current directory for secrets
```bash
ripsecrets
```

### Scan specific files or directories
```bash
ripsecrets src/ config.yml .env
```

### Install as Git pre-commit hook
```bash
ripsecrets --install-pre-commit
```

### Check with custom patterns
```bash
ripsecrets --additional-pattern "my-api-key-\*"
```

## What ripsecrets Detects

- AWS API keys and credentials
- GitHub tokens and personal access tokens
- Private keys (RSA, DSA, EC)
- Database connection strings
- OAuth tokens
- API keys from common services
- Private encryption keys
- Custom patterns you define

## Exit Codes

- **0**: No secrets found
- **1**: Secrets detected (non-zero exit code helps in pre-commit hooks)

## Pre-commit Hook Setup

Automatic setup:
```bash
ripsecrets --install-pre-commit
```

This adds ripsecrets to your Git pre-commit hooks, preventing commits with detected secrets.

Manual setup in `.git/hooks/pre-commit`:
```bash
#!/bin/bash
ripsecrets || exit 1
```

## Whitelisting Secrets

Create a `.secretsignore` file in your repository root:
```
# Allow specific test keys
test-api-key: akia2c3d4e5f6g7h8
demo_token: ghp_1234567890abcdefghijk
```

Or add allowlist comments in code:
```python
# ripsecrets:allow
API_KEY = "test_key_12345"
```

## Common Options

- `--strict-ignore` - Respect .secretsignore file strictly
- `--additional-pattern <PATTERN>` - Add custom regex patterns
- `--check <PATH>` - Check specific file/directory
- `--version` - Show version info
- `--help` - Display help

## Real-world Use Cases

### Pre-commit integration
```bash
ripsecrets || exit 1
```

### CI/CD pipeline scanning
```bash
ripsecrets . --strict-ignore
```

### Audit existing repository
```bash
# Find all secrets in entire repository history
git log -p | ripsecrets
```

### Custom pattern scanning
```bash
ripsecrets --additional-pattern "db_password=\*" .
```

## Performance

- Scans most repositories in **milliseconds**
- Uses statistical randomness detection for speed
- No external API calls
- Operates entirely offline

## Comparison to Alternatives

| Tool | Speed | Method | False Positives |
|------|-------|--------|-----------------|
| ripsecrets | 95x faster | Statistical | Low |
| truffleHog | Baseline | Entropy scanning | Medium |
| gitleaks | ~50x slower | Pattern matching | High |

## Limitations

- Cannot detect all possible secret formats
- Custom patterns may require tuning
- Some false positives possible with entropy-based detection

## Resources

- [GitHub Repository](https://github.com/sirwart/ripsecrets)
- [Issue Tracker](https://github.com/sirwart/ripsecrets/issues)
- [pre-commit Framework](https://pre-commit.com/)

## Integration Examples

### With pre-commit framework
```yaml
# .pre-commit-config.yaml
- repo: local
  hooks:
    - id: ripsecrets
      name: ripsecrets
      entry: ripsecrets
      language: system
      stages: [commit]
```

### In GitHub Actions
```yaml
- name: Scan for secrets
  run: ripsecrets . --strict-ignore
```
