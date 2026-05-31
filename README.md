<p align="center">
  <img src="https://img.shields.io/npm/v/superacli" alt="npm">
  <img src="https://img.shields.io/badge/release-2026--05--14-blue" alt="Latest Release">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/github/stars/javimosch/supercli?style=social" alt="Stars">
</p>

<h1 align="center">supercli ⎯ 3,300+ CLI Tools, One Command — and growing every day</h1>

<p align="center">
  <b>Zero install.</b> Run any CLI tool with <code>npx supercli</code>.<br>
  Works for humans. Works for AI agents. Everything returns JSON.
</p>

> Think: "Stripe API for CLIs and tools"

## ⚡ TL;DR

> Turn any CLI, API, or workflow into a discoverable, executable capability
> — with consistent inputs, outputs, and zero glue code.

```bash
# Discover what exists
npx supercli skills search "deploy" --json

# Understand exactly how to use it
npx supercli skills get aws.cfn.deploy --json

# Execute with predictable output
npx supercli aws cfn deploy --stack-name my-stack --json
```

👉 Works the same across CLI tools, APIs, MCP servers, and workflows
👉 No glue code, no parsing, no guesswork

## ⚡ Example

```bash
npx supercli ask "list my tasks and recent commits"
```

```json
{
  "tasks": [...],
  "commits": [...]
}
```

→ Combines multiple tools into one structured response.

## The Problem

Every tool speaks a different language:
- CLIs → flags & inconsistent output
- APIs → schemas & auth
- MCP/tools → custom protocols
- Workflows → glue code everywhere

Humans waste time learning syntax. Agents fail because nothing is predictable.

## The Solution

supercli turns everything into capabilities:
- Same structure → `supercli <namespace> <resource> <action>`
- Same output → deterministic JSON envelopes
- Same discovery → searchable skill graph
- Same execution → no custom integrations

---

## ⚡ Quick Start

```bash
# Run without installing anything
npx supercli uuid self generate
# → {"uuid":"550e8400-e29b-41d4-a716-446655440000"}

# Check if a website is up
npx supercli http check health --url https://example.com
# → {"status":"ok","ms":142,"code":200}

# Generate a password
npx supercli passgen
# → {"password":"xK9#mP2$vL7@nQ5%"}

# Convert CSV to JSON
echo "name,age\nAlice,30\nBob,25" | npx supercli csv json convert
# → [{"name":"Alice","age":"30"},{"name":"Bob","age":"25"}]

# Explore capabilities
npx supercli skills search "github" --json

# Run something real
npx supercli gh issue list --json

# AI-driven execution
npx supercli ask "generate a uuid and check if google.com is up"

# Manage plugins
npx supercli plugins list
npx supercli plugins explore
npx supercli plugins install commiat
```

> 💡 No install? Correct. `npx supercli` works immediately.<br>
> Want it global? `npm install -g superacli`<br>
> Server mode: See docs/features/server-plugins.md

---

## For Humans

| Instead of... | You do... |
|--------------|-----------|
| Installing 50 tools separately | One command: `npx supercli` |
| Reading man pages for flags | `supercli skills get <tool>.*` → structured metadata |
| Parsing inconsistent output | `--json` on every tool |
| Gluing tools with shell scripts | `supercli ask "do X and Y"` |

## For AI Agents

- 🔍 **Discoverable** — `supercli skills search "database"` returns machine-readable metadata
- 📦 **Deterministic** — Every tool accepts `--json`, `--silent` (no interactive prompts)
- 🚨 **Predictable errors** — Standard error codes: `82` (validation), `105` (integration), `110` (internal)
- 🔗 **Composable** — `supercli ask "check status and send alert"` chains tools automatically
- 📋 **Auditable** — Every call logs namespace, resource, action, inputs, outputs

```bash
# Agent workflow: discover → inspect → execute
supercli skills search "deploy" --json
supercli skills get aws.cfn.deploy --json
supercli aws cfn deploy --stack my-stack --json
```

---

## What You Get

- 🔍 Find any capability instantly — no docs hunting
- ⚡ Run tools with one consistent interface
- 🤖 Give agents predictable, structured execution
- 🔗 Combine multiple tools without glue code
- 📦 Extend anything via plugins

---

## 🛠️ CLI Usage Examples

