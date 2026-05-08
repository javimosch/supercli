# nuclei Quickstart Guide

nuclei is a fast, modular vulnerability scanner built with Go. It uses YAML-based templates to scan for vulnerabilities across HTTP, DNS, TCP, SSL/TLS, File, Whois, WebSocket, and headless browser protocols. Powered by 12,000+ community templates.

## Installation

```bash
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
```

Or download pre-built binaries from GitHub releases.

## Basic Usage

### Scan a single URL
```bash
nuclei -u http://example.com
```

### Scan multiple URLs
```bash
nuclei -l urls.txt
```

### Scan with specific template
```bash
nuclei -u http://example.com -t cves/2024
```

### Output results as JSON
```bash
nuclei -u http://example.com -json
```

## Common Options

- `-u <URL>` - Target URL
- `-l <FILE>` - Load URLs from file
- `-t <TEMPLATE>` - Template or template directory
- `-template-ratio <RATIO>` - Filter templates by severity
- `-severity <LEVEL>` - Filter by severity: critical, high, medium, low, info
- `-json` - Output as JSON
- `-json-export <FILE>` - Export JSON to file
- `-markdown-export <FILE>` - Export Markdown report
- `-timeout <SECONDS>` - Scan timeout
- `-rate-limit <RATE>` - Requests per second
- `-concurrency <NUM>` - Parallel targets
- `-headless` - Enable headless browser templates
- `-exclude-template <TEMPLATE>` - Exclude specific templates
- `-silent` - Suppress output (show only results)

## Template Types

nuclei supports vulnerability detection across:
- **HTTP**: Web applications, APIs, misconfigurations
- **DNS**: DNS vulnerabilities, zone transfers
- **TCP**: Network services, protocols
- **SSL/TLS**: Certificate issues, weak ciphers
- **File**: Local file vulnerabilities, hardcoded secrets
- **Websocket**: WebSocket protocol vulnerabilities
- **Headless**: JavaScript-heavy applications, browser exploits

## Real-world Use Cases

### Scan website for CVEs
```bash
nuclei -u https://example.com -severity critical,high
```

### Batch scan from list
```bash
nuclei -l targets.txt -json-export results.json
```

### Scan internal network
```bash
nuclei -l internal-ips.txt -rate-limit 10 -concurrency 5
```

### Generate Markdown report
```bash
nuclei -u http://example.com -markdown-export report.md
```

### Test API endpoints
```bash
nuclei -u http://api.example.com -t http/api
```

## Understanding Results

nuclei outputs findings with:
- **Severity**: critical, high, medium, low, info
- **Name**: Vulnerability name
- **Template**: Template that detected it
- **Timestamp**: When detected
- **Matcher**: How it was detected

Example output:
```
[critical] SQL Injection (Generic)
    [http] http://example.com/search?q=test
    [cves/2024/sql-injection] Detected via matcher
```

## Performance Tips

- Use `-rate-limit` to avoid overwhelming targets
- Use `-concurrency` to scan multiple targets in parallel
- Filter templates by severity to reduce scan time
- Use `-timeout` for slow targets
- Exclude non-critical templates with `-exclude-template`

## Advanced Usage

### Custom template scanning
```bash
# Create custom template
cat > custom.yaml <<EOF
id: custom-check
info:
  name: Custom Vulnerability Check
  severity: high
requests:
  - method: GET
    path: /admin
    matchers:
      - type: word
        words: ["Dashboard"]
EOF

nuclei -u http://example.com -t custom.yaml
```

### Chaining with other tools
```bash
# Find domains and scan with nuclei
subfinder -d example.com | nuclei -json
```

### CI/CD Integration
```bash
# Fail on critical findings
nuclei -u http://example.com -severity critical && exit 1 || true
```

## Template Management

### Update templates
```bash
nuclei -update-templates
```

### List all templates
```bash
nuclei -list-templates
```

### List templates by severity
```bash
nuclei -tl -type critical
```

## Ethical Usage

- **Always get written permission** before scanning systems you don't own
- Use for authorized penetration testing only
- Respect rate limits and target resource constraints
- Follow responsible disclosure practices
- Document all findings appropriately

## Compliance & Reporting

nuclei is widely used for:
- OWASP Top 10 vulnerability scanning
- CVE assessment and verification
- Security compliance testing
- Penetration testing engagements
- Continuous vulnerability monitoring

## Resources

- [GitHub Repository](https://github.com/projectdiscovery/nuclei)
- [Official Documentation](https://nuclei.projectdiscovery.io/)
- [Community Templates](https://github.com/projectdiscovery/nuclei-templates)
- [Template Examples](https://nuclei.projectdiscovery.io/nuclei/get-started/)

## Troubleshooting

### Templates not found
Update templates:
```bash
nuclei -update-templates
```

### Timeout issues
Increase timeout:
```bash
nuclei -u http://example.com -timeout 30
```

### Too many requests
Reduce rate limit:
```bash
nuclei -u http://example.com -rate-limit 5
```
