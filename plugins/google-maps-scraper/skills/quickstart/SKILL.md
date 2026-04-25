---
name: google-maps-scraper
description: Use this skill when the user wants to scrape business data from Google Maps including names, addresses, websites, phone numbers, ratings, and reviews.
---

# Google Maps Scraper Plugin

Scrape business data from Google Maps using Playwright. Extracts names, addresses, websites, phone numbers, ratings, and review counts for local businesses.

## Commands

### Scraping
- `google-maps-scraper search scrape <query>` — Scrape Google Maps for business data
- `google-maps-scraper _ _` — Passthrough to the Python scraper CLI

## Usage Examples

```bash
# Scrape restaurants in Paris
sc google-maps-scraper search scrape "restaurants in Paris"

# Scrape with limit
sc google-maps-scraper search scrape "coffee shops in New York" --limit 20

# Direct Python usage with output file
python3 plugins/google-maps-scraper/scraper.py "hotels in Tokyo" -l 15 -o results.json
```

## Installation

```bash
pip install playwright pandas
playwright install chromium
supercli plugins install ./plugins/google-maps-scraper --on-conflict replace --json
```

## Examples

```bash
# Basic scrape
sc google-maps-scraper search scrape "plumbers in Chicago"

# With more results
sc google-maps-scraper search scrape "dentists in London" --limit 25

# Direct CLI with verbose output
python3 plugins/google-maps-scraper/scraper.py "gyms in Berlin" -l 10 -v --no-headless
```

## Key Features

- **Headless by default**: Optimized for automated agent use
- **Robust selectors**: Handles Google Maps UI changes with XPath selectors
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
