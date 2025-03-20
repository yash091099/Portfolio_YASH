const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Handle favicon requests
  if (req.url === '/favicon.ico') {
    const faviconPath = path.join(__dirname, 'assets', 'images', 'favicon.png');
    fs.readFile(faviconPath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end();
        return;
      }
      res.setHeader('Content-Type', 'image/png');
      res.end(data);
    });
    return;
  }
  
  // Parse URL to get the pathname
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Get file extension
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If the file doesn't exist, serve 404.html
      if (err.code === 'ENOENT') {
        console.log(`File not found: ${filePath}`);
        
        fs.readFile('./404.html', (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Server Error');
            return;
          }
          
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success - send the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
}); 