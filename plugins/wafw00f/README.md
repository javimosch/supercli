# wafw00f Plugin for SuperCLI

[wafw00f](https://github.com/EnableSecurity/wafw00f) fingerprints the Web
Application Firewall in front of a web application by matching probe responses
against 200+ WAF signatures — Cloudflare, Akamai, AWS/Azure WAF, F5, ModSecurity,
FortiWeb, and more.

## Installation

```bash
# Install wafw00f binary (pick one)
pipx install wafw00f
# or: pip install wafw00f
# or: apt install wafw00f  (Kali/Debian)

# Install supercli plugin
supercli plugins install ./plugins/wafw00f
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli wafw00f self version` | Show wafw00f version |
| `supercli wafw00f detect run <url>` | Fingerprint the WAF on a target |
| `supercli wafw00f wafs list` | List detectable WAFs |
| `supercli wafw00f <any>` | Passthrough to wafw00f CLI |

## Usage

```bash
supercli wafw00f detect run https://target.com
supercli wafw00f detect run https://target.com -a -f json -o out.json
supercli wafw00f wafs list
```

Only probe targets you are authorized to test.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
