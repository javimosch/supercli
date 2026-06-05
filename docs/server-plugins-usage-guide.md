# Server Plugins Usage Guide

This guide covers manual testing of server plugins in supercli, including JSON and ZIP plugin flows.

## Prerequisites

- A running server instance (example: `PORT=3001 sc --server`)
- CLI shell with:

```bash
export SUPERCLI_SERVER=http://localhost:3001
```

## 1) Verify Server Plugin Endpoints

```bash
curl -s "$SUPERCLI_SERVER/api/plugins?format=json" | jq
curl -s "$SUPERCLI_SERVER/api/plugins/settings" | jq
```

Expected: JSON response with `plugins` and `settings`.

## 2) Create a JSON Server Plugin

Create a simple shell command plugin:

```bash
curl -s -X POST "$SUPERCLI_SERVER/api/plugins" \
  -H 'Content-Type: application/json' \
  -d '{
    "source_type": "json",
    "name": "server-demo-json",
    "version": "0.1.0",
    "description": "Server JSON plugin demo",
    "enabled": true,
    "hooks_policy": "inherit",
    "manifest": {
      "name": "server-demo-json",
      "version": "0.1.0",
      "commands": [
        {
          "namespace": "demo",
          "resource": "fs",
          "action": "list",
          "description": "List files via server plugin",
          "adapter": "shell",
          "adapterConfig": {
            "unsafe": true,
            "script": "ls -lrt",
            "parseJson": false,
            "timeout_ms": 5000
          },
          "args": []
        }
      ]
    }
  }' | jq
```

## 3) Sync and Execute JSON Plugin Command

```bash
sc sync --json | jq
sc commands --namespace demo --json | jq
sc demo fs list --json | jq
```

Expected:

- `sync` includes `server_plugins` diagnostics.
- `demo fs list` appears in commands.
- execution returns shell output in `data.raw`.

## 4) Test Enable/Disable Server Plugin

Disable:

```bash
curl -s -X PATCH "$SUPERCLI_SERVER/api/plugins/server-demo-json" \
  -H 'Content-Type: application/json' \
  -d '{"enabled": false}' | jq
```

Re-sync and verify command removal:

```bash
sc sync --json | jq
sc commands --namespace demo --json | jq
```

Re-enable:

```bash
curl -s -X PATCH "$SUPERCLI_SERVER/api/plugins/server-demo-json" \
  -H 'Content-Type: application/json' \
  -d '{"enabled": true}' | jq
sc sync --json | jq
```

## 5) Upload a ZIP Server Plugin (multipart)

Create a minimal ZIP payload:

```bash
mkdir -p /tmp/server-demo-zip
cat > /tmp/server-demo-zip/plugin.json <<'EOF'
{
  "name": "server-demo-zip",
  "version": "0.1.0",
  "commands": [
    {
      "namespace": "zipdemo",
      "resource": "tool",
      "action": "ping",
      "description": "ZIP plugin ping",
      "adapter": "shell",
      "adapterConfig": {
        "unsafe": true,
        "script": "printf ping",
        "parseJson": false,
        "timeout_ms": 3000
      },
      "args": []
    }
  ]
}
EOF
(cd /tmp/server-demo-zip && zip -r /tmp/server-demo-zip.zip .)
```

Upload as multipart form:

```bash
curl -s -X POST "$SUPERCLI_SERVER/api/plugins/upload" \
  -F "name=server-demo-zip" \
  -F "version=0.1.0" \
  -F "description=ZIP plugin demo" \
  -F "enabled=true" \
  -F "hooks_policy=inherit" \
  -F "manifest={\"name\":\"server-demo-zip\",\"version\":\"0.1.0\",\"commands\":[]}" \
  -F "archive=@/tmp/server-demo-zip.zip;type=application/zip" | jq
```

Then sync and verify:

```bash
sc sync --json | jq
sc commands --namespace zipdemo --json | jq
```

## 6) Validate Local-Over-Server Precedence

Install/create a local plugin with the same plugin name as a server plugin.
After `sc sync`, verify server plugin is shadowed:

```bash
sc sync --json | jq '.server_plugins.shadowed_by_local'
```

Expected: plugin name appears in `shadowed_by_local`, and local plugin commands remain active.

## 7) Update Server Plugin Settings

```bash
curl -s -X PUT "$SUPERCLI_SERVER/api/plugins/settings" \
  -H 'Content-Type: application/json' \
  -d '{"max_zip_mb": 10, "default_hooks_policy": "deny"}' | jq
```

## 8) Cleanup

```bash
curl -s -X DELETE "$SUPERCLI_SERVER/api/plugins/server-demo-json" | jq
curl -s -X DELETE "$SUPERCLI_SERVER/api/plugins/server-demo-zip" | jq
sc sync --json | jq
```

## Troubleshooting

- If ZIP upload fails with size errors, check `max_zip_mb` in `/api/plugins/settings`.
- If ZIP sync fails on client extraction, ensure `unzip` is installed.
- If commands do not appear after server updates, run `sc sync` again and inspect `server_plugins` diagnostics.
