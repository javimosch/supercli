// Google Maps Scraper using Lightpanda + puppeteer-core
// Extracts business data from Google Maps search results
// v0.3.0 - Updated consent flow + better extraction

const SKIP_WORDS = [
  'google', 'résultats', 'filtres', 'prix', 'disponible', 'inclus',
  'changer', 'invités', 'connecter', 'cookies', 'privacy', 'terms',
  'utiliser', 'sans frais', 'précédent', 'suivant', 'plan',
  'clavier', 'fléchées', 'déplacer', 'appuyer', 'numérique',
  'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche', 'lundi', 'mardi',
  "aujourd'hui", 'demain', 'nuit', 'euro'
];

function isBusinessName(text) {
  if (!text || text.length < 3) return false;
  if (text.length > 120) return false;
  const lower = text.toLowerCase();
  for (const word of SKIP_WORDS) {
    if (lower.includes(word)) return false;
  }
  return true;
}

async function acceptConsent(page) {
  try {
    const hasConsent = await page.evaluate(() => {
      return document.body.innerText.includes("Avant d'accéder") ||
             document.body.innerText.includes('Before you continue');
    });
    if (!hasConsent) return false;

    console.log('Consent page detected, handling...');
    await new Promise(r => setTimeout(r, 2000));

    // Click "Plus d'options" / "More options"
    await page.evaluate(() => {
      for (const a of document.querySelectorAll('a')) {
        const t = a.textContent || '';
        if (t.includes("Plus d'options") || t.includes('More options')) {
          a.click(); return;
        }
      }
    });
    await new Promise(r => setTimeout(r, 2000));

    // Click "Tout refuser" / "Reject all"
    await page.evaluate(() => {
      for (const b of document.querySelectorAll('button')) {
        const t = (b.textContent || '').trim();
        if (t.includes('Tout refuser') || t.includes('Reject all')) {
          b.click(); return;
        }
      }
    });
    await new Promise(r => setTimeout(r, 4000));
    console.log('Consent handled (rejected personalization)');
    return true;
  } catch (e) {
    console.log('Consent handling error: ' + e.message);
    return false;
  }
}

async function scrapeGoogleMaps(query, limit) {
  console.log('Scraping Google Maps for: ' + query);

  const searchUrl = 'https://www.google.com/maps/search/' + query.replace(/ /g, '+');
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

  await acceptConsent(page);
  await new Promise(r => setTimeout(r, 3000));

  // Scroll to load more results
  for (let s = 0; s < 10; s++) {
    await page.mouse.wheel(0, 3000);
    await new Promise(r => setTimeout(r, 1500));
  }

  const rawListings = await page.evaluate(() => {
    const seen = new Set();
    const results = [];

    // Strategy 1: Place links with aria-label
    for (const el of document.querySelectorAll('a[href*="/maps/place/"]')) {
      const name = el.getAttribute('aria-label');
      if (name && !seen.has(name)) {
        seen.add(name);
        results.push({ method: 'place', name });
      }
    }

    // Strategy 2: aria-label divs with business-like names (all-caps or title case)
    for (const el of document.querySelectorAll('div[aria-label]')) {
      const label = el.getAttribute('aria-label') || '';
      if (!label || label.length < 3) continue;
      const firstLine = label.split('\n')[0].trim();
      if (firstLine && !seen.has(firstLine)) {
        if (/^[A-Z][A-Za-zÀ-ÿ\s'\-\d]+$/.test(firstLine) && firstLine.length > 3) {
          seen.add(firstLine);
          results.push({ method: 'aria', name: firstLine });
        }
      }
    }

    // Strategy 3: Sidebar listing cards
    for (const el of document.querySelectorAll('.Nv2PK, .THOPZb, .lI9IFe')) {
      const text = el.textContent || '';
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      const name = lines[0];
      if (name && !seen.has(name) && name.length > 3) {
        seen.add(name);
        let rating = null, reviews = null;
        for (const line of lines) {
          const rm = line.match(/^([\d.]+)\s*[★☆]/);
          if (rm) {
            rating = parseFloat(rm[1]);
            const rcm = line.match(/\((\d+)\)/);
            if (rcm) reviews = parseInt(rcm[1], 10);
          }
        }
        results.push({ method: 'card', name, rating, reviews });
      }
    }

    return results;
  });

  console.log('Found ' + rawListings.length + ' raw listings');

  const seen = new Set();
  const results = [];
  for (const item of rawListings) {
    if (results.length >= limit) break;
    if (seen.has(item.name)) continue;
    seen.add(item.name);
    if (!isBusinessName(item.name)) continue;

    results.push({
      name: item.name,
      rating: item.rating || null,
      reviews_count: item.reviews || null,
      address: '',
      website: '',
      phone: '',
      type: '',
      query: query
    });
    console.log('Extracted ' + results.length + ': ' + item.name);
  }

  return results;
}

const query = context.args.query || "restaurants in Annecy France";
const limit = context.args.limit || 20;

const results = await scrapeGoogleMaps(query, limit);
console.log('Successfully scraped ' + results.length + ' businesses');

return results;
