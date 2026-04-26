const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const query = process.argv[2];
const limit = process.argv[3] || '20';
const timeout = process.argv[4] || '180000';
const verbose = process.argv[4] === 'true' ? '--verbose' : '';

if (!query) {
  console.error('Usage: node run.js "<query>" [limit] [timeout-ms] [verbose]');
  process.exit(1);
}

// Read the scraper script
const scraperScript = fs.readFileSync(path.join(__dirname, 'scraper.js'), 'utf8');

// Inject query and limit into the script
const modifiedScript = scraperScript.replace(
  /const query = context\.args\.query \|\| "restaurants in Annecy France";/,
  `const query = "${query}";`
).replace(
  /const limit = context\.args\.limit \|\| 20;/,
  `const limit = ${limit};`
);

// Write to a temp file
const tempFile = path.join(__dirname, 'temp-scraper.js');
fs.writeFileSync(tempFile, modifiedScript);

// Run lightpanda wrapper
const args = [
  'plugins/lightpanda/scripts/lightpanda-wrapper.js',
  'run',
  '--file',
  tempFile,
  '--timeout-ms',
  timeout
];

if (verbose) {
  args.push('--verbose');
}

const proc = spawn('node', args, {
  cwd: path.join(__dirname, '../..'),
  stdio: 'inherit'
});

proc.on('exit', (code) => {
  // Clean up temp file
  try {
    fs.unlinkSync(tempFile);
  } catch (e) {
    // Ignore
  }
  process.exit(code || 0);
});
