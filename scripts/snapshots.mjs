// Capture still frames at given times for quick visual review.
// Usage: node scripts/snapshots.mjs <html> <outDir> <t1> <t2> ...
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const [html, outDir, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.resolve(html) + '?render');
await page.evaluate(() => document.fonts.ready);
for (const t of times) {
  await page.evaluate(t => window.renderAt(t), Number(t));
  await page.locator('#stage').screenshot({ path: path.join(outDir, `t${String(t).padStart(5, '0')}.png`) });
}
await browser.close();
