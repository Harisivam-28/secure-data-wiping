import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=====================================================');
console.log(' 🛡️ Starting DataShield Forensics (Backend + Frontend)');
console.log('=====================================================');

// 1. Launch Backend Server (Port 5001)
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Launch Frontend Dev Server (Port 3000)
const frontend = spawn('npx', ['vite', '--port', '3000'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

console.log('[+] Backend REST API: http://localhost:5001/api/status');
console.log('[+] Frontend Web App: http://localhost:3000');
console.log('=====================================================');

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
