import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.woff2': 'font/woff2' };
http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const filename = path.resolve(root, relative);
    if (!filename.startsWith(root) || !['index.html', 'version-1.html', 'styles.css', 'version-2.html', 'version-2.css', 'version-3.html', 'version-3.css', 'version-3.js', 'version-4.css', 'assets/puravisoft-emblem.png', 'assets/puravisoft-logo.png', 'assets/puravisoft-neighborhood.png', 'assets/regular.woff2', 'assets/semibold.woff2'].includes(relative)) {
      response.writeHead(404).end('Not found');
      return;
    }
    const content = await readFile(filename);
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)], 'X-Content-Type-Options': 'nosniff' });
    response.end(content);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`PuraviSoft preview: http://localhost:${port}`));
