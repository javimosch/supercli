---
name: hotify
description: Use this skill when the user wants to manage web apps behind Traefik with Cloudflare DNS and SSL automation, deploy apps to remote servers, manage Docker containers, or troubleshoot Traefik/DNS issues.
---

# hotify Plugin

Traefik/Cloudflare app management CLI — deploy web apps behind Traefik with Cloudflare DNS and Let's Encrypt SSL certificates. Also supports Docker container management.

## Current Version: v2.8.1

### v2.8.1 Features (External Reverse Proxy Support)
- **External reverse proxy support**: Apps can now run on external machines while hotify handles DNS, TLS, and Traefik routing
- **--backend-url parameter**: Configure custom backend URLs for apps (e.g., http://100.114.4.57:8080)
- **Web UI support**: Backend URL field added to add/edit app forms
- **Traefik integration**: Automatic routing to custom backend URLs when configured
- Use cases: Apps running on different servers via Tailscale/VPN, containerized apps on separate hosts, microservices architectures

### v2.7.4 Features (Permission Enforcement)
- **Implemented permission enforcement** at server level - all endpoints now require specific permissions
- Added permission checking to auth middleware with 403 Forbidden responses
- **Wildcard support** - `all` or `*` grants full access for easier key management
- Comprehensive endpoint-to-permission mapping for all API routes
- Permission denials logged in audit system for security monitoring
- Admin permission automatically grants all permissions
- Fine-grained access control for multi-team deployments

### v2.7.3 Features (Remote Execution for App Configuration)
- **Remote execution for basic-auth, setup-traefik, setup-dns** — all app configuration commands now support remote execution via HTTP API
- Added `--target` and `--local` flags to `basic-auth`, `setup-traefik`, and `setup-dns` commands
- New remote API endpoints: `/api/remote/apps/{id}/basic-auth`, `/api/remote/apps/{id}/setup-traefik`, `/api/remote/apps/{id}/setup-dns`
- **No-humans mindset**: Always prefer hotify HTTP API over SSH/scp when possible — developers can manage apps remotely without SSH access
- Use case: DevOps installs hotify-cli on remote server, developers use hotify-cli locally with configured targets

### v2.7.1 Features (Docker Compose Status Detection)
- **Improved status detection for Docker Compose apps** — now checks actual compose stack status instead of cached config
- Added `checkComposeStatus()` function to verify Docker Compose stack is running
- Local status checks now detect Docker Compose app status via `--local` flag
- Config automatically updated when actual status differs from cached status
- Fixed `--daemon` flag parsing in `handleCLIAppStart()` — daemon mode now works correctly
- Added `--port` flag to `start` command for custom daemon port configuration

### v2.7.0 Features (Full SSH Independence)
- **Refactored `traefik-system` to use HTTP API** — all commands now use HTTP API (no SSH required)
- Added server-side API endpoints for Traefik installation/management (`/api/traefik-system/status`, `/api/traefik-system/install`, `/api/traefik-system/remove`)
- Removed SSH execution from `traefik_system.go` — commands now run on remote server via hotify daemon
- **hotify-cli is now fully SSH-independent** — all remote operations use HTTP API

### v2.6.0 Features (Docker Compose Deployment Automation)
- `deploy-compose` — Copy full project tree to remote compose_path via HTTP API (replaces manual `scp`)
- `compose-sync` — Sync compose file (+ .env) only — faster than full deploy
- `compose-copy-dir` — Copy a specific local directory into remote compose_path
- `volume-init` — Populate a Docker named volume with local directory content
- `setup-compose` — Register app config + deploy project files in one command
- All v2.6.0 commands use HTTP API (no SSH required)

### v2.5.0 Features (Docker Compose Support)
- `compose` command — passthrough to `docker compose` (all subcommands forwarded verbatim)
- `--id` flag resolves `compose_path` and `compose_file` from app config automatically
- `--compose-file` and `--compose-path` flags in `setup`/`add`/`edit`
- `compose_file` and `compose_path` fields in app config and `list` output
- Hotify is responsible only for knowing which compose file to use — Docker config stays in the app repo

### v2.4.0 Features (Docker Support)
- Docker container management (list/start/stop/restart/status/logs)
- Traefik Docker provider enable/disable
- Docker CLI integration via sudo docker commands

### v2.3.0 Features (Traefik Configuration Improvements)
- Explicit domain specification in dynamic.yml (fixes ACME "domain not defined" errors)
- --challenge-type flag (http/dns selection for ACME)
- Smart restart (never uses reload, works even when reload unsupported)
- DNS record existence check (skip/update/create based on current state)
- Pre-flight config validation before touching Traefik files
- New CLI commands: setup-dns, setup-traefik

### v2.1.0 Features (Process Management)
- Pause/resume for both local and remote apps
- Daemon PID tracking with two-strategy resolver (proc tree + port lookup)
- Local mode with --local flag for direct execution

## Commands

### App Management
- `hotify setup --id <id> --name <n> --domain <d> --port <p> --cmd <c> [--compose-file <f>] [--compose-path <p>] [--backend-url <url>]` — Create or update app (upsert)
- `hotify add --id <id> --name <n> --domain <d> --port <p> --cmd <c> [--compose-file <f>] [--compose-path <p>] [--backend-url <url>]` — Strict create (fails if exists)
- `hotify remove --id <id>` — Delete app
- `hotify list` — List all apps

### Process Management
- `hotify start --id <id> [--local]` — Start app (local or remote)
- `hotify stop --id <id> [--local]` — Stop app (local or remote)
- `hotify restart --id <id> [--local]` — Restart app (local or remote)
- `hotify status --id <id> [--local]` — App status (local or remote)
- `hotify pause --id <id> [--local]` — Pause app (SIGSTOP)
- `hotify resume --id <id> [--local]` — Resume paused app (SIGCONT)

### Daemon
- `hotify start --daemon` — Start hotify daemon (web UI + API)
- `hotify stop` — Stop daemon
- `hotify status` — Daemon status

### DNS & Traefik Configuration (v2.3.0+)
- `hotify setup-dns --id <id> [--ip <ip>] [--target <t>] [--local]` — Create/update Cloudflare DNS A record
- `hotify setup-traefik --id <id> [--challenge-type http|dns] [--target <t>] [--local]` — Configure Traefik routing

### Basic Auth Management (v2.7.3+)
- `hotify basic-auth --id <id> --action <add|remove|list> [--user <u>] [--password <p>] [--hash <h>] [--target <t>] [--local]` — Manage Traefik HTTP basic auth

### Docker Compose (v2.5.0+)
- `hotify compose [--id <app>] <subcommand> [args...]` — passthrough to `docker compose`
- When `--id` is set, resolves `compose_path` and `compose_file` from app config
- All subcommands and flags are forwarded verbatim to `docker compose`

### Docker Compose Deployment Automation (v2.6.0+)
- `hotify deploy-compose --id <id> --source <dir> [--compose-file <f>] [--remote-path <p>] [--start]` — Copy full project tree to remote
- `hotify compose-sync --id <id> [--source <dir>] [--restart] [--env=false]` — Sync compose file (+ .env) only
- `hotify compose-copy-dir --id <id> --dir <subdir> --source <local-dir>` — Copy a directory into remote compose_path
- `hotify volume-init --id <id> --volume <vol-name> --source <dir>` — Populate Docker named volume with local directory
- `hotify setup-compose --id <id> --name <n> --domain <d> --port <p> --cmd <c> --source <dir> [--compose-file <f>] [--remote-path <p>] [--setup-dns] [--start]` — Register app + deploy in one command

Examples:
```bash
# App-aware (resolves path and compose file automatically)
hotify-cli compose --id cmdcenter up -d
hotify-cli compose --id cmdcenter down
hotify-cli compose --id cmdcenter ps
hotify-cli compose --id cmdcenter logs -f
hotify-cli compose --id cmdcenter restart
hotify-cli compose --id cmdcenter pull

# Raw passthrough (runs docker compose in current directory)
hotify-cli compose -f compose.binary.yml up -d
hotify-cli compose ps
```

### Docker Management (v2.4.0+)
- `hotify docker list` — List all containers
- `hotify docker start <id>` — Start container
- `hotify docker stop <id>` — Stop container
- `hotify docker restart <id>` — Restart container
- `hotify docker status <id>` — Container status
- `hotify docker logs <id>` — Container logs
- `hotify docker enable-traefik` — Enable Traefik Docker provider
- `hotify docker disable-traefik` — Disable Traefik Docker provider

### Deployment
- `hotify deploy --id <id> --source <path> [--target <t>] [--setup-dns]` — Deploy binary/folder
- `hotify prune --id <id>` — Remove DNS/Traefik for app
- `hotify prune --all` — Rebuild Traefik for all apps

### Authentication
- `hotify auth --url <u> --token <t> --name <n>` — Authenticate with remote daemon
- `hotify targets --action list` — List targets
- `hotify targets --action use --name <n>` — Set active target

### API Key Management (Local Only)
- `hotify api-keys --action add --name <n> [--permissions <p>]` — Create API key with permissions
- `hotify api-keys --action list` — List all API keys
- `hotify api-keys --action remove --name <n>` — Remove API key
- `hotify api-keys --action permissions --name <n> --add <p> --remove <p>` — Update permissions
- `hotify api-keys --action usage --name <n>` — Show API key usage statistics

**Available Permissions**: `deploy`, `start`, `stop`, `restart`, `logs`, `config`, `admin`, `all`, `*`
**Note**: Permissions are fully enforced at server level as of v2.7.4. Use `all` or `*` for full access.

### Infrastructure
- `hotify traefik-system` — Manage Traefik installation on targets

## Setup

```bash
# Interactive setup (Cloudflare token, domain, email)
hotify-cli init

# Or non-interactive
hotify-cli init --token <cf-token> --domain example.com --email admin@example.com
```

This creates `~/.hotify/config.json` with Cloudflare API credentials.

## Typical Workflow

```bash
# 1. Register an app
hotify-cli setup --id myapp --name "My App" --domain myapp --port 3000 --cmd "/usr/local/bin/myapp start"

# 2. Setup DNS (checks for existing record)
hotify-cli setup-dns --id myapp --ip 92.113.145.178

# 3. Setup Traefik (HTTP challenge by default)
hotify-cli setup-traefik --id myapp --challenge-type http

# 4. Deploy binary to remote
hotify-cli deploy --id myapp --source ./myapp-binary --target dk1

# 5. Start app on remote
hotify-cli start --id myapp --target dk1

# 6. Check status
hotify-cli status --id myapp --target dk1
```

## External Reverse Proxy Workflow (v2.8.1+)

The v2.8.1 release adds support for external reverse proxy targets, allowing apps to run on different machines while hotify handles DNS, TLS, and Traefik routing.

### Use Cases
- Apps running on different servers via Tailscale/VPN
- Containerized apps on separate hosts
- Microservices architectures across multiple machines

### Usage Example
```bash
# Setup app with external backend URL (e.g., Tailscale network)
hotify-cli setup \
  --id gitea-rbm2 \
  --name "Gitea on rbm2" \
  --domain gitea \
  --port 3000 \
  --cmd "/usr/local/bin/gitea start" \
  --backend-url "http://100.114.4.57:3000"

# Setup DNS and Traefik (still handled by hotify)
hotify-cli setup-dns --id gitea-rbm2
hotify-cli setup-traefik --id gitea-rbm2
```

When `--backend-url` is set:
- Traefik routes to the specified URL instead of `http://127.0.0.1:<port>`
- DNS and TLS certificate management still handled by hotify
- Basic auth and other Traefik middleware still apply
- The app can run on any reachable machine (local network, Tailscale, VPN)

## Docker Compose Workflow (v2.5.0+)

```bash
# 1. Register app with compose config (Docker config stays in the app repo)
hotify-cli setup \
  --id cmdcenter \
  --name "Command Center" \
  --domain cmdcenter \
  --port 3031 \
  --cmd "docker compose up -d" \
  --compose-file compose.binary.yml \
  --compose-path /home/dk1/cmdcenter

# 2. Start compose stack (resolves path + file automatically)
hotify-cli compose --id cmdcenter up -d

# 3. Check status
hotify-cli compose --id cmdcenter ps

# 4. View logs
hotify-cli compose --id cmdcenter logs -f

# 5. Restart
hotify-cli compose --id cmdcenter restart

# 6. Stop
hotify-cli compose --id cmdcenter down
```

## Docker Compose Deployment Workflow (v2.6.0+)

The v2.6.0 commands automate the manual `scp` workflow for Docker Compose deployments. All use the HTTP API (no SSH required).

```bash
# Full deploy: copy entire project tree (compose file, .env, webui/, templates/, etc.)
hotify-cli deploy-compose \
  --id cir-doc-gen \
  --source /local/path/to/project

# Deploy and start immediately
hotify-cli deploy-compose --id cir-doc-gen --source ./project --start

# Sync only compose file (+ .env) after editing docker-compose.yml
hotify-cli compose-sync --id cir-doc-gen --restart

# Copy a specific directory (e.g., webui/)
hotify-cli compose-copy-dir \
  --id cir-doc-gen \
  --dir webui \
  --source /local/path/webui

# Populate a Docker named volume with local content
hotify-cli volume-init \
  --id cir-doc-gen \
  --volume cir-webui \
  --source /local/webui

# One-shot: register app + deploy + DNS + start
hotify-cli setup-compose \
  --id cir-doc-gen \
  --name "CIR Doc Gen" \
  --domain cir-doc-gen \
  --port 8080 \
  --cmd "docker compose up -d" \
  --source /local/project \
  --compose-file docker-compose.yml \
  --remote-path /home/dk1/cir-doc-gen \
  --setup-dns \
  --start
```

**What this replaces:**
- `deploy-compose` replaces: `scp docker-compose.yml`, `scp .env`, `scp -r webui/`, `scp -r templates/`
- `compose-sync` replaces: `scp docker-compose.yml host:/path/`
- `compose-copy-dir` replaces: `scp -r webui/ host:/path/webui/`
- `volume-init` replaces: `sudo cp -r webui/* /var/lib/docker/volumes/.../` (requires write access on remote)

## Docker Workflow (v2.4.0+)

```bash
# List all containers
hotify-cli docker list

# Check container status
hotify-cli docker status --id mycontainer

# Start/stop container
hotify-cli docker start --id mycontainer
hotify-cli docker stop --id mycontainer

# Enable Traefik Docker provider (requires Traefik v3.6+)
hotify-cli docker enable-traefik
```

## Architecture

- **Local CLI**: All CRUD, authentication, deployment, and Docker commands
- **Daemon Mode** (`hotify-cli start -daemon`): HTTP server on port 8080 with embedded web UI + REST API
- **Remote Targets**: Manage multiple servers via API with encrypted tokens
- **Docker Integration**: Container management via Docker CLI, Traefik Docker provider support
- **Transport**: All commands use HTTP API (no SSH required) — hotify-cli is fully SSH-independent as of v2.7.0

## No-Humans Mindset: Prefer Hotify Over SSH/SCP

**Core Principle**: If an operation can be done via hotify's HTTP API, always prefer it over SSH/scp. This enables true remote management without requiring SSH access to servers.

### When to Use Hotify HTTP API (Preferred)
- **App configuration**: `setup`, `add`, `edit`, `remove`, `list`
- **Process management**: `start`, `stop`, `restart`, `status`, `pause`, `resume`
- **DNS & Traefik**: `setup-dns`, `setup-traefik`, `basic-auth` (v2.7.3+)
- **Deployment**: `deploy`, `deploy-compose`, `compose-sync`, `compose-copy-dir`
- **Docker operations**: `compose`, `docker` commands
- **Infrastructure**: `traefik-system` (v2.7.0+)

### When SSH Might Still Be Needed
- Initial hotify-cli installation on remote server
- System-level troubleshooting outside hotify's scope
- Manual file operations not supported by hotify API

### Remote Execution Pattern (v2.7.3+)
```bash
# Remote mode (default - uses configured target)
hotify-cli basic-auth --id myapp --action list
hotify-cli setup-traefik --id myapp
hotify-cli setup-dns --id myapp

# Explicit target specification
hotify-cli basic-auth --id myapp --action list --target dk1
hotify-cli setup-traefik --id myapp --target dk1

# Local mode (execute directly on local server)
hotify-cli basic-auth --id myapp --action list --local
hotify-cli setup-traefik --id myapp --local
```

### Benefits of HTTP API Over SSH
- **No SSH keys required**: Developers don't need SSH access to infrastructure
- **Audit logging**: All operations logged via hotify's audit system
- **Consistent interface**: Same commands work locally and remotely
- **No tunneling required**: Works through firewalls/NAT without SSH tunnels
- **Team collaboration**: Multiple developers can work via shared API tokens

### Important Note: Permission Enforcement (v2.7.4+)
**✅ Permission Enforcement Implemented**: As of v2.7.4, hotify-cli enforces permissions at the server level. The auth middleware validates tokens AND checks specific permissions for each endpoint.

**Current State**:
- Permissions are enforced for all authenticated endpoints
- Permission types: `deploy`, `start`, `stop`, `restart`, `logs`, `config`, `admin`
- Wildcard support: `all` or `*` grants full access
- Admin permission automatically grants all permissions
- 403 Forbidden responses for insufficient permissions

**Permission Mapping**:
- `/api/status` → requires `logs`
- `/api/config` → requires `config`
- `/api/apps/*/start` → requires `start`
- `/api/apps/*/stop` → requires `stop`
- `/api/deploy` → requires `deploy`
- `/api/api-keys/*` → requires `admin`
- And more... (see permissions.go for full mapping)

**Wildcard Usage**:
```bash
# Create full access key using wildcard
hotify-cli api-keys --action add --name fullaccess --permissions all

# Alternative wildcard syntax
hotify-cli api-keys --action add --name fullaccess --permissions "*"
```

**Recommendation for Agents**:
- Use appropriate permission scoping for security
- Create keys with minimum required permissions
- Use wildcards (`all`/`*`) only for trusted administrative access
- Monitor audit logs for permission denials

### Implementation Pattern
When working with hotify, follow this decision tree:
1. **Is there a hotify command for this operation?** → Use hotify CLI
2. **Does it support remote execution?** → Use `--target` flag (default)
3. **Only use SSH if**: hotify cannot perform the operation at all

## Key Learnings & Caveats

### Traefik Configuration

1. **ACME "Domain Not Defined" Error (v2.3.0 fix)**
   - **Issue**: Traefik rejects domain configuration without explicit `domains:` block
   - **Fix**: Always include `domains: - main: <domain>` in router TLS configuration
   - **Example**:
     ```yaml
     tls:
       certResolver: letsencrypt
       domains:
         - main: app.example.com
     ```

2. **ACME Challenge Type Conflicts**
   - **Issue**: Having both DNS and HTTP challenges in traefik.yml causes conflicts
   - **Fix**: Use only one challenge type (HTTP is simpler, DNS for wildcards)
   - **Default**: HTTP challenge (v2.3.0+)

3. **Service Reload Not Supported**
   - **Issue**: `systemctl reload traefik` fails on some systems
   - **Fix**: Always use `systemctl restart traefik` (v2.3.0+)
   - **Implementation**: Detect running state, use start vs restart accordingly

4. **DNS Record Existence Check**
   - **Issue**: Attempting to create duplicate DNS records fails
   - **Fix**: Check existing record before creation — skip if IP matches, update if differs (v2.3.0+)
   - **Benefit**: Idempotent DNS setup

### Docker Compatibility

5. **Docker API Version Mismatch**
   - **Issue**: Traefik v3.1.4 uses Docker API v1.24, but Docker 29.x requires v1.44+
   - **Symptom**: "client version 1.24 is too old. Minimum supported API version is 1.44"
   - **Fix**: Upgrade Traefik to v3.6+ (v3.7.0 recommended)
   - **Requirement**: Traefik v3.6+ for Docker 29.x compatibility

6. **Traefik Docker Provider**
   - **Configuration**: Use `exposedByDefault: false` for security
   - **Endpoint**: `unix:///var/run/docker.sock`
   - **Labels**: Required for routing (traefik.enable=true, Host rule, certResolver)
   - **Example labels**:
     ```yaml
     labels:
       - "traefik.enable=true"
       - "traefik.http.routers.myapp.rule=Host(\`myapp.example.com\`)"
       - "traefik.http.routers.myapp.entrypoints=websecure"
       - "traefik.http.routers.myapp.tls.certresolver=letsencrypt"
       - "traefik.http.services.myapp.loadbalancer.server.port=8080"
     ```

### PID Tracking (v2.1.0+)

7. **Daemon PID Tracking Issue**
   - **Issue**: When starting app via `sh -c <command>`, tracked shell PID exits immediately for daemon apps
   - **Fix**: Two-strategy resolver:
     1. `/proc` tree walk — finds leaf child of shell (single-fork processes)
     2. Port-based lookup via `ss` — finds PID by app's configured port (double-fork/setsid daemons)
   - **Implementation**: `resolveActualPID(shellPID int, port int)` in local_ops.go

8. **Local vs Remote Operations**
   - **Local mode**: `--local` flag executes commands directly on server (no API)
   - **Remote mode**: Uses hotify daemon API on target server
   - **PID tracking**: Both local and remote use same two-strategy resolver

### File Size Limits

9. **500 LOC Limit**
   - hotify-cli enforces 500 lines of code per source file
   - Files exceeding limit must be split (e.g., process.go → local_ops.go + remote_ops.go)
   - **Rationale**: Maintainability and readability

### Smoke Testing

10. **Smoke Test Approach**
    - Comprehensive test document for each version
    - Test server: dk1@92.113.145.178
    - Categories: CLI structure, feature-specific, regression, E2E
    - Document issues found and fixed during testing
    - All tests must pass before release

### Security & Permissions

11. **Traefik Service File Permissions**
    - **Issue**: `/etc/systemd/system/traefik.service` owned by root, regular user can't write
    - **Fix**: Skip service file write if already exists (v2.3.0+)
    - **Rationale**: Config files in `/etc/traefik/` owned by deploy user, only service file needs root

12. **Cloudflare Token Format**
    - **Issue**: Legacy API format (X-Auth-Key + X-Auth-Email) vs Bearer token
    - **Fix**: hotify-cli uses legacy format for broader compatibility
    - **Note**: Bearer tokens may work but not explicitly tested

### Common Pitfalls

13. **Base Domain Extraction Bug**
    - **Issue**: `getZoneID` was extracting only TLD (`fr` instead of `intrane.fr`)
    - **Fix**: Split on all dots, take last 2 parts for registrable domain
    - **Impact**: DNS setup would fail with "zone not found" error

14. **Configuration Validation**
    - **Best practice**: Always validate config before touching Traefik files
    - **Check**: admin_email, domain, app ID, app domain, app port
    - **Benefit**: Prevents partial/broken state

15. **Watch vs Restart**
    - **Issue**: Traefik's `watch: true` on file provider doesn't always pick up changes
    - **Fix**: Always restart Traefik after configuration changes
    - **Rationale**: Reliable configuration application

## Troubleshooting

### Traefik Errors

**"domain not defined" in ACME logs**
- Cause: Missing explicit `domains:` block in router TLS configuration
- Fix: Use v2.3.0+ setup-traefik (adds domain spec automatically)

**"reload is not supported for this unit"**
- Cause: systemd service doesn't support reload
- Fix: v2.3.0+ uses restart automatically

**Docker provider errors**
- Check Traefik version (needs v3.6+ for Docker 29.x)
- Check Docker API version (`docker version | grep "API version"`)
- Verify Docker socket accessible: `ls -la /var/run/docker.sock`

### DNS Errors

**"zone not found"**
- Check Cloudflare token permissions
- Verify domain is managed in Cloudflare
- Check base domain extraction (should be 2-part, not just TLD)

**"record already exists"**
- v2.3.0+ handles this automatically (skip/update/create)
- If using older version, manually delete via Cloudflare dashboard

### Process Errors

**PID becomes invalid after start**
- Daemon app double-forked, shell PID exited
- v2.1.0+ uses two-strategy resolver to find actual daemon PID
- Check: `hotify-cli status --id <app> --local`

## Version-Specific Notes

### v2.7.4
- Implemented server-side permission enforcement for all API endpoints
- Added wildcard support (`all`/`*`) for full access keys
- Created comprehensive endpoint-to-permission mapping in permissions.go
- Updated auth middleware to check permissions before allowing access
- Added 403 Forbidden responses with audit logging for permission denials
- Simplified permission management by removing redundant PermissionManager struct
- Updated API key creation to expand wildcards to individual permissions

### v2.7.3
- Added remote execution support for `basic-auth`, `setup-traefik`, and `setup-dns` commands
- Added `--target` and `--local` flags to app configuration commands
- New remote API endpoints: `/api/remote/apps/{id}/basic-auth`, `/api/remote/apps/{id}/setup-traefik`, `/api/remote/apps/{id}/setup-dns`
- Fixed route conflicts by using `/api/remote/apps/` path pattern instead of `/api/apps/`
- Added `PostWithData` method to HTTPClient for POST requests that return response data
- Updated AGENTS.md with remote execution documentation and "no-humans mindset"

### v2.7.0
- Refactored `traefik-system` to use HTTP API instead of SSH
- Added server-side API endpoints for Traefik installation/management
- hotify-cli is now fully SSH-independent (all commands use HTTP API)
- Removed SSH execution code from traefik_system.go

### v2.6.0
- Added Docker Compose Deployment Automation (5 new commands)
- All new commands use HTTP API (no SSH required)
- Only `traefik-system` still uses SSH (legacy, to be refactored)
- Added server-side API endpoint `/api/compose/volume-init` for volume initialization
- Added `HTTPClient.PostLarge()` with 5-minute timeout for large uploads

### v2.4.0
- Added Docker container management
- Added Traefik Docker provider enable/disable
- Requires Traefik v3.6+ for Docker 29.x compatibility
- Docker commands use `sudo docker` internally

### v2.3.0
- Fixed ACME domain specification
- Added --challenge-type flag
- Fixed service reload vs restart
- Added DNS existence check
- Added config validation
- New CLI: setup-dns, setup-traefik

### v2.1.0
- Added pause/resume for apps
- Fixed daemon PID tracking (both local and remote)
- Added --local flag for direct execution
- Split process.go into local_ops.go + remote_ops.go

## Dependencies

- **Go**: Pure stdlib, no external dependencies
- **Docker**: Required for Docker commands (v2.4.0+)
- **Traefik**: Required for reverse proxy (v2.3.0+ requires v3.6+ for Docker 29.x)
- **Cloudflare**: DNS provider (requires API token)
- **systemd**: Service management (Linux)
