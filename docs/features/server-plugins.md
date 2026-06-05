# Server Plugins

Server plugins let the supercli server distribute plugin capabilities to CLI clients during `supercli sync`.

## Plugin Types

- `json`: manifest-only plugins for simple command wrappers or remote integrations.
- `zip`: packaged plugins for assets such as `skills/`, hook scripts, and auxiliary files.

## Sync Model

1. Client runs `supercli sync` with `SUPERCLI_SERVER` configured.
2. Client fetches `/api/config` and `/api/plugins?format=json`.
3. Client downloads only changed enabled server plugins by checksum.
4. Client stores server plugins locally under `~/.supercli/plugins/server`.
5. Runtime command graph merges base config + plugins.

## Precedence Rules

- Local plugins always win over server plugins when names collide.
- Server plugins never override local-only plugins.
- Sync diagnostics include shadowing details (`shadowed_by_local`).

## Enable/Disable Behavior

- Server plugin records include `enabled`.
- `enabled=false` removes the plugin from effective server-synced state on next sync.
- This only affects server-distributed plugins.

## Hook Policy

- Hook execution is policy-driven, not environment-variable-driven.
- Effective policy resolution:
  - per-plugin `hooks_policy` (`allow|deny|inherit`)
  - fallback to global server default (`settings.default_hooks_policy`)
- When denied, plugin sync still succeeds and reports skipped hooks.

## ZIP Safety Controls

- Default max ZIP size: `10MB` (configurable via server plugin settings).
- ZIP payload validation includes:
  - ZIP signature check
  - unsafe path detection (`../`, absolute paths, drive roots)
  - uncompressed-size threshold checks

## Storage Paths

- Client plugin root: `~/.supercli/plugins`
- Local plugin lock: `~/.supercli/plugins/plugins.lock.json`
- Server plugin lock: `~/.supercli/plugins/server.lock.json`
- Server plugin content: `~/.supercli/plugins/server/<name>/<version>/`

## API Surface

- `GET /api/plugins?format=json` list plugins + settings
- `POST /api/plugins` create/update JSON plugin
- `POST /api/plugins/upload` upload ZIP plugin (multipart or JSON base64)
- `PATCH /api/plugins/:name` update metadata (`enabled`, `hooks_policy`)
- `DELETE /api/plugins/:name` remove plugin
- `GET /api/plugins/:name/manifest` fetch manifest
- `GET /api/plugins/:name/archive` fetch ZIP payload
- `GET /api/plugins/settings` and `PUT /api/plugins/settings` manage defaults
