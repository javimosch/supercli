# nc (Netcat) Quickstart

Netcat is a versatile networking utility for reading from and writing to TCP/UDP connections.

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
