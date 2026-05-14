#!/usr/bin/env node

const http = require('http');

// Get command from first argument (from supercli)
const command = process.argv[2];
// Get additional arguments
const args = process.argv.slice(3);

const email = process.env.POCKETBASE_EMAIL || 'admin@example.com';
const password = process.env.POCKETBASE_PASSWORD || 'password123';
const url = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

function authenticate(callback) {
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
        callback(auth.token);
      } catch (e) {
        console.error('Authentication failed:', body);
        process.exit(1);
      }
    });
  });
  
  authReq.on('error', (err) => {
    console.error('Auth request error:', err.message);
    process.exit(1);
  });
  
  authReq.write(data);
  authReq.end();
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
        console.log(listBody);
        process.exit(0);
      });
    });
    
    listReq.on('error', (err) => {
      console.error('List request error:', err.message);
      process.exit(1);
    });
    
    listReq.end();
  });
  
} else if (command === 'delete') {
  const id = args[0];
  
  if (!id) {
    console.error('Usage: collection-manager.js delete <id>');
    process.exit(1);
  }
  
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
        console.log(delBody || 'Collection deleted');
        process.exit(0);
      });
    });
    
    delReq.on('error', (err) => {
      console.error('Delete request error:', err.message);
      process.exit(1);
    });
    
    delReq.end();
  });
  
} else {
  console.error('Usage: collection-manager.js <create|list|delete> [args...]');
  console.error('  create <name> [type]  - Create a collection');
  console.error('  list                   - List all collections');
  console.error('  delete <id>            - Delete a collection');
  process.exit(1);
}