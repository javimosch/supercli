#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const pocketbasePath = process.env.POCKETBASE_PATH || 'pocketbase';
const args = ['serve', '--dev'];

console.log('Starting PocketBase server in development mode...');
console.log('Server will be available at http://127.0.0.1:8090');
console.log('Dashboard: http://127.0.0.1:8090/_/');
console.log('Press Ctrl+C to stop the server');

const server = spawn(pocketbasePath, args, {
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('Failed to start PocketBase server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`PocketBase server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping PocketBase server...');
  server.kill('SIGTERM');
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
});

process.on('SIGTERM', () => {
  console.log('\nStopping PocketBase server...');
  server.kill('SIGTERM');
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
});