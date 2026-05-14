#!/usr/bin/env node

const { spawn, ChildProcess } = require('child_process');
const fs = require('fs');
const path = require('path');

class PocketBaseServer {
  constructor(options = {}) {
    this.binary = options.binary || 'pocketbase';
    this.args = options.args || ['serve', '--dev'];
    this.pidFile = options.pidFile || '/tmp/pocketbase.pid';
    this.logFile = options.logFile || '/tmp/pocketbase.log';
    this.process = null;
    this.restartAttempts = 0;
    this.maxRestarts = options.maxRestarts || 3;
    this.restartDelay = options.restartDelay || 2000;
  }

  start() {
    if (this.isRunning()) {
      console.log('PocketBase server is already running');
      return Promise.resolve(false);
    }

    console.log('Starting PocketBase server...');
    
    // Ensure log directory exists
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logStream = fs.createWriteStream(this.logFile, { flags: 'a' });
    
    this.process = spawn(this.binary, this.args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true
    });

    this.process.stdout.pipe(logStream);
    this.process.stderr.pipe(logStream);

    // Also output to console for visibility
    this.process.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    this.process.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    this.process.on('exit', (code, signal) => {
      console.log(`PocketBase server exited with code ${code}, signal ${signal}`);
      this.cleanup();
      
      // Auto-restart if not explicitly stopped
      if (signal !== 'SIGTERM' && signal !== 'SIGINT' && this.restartAttempts < this.maxRestarts) {
        this.restartAttempts++;
        console.log(`Attempting restart ${this.restartAttempts}/${this.maxRestarts}...`);
        setTimeout(() => this.start(), this.restartDelay);
      }
    });

    // Write PID file
    fs.writeFileSync(this.pidFile, this.process.pid.toString());
    
    // Wait for server to be ready
    return this.waitForReady();
  }

  stop() {
    if (!this.isRunning()) {
      console.log('PocketBase server is not running');
      return Promise.resolve(false);
    }

    console.log('Stopping PocketBase server...');
    
    try {
      const pid = parseInt(fs.readFileSync(this.pidFile, 'utf8'));
      process.kill(pid, 'SIGTERM');
      
      // Force kill if it doesn't stop gracefully
      setTimeout(() => {
        try {
          process.kill(pid, 'SIGKILL');
        } catch (e) {
          // Process already stopped
        }
      }, 5000);
      
      this.cleanup();
      return Promise.resolve(true);
    } catch (e) {
      console.error('Failed to stop server:', e.message);
      return Promise.resolve(false);
    }
  }

  restart() {
    console.log('Restarting PocketBase server...');
    return this.stop().then(() => {
      return new Promise(resolve => setTimeout(resolve, 2000));
    }).then(() => {
      return this.start();
    });
  }

  status() {
    const running = this.isRunning();
    if (running) {
      try {
        const pid = parseInt(fs.readFileSync(this.pidFile, 'utf8'));
        console.log(`PocketBase server is running (PID: ${pid})`);
        return { running: true, pid };
      } catch (e) {
        console.log('PocketBase server status unknown');
        return { running: false };
      }
    } else {
      console.log('PocketBase server is not running');
      return { running: false };
    }
  }

  isRunning() {
    try {
      if (!fs.existsSync(this.pidFile)) return false;
      
      const pid = parseInt(fs.readFileSync(this.pidFile, 'utf8'));
      process.kill(pid, 0); // Check if process exists
      return true;
    } catch (e) {
      return false;
    }
  }

  async waitForReady(timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const http = require('http');
        await new Promise((resolve, reject) => {
          http.get('http://127.0.0.1:8090/api/', (res) => {
            if (res.statusCode === 404) { // 404 is expected for root API
              resolve();
            } else {
              reject(new Error(`Unexpected status code: ${res.statusCode}`));
            }
          }).on('error', reject);
        });
        console.log('PocketBase server is ready at http://127.0.0.1:8090');
        console.log('Dashboard: http://127.0.0.1:8090/_/');
        return true;
      } catch (e) {
        // Server not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error('Server failed to start within timeout period');
  }

  cleanup() {
    this.process = null;
    if (fs.existsSync(this.pidFile)) {
      fs.unlinkSync(this.pidFile);
    }
  }
}

// CLI interface
const command = process.argv[2];
const server = new PocketBaseServer();

if (command === 'start' || command === undefined) {
  server.start().then(() => {
    console.log('Server started successfully');
  }).catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
} else if (command === 'stop') {
  server.stop().then(() => {
    console.log('Server stopped successfully');
  });
} else if (command === 'restart') {
  server.restart().then(() => {
    console.log('Server restarted successfully');
  }).catch(err => {
    console.error('Failed to restart server:', err.message);
    process.exit(1);
  });
} else if (command === 'status') {
  server.status();
} else {
  console.log('Usage: serve.js [start|stop|restart|status]');
  process.exit(1);
}