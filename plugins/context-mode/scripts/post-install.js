#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

async function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'pipe' });
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => { stdout += data; });
    proc.stderr.on('data', (data) => { stderr += data; });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    // Register context-mode as a stateful MCP server
    await runCommand('sc', ['mcp', 'add', 'context-mode', '--command', 'context-mode', '--args-json', '[]', '--stateful']);
    console.log('✓ context-mode registered as stateful MCP server');

    // Start the daemon so context-mode is immediately available
    await runCommand('sc', ['mcp', 'daemon', 'start']);
    console.log('✓ MCP daemon started');

    process.exit(0);
  } catch (err) {
    console.error(`✗ Failed to register MCP server: ${err.message}`);
    process.exit(1);
  }
}

main();
