---
name: hotify
description: Use this skill when the user wants to manage web apps behind Traefik with Cloudflare DNS and SSL automation, deploy apps to remote servers, manage Docker containers, or troubleshoot Traefik/DNS issues.
---

# hotify Plugin

Traefik/Cloudflare app management CLI — deploy web apps behind Traefik with Cloudflare DNS and Let's Encrypt SSL certificates. Also supports Docker container management.

## Current Version: v2.5.0

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
- `hotify setup --id <id> --name <n> --domain <d> --port <p> --cmd <c> [--compose-file <f>] [--compose-path <p>]` — Create or update app (upsert)
- `hotify add --id <id> --name <n> --domain <d> --port <p> --cmd <c> [--compose-file <f>] [--compose-path <p>]` — Strict create (fails if exists)
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
- `hotify setup-dns --id <id> [--ip <ip>]` — Create/update Cloudflare DNS A record
- `hotify setup-traefik --id <id> [--challenge-type http|dns]` — Configure Traefik routing

### Docker Compose (v2.5.0+)
- `hotify compose [--id <app>] <subcommand> [args...]` — passthrough to `docker compose`
- When `--id` is set, resolves `compose_path` and `compose_file` from app config
- All subcommands and flags are forwarded verbatim to `docker compose`

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
