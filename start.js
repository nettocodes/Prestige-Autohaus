const { exec } = require('child_process');
const path = require('path');

// Caminhos das pastas
const backendPath = path.resolve(__dirname, 'backend');
const frontendPath = path.resolve(__dirname, 'frontend');

// Iniciar backend
const backend = exec('node server.js', { cwd: backendPath });
backend.stdout.on('data', (data) => console.log(`[BACKEND] ${data}`));
backend.stderr.on('data', (data) => console.error(`[BACKEND ERROR] ${data}`));

// Iniciar frontend
const frontend = exec('npm run serve', { cwd: frontendPath });
frontend.stdout.on('data', (data) => console.log(`[FRONTEND] ${data}`));
frontend.stderr.on('data', (data) => console.error(`[FRONTEND ERROR] ${data}`));
