// Export every .slide in an HTML page as a numbered PNG (for Instagram/Threads carousels).
// Usage: node scripts/carousel.mjs <html> <outDir>
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const [html, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 } });
await page.goto('file://' + path.resolve(html));
await page.evaluate(() => document.fonts.ready);
const slides = await page.locator('.slide').all();
for (const [i, slide] of slides.entries()) {
  await slide.screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
}
await browser.close();
console.log(`${slides.length} slides -> ${outDir}`);
