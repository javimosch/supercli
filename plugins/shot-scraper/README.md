# shot-scraper Plugin for SuperCLI

[shot-scraper](https://github.com/simonw/shot-scraper) — shot-scraper (Simon Willison) drives headless Chromium via Playwright to take full-page or element screenshots, run JavaScript against a page, capture HTML, accessibility snapshots, and PDFs - scriptable for CI pipelines and scheduled captures.

## Installation

```bash
pipx install shot-scraper
shot-scraper install

# Install supercli plugin
supercli plugins install ./plugins/shot-scraper
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli shot-scraper self version` | Show shot-scraper version |
| `supercli shot-scraper page shot` | Screenshot a URL |
| `supercli shot-scraper page pdf` | Save a page as PDF |
| `supercli shot-scraper page html` | Dump rendered HTML |
| `supercli shot-scraper page javascript` | Evaluate JS on a page |
| `supercli shot-scraper <any>` | Passthrough to shot-scraper CLI |

## Usage

```bash
shot-scraper https://example.com -o page.png --full-page
```

## Notes

Requires the one-time `shot-scraper install` browser download. `shot-scraper multi shots.yml` runs a YAML batch of captures.
