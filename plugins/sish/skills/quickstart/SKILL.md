---
name: sish
description: Use this skill when the user wants to expose local services through SSH reverse tunnels or run a self-hosted ngrok/serveo alternative with sish.
---

# sish Plugin

sish is a tunnel server: HTTP(S)/WS(S)/TCP forwarding over SSH. Clients use plain `ssh -R` — no client install. Server assigns subdomains (or uses `--domain` wildcard) and can auto-issue Let's Encrypt certs. Community instance: `ssi.sh` (port 2222).

## Commands

### Server
- `sish server run` — Start the tunnel server (flags via passthrough)
- `sish self version` — Print version

### Client (uses system ssh)
- `sish tunnel expose <spec> <host>` — `ssh -R <spec>` against a sish server; spec = `remote:localport:localhost:port` e.g. `mysub:80:localhost:3000` or `2222:localhost:22` for raw TCP
- `sish _ _` — Passthrough to sish CLI

## Usage Examples

- "Expose my local port 3000 on a public URL"
- "Set up an SSH tunnel to ssi.sh for my web app"
- "Run a self-hosted serveo alternative"

## Installation

```bash
# Server binary (static Go binary)
curl -sSfL https://github.com/antoniomika/sish/releases/latest/download/sish-linux-amd64 \
  -o ~/.local/bin/sish && chmod +x ~/.local/bin/sish
# or: docker run -d --name sish -p 2222:2222 -p 80:80 -p 443:443 antoniomika/sish
# or: go install github.com/antoniomika/sish/cmd/sish@latest
```

## Examples

```bash
# Public instance — expose localhost:3000 at mysub.ssi.sh
ssh -p 2222 -R mysub:80:localhost:3000 ssi.sh

# Raw TCP forward (e.g. SSH back in)
ssh -p 2222 -R 2222:localhost:22 ssi.sh

# Run your own server with wildcard domain + HTTPS
sish --ssh-address=:2222 --domain=*.tun.example.com \
     --https --https-certificate-directory=/etc/sish/ssl
```

## Key Features

- No client software — any machine with OpenSSH can tunnel
- HTTP/HTTPS/Websocket/TCP/SNI forwarding, per-tunnel subdomains
- Automatic Let's Encrypt certificates; IP whitelists, auth keys, service aliases
- Built-in web console and stats; single static binary or Docker
