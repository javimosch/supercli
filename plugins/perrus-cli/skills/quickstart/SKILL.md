# perrus-cli quickstart

perrus-cli is a developer-oriented health dashboard that monitors HTTP, TCP, and DNS endpoints using configurable conditions. It is a clean-room Go reimplementation of [Gatus](https://github.com/TwiN/gatus) designed for agent-first CLI usage.

## Setup

```bash
# 1. Generate a config file
perrus-cli config-init

# 2. Edit config.yaml — add your endpoints
# 3. Validate the config
perrus-cli config-validate

# 4. Start the dashboard (foreground)
perrus-cli start

# OR as a background daemon
perrus-cli start -daemon
```

Dashboard is served at http://localhost:8080

## Config format

```yaml
endpoints:
  - name: "my-api"
    url: "https://api.example.com/health"
    interval: "30s"
    conditions:
      - "[STATUS] == 200"
      - "[RESPONSE_TIME] < 500"

  - name: "my-db"
    url: "tcp://db.example.com:5432"
    interval: "60s"
    conditions:
      - "[CONNECTED] == true"

  - name: "dns-check"
    url: "dns://example.com"
    interval: "120s"
    conditions:
      - "[CONNECTED] == true"
```

## Supported URL schemes

| Scheme | Example | Notes |
|--------|---------|-------|
| `https://` | `https://api.example.com` | HTTP/HTTPS checks |
| `http://`  | `http://localhost:8080`   | HTTP/HTTPS checks |
| `tcp://`   | `tcp://db:5432`           | TCP connect check |
| `dns://`   | `dns://example.com`       | DNS resolution    |

## Supported conditions

| Placeholder | Operators | Description |
|-------------|-----------|-------------|
| `[STATUS]`        | `==` `!=` `<` `<=` `>` `>=` | HTTP status code |
| `[RESPONSE_TIME]` | `==` `!=` `<` `<=` `>` `>=` | Response time in ms |
| `[CONNECTED]`     | `==` `!=`                    | TCP/DNS connected |
| `[BODY]`          | `==` `!=` `contains`         | Response body |

## One-shot checks (agent-friendly)

```bash
# Check a single endpoint, exit code 0=pass, 2=fail
perrus-cli check -config config.yaml my-api

# Machine-readable JSON output
perrus-cli check -config config.yaml -json my-api

# Check all endpoints and print results
perrus-cli results -config config.yaml -format json
```

## Daemon management

```bash
perrus-cli start -daemon              # start background daemon
perrus-cli status                     # check if running
perrus-cli stop                       # stop daemon
```

Logs: `/tmp/perrus-cli.log`

## API endpoints (when server is running)

| Endpoint | Description |
|----------|-------------|
| `GET /` | Web dashboard |
| `GET /api/v1/endpoints/statuses` | All endpoint statuses (JSON) |
| `GET /api/v1/endpoints/{name}/statuses` | Single endpoint status |
| `GET /api/v1/health` | Health check |