```bash
# Discovery
npx supercli skills list
npx supercli skills search "database"

# Inspection (important for agents)
npx supercli inspect beads issue create
npx supercli skills get beads.issue.create --json

# Execution
npx supercli beads issue create --title "Fix bug"
npx supercli beads issue list --json
npx supercli gwc drive files list

# AI
npx supercli ask "do X and Y"

# Plugins
npx supercli plugins list
npx supercli plugins install commiat
npx supercli plugins show commiat

# Get weather for any city
npx supercli weather now "Tokyo"
# → {"temp_C":22,"condition":"Clear","humidity":65}

# Check SSL certificate details
npx supercli cert info --domain github.com
# → {"issuer":"GTS","expires":"2026-07-22","days_left":74}

# Scan for secrets in code
npx supercli secret scan ./src
# → [{"file":"config.js","line":42,"type":"AWS Access Key"}]
```

---

## 🔄 Keeping Plugins Updated

Plugins are added daily — new tools, updated checksums, fresh metadata. Keep your local installation in sync:

```bash
# Check what's new (dry-run, no changes)
supercli plugins update --check

# Apply the latest plugins
supercli plugins update
```

> **Latest npm release:** v1.15.0 (2026-05-14) — published [8 days ago]. New versions ship multiple times per week.

---

## 📦 3,300+ CLI Tools — Organized

| Category | Count | Examples |
|----------|-------|---------|
| **System** | 450+ | `curl`, `jq`, `git`, `tmux`, `htop`, `rsync` |
| **Development** | 380+ | `cargo`, `npm`, `go`, `rustc`, `gcc`, `make` |
| **Databases** | 120+ | `mysql`, `postgres`, `redis`, `mongodb`, `sqlite`, `cockroach` |
| **Cloud** | 160+ | `aws`, `gcloud`, `azure`, `kubectl`, `terraform`, `pulumi` |
| **Security** | 200+ | `nmap`, `gitleaks`, `trufflehog`, `openssl`, `git-crypt` |
| **Network** | 180+ | `ncat`, `tshark`, `mtr`, `socat`, `chisel`, `doggo` |
| **Data** | 150+ | `csvkit`, `xsv`, `miller`, `qsv`, `datamash` |
| **Media** | 100+ | `ffmpeg`, `sox`, `imagemagick`, `exiftool`, `gstreamer` |
| **Testing** | 90+ | `k6`, `vegeta`, `fortio`, `hey`, `siege`, `wrk2` |
| **Blockchain** | 30+ | `foundry`, `cast`, `hardhat`, `truffle`, `solana` |
| **Serverless** | 40+ | `fission`, `openfaas`, `kn`, `serverless`, `chalice` |
| **Web** | 80+ | `wrangler`, `netlify`, `vercel`, `surge`, `heroku` |
> Every tool includes: description, tags, source URL, install method, binary check, and commands.

---

## 📦 Install

### Option 1: Zig Version (Fast, Single Binary)

```bash
# Quick install (curl)
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash

# Install and replace Node.js version
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash -s -- --replace
```

**Why Zig?**
- ✅ No Node.js startup overhead
- ✅ Single static binary (250KB)
- ✅ Reads same `~/.supercli/plugins/plugins.lock.json`
- ✅ Progressive adoption: co-exists with Node.js version
- ✅ Easy revert: `npm uninstall -g supercli && npm install -g supercli`

### Option 2: Node.js Version (npx/npm)

```bash
# Run immediately (no install)
npx supercli uuid self generate

# Install globally
npm install -g superacli
supercli uuid self generate
```

**Why Node.js?**
- ✅ Full feature parity (MCP, server, HTTP adapter)
- ✅ Plugin installation from registry
- ✅ Ecosystem integration

### Progressive Adoption

Both versions read the same plugin storage. Try the Zig version first:

```bash
# Install Zig version as sc-zig (co-exists with Node.js sc)
curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash

# Test it
sc-zig --version

# If you like it, replace Node.js sc:
sc-zig install-as-sc
sudo ln -sf /usr/local/bin/sc-zig /usr/local/bin/sc

# To go back to Node.js:
npm uninstall -g supercli
npm install -g supercli
```

**Check which version you have:**
```bash
sc --version
# Zig version shows: SuperCLI (Zig) v0.1.0
# Node.js version shows different info
```

---

## 💬 What People Say

> *"Yooooooo, my agent nearly shit himself when I showed him this. TY! I'll keep an eye out for updates from you. This is a fantastic tool!"*
> — **zetsi77** ([@Hadu_Ken77](https://x.com/Hadu_Ken77))

<br>

> ## ⭐ If supercli saved you time, [**star the repo**](https://github.com/javimosch/supercli). Takes one click, means the world to us.

---

## License

MIT — [Javier Leandro Arancibia](https://github.com/javimosch)
