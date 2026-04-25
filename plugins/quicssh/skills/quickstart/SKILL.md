# quicssh - SSH over QUIC

## Overview
quicssh provides SSH over QUIC protocol. Faster and more reliable SSH connections using QUIC transport.

## Quick Start

### Passthrough to quicssh CLI
```bash
sc quicssh _ <quicssh-args>
```

## Key Features

- **QUIC Protocol**: SSH over QUIC for faster connections
- **Improved Reliability**: Better network performance
- **Client/Server**: Both client and server modes
- **SSH Compatible**: Drop-in replacement for SSH

## Installation

```bash
go install github.com/moul/quicssh/cmd/quicssh@latest
```

## Usage Examples

### Connect to server
```bash
quicssh user@host
```

### Server mode
```bash
quicssh server
```

### Custom port
```bash
quicssh user@host --port 443
```

### With key
```bash
quicssh user@host --key ~/.ssh/id_rsa
```

## Notes

- Run `quicssh --help` to see all available options
- QUIC provides better performance over unreliable networks
- Can be used as a drop-in replacement for SSH
