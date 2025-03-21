const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;

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
  
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Check if path exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Path doesn't exist, check if it's a directory path without trailing slash
      if (req.url.endsWith('/')) {
        // Try index.html in that directory
        filePath = path.join(filePath, 'index.html');
      } else {
        // Try adding trailing slash and seeing if that directory exists
        const dirPath = filePath + '/';
        fs.access(dirPath, fs.constants.F_OK, (dirErr) => {
          if (!dirErr) {
            // Directory exists, redirect to add trailing slash
            res.writeHead(301, { 'Location': req.url + '/' });
            res.end();
            return;
          } else {
            // Neither file nor directory exists, serve 404
            serveNotFound(res);
            return;
          }
        });
        return;
      }
    }
    
    // Check if it's a directory
    fs.stat(filePath, (err, stats) => {
      if (err) {
        serveNotFound(res);
        return;
      }
      
      if (stats.isDirectory()) {
        // It's a directory, try to serve index.html from it
        const indexPath = path.join(filePath, 'index.html');
        fs.access(indexPath, fs.constants.F_OK, (err) => {
          if (err) {
            serveNotFound(res);
            return;
          }
          serveFile(indexPath, res);
        });
      } else {
        // It's a file, serve it
        serveFile(filePath, res);
      }
    });
  });
});

function serveFile(filepath, res) {
  const extname = path.extname(filepath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filepath, (err, content) => {
    if (err) {
      serveNotFound(res);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
}

function serveNotFound(res) {
  fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(content, 'utf-8');
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});