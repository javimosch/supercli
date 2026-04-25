// Google Maps Scraper using Lightpanda + puppeteer-core
// Extracts business data from Google Maps search results

async function extractText(page, selector) {
  try {
    const element = await page.$(selector);
    if (element) {
      return await element.evaluate(el => el.textContent?.trim() || "");
    }
  } catch (e) {
    console.debug(`Failed to extract text for ${selector}: ${e.message}`);
  }
  return "";
}

async function extractPlaceDetails(page) {
  const selectors = {
    name: 'h1[class*="DUwDvf"]',
    address: 'button[data-item-id="address"] div[class*="fontBodyMedium"]',
    website: 'a[data-item-id="authority"] div[class*="fontBodyMedium"]',
    phone: 'button[data-item-id*="phone:tel:"] div[class*="fontBodyMedium"]',
    rating: 'div[class*="F7nice"] span[aria-hidden="true"]',
    reviews: 'div[class*="F7nice"] span[aria-label*="reviews"]',
    type: 'button[class*="DkEaL"]'
  };

  const details = {};
  for (const [key, selector] of Object.entries(selectors)) {
    details[key] = await extractText(page, selector);
  }

  // Parse reviews count
  if (details.reviews) {
    const match = details.reviews.replace(/\xa0/g, "").replace(/,/g, "").match(/(\d+)/);
    details.reviews_count = match ? parseInt(match[1], 10) : null;
  } else {
    details.reviews_count = null;
  }

  // Parse rating
  if (details.rating) {
    const parsed = parseFloat(details.rating.replace(/ /g, "").replace(/,/g, "."));
    details.rating = isNaN(parsed) ? null : parsed;
  }

  return details;
}

async function scrapeGoogleMaps(query, limit = 10) {
  console.log(`Scraping Google Maps for: ${query}`);
  
  const searchUrl = `https://www.google.com/maps/search/${query.replace(/ /g, "+")}`;
  await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Handle cookie consent
  try {
    const consentButton = await page.$('button[aria-label="Accept all"], button:has-text("Accept all")');
    if (consentButton) {
      await consentButton.click();
      console.log("Accepted cookies");
    }
  } catch (e) {
    // Cookie consent might not be present
  }

  // Check for single result page
  const singleResult = await page.$('h1[class*="DUwDvf"]');
  if (singleResult) {
    console.log("Found single result page");
    return [await extractPlaceDetails(page)];
  }

  // Wait for listings
  await page.waitForSelector('a[href*="https://www.google.com/maps/place"]', { timeout: 10000 });

  // Scroll to load more results
  let scrollAttempts = 0;
  while (scrollAttempts < 5) {
    const scrollable = await page.$('div[role="feed"], div[aria-label*="Results for"]');
    if (scrollable) {
      await page.evaluate(el => el.scrollTop += 5000, scrollable);
    } else {
      await page.mouse.wheel(0, 5000);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const count = await page.$$eval('a[href*="https://www.google.com/maps/place"]", els => els.length);
    if (count >= limit) break;
    scrollAttempts++;
  }

  // Get all listings
  const listings = await page.$$('a[href*="https://www.google.com/maps/place"]');
  const results = [];
  const maxListings = Math.min(listings.length, limit);
  
  console.log(`Found ${listings.length} listings, scraping ${maxListings}`);

  for (let i = 0; i < maxListings; i++) {
    try {
      await listings[i].click();
      await page.waitForSelector('h1[class*="DUwDvf"]', { timeout: 5000 });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const details = await extractPlaceDetails(page);
      if (details.name) {
        results.push(details);
        console.log(`Extracted ${i + 1}/${maxListings}: ${details.name}`);
      }
    } catch (e) {
      console.warn(`Failed to extract listing ${i + 1}: ${e.message}`);
    }
  }

  return results;
}

// Main execution
const query = context.args.query;
const limit = context.args.limit || 10;

if (!query) {
  throw new Error("Query is required");
}

const results = await scrapeGoogleMaps(query, limit);
console.log(`Successfully scraped ${results.length} businesses`);

return results;
