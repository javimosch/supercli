# unlighthouse Plugin for SuperCLI

[unlighthouse](https://github.com/harlan-zw/unlighthouse) runs Google Lighthouse
across your *entire* site — it crawls routes, audits every page for performance,
accessibility, best-practices, and SEO, and produces aggregate reports.

## Installation

```bash
npm install -g @unlighthouse/cli
# one-off: npx unlighthouse-ci --site https://example.com

# Install supercli plugin
supercli plugins install ./plugins/unlighthouse
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli unlighthouse self version` | Show version |
| `supercli unlighthouse site audit` | Headless CI audit of a whole site |
| `supercli unlighthouse site dashboard` | Interactive scan + dashboard UI |
| `supercli unlighthouse <any>` | Passthrough to unlighthouse-ci CLI |

## Usage

```bash
# JSON report for CI parsing
supercli unlighthouse site audit --site https://example.com --reporter json

# Enforce budgets (exits non-zero below score)
supercli unlighthouse site audit --site https://staging.example.com --budget 80

# Static HTML report
supercli unlighthouse site audit --site https://example.com --build-static
```

Reports are written to `.unlighthouse/` (or `--output-path`).

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
