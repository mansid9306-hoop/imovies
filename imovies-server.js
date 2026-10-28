import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import backend Express app from backend/server.js or provide standalone fallback server
const PORT = process.env.PORT || 5000;

// Read standalone HTML file to serve directly
const htmlPath = path.join(__dirname, 'imovies-standalone.html');

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Health endpoint
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', app: 'IMovies Single-File Server', version: '1.0.0' }));
    return;
  }

  // Serve single-file standalone web app
  if (req.url === '/' || req.url.startsWith('/movies') || req.url.startsWith('/booking') || req.url.startsWith('/admin')) {
    fs.readFile(htmlPath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading standalone application: ' + err.message);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🎬 IMOVIES - ALL-IN-ONE SINGLE FILE SERVER ACTIVE`);
  console.log(`🔗 Local Web App: http://localhost:${PORT}`);
  console.log(`📁 Standalone File: ${htmlPath}`);
  console.log(`================================================================`);
});
