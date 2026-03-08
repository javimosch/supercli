# Docker Plugin

The Docker plugin adds a focused Docker harness to dcli with a guarded non-TTY safety policy for interactive operations.

## Install

```bash
dcli plugins install docker --json
```

## Explore

```bash
dcli plugins explore --name docker --json
dcli plugins show docker --json
dcli plugins doctor docker --json
```

## Common commands

```bash
dcli docker container ls --json
dcli docker container run --image nginx --detach --publish 8080:80 --name demo --json
dcli docker container logs --container demo --tail 100 --json
dcli docker image build --context . --tag myapp:latest --json
dcli docker system version --json
```

## Safety

- Interactive flags are blocked in non-TTY contexts for guarded commands (`run`, `exec`).
- Guarded flags: `-i`, `-t`, `--interactive`, `--tty`.
- Rejected requests return `code: 91` and `type: safety_violation`.

Reserved interactive-only operations (`attach`, `login`) are intentionally excluded from this MVP manifest and should run directly in a local interactive terminal.
