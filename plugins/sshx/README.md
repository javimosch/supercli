# sshx Plugin for SuperCLI

[sshx](https://github.com/ekzhang/sshx) lets you share your terminal with anyone
via a single browser link — a multiplayer, infinite-canvas session with
real-time cursors, resizable windows, and chat. End-to-end encrypted (Argon2 +
AES), statically linked, no SSH setup needed.

## Installation

```bash
curl -sSf https://sshx.io/get | sh
# or: cargo install sshx
# or: brew install sshx

# Install supercli plugin
supercli plugins install ./plugins/sshx
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli sshx self version` | Show sshx version |
| `supercli sshx session start` | Start a shared session, print join link |
| `supercli sshx <any>` | Passthrough to sshx CLI |

## Usage

```bash
# Start a session — prints https://sshx.io/s/... link to share
supercli sshx session start

# With a display name
supercli sshx session start --name "oncall-debug"
```

CI rescue pattern: add `curl -sSf https://sshx.io/get | sh -s run` to a workflow
step to pause a build and open a live collaborative shell on the runner.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
