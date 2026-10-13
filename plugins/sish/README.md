# sish Plugin for SuperCLI

[sish](https://github.com/antoniomika/sish) is a self-hosted serveo/ngrok alternative:
HTTP(S), WS(S), and TCP tunnels over plain SSH. The client needs nothing but `ssh -R` —
sish handles routing, subdomains, and automatic Let's Encrypt certificates on the server.

## Installation

```bash
# Install sish server binary
curl -sSfL https://github.com/antoniomika/sish/releases/latest/download/sish-linux-amd64 \
  -o ~/.local/bin/sish && chmod +x ~/.local/bin/sish
# or: docker run -d --name sish -p 2222:2222 -p 80:80 -p 443:443 antoniomika/sish

# Install supercli plugin
supercli plugins install ./plugins/sish
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli sish self version` | Show sish version |
| `supercli sish server run` | Run the sish tunnel server |
| `supercli sish tunnel expose <spec> <host>` | Expose a local port via `ssh -R` |
| `supercli sish <any>` | Passthrough to sish CLI |

## Usage

```bash
# Run a sish server (public instance exists at ssi.sh)
supercli sish server run --ssh-address=:2222 --domain=example.com

# Client side — expose local :3000 as mysub.ssi.sh (no sish binary needed)
supercli sish tunnel expose mysub:80:localhost:3000 ssi.sh

# Plain TCP forward
supercli sish tunnel expose 2222:localhost:22 ssi.sh
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
