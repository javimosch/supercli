const { execSync } = require('child_process');
const fs = require('fs');

function isCommandAvailable(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

console.log('--- Coding Agent Session Search (cass) Setup ---');

if (isCommandAvailable('cass')) {
  console.log('cass is already installed and working.');
} else {
  console.log('cass not found or broken (GLIBC mismatch). Attempting installation...');
  
  try {
    execSync('which cargo', { stdio: 'ignore' });
    console.log('cargo found. Installing from git to ensure compatibility...');
    execSync('cargo install --git https://github.com/Dicklesworthstone/coding_agent_session_search coding-agent-search', { stdio: 'inherit' });
    console.log('Success: cass installed via cargo.');
  } catch (e) {
    console.log('cargo not found or failed. Trying official install script...');
    try {
      // Official install script
      execSync('curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/coding_agent_session_search/main/install.sh" | bash -s -- --easy-mode --verify', { stdio: 'inherit' });
      console.log('Success: cass installed via script.');
    } catch (e2) {
      console.error('Failed to install cass.');
      console.error('Please install Rust (https://rustup.rs) and run: cargo install --git https://github.com/Dicklesworthstone/coding_agent_session_search coding-agent-search');
      process.exit(1);
    }
  }
}

// Final check
try {
  const version = execSync('cass --version').toString().trim();
  console.log(`Verified: ${version} is available.`);
} catch (e) {
  console.error('Error: cass binary still not working. This usually means a GLIBC mismatch.');
  console.error('Please install from source: cargo install --git https://github.com/Dicklesworthstone/coding_agent_session_search coding-agent-search');
  process.exit(1);
}
