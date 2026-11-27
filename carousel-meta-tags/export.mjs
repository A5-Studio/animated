// Export every .slide in index.html as a 1080x1350 PNG.
// Usage: node carousel-meta-tags/export.mjs  (from repo root)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import fs from 'node:fs';

const dir = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(dir, 'slides');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'index.html'));
await page.evaluate(() => document.fonts.ready);
// Main slides are numbered 01.png, 02.png, ...; alternative covers (data-alt="x") become cover-alt-x.png.
const slides = await page.locator('.slide').all();
let n = 0;
for (const slide of slides) {
  const alt = await slide.getAttribute('data-alt');
  const name = alt ? `cover-alt-${alt}.png` : `${String(++n).padStart(2, '0')}.png`;
  await slide.screenshot({ path: path.join(out, name) });
}
await browser.close();
console.log(`exported ${slides.length} slides to ${out}`);
