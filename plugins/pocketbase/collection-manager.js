#!/usr/bin/env node

const http = require('http');

// Get command from first argument (from supercli)
const command = process.argv[2];
// Get additional arguments
const args = process.argv.slice(3);

const email = process.env.POCKETBASE_EMAIL || 'admin@example.com';
const password = process.env.POCKETBASE_PASSWORD || 'password123';
const url = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;
const MAX_DELAY = 10000;
const BACKOFF_MULTIPLIER = 2;

function isRetryableError(error) {
  const retryablePatterns = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'socket hang up',
    'connect ECONNREFUSED'
  ];
  
  return retryablePatterns.some(pattern => 
    error.message && error.message.includes(pattern)
  );
}

async function withRetry(fn, options = {}) {
  const {
    maxRetries = MAX_RETRIES,
    initialDelay = INITIAL_DELAY,
    maxDelay = MAX_DELAY,
    backoffMultiplier = BACKOFF_MULTIPLIER
  } = options;
  
  let lastError;
  let delay = initialDelay;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Check if error is retryable
      if (!isRetryableError(error)) {
        throw error;
      }
      
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }
  
  throw lastError;
}

function authenticate(callback) {
  return withRetry(() => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ identity: email, password });
      const authReq = http.request(`${url}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }, (authRes) => {
        let body = '';
        authRes.on('data', chunk => body += chunk);
        authRes.on('end', () => {
          try {
            const auth = JSON.parse(body);
            resolve(auth.token);
          } catch (e) {
            reject(new Error('Authentication failed: ' + body));
          }
        });
      });
      
      authReq.on('error', reject);
      authReq.write(data);
      authReq.end();
    });
  }).then(token => {
    return callback(token);
  }).catch(error => {
    console.error('Auth request error:', error.message);
    process.exit(1);
  });
}

async function listCollections() {
  return new Promise((resolve, reject) => {
    authenticate((token) => {
      const listReq = http.request(`${url}/api/collections`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, (listRes) => {
        let listBody = '';
        listRes.on('data', chunk => listBody += chunk);
        listRes.on('end', () => {
          try {
            resolve(JSON.parse(listBody));
          } catch (e) {
            reject(new Error('Failed to parse collections response'));
          }
        });
      });
      
      listReq.on('error', reject);
      listReq.end();
    });
  });
}

async function resolveCollectionId(nameOrId) {
  // If it looks like an ID (starts with pbc_), return as-is
  if (nameOrId.startsWith('pbc_')) {
    return nameOrId;
  }
  
  // Otherwise, resolve name to ID
  try {
    const collections = await listCollections();
    const collection = collections.items.find(c => c.name === nameOrId);
    
    if (!collection) {
      throw new Error(`Collection "${nameOrId}" not found`);
    }
    
    return collection.id;
  } catch (error) {
    throw new Error(`Failed to resolve collection "${nameOrId}": ${error.message}`);
  }
}

function formatCollections(collections, options = {}) {
  const format = options.format || 'table';
  const filter = options.filter || null;
  
  let items = collections.items;
  
  // Apply filter if specified
  if (filter) {
    items = items.filter(col => 
      col.name.toLowerCase().includes(filter.toLowerCase()) ||
      col.id.toLowerCase().includes(filter.toLowerCase())
    );
  }
  
  if (format === 'json') {
    console.log(JSON.stringify({ ...collections, items }, null, 2));
  } else {
    // Table format
    console.log('Collections:');
    console.log('ID'.padEnd(20) + 'Name'.padEnd(20) + 'Type'.padEnd(10) + 'System');
    console.log('-'.repeat(60));
    
    items.forEach(col => {
      console.log(
        col.id.padEnd(20) +
        col.name.padEnd(20) +
        col.type.padEnd(10) +
        (col.system ? 'Yes' : 'No')
      );
    });
    
    if (collections.totalItems > collections.items.length) {
      console.log(`\nShowing ${items.length} of ${collections.totalItems} collections`);
      console.log(`Use --filter=<pattern> to search`);
    }
  }
}

if (command === 'create') {
  const name = args[0];
  const type = args[1] || 'base';
  
  if (!name) {
    console.error('Usage: collection-manager.js create <name> [type]');
    process.exit(1);
  }
  
  authenticate((token) => {
    const colData = JSON.stringify({ name, type });
    const colReq = http.request(`${url}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': colData.length
      }
    }, (colRes) => {
      let colBody = '';
      colRes.on('data', chunk => colBody += chunk);
      colRes.on('end', () => {
        console.log(colBody);
        process.exit(0);
      });
    });
    
    colReq.on('error', (err) => {
      console.error('Collection creation error:', err.message);
      process.exit(1);
    });
    
    colReq.write(colData);
    colReq.end();
  });
  
} else if (command === 'list') {
  const options = {
    format: 'table',
    filter: null
  };
  
  // Parse arguments
  args.forEach(arg => {
    if (arg === '--json' || arg === '-j') options.format = 'json';
    if (arg.startsWith('--filter=')) options.filter = arg.split('=')[1];
  });
  
  listCollections().then(collections => {
    formatCollections(collections, options);
    process.exit(0);
  }).catch(error => {
    console.error('List request error:', error.message);
    process.exit(1);
  });
  
} else if (command === 'delete') {
  const nameOrId = args[0];
  
  if (!nameOrId) {
    console.error('Usage: collection-manager.js delete <name-or-id>');
    process.exit(1);
  }
  
  resolveCollectionId(nameOrId).then(id => {
    authenticate((token) => {
      const delReq = http.request(`${url}/api/collections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, (delRes) => {
        let delBody = '';
        delRes.on('data', chunk => delBody += chunk);
        delRes.on('end', () => {
          console.log(delBody || `Collection "${nameOrId}" deleted successfully`);
          process.exit(0);
        });
      });
      
      delReq.on('error', (err) => {
        console.error('Delete request error:', err.message);
        process.exit(1);
      });
      delReq.end();
    });
  }).catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
  
} else {
  console.error('Usage: collection-manager.js <create|list|delete> [args...]');
  console.error('  create <name> [type]       - Create a collection');
  console.error('  list [--json] [--filter=X] - List all collections');
  console.error('  delete <name-or-id>        - Delete a collection (by name or ID)');
  process.exit(1);
}