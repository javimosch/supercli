#!/usr/bin/env node

const { spawn } = require('child_process');

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
        // Don't fail if the server wasn't registered
        resolve(stdout);
      }
    });

    proc.on('error', (err) => {
      // Don't fail if sc command isn't available
      resolve('');
    });
  });
}

async function main() {
  try {
    // Remove context-mode MCP server registration
    await runCommand('sc', ['mcp', 'remove', 'context-mode']);
    console.log('✓ context-mode MCP server registration removed');
    process.exit(0);
  } catch (err) {
    console.error(`✗ Failed to remove MCP server: ${err.message}`);
    process.exit(1);
  }
}

main();
