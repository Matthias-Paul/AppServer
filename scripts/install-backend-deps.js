const { execSync } = require('child_process');
const path = require('path');

const backendPath = path.join(__dirname, '..', 'backend');
console.log('Installing backend dependencies...');
execSync('npm ci', { cwd: backendPath, stdio: 'inherit' });
