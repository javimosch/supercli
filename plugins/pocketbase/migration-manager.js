#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const command = process.argv[2];
const args = process.argv.slice(3);

function createMigration(name, force = false) {
  const timestamp = Date.now();
  const filename = `${timestamp}_${name}.js`;
  const migrationsDir = path.join(process.cwd(), 'pb_migrations');
  
  // Create migrations directory if it doesn't exist
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  const template = `/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Add your up migration logic here
}, (app) => {
  // Add your down migration logic here
})`;
  
  const filepath = path.join(migrationsDir, filename);
  fs.writeFileSync(filepath, template);
  
  console.log(`Created migration: ${filename}`);
  return filepath;
}

function applyMigration(force = false) {
  if (force) {
    return new Promise((resolve, reject) => {
      const child = spawn('pocketbase', ['migrate', 'up'], {
        stdio: ['pipe', 'inherit', 'inherit']
      });
      
      // Auto-confirm with 'y'
      setTimeout(() => {
        child.stdin.write('y\n');
        child.stdin.end();
      }, 100);
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Migration failed with exit code ${code}`));
        }
      });
      
      child.on('error', reject);
    });
  } else {
    const result = spawnSync('pocketbase', ['migrate', 'up'], { stdio: 'inherit' });
    if (result.status !== 0) {
      throw new Error(`Migration failed with exit code ${result.status}`);
    }
    return result.status;
  }
}

function revertMigration(count = 1, force = false) {
  if (force) {
    return new Promise((resolve, reject) => {
      const child = spawn('pocketbase', ['migrate', 'down', count.toString()], {
        stdio: ['pipe', 'inherit', 'inherit']
      });
      
      // Auto-confirm with 'y'
      setTimeout(() => {
        child.stdin.write('y\n');
        child.stdin.end();
      }, 100);
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Migration revert failed with exit code ${code}`));
        }
      });
      
      child.on('error', reject);
    });
  } else {
    const result = spawnSync('pocketbase', ['migrate', 'down', count.toString()], { stdio: 'inherit' });
    if (result.status !== 0) {
      throw new Error(`Migration revert failed with exit code ${result.status}`);
    }
    return result.status;
  }
}

// Command routing
if (command === 'create') {
  const name = args[0];
  const force = args.includes('--force') || args.includes('-f');
  
  if (!name) {
    console.error('Usage: migration-manager.js create <name> [--force]');
    process.exit(1);
  }
  
  try {
    createMigration(name, force);
    process.exit(0);
  } catch (error) {
    console.error('Error creating migration:', error.message);
    process.exit(1);
  }
  
} else if (command === 'up') {
  const force = args.includes('--force') || args.includes('-f');
  
  applyMigration(force)
    .then(() => {
      console.log('Migration applied successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error applying migration:', error.message);
      process.exit(1);
    });
    
} else if (command === 'down') {
  const force = args.includes('--force') || args.includes('-f');
  const countArg = args.find(a => !a.startsWith('-'));
  const count = countArg ? parseInt(countArg) : 1;
  
  revertMigration(count, force)
    .then(() => {
      console.log('Migration reverted successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error reverting migration:', error.message);
      process.exit(1);
    });
    
} else {
  console.error('Usage: migration-manager.js <create|up|down> [args...]');
  console.error('  create <name> [--force]  - Create migration file');
  console.error('  up [--force]              - Apply pending migrations');
  console.error('  down [count] [--force]    - Revert last N migrations');
  process.exit(1);
}