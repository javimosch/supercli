# nc (Netcat) Quickstart

Netcat is a versatile networking utility for reading from and writing to TCP/UDP connections.

## Commands
- `nc <resource> <action>` — Execute nc commands
- `nc self version` — Show nc help/version info
- `nc tcp connect` — Connect to TCP port
- `nc tcp listen` — Listen on TCP port
- `nc tcp scan` — Scan TCP ports on a host
- `nc file transfer` — Transfer a file over TCP
- `nc _ _` — Passthrough to nc CLI

## Common Operations

```bash
# Connect to a TCP port
nc hostname port

# Listen on a TCP port
nc -l -p port

# Scan ports
nc -zv hostname port-range

# Transfer a file (receiver)
nc -l -p port > file

# Transfer a file (sender)
nc hostname port < file

# UDP connection
nc -u hostname port
```
