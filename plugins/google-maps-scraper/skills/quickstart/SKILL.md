---
name: google-maps-scraper
description: |
  Scrape business data from Google Maps using Lightpanda (lightweight headless browser).
  Extracts business names from any search query. ~120 MB one-time binary download.
  Use when user wants to find businesses, hostels, restaurants, hotels, services in a city.
---

# Google Maps Scraper

Scrape Google Maps for business listings. Works **locally** via Lightpanda (puppeteer-core, not full Puppeteer — much lighter).

## Requirements

**One-time setup** (~140 MB total):
```bash
# Install Lightpanda runtime (binary + deps)
sc lightpanda cli setup

# If that doesn't download the binary, run directly:
cd /home/jarancibia/.supercli/plugins/bundled/lightpanda/node_modules/@lightpanda/browser
node dist/scripts/postinstall.js
```

## Usage

### Via Node.js (recommended — the `sc` adapter is broken locally)

```bash
cd ~/ai/supercli/plugins/google-maps-scraper
node run.js "hostels in Lyon France" 20
node run.js "restaurants in Paris" 15
node run.js "coworking space Bordeaux" 10
```

**Arguments:** `<query>` `[limit]` `[timeout-ms]` `[verbose]`

### Via supercli (when the builtin adapter is fixed)

```bash
sc google-maps-scraper search scrape --query "hostels in Lyon France" --limit 20
```

## What It Returns

Each result is a JSON object:
```json
{
  "name": "The People Lyon",
  "rating": null,
  "reviews_count": null,
  "address": "",
  "website": "",
  "phone": "",
  "type": "",
  "query": "hostels in Lyon France"
}
```

Currently extracts **business names only**. Rating/reviews/address extraction needs the detail-page click-through (not implemented yet).

## Consent Handling

The scraper auto-handles Google's updated consent wall:
1. Detects `"Avant d'accéder"` or `"Before you continue"` page
2. Clicks **"Plus d'options"** → **"Tout refuser"** (bypasses personalization gate)
3. Redirects to the actual search results

## Extraction Strategy (3 methods)

| Strategy | Selector | Purpose |
|----------|----------|---------|
| Place links | `a[href*="/maps/place/"]` | Primary — most reliable |
| aria-label | `div[aria-label]` | Fallback — catches cards without links |
| Sidebar cards | `.Nv2PK, .THOPZb, .lI9IFe` | Secondary — gets ratings when available |

Filters out UI noise: dates, prices, filter chips, consent text, navigation labels.

## Examples

```bash
# Hotels
node run.js "hotels in Nice France" 20

# Specific types
node run.js "vegan restaurants Lyon" 15

# Services
node run.js "plumbers in Annecy" 10

# Coworking
node run.js "coworking space Geneva Switzerland" 15

# With longer timeout for slow connections
node run.js "digital agencies in Paris" 30 180000
```

## Caveats

- **Headless mode limit**: Google returns ~6-15 results per search regardless of `--limit`. Combine multiple queries (different phrasings) for more coverage.
- **~27s per query**: Includes consent handling, scrolling, and extraction.
- **Ratings/details**: Currently null — would need to click each result and extract from detail panels.
- **Google UI changes**: Selectors may break if Google updates Maps. Check the extraction scripts periodically.

## Architecture

```
scraper.js         ← Lightpanda version (supercli plugin, this skill)
run.js             ← Wrapper that injects query/limit into scraper.js
improved-scraper.js← Standalone Puppeteer (French biz focused, keyword filter)
standalone-scraper.js← Standalone Puppeteer (coworking focused)
scrape.js           ← Standalone Puppeteer (generic, no filter)
cron-scrape.py      ← Python batch orchestrator for multi-city scraping
cron-run.sh         ← Shell wrapper for batch scraping
```

The standalone scrapers (`improved-scraper.js`, `standalone-scraper.js`, `scrape.js`) use **full Puppeteer** instead of Lightpanda — more capable but **~200 MB heavier**. Only use if Lightpanda can't handle your use case.
