// Google Maps Scraper using Lightpanda + puppeteer-core
// Extracts business data from Google Maps search results

async function extractText(page, selector) {
  try {
    const element = await page.$(selector);
    if (element) {
      return await element.evaluate(el => el.textContent ? el.textContent.trim() : "");
    }
  } catch (e) {
    console.debug('Failed to extract text for ' + selector + ': ' + e.message);
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
  for (const key in selectors) {
    details[key] = await extractText(page, selectors[key]);
  }

  if (details.reviews) {
    const match = details.reviews.replace(/\xa0/g, "").replace(/,/g, "").match(/(\d+)/);
    details.reviews_count = match ? parseInt(match[1], 10) : null;
  } else {
    details.reviews_count = null;
  }

  if (details.rating) {
    const parsed = parseFloat(details.rating.replace(/ /g, "").replace(/,/g, "."));
    details.rating = isNaN(parsed) ? null : parsed;
  }

  return details;
}

async function extractFromListingCard(element) {
  try {
    const text = await element.evaluate(el => el.textContent || '');
    console.log('Listing text: ' + text.substring(0, 100));
    if (!text || text.trim().length === 0) {
      return null;
    }
    
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) {
      return null;
    }
    
    const name = lines[0];
    let rating = null;
    let reviews_count = null;
    
    for (var i = 1; i < lines.length; i++) {
      const line = lines[i];
      const ratingMatch = line.match(/^([\d.]+)\s*★?/);
      if (ratingMatch) {
        rating = parseFloat(ratingMatch[1]);
        const reviewsMatch = line.match(/\((\d+)\)/);
        if (reviewsMatch) {
          reviews_count = parseInt(reviewsMatch[1], 10);
        }
      }
    }
    
    return {
      name: name,
      rating: rating,
      reviews_count: reviews_count,
      address: '',
      website: '',
      phone: '',
      type: ''
    };
  } catch (e) {
    console.log('Error extracting from card: ' + e.message);
    return null;
  }
}

async function scrapeGoogleMaps(query, limit) {
  console.log('Scraping Google Maps for: ' + query);
  
  const searchUrl = 'https://www.google.com/maps/search/' + query.replace(/ /g, '+');
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

  try {
    const consentButton = await page.$('button[aria-label="Accept all"]');
    if (consentButton) {
      await consentButton.click();
      console.log('Accepted cookies');
    }
  } catch (e) {
  }

  await new Promise(function(resolve) { setTimeout(resolve, 5000); });

  for (var scroll = 0; scroll < 3; scroll++) {
    await page.mouse.wheel(0, 2000);
    await new Promise(function(resolve) { setTimeout(resolve, 2000); });
  }

  const listings = await page.evaluate(function() {
    const results = [];
    const allDivs = document.querySelectorAll('div[aria-label]');
    
    for (var i = 0; i < allDivs.length; i++) {
      const el = allDivs[i];
      const ariaLabel = el.getAttribute('aria-label') || '';
      if (ariaLabel && ariaLabel.length > 5 && ariaLabel.length < 200) {
        results.push(ariaLabel);
      }
    }
    
    return results;
  });
  
  console.log('Found ' + listings.length + ' aria-label elements');
  
  const results = [];
  
  for (var i = 0; i < listings.length; i++) {
    if (results.length >= limit) break;
    
    const text = listings[i];
    const ratingMatch = text.match(/([\d.]+)\s*$/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    
    const isBusiness = text.indexOf('Google') === -1 && 
                      text.indexOf('Résultats') === -1 && 
                      text.indexOf('Filtres') === -1 &&
                      text.indexOf('Prix') === -1 &&
                      text.indexOf('disponible') === -1 &&
                      text.indexOf('inclus') === -1 &&
                      text.indexOf('Changer') === -1 &&
                      text.indexOf('Du lundi') === -1 &&
                      text.indexOf('€') === -1 &&
                      text.length > 10;
    
    if (isBusiness) {
      results.push({
        name: text,
        rating: rating,
        reviews_count: null,
        address: '',
        website: '',
        phone: '',
        type: ''
      });
      console.log('Extracted ' + results.length + ': ' + text);
    }
  }

  return results;
}

const query = context.args.query || "restaurants in Annecy France";
const limit = context.args.limit || 20;

const results = await scrapeGoogleMaps(query, limit);
console.log('Successfully scraped ' + results.length + ' businesses');

return results;
