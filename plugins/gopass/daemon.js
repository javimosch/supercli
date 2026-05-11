#!/usr/bin/env node

const WebSocket = require('ws');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const REMOTE_UI_URL = process.env.GOPASS_UI_URL || 'ws://92.113.145.178:8768';
const STATIC_AUTH_TOKEN = process.env.GOPASS_AUTH_TOKEN || 'gopass-daemon-shared-secret-2024';
const SESSION_ID = process.env.GOPASS_SESSION_ID || crypto.randomBytes(16).toString('hex');
const PLUGIN_DIR = process.env.SUPERCLI_PLUGIN_DIR || __dirname;
const PID_FILE = path.join(PLUGIN_DIR, '.daemon.pid');

// Get static auth token
function getAuthToken() {
  return STATIC_AUTH_TOKEN;
}

// Execute gopass command
function executeGopassCommand(args, password = null, value = null) {
  try {
    let command = 'gopass';
    let commandArgs = args;
    
    if (password) {
      // For commands that need password input
      let bashCommand;
      if (value) {
        // For insert command with value - args should be just the path
        const path = args[0]; // First arg is the path for insert
        bashCommand = `echo "${value}" | gopass insert --force ${path}`;
      } else {
        // For show command
        bashCommand = `echo "${password}" | gopass ${args.join(' ')}`;
      }
      
      const result = spawn('bash', ['-c', bashCommand], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';
      
      result.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      result.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      return new Promise((resolve, reject) => {
        result.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true, data: stdout.trim(), error: stderr.trim() });
          } else {
            resolve({ success: false, data: stdout.trim(), error: stderr.trim() });
          }
        });
        
        result.on('error', (error) => {
          reject({ success: false, error: error.message });
        });
      });
    } else {
      // For commands that don't need password (like list)
      const stdout = execSync(`gopass ${args.join(' ')}`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      return Promise.resolve({ success: true, data: stdout.trim() });
    }
  } catch (error) {
    return Promise.resolve({ success: false, error: error.message });
  }
}

// Connect to remote UI
function connectToRemoteUI() {
  console.log(`🔗 Connecting to remote UI: ${REMOTE_UI_URL}`);
  console.log(`🆔 Session ID: ${SESSION_ID}`);
  console.log(`🔐 Using static auth token`);
  
  const ws = new WebSocket(REMOTE_UI_URL, {
    headers: {
      'X-Session-ID': SESSION_ID,
      'X-Auth-Token': STATIC_AUTH_TOKEN
    }
  });
  
  ws.on('open', () => {
    console.log('✅ Connected to remote UI');
    
    // Register this daemon with metadata
    const metadata = {
      hostname: require('os').hostname(),
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };
    
    ws.send(JSON.stringify({
      type: 'register',
      metadata
    }));
  });
  
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      await handleRemoteMessage(ws, message);
    } catch (error) {
      console.error(`❌ Error handling message: ${error.message}`);
      ws.send(JSON.stringify({ type: 'error', error: error.message }));
    }
  });
  
  ws.on('close', () => {
    console.log('🔗 Disconnected from remote UI');
    process.exit(0);
  });
  
  ws.on('error', (error) => {
    console.error(`❌ WebSocket error: ${error.message}`);
    process.exit(1);
  });
  
  return ws;
}

// Handle messages from remote UI
async function handleRemoteMessage(ws, message) {
  console.log(`📨 Received command: ${message.type}`);
  
  if (message.type === 'command') {
    console.log(`🔧 Executing: ${message.command}`);
    
    let result;
    switch (message.command) {
      case 'list':
        result = await executeGopassCommand(['list']);
        break;
      case 'show':
        result = await executeGopassCommand(['show', message.path], message.password);
        break;
      case 'insert':
        result = await executeGopassCommand([message.path], message.password, message.value);
        break;
      case 'generate':
        result = await executeGopassCommand(['generate', message.path, message.length || '24']);
        break;
      case 'delete':
        result = await executeGopassCommand(['delete', message.path], message.password);
        break;
      case 'sync':
        result = await executeGopassCommand(['sync']);
        break;
      default:
        result = { success: false, error: 'Unknown command' };
    }
    
    ws.send(JSON.stringify({
      type: 'response',
      command: message.command,
      ...result
    }));
  }
}

// Start daemon
function startDaemon(background = false) {
  if (background) {
    // Fork to background
    const { spawn } = require('child_process');
    const daemonProcess = spawn(process.argv[0], [process.argv[1], 'start'], {
      detached: true,
      stdio: 'ignore'
    });
    daemonProcess.unref();
    console.log('✅ gopass daemon started in background');
    process.exit(0);
  }

  console.log('🔐 gopass daemon starting...');
  console.log(`🌐 Connecting to remote gopassui at ${REMOTE_UI_URL}`);
  
  // Write PID file immediately
  fs.writeFileSync(PID_FILE, process.pid.toString());
  
  const ws = connectToRemoteUI();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n🛑 Shutting down daemon...');
    ws.close();
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE);
    }
    process.exit(0);
  });
}

// Stop daemon
function stopDaemon() {
  if (fs.existsSync(PID_FILE)) {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
    try {
      process.kill(pid, 'SIGTERM');
      fs.unlinkSync(PID_FILE);
      console.log('✅ gopass daemon stopped');
    } catch (error) {
      console.error('❌ Failed to stop daemon:', error.message);
      process.exit(1);
    }
  } else {
    console.log('ℹ️  gopass daemon is not running');
  }
}

// Check daemon status
function statusDaemon() {
  if (fs.existsSync(PID_FILE)) {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
    try {
      process.kill(pid, 0); // Check if process is running
      console.log('✅ gopass daemon is running (PID:', pid + ')');
      console.log(`🌐 Connected to: ${REMOTE_UI_URL}`);
    } catch (error) {
      console.log('❌ gopass daemon PID file exists but process is not running');
      console.log('🧹 Cleaning up stale PID file');
      fs.unlinkSync(PID_FILE);
    }
  } else {
    console.log('ℹ️  gopass daemon is not running');
  }
}

// CLI interface
const command = process.argv[2];
const args = process.argv.slice(3);
const background = args.includes('--background');

switch (command) {
  case 'start':
    startDaemon(background);
    break;
  case 'stop':
    stopDaemon();
    break;
  case 'status':
    statusDaemon();
    break;
  case 'token':
    console.log(getAuthToken());
    break;
  default:
    console.log('Usage: node daemon.js [start|stop|status|token] [--background]');
    process.exit(1);
}
