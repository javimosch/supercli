# AWL Plugin Quickstart

## Overview

AWL (a pointed tool for making small holes) is a command-line DNS lookup tool that supports DNS queries over UDP, TCP, TLS, HTTPS, DNSCrypt, and QUIC. It's designed as a drop-in replacement for dig with modern protocol support and JSON output. The supercli awl plugin provides convenient commands for DNS lookups with structured JSON output.

## Installation

The awl binary must be installed on your system:

```bash
# Via Go
go install dns.froth.zone/awl@latest

# Via Homebrew
brew install SamTherapy/tap/awl

# Via Alpine Linux
apk add awl-dns

# Via Arch Linux (AUR)
yay -S awl-dns-git

# Via Debian/Ubuntu
apt install awl-dns
```

## Available Commands

### Basic DNS Lookup

```bash
sc awl lookup example.com
```

Performs a standard DNS lookup and returns results in JSON format.

### Record Type Specific Lookups

```bash
# A records (IPv4 addresses)
sc awl lookup-a example.com

# AAAA records (IPv6 addresses)
sc awl lookup-aaaa example.com

# MX records (mail servers)
sc awl lookup-mx example.com

# TXT records (text records)
sc awl lookup-txt example.com

# NS records (name servers)
sc awl lookup-ns example.com
```

### Modern DNS Protocols

```bash
# DNS over HTTPS (DoH)
sc awl lookup-https example.com

# DNS over TLS (DoT)
sc awl lookup-tls example.com

# DNS over QUIC (DoQ)
sc awl lookup-quic example.com

# DNSCrypt
sc awl lookup-dnscrypt example.com
```

## Protocol Support

AWL supports the following DNS protocols:
- **UDP**: Traditional DNS over UDP
- **TCP**: DNS over TCP
- **TLS**: DNS over TLS (DoT)
- **HTTPS**: DNS over HTTPS (DoH)
- **DNSCrypt**: Encrypted DNS protocol
- **QUIC**: DNS over QUIC (DoQ)

## Output Format

All commands return structured JSON output, making it easy to parse and process in scripts:

```json
{
  "response": {
    "answers": [
      {
        "name": "example.com",
        "type": "A",
        "class": "IN",
        "ttl": 300,
        "address": "93.184.216.34"
      }
    ]
  }
}
```

## Use Cases

- **Network diagnostics**: Check DNS resolution across different protocols
- **Security testing**: Verify encrypted DNS (DoT/DoH) functionality
- **Performance testing**: Compare DNS resolution times across protocols
- **Monitoring scripts**: Integrate DNS health checks with JSON parsing
- **Privacy**: Use encrypted DNS protocols to avoid DNS surveillance

## Caveats & Pitfalls

- **Protocol availability**: Not all DNS servers support modern protocols (DoH/DoT/DoQ)
- **Network requirements**: Encrypted protocols require specific server configurations
- **JSON parsing**: Output is always JSON; ensure your tools can parse JSON
- **Server compatibility**: Some DNS servers may not support all query types

## Examples

### Check domain resolution with DoH

```bash
sc awl lookup-https example.com
```

### Verify DNS over TLS

```bash
sc awl lookup-tls example.com
```

### Compare protocols

```bash
sc awl lookup example.com      # UDP
sc awl lookup-https example.com # DoH
sc awl lookup-tls example.com    # DoT
```

### Query specific record type with DoH

```bash
sc awl lookup-a example.com
# Then manually add +https flag if needed
```

### Test DNSCrypt

```bash
sc awl lookup-dnscrypt example.com
```

### Use QUIC for DNS

```bash
sc awl lookup-quic example.com
```

## Advantages Over Traditional Tools

- **Modern protocols**: Supports DoH, DoT, DoQ, and DNSCrypt
- **JSON output**: Structured output for programmatic use
- **Drop-in replacement**: Similar interface to dig
- **Cross-platform**: Written in Go for consistent behavior
- **Privacy-focused**: Encrypted DNS protocol support

## Common Patterns

### Verify encrypted DNS is working

```bash
sc awl lookup-https example.com | sc gojq query '.response.answers[].address'
```

### Compare DNS resolution across protocols

```bash
for protocol in udp https tls quic; do
  echo "Testing $protocol:"
  sc awl lookup example.com +$protocol +json
done
```

### Monitor DNS health

```bash
watch -n 60 'sc awl lookup example.com +json | sc gojq query ".response.answers[0]"'
```

### Debug DNS resolution issues

```bash
sc awl lookup example.com +https +json | sc gojq query '.response'
```