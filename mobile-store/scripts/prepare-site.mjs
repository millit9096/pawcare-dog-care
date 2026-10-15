import { mkdir, readFile, writeFile, copyFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '..');
const candidates = [path.resolve(mobileRoot, '..', 'mobile'), path.resolve(mobileRoot, '..')];
let source;
for (const candidate of candidates) {
  try { await access(path.join(candidate, 'index.html')); source = candidate; break; }
  catch { /* try the next repository layout */ }
}
if (!source) throw new Error('Could not find the PawCare web app source files.');
const site = path.join(mobileRoot, 'site');
const publicDir = path.join(site, 'public');
await mkdir(site, { recursive: true });
await mkdir(publicDir, { recursive: true });

await copyFile(path.join(source, 'index.html'), path.join(site, 'index.html'));
for (const filename of ['app.js', 'paw.svg', 'privacy.html']) {
  await copyFile(path.join(source, filename), path.join(publicDir, filename));
}

const indexPath = path.join(site, 'index.html');
let html = await readFile(indexPath, 'utf8');
html = html.replace('</body>', '  <script type="module" src="./native-features.js"></script>\n</body>');
await writeFile(indexPath, html);

