---
name: google-maps-scraper
description: Use this skill when the user wants to scrape business data from Google Maps including names, addresses, websites, phone numbers, ratings, and reviews.
---

# Google Maps Scraper Plugin

Scrape business data from Google Maps using Lightpanda + puppeteer-core. Extracts business names from Google Maps search results.

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
- **Robust selectors**: Uses `div[aria-label]` selector for efficiency
- **Cookie consent handling**: Automatically accepts cookies
- **Scrolling**: Automatically scrolls to load more results
- **JSON output**: Structured data for easy processing
- **Configurable limits**: Control how many results to scrape

## Data Fields

Each scraped business includes:
- `name`: Business name
- `rating`: Average rating (float, may be null)
- `reviews_count`: Number of reviews (integer, may be null)
- `address`: Street address (currently empty)
- `website`: Website URL (currently empty)
- `phone`: Phone number (currently empty)
- `type`: Business category (currently empty)

## Caveats and Limitations

### Google Maps Result Limitation
- **Headless mode limits**: Google Maps returns only 6-10 results per search in headless mode, regardless of the `--limit` parameter
- **Workaround**: Run multiple searches with different queries (e.g., "restaurants", "cafes", "bars") and combine results to reach desired count
- **Example**: To get 20+ results, search for multiple categories and merge the outputs

### Current Extraction Limitations
- **Business names only**: Currently extracts business names from `aria-label` attributes
- **Missing details**: Address, website, phone, and type fields are currently empty
- **Rating extraction**: Ratings are not reliably extracted from the current selector approach

### Selector and Filtering
- **Language sensitivity**: Filter keywords are currently hardcoded in French ("Résultats", "Filtres", "Prix", etc.)
- **UI elements**: Must filter out non-business elements like "Prix par nuit", "disponible", "inclus"
- **Selector efficiency**: Using `div[aria-label]` is critical to prevent hanging from expensive DOM traversal

### Performance and Stability
- **Timeout management**: Always wrap scraper calls with timeout (e.g., `timeout 90`) to prevent hanging
- **Scrolling effectiveness**: Scrolling may not load significantly more results due to Google Maps limitations
- **Session cleanup**: The lightpanda wrapper may take time to clean up after execution

### Best Practices for Agents
1. **Use timeout wrapper**: Always run with `timeout 90` or similar to prevent indefinite hangs
2. **Combine multiple searches**: To get 20+ results, run multiple category searches and combine
3. **Filter results**: Post-process to remove duplicates and irrelevant entries
4. **Handle language**: Adjust filter keywords based on target location language
5. **Verify results**: Check that extracted names are actual businesses, not UI elements

## Technical Details

The scraper uses the Lightpanda wrapper which provides:
- `browser`: Connected puppeteer-core browser instance
- `page`: A new page created for the run
- `puppeteer`: The imported puppeteer-core module
- `lightpanda`: The imported @lightpanda/browser module
- `context`: Metadata about the run including args (query, limit)

### Current Implementation Approach
- Uses `div[aria-label]` selector for efficient DOM traversal
- Filters out UI elements using keyword matching
- Scrolls 3 times to attempt loading more results
- Extracts text content and attempts rating parsing

### Known Issues
- Google Maps UI changes may break selectors
- Headless detection may limit result count
- Cookie consent handling may need updates
- Rating extraction is not reliable
