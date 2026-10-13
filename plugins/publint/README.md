# publint Plugin for SuperCLI

[publint](https://github.com/publint/publint) lints npm packages for packaging and
publishing mistakes: broken `exports` maps, missing `types`, `files` field gaps,
ESM/CJS format mismatches — the errors that only surface after `npm publish`.

## Installation

```bash
# Install publint binary
npm install -g publint
# or: npx publint (no install)

# Install supercli plugin
supercli plugins install ./plugins/publint
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli publint self version` | Show publint version |
| `supercli publint pkg lint [dir]` | Lint package directory |
| `supercli publint <any>` | Passthrough to publint CLI |

## Usage

```bash
# Lint current package
supercli publint pkg lint

# Strict mode (recommended for libraries)
supercli publint pkg lint --strict

# Lint the actual published tarball
supercli publint pkg lint --pack
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
