# gitlint Plugin for SuperCLI

[gitlint](https://github.com/jorisroovers/gitlint) lints git commit messages — title
length, body format, trailing whitespace, conventional-commit style, and custom regex
rules. Runs as a CLI, a commit-msg hook, or in CI to keep history clean.

## Installation

```bash
# Install gitlint binary (pick one)
pipx install gitlint
# or: pip install gitlint

# Install supercli plugin
supercli plugins install ./plugins/gitlint
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli gitlint self version` | Show gitlint version |
| `supercli gitlint commit lint` | Lint the last commit |
| `supercli gitlint commit lint-range <range>` | Lint a commit range |
| `supercli gitlint hooks install` | Install commit-msg hook |
| `supercli gitlint config init` | Generate .gitlint config |
| `supercli gitlint <any>` | Passthrough to gitlint CLI |

## Usage

```bash
# Lint latest commit
supercli gitlint commit lint

# Lint everything on this branch
supercli gitlint commit lint-range main..HEAD

# Lint a message from stdin
echo "fix stuff" | supercli gitlint --msg-filename - || true
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
