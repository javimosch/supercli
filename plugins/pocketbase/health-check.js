#!/usr/bin/env node

const http = require('http');

function checkHealth(url = 'http://127.0.0.1:8090') {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    http.get(`${url}/api/`, (res) => {
      const responseTime = Date.now() - startTime;
      
      if (res.statusCode === 404) {
        // 404 is expected for root API endpoint
        resolve({
          status: 'healthy',
          responseTime: `${responseTime}ms`,
          url: url,
          timestamp: new Date().toISOString()
        });
      } else {
        resolve({
          status: 'unhealthy',
          responseTime: `${responseTime}ms`,
          url: url,
          statusCode: res.statusCode,
          timestamp: new Date().toISOString()
        });
      }
    }).on('error', (err) => {
      resolve({
        status: 'unreachable',
        error: err.message,
        url: url,
        timestamp: new Date().toISOString()
      });
    });
  });
}

const url = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
checkHealth(url).then(result => {
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.status === 'healthy' ? 0 : 1);
});