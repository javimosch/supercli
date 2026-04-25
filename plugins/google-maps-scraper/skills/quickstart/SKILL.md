---
name: google-maps-scraper
description: Use this skill when the user wants to scrape business data from Google Maps including names, addresses, websites, phone numbers, ratings, and reviews.
---

# Google Maps Scraper Plugin

Scrape business data from Google Maps using Lightpanda + puppeteer-core. Extracts names, addresses, websites, phone numbers, ratings, and review counts for local businesses.

## Commands

### Scraping
- `google-maps-scraper search scrape` — Scrape Google Maps for business data

## Usage Examples

```bash
# Scrape restaurants in Paris
sc google-maps-scraper search scrape --query "restaurants in Paris"

# Scrape with limit
sc google-maps-scraper search scrape --query "coffee shops in New York" --limit 20

# With verbose logging
sc google-maps-scraper search scrape --query "hotels in Tokyo" --limit 15 --verbose
```

## Installation

```bash
sc lightpanda cli setup
supercli plugins install ./plugins/google-maps-scraper --on-conflict replace --json
```

## Examples

```bash
# Basic scrape
sc google-maps-scraper search scrape --query "plumbers in Chicago"

# With more results
sc google-maps-scraper search scrape --query "dentists in London" --limit 25

# With custom timeout
sc google-maps-scraper search scrape --query "gyms in Berlin" --limit 10 --timeout-ms 90000
```

## Key Features

- **Lightweight**: Uses Lightpanda + puppeteer-core instead of heavy Playwright
- **Headless by default**: Optimized for automated agent use
- **Robust selectors**: Handles Google Maps UI changes with CSS selectors
- **Cookie consent handling**: Automatically accepts cookies
- **Scrolling**: Automatically scrolls to load more results
- **JSON output**: Structured data for easy processing
- **Configurable limits**: Control how many results to scrape

## Data Fields

Each scraped business includes:
- `name`: Business name
- `address`: Street address
- `website`: Website URL
- `phone`: Phone number
- `rating`: Average rating (float)
- `reviews_count`: Number of reviews (integer)
- `type`: Business category

## Technical Details

The scraper uses the Lightpanda wrapper which provides:
- `browser`: Connected puppeteer-core browser instance
- `page`: A new page created for the run
- `puppeteer`: The imported puppeteer-core module
- `lightpanda`: The imported @lightpanda/browser module
- `context`: Metadata about the run including args (query, limit)
