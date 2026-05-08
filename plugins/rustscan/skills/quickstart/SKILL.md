# RustScan Quickstart Guide

RustScan is an ultra-fast port scanner written in Rust. It can scan all 65,000 ports in approximately 3 seconds, making it one of the fastest port scanners available. It's designed for network security professionals, penetration testers, and system administrators.

## Installation

```bash
cargo install rustscan
```

Or via Homebrew:
```bash
brew install rustscan
```

## Basic Usage

### Scan all ports on a single host
```bash
rustscan -a 192.168.1.1
```

### Scan specific ports
```bash
rustscan -p 80,443,8080 192.168.1.1
```

### Scan port range
```bash
rustscan -p 1-1000 192.168.1.1
```

### Scan with hostname
```bash
rustscan -a example.com
```

## Common Options

- `-a <TARGET>` - Target IP address, hostname, or CIDR range
- `-p <PORTS>` - Ports or port ranges to scan (default: top 1000)
- `-r <RATE>` - Socket timeout in seconds (default: 5)
- `-t <THREADS>` - Number of parallel connections (default: auto)
- `--top` - Scan top N common ports
- `-s` - Scan slower but more reliable
- `--script <SCRIPT>` - Execute custom scripts after scan (nmap-safe, etc.)
- `-l <FILE>` - Load list of hosts from file
- `-x <FILE>` - Exclude IP addresses from file

## Advanced Usage

### Scan entire subnet
```bash
rustscan -a 192.168.0.0/24
```

### Scan from file with hostnames
```bash
rustscan -l targets.txt
```

### Integrate with Nmap for detailed analysis
```bash
rustscan -a 192.168.1.1 -- -A
```

### Exclude specific hosts
```bash
rustscan -a 192.168.0.0/24 -x excluded.txt
```

### Scan only top 100 ports
```bash
rustscan --top 100 192.168.1.1
```

## Performance Tips

- RustScan is fast by default; increase `-t` (threads) for even faster scanning
- Use `-s` (slower mode) for more reliable results on unstable networks
- Scan top ports first (`--top 1000`) then expand range as needed
- Batch multiple targets for better efficiency

## Output Examples

```bash
# Basic output
rustscan -a 192.168.1.1 -p 80,443

# JSON output
rustscan -a 192.168.1.1 -p 80,443 --format json

# Scan with service detection (via Nmap script)
rustscan -a 192.168.1.1 --script nmap-safe
```

## Real-world Use Cases

### Quick vulnerability scan on internal network
```bash
rustscan -a 192.168.0.0/24 -p 80,443,3306,5432,6379
```

### Penetration testing - scan all ports
```bash
rustscan -a target.com -p 1-65535
```

### Monitor for unexpected open ports
```bash
rustscan -a 10.0.0.5 -p 1-10000 > baseline.txt
# Compare later
rustscan -a 10.0.0.5 -p 1-10000 > current.txt
diff baseline.txt current.txt
```

### CI/CD pipeline security check
```bash
#!/bin/bash
rustscan -a localhost -p 1-65535 | grep -q "OPEN" && echo "Unexpected ports found!" && exit 1
```

## Comparison to Nmap

| Aspect | RustScan | Nmap |
|--------|----------|------|
| Speed | Ultra-fast (3s for all ports) | Slower (detailed analysis) |
| Use Case | Port discovery | Deep protocol analysis |
| Scripting | Limited (Lua, Python, Shell) | Extensive NSE scripts |
| Learning Curve | Easy | Steeper |

## Integration with Other Tools

### Pipe to Nmap for service detection
```bash
rustscan -a target.com -- -sV -sC
```

### Chain with other security tools
```bash
rustscan -a target.com -p 80 | xargs -I {} curl http://{}
```

## Ethical Considerations

- **Always get permission** before scanning networks you don't own
- Unauthorized network scanning may be illegal in your jurisdiction
- Use RustScan responsibly for:
  - Your own infrastructure
  - Authorized penetration testing engagements
  - Security research with permission
  - Network administration and monitoring

## Resources

- [GitHub Repository](https://github.com/RustScan/RustScan)
- [Official Documentation](https://github.com/RustScan/RustScan/wiki)
- [GitHub Issues & Feature Requests](https://github.com/RustScan/RustScan/issues)

## Troubleshooting

### "Permission denied" error
RustScan requires elevated privileges for some operations. Use `sudo` if needed:
```bash
sudo rustscan -a 192.168.1.1
```

### Timeout issues
Increase socket timeout:
```bash
rustscan -a target.com -r 10
```

### Too many connections
Reduce thread count:
```bash
rustscan -a target.com -t 100
```
