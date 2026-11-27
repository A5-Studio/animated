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
const slides = await page.locator('.slide').all();
for (let i = 0; i < slides.length; i++) {
  await slides[i].screenshot({ path: path.join(out, `${String(i + 1).padStart(2, '0')}.png`) });
}
await browser.close();
console.log(`exported ${slides.length} slides to ${out}`);
