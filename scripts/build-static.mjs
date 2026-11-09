import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = relative => readFile(path.join(root, relative));
const [htmlBytes, cssBytes, font, emblem] = await Promise.all([
  read('index.html'), read('version-4.css'),
  read('assets/regular.woff2'), read('assets/puravisoft-emblem.png'),
]);
const fontUrl = `data:font/woff2;base64,${font.toString('base64')}`;
const imageUrl = `data:image/png;base64,${emblem.toString('base64')}`;
const css = cssBytes.toString('utf8').replaceAll('assets/regular.woff2', fontUrl);
const html = htmlBytes.toString('utf8')
  .replace(/\s*<link rel="preload" href="assets\/regular\.woff2"[^>]*\/>/, '')
  .replace('<link rel="stylesheet" href="version-4.css" />', `<style>\n${css}\n</style>`)
  .replace('src="assets/puravisoft-emblem.png"', `src="${imageUrl}"`);
if (/\b(?:src|href)=["'](?:assets\/|version-4\.css)/.test(html)) {
  throw new Error('The publishing page still references an external local asset.');
}
const output = path.join(root, 'dist');
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'index.html'), html, 'utf8');
console.log('Built dist/index.html — standalone page with embedded image, font, styles, and animation.');
