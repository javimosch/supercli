---
name: ferret
description: Use this skill when the user wants to scrape web pages, extract data from websites, or perform web crawling tasks.
---

# ferret Plugin

Declarative web scraping tool. Extract data from websites using a query language. Supports scraping, crawling, and data extraction from web pages.

## Commands

### Web Scraping
- `ferret web scrape` — Scrape data from websites

### Utility
- `ferret _ _` — Passthrough to ferret CLI

## Usage Examples
- "Scrape this website"
- "Extract data from web page"
- "Crawl and scrape multiple pages"
- "Query web page data"

## Installation

```bash
brew install ferret
```

Or via Go:
```bash
go install github.com/MontFerret/ferret/cmd/ferret@latest
```

## Examples

```bash
# Scrape with FQL script
ferret web scrape script.fql

# Output to file
ferret web scrape script.fql --output results.json

# CSV output format
ferret web scrape script.fql --format csv

# Headless mode
ferret web scrape script.fql --headless

# Set timeout
ferret web scrape script.fql --timeout 30

# Any ferret command with passthrough
ferret _ _ script.fql --output data.json
ferret _ _ --headless script.fql
```

## Key Features
- **Declarative** - FQL query language
- **Dynamic content** - Headless Chrome support
- **Crawling** - Multi-page crawling
- **Data extraction** - Structured data output
- **JSON/CSV** - Multiple output formats
- **JavaScript** - Execute JavaScript on pages
- **Cross-platform** - Linux, macOS, Windows
- **Fast** - Efficient scraping
- **Flexible** - Custom queries
- **Extensible** - Plugin system

## Notes
- Uses FQL (Ferret Query Language)
- Supports JavaScript execution
- Can handle dynamic content
- Perfect for data extraction
- Works with single pages and crawling
