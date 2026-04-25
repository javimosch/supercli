#!/usr/bin/env node

// Dev.to publish script
// Reads flags from command line and publishes article via API

const https = require('https');

// Parse command line flags
const flags = {};
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const flagName = arg.slice(2);
    // Check if next arg is a value (not a flag)
    if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
      const value = args[i + 1];
      // Handle boolean flags
      if (value === 'true') {
        flags[flagName] = true;
      } else if (value === 'false') {
        flags[flagName] = false;
      } else {
        flags[flagName] = value;
      }
      i++; // Skip next arg since we used it as value
    } else {
      // Flag without value (boolean true)
      flags[flagName] = true;
    }
  }
}

// Required fields
const apiKey = flags['api-key'];
const title = flags.title;
const bodyMarkdown = flags['body-markdown'];
const published = flags.published !== 'false';
const tags = flags.tags ? flags.tags.split(',').map(t => t.trim()) : [];

if (!apiKey || !title || !bodyMarkdown) {
  console.error(JSON.stringify({
    error: 'Missing required fields',
    required: ['api-key', 'title', 'body-markdown'],
    provided: Object.keys(flags)
  }));
  process.exit(1);
}

// Build request body
const requestBody = {
  article: {
    title,
    body_markdown: bodyMarkdown,
    published,
    tags: tags.slice(0, 4) // Max 4 tags
  }
};

// Make HTTP request
const postData = JSON.stringify(requestBody);

const options = {
  hostname: 'dev.to',
  port: 443,
  path: '/api/articles',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api-key': apiKey,
    'User-Agent': 'supercli-devto-publish/0.1.0',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(data);
    } else {
      console.error(JSON.stringify({
        error: `HTTP ${res.statusCode}`,
        status: res.statusCode,
        details: data
      }));
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(JSON.stringify({
    error: error.message,
    type: 'network_error'
  }));
  process.exit(1);
});

req.write(postData);
req.end();
