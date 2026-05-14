<p align="center">
  <img src="https://img.shields.io/npm/v/superacli" alt="npm">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/github/stars/javimosch/supercli?style=social" alt="Stars">
</p>

<h1 align="center">supercli ⎯ 3,000 CLI Tools, One Command</h1>

<p align="center">
  <b>Zero install.</b> Run any CLI tool with <code>npx supercli</code>.<br>
  Works for humans. Works for AI agents. Everything returns JSON.
</p>

<p align="center">
  <a href="#-quick-start"><b>Quick Start →</b></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-examples"><b>Examples →</b></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-for-ai-agents"><b>For AI Agents →</b></a>
</p>

<br>

---

**The problem:** Every CLI tool has different flags, different output formats, different install methods. You waste time learning syntax instead of getting work done. AI agents can't use most tools because output is unpredictable.

**supercli fixes this.** 3,000 tools. One interface. JSON out. Zero guesswork.

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

# AI mode — describe what you want
npx supercli ask "generate a uuid and check if google.com is up"
# → Combines multiple tools automatically
```

> 💡 No install? Correct. `npx supercli` works immediately.<br>
> Want it global? `npm install -g superacli`

---

## 🚀 What Makes This Different

| Instead of... | You do... |
|--------------|-----------|
| Installing 50 tools separately | One command: `npx supercli` |
| Reading man pages for flags | `supercli skills get <tool>.*` → structured metadata |
| Parsing inconsistent output | `--json` on *every* tool |
| Gluing tools with shell scripts | `supercli ask "do X and Y"` |
| Teaching agents tool syntax | JSON envelopes, machine-readable errors |

---

## 🛠️ Examples

```bash
# ---- EVERYDAY TOOLS ----

# Get weather for any city
npx supercli weather now "Tokyo"
# → {"temp_C":22,"condition":"Clear","humidity":65}

# Get system info as JSON
npx supercli sys info
# → {"host":"my-server","cpus":8,"mem":"32GB","uptime":"14d"}

# Encode/decode base64
npx supercli base64 encode "hello world"
npx supercli base64 decode "aGVsbG8gd29ybGQ="

# Format a JSON file
cat data.json | npx supercli json validate
cat data.json | npx supercli json pick "users.*.name"

# Check SSL certificate details
npx supercli cert info --domain github.com
# → {"issuer":"GTS","expires":"2026-07-22","days_left":74}

# ---- AI & DATA ----

# Count tokens in text (LLM context planning)
echo "Your prompt text here" | npx supercli token count
# → {"chars":142,"words":24,"tokens_estimate":32}

# Profile a CSV file
npx supercli data profile data.csv
# → {"columns":5,"rows":1000,"types":{"age":"numeric","name":"string"}}

# Scan for secrets in code
npx supercli secret scan ./src
# → [{"file":"config.js","line":42,"type":"AWS Access Key"}]
```

---

## 🤖 For AI Agents

supercli was designed for agents from day one.

```python
# Every tool returns the same envelope
{
  "version": "1.0",
  "command": "http.check.health",
  "duration_ms": 142,
  "data": { "status": "ok" }
}
```

**Why agents love supercli:**

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

## 📦 3,000 CLI Tools — Organized

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

```bash
# Run immediately (no install)
npx supercli uuid self generate

# Install globally
npm install -g superacli
supercli uuid self generate
```

---

## 🔄 Plugin Updates — Decoupled from npm

supercli includes 3,000+ plugins bundled in the npm package. But plugins change frequently — new tools are added, bugs are fixed, install guidance is updated.

**The old way:** Every plugin update required a new npm release. Users had to `npm update -g superacli` to get the latest plugins.

**The new way:** Plugins update independently from the CLI core.

```bash
# Check for plugin updates (dry-run)
sc plugins update --check

# Apply available updates
sc plugins update

# Force re-download all plugins
sc plugins update --force
```

**How it works:**
1. Fetches a lightweight catalog from GitHub (checksums only)
2. Compares against local cache (`~/.supercli/plugins/remote-catalog.json`)
3. Downloads the GitHub tarball of the `plugins/` directory
4. Extracts only changed plugins to `~/.supercli/plugins/bundled/`
5. Remote cache takes precedence over npm-bundled plugins

**Why this matters:**
- Plugin authors can ship fixes immediately without npm releases
- Users get fresh plugins on-demand, not on npm schedule
- npm package stays smaller (plugins are cached locally after first update)
- Fully backwards compatible — works offline after first sync

---

## 💬 What People Say

> *"Yooooooo, my agent nearly shit himself when I showed him this. TY! I'll keep an eye out for updates from you. This is a fantastic tool!"*
> — **zetsi77** ([@Hadu_Ken77](https://x.com/Hadu_Ken77))

<br>

> ## ⭐ If supercli saved you time, [**star the repo**](https://github.com/javimosch/supercli). Takes one click, means the world to us.

---

## License

MIT — [Javier Leandro Arancibia](https://github.com/javimosch)
