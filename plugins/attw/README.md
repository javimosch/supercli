# attw Plugin for SuperCLI

[attw](https://github.com/arethetypeswrong/arethetypeswrong.github.io) (Are the Types
Wrong) checks whether an npm package's TypeScript types actually resolve correctly for
consumers under every module resolution mode — catching "masquerading" CJS/ESM files,
missing declaration files, and resolution-mode mismatches.

## Installation

```bash
# Install attw binary
npm install -g @arethetypeswrong/cli
# or: npx @arethetypeswrong/cli (no install)

# Install supercli plugin
supercli plugins install ./plugins/attw
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli attw self version` | Show attw version |
| `supercli attw check pack` | Pack local package and check types |
| `supercli attw check npm <pkg>` | Check a published npm package |
| `supercli attw check tarball <file.tgz>` | Check a tarball file |
| `supercli attw <any>` | Passthrough to attw CLI |

## Usage

```bash
# Check local package pre-publish
supercli attw check pack

# Check a published dependency
supercli attw check npm lodash

# JSON output for CI
supercli attw check pack --format json
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
