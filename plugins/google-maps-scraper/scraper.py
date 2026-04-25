#!/usr/bin/env python3
"""
Google Maps Scraper - CLI tool for scraping business data from Google Maps
"""

import argparse
import json
import logging
import re
import sys
import time
from typing import List, Dict, Any, Optional

from playwright.sync_api import sync_playwright, Page


def setup_logging(verbose: bool = False):
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(levelname)s - %(message)s',
    )


def extract_text(page: Page, xpath: str) -> str:
    """Extract text from page using XPath selector."""
    try:
        locator = page.locator(xpath)
        if locator.count() > 0:
            return locator.first.inner_text().strip()
    except Exception as e:
        logging.debug(f"Failed to extract text for xpath {xpath}: {e}")
    return ""


def extract_place_details(page: Page) -> Dict[str, Any]:
    """Extract place details from Google Maps page."""
    selectors = {
        "name": '//h1[contains(@class, "DUwDvf")]',
        "address": '//button[@data-item-id="address"]//div[contains(@class, "fontBodyMedium")]',
        "website": '//a[@data-item-id="authority"]//div[contains(@class, "fontBodyMedium")]',
        "phone": '//button[contains(@data-item-id, "phone:tel:")]//div[contains(@class, "fontBodyMedium")]',
        "rating": '//div[contains(@class, "F7nice")]//span[@aria-hidden="true"]',
        "reviews": '//div[contains(@class, "F7nice")]//span[contains(@aria-label, "reviews")]',
        "type": '//button[contains(@class, "DkEaL")]'
    }
    
    details = {}
    for key, xpath in selectors.items():
        details[key] = extract_text(page, xpath)
    
    # Parse reviews count
    if details["reviews"]:
        match = re.search(r'(\d+)', details["reviews"].replace('\xa0', '').replace(',', ''))
        if match:
            details["reviews_count"] = int(match.group(1))
        else:
            details["reviews_count"] = None
    else:
        details["reviews_count"] = None
    
    # Parse rating
    if details["rating"]:
        try:
            details["rating"] = float(details["rating"].replace(' ', '').replace(',', '.'))
        except ValueError:
            details["rating"] = None
    
    return details


def scrape_google_maps(query: str, limit: int = 10, headless: bool = True) -> List[Dict[str, Any]]:
    """Scrape Google Maps for business data."""
    results = []
    logging.info(f"Scraping Google Maps for: {query}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        
        try:
            search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
            page.goto(search_url, timeout=60000)
            
            # Handle cookie consent
            try:
                consent = page.locator('//button[@aria-label="Accept all"] | //button[contains(., "Accept all")]').first
                if consent.is_visible(timeout=5000):
                    consent.click()
                    logging.info("Accepted cookies")
            except:
                pass

            # Check for single result page
            if page.locator('//h1[contains(@class, "DUwDvf")]').is_visible(timeout=5000):
                logging.info("Found single result page")
                results.append(extract_place_details(page))
                return results

            # Handle list of results
            listing_selector = '//a[contains(@href, "https://www.google.com/maps/place")]'
            try:
                page.wait_for_selector(listing_selector, timeout=10000)
            except:
                logging.warning("No listings found")
                return results

            # Scroll to load more results
            scroll_attempts = 0
            while page.locator(listing_selector).count() < limit and scroll_attempts < 5:
                scrollable = page.locator('div[role="feed"], div[aria-label*="Results for"]')
                if scrollable.count() > 0:
                    scrollable.first.evaluate("el => el.scrollTop += 5000")
                else:
                    page.mouse.wheel(0, 5000)
                time.sleep(2)
                scroll_attempts += 1

            listings = page.locator(listing_selector).all()[:limit]
            logging.info(f"Found {len(listings)} listings")
            
            for idx, listing in enumerate(listings):
                try:
                    listing.click()
                    page.wait_for_selector('//h1[contains(@class, "DUwDvf")]', timeout=5000)
                    time.sleep(0.5)
                    details = extract_place_details(page)
                    if details["name"]:
                        results.append(details)
                        logging.info(f"Extracted {idx+1}/{len(listings)}: {details['name']}")
                except Exception as e:
                    logging.warning(f"Failed to extract listing {idx+1}: {e}")
                    
        finally:
            browser.close()
    
    return results


def main():
    parser = argparse.ArgumentParser(description="Scrape business data from Google Maps")
    parser.add_argument("query", help="Search query for Google Maps")
    parser.add_argument("-l", "--limit", type=int, default=10, help="Maximum number of results (default: 10)")
    parser.add_argument("-o", "--output", help="Output JSON file path")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose logging")
    parser.add_argument("--no-headless", action="store_false", dest="headless", help="Run browser in visible mode")
    
    args = parser.parse_args()
    setup_logging(args.verbose)
    
    try:
        results = scrape_google_maps(args.query, args.limit, args.headless)
        
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(results, f, indent=2)
            logging.info(f"Saved {len(results)} results to {args.output}")
        else:
            print(json.dumps(results, indent=2))
        
        logging.info(f"Successfully scraped {len(results)} businesses")
        sys.exit(0)
    except Exception as e:
        logging.error(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
