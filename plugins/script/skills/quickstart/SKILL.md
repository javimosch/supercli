# script Quickstart

script records a terminal session to a file (typescript). Use scriptreplay to replay recorded sessions.

## Basic Usage

```bash
# Record a session (interactive shell)
script

# Record to a specific file
script session.log

# Record quietly (no startup/exit messages)
script -q session.log

# Run a specific command and record its output
script -c "ls -la" output.log

# Record with timing data for replay
script --timing=timing.log session.log

# Append to an existing recording
script -a session.log

# Flush output after each write
script -f session.log
```

## Replaying Sessions

```bash
# Replay a recorded session (requires timing data)
scriptreplay --timing=timing.log session.log
```

## Common Flags

| Flag | Description |
|------|-------------|
| `-q` | Quiet mode |
| `-a` | Append to existing file |
| `-f` | Flush output after each write |
| `-c command` | Run specified command |
| `-e` | Return exit code of child |
| `--timing file` | Write timing data |
