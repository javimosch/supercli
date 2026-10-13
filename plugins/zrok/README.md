# zrok Plugin for SuperCLI

[zrok](https://github.com/openziti/zrok) is an open-source, zero-trust sharing platform
built on OpenZiti. Expose local services on public URLs, share folders of files, or build
private peer-to-peer tunnels — no inbound firewall holes needed. Free hosted tier at
zrok.io, or self-host the whole thing.

## Installation

```bash
# Install zrok binary
curl -sSf https://get.openziti.io/install.bash | bash -s zrok
# or: brew install zrok / deb & rpm packages / GitHub releases

# One-time setup (free account at https://zrok.io)
zrok invite && zrok enable <token>

# Install supercli plugin
supercli plugins install ./plugins/zrok
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli zrok self version` | Show zrok version |
| `supercli zrok share public <target>` | Public URL for a local service/folder |
| `supercli zrok share private <target>` | Peer-to-peer share (token-gated) |
| `supercli zrok access private <token>` | Connect to a private share |
| `supercli zrok env status` | Environment status and shares |
| `supercli zrok <any>` | Passthrough to zrok CLI |

## Usage

```bash
# Expose local web server publicly
supercli zrok share public http://localhost:3000

# Share a folder as a public file listing
supercli zrok share public ./dist

# Private share (SSH-like, no public URL)
supercli zrok share private localhost:22
supercli zrok access private <token>    # on the other side
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
