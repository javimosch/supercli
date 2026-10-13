# sst Plugin for SuperCLI

[SST Ion](https://sst.dev) is an infrastructure-as-code framework that deploys
full-stack apps to AWS and other providers. Resources are defined in
TypeScript, `sst dev` runs a live development environment, and stages are
managed with deploy / remove / diff.

## Installation

```bash
# Install sst binary (pick one)
curl -fsSL https://ion.sst.dev/install | bash
# or: npm install -g sst
# or: brew install sst

# Install supercli plugin
supercli plugins install ./plugins/sst
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli sst self version` | Show sst version |
| `supercli sst project init` | Initialize sst in a project |
| `supercli sst app deploy` | Deploy the app to a stage |
| `supercli sst app remove` | Remove a stage's resources |
| `supercli sst app diff` | Preview deploy changes |
| `supercli sst state unlock` | Force-unlock a stuck state lock |
| `supercli sst <any>` | Passthrough to sst CLI |

## Usage

```bash
# Bootstrap a project
supercli sst project init

# Preview what would change
supercli sst app diff --stage dev

# Deploy to production
supercli sst app deploy --stage production

# Tear down a dev stage
supercli sst app remove --stage dev

# Live dev environment (long-running)
supercli sst dev
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
