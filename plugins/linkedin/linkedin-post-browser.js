#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function runLinkedInPost(browser, page, text, cookies = null) {
  try {
    // Set cookies if provided
    if (cookies && Array.isArray(cookies)) {
      await page.setCookie(...cookies);
    }

    // Navigate to LinkedIn
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'networkidle2' });

    // Wait for page to load
    await page.waitForTimeout(5000);

    // Try to find the start post button (LinkedIn uses various selectors)
    const startPostButton = await page.$('[data-test-id="start-post"]') || 
                            await page.$('.share-box-feed-entry__button') ||
                            await page.$('button[aria-label*="Start a post"]');

    if (!startPostButton) {
      return { success: false, error: 'Could not find start post button - may not be logged in' };
    }

    // Click the start post button
    await startPostButton.click();

    // Wait for the post editor to appear
    await page.waitForTimeout(3000);

    // Find the text area (LinkedIn uses various selectors)
    const textArea = await page.$('[contenteditable="true"]') || 
                     await page.$('.ql-editor') ||
                     await page.$('div[role="textbox"]');

    if (!textArea) {
      return { success: false, error: 'Could not find text area' };
    }

    // Click and type the post
    await textArea.click();
    await page.waitForTimeout(500);
    await textArea.type(text, { delay: 30 });

    // Wait for the post button to become enabled
    await page.waitForTimeout(2000);

    // Find and click the post button (LinkedIn uses various selectors)
    const postButton = await page.$('[data-test-id="post-submit-button"]') || 
                       await page.$('.share-actions__primary-action') ||
                       await page.$('button[type="submit"]') ||
                       await page.$('button[aria-label*="Post"]');

    if (!postButton) {
      return { success: false, error: 'Could not find post button' };
    }

    await postButton.click();

    // Wait for post to submit
    await page.waitForTimeout(5000);

    return { success: true, message: 'Post published successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Export for lightpanda wrapper
module.exports = { runLinkedInPost };
