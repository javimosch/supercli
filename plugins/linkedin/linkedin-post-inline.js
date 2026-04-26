#!/usr/bin/env node

const fs = require('fs');

async function runLinkedInPost(browser, page, text, cookiesFile) {
  try {
    const cookies = JSON.parse(fs.readFileSync(cookiesFile, 'utf8'));
    await page.setCookie(...cookies);
    
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(5000);

    const startPostButton = await page.$('[data-test-id="start-post"]') || 
                            await page.$('.share-box-feed-entry__button') ||
                            await page.$('button[aria-label*="Start a post"]');

    if (!startPostButton) {
      return { success: false, error: 'Could not find start post button' };
    }

    await startPostButton.click();
    await page.waitForTimeout(3000);

    const textArea = await page.$('[contenteditable="true"]') || 
                     await page.$('.ql-editor') ||
                     await page.$('div[role="textbox"]');

    if (!textArea) {
      return { success: false, error: 'Could not find text area' };
    }

    await textArea.click();
    await page.waitForTimeout(500);
    await textArea.type(text, { delay: 30 });
    await page.waitForTimeout(2000);

    const postButton = await page.$('[data-test-id="post-submit-button"]') || 
                       await page.$('.share-actions__primary-action') ||
                       await page.$('button[type="submit"]') ||
                       await page.$('button[aria-label*="Post"]');

    if (!postButton) {
      return { success: false, error: 'Could not find post button' };
    }

    await postButton.click();
    await page.waitForTimeout(5000);

    return { success: true, message: 'Post published successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { runLinkedInPost };
