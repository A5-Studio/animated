// Render a time-driven HTML animation (exposes window.renderAt(t) and window.DURATION)
// into a 1080x1920 (9:16 Reels) MP4. Optional soundtrack: a WAV next to the HTML
// named soundtrack.wav (see scripts/soundtrack.py).
//
// Usage: node scripts/render.mjs <html> <out.mp4> [fps]
// Needs ffmpeg with libx264 on PATH, or set FFMPEG=/path/to/ffmpeg.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const [html, out, fpsArg] = process.argv.slice(2);
if (!html || !out) {
  console.error('Usage: node scripts/render.mjs <html> <out.mp4> [fps]');
  process.exit(1);
}
const FPS = Number(fpsArg || 30);
const ffmpegBin = process.env.FFMPEG || 'ffmpeg';
const audio = path.join(path.dirname(html), 'soundtrack.wav');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.resolve(html) + '?render');
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.DURATION);
const frames = Math.round(duration * FPS);

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-'];
if (fs.existsSync(audio)) args.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-profile:v', 'high', '-movflags', '+faststart', out);
const ff = spawn(ffmpegBin, args, { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));

for (let i = 0; i < frames; i++) {
  await page.evaluate(t => window.renderAt(t), i / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 100 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % FPS === 0) process.stdout.write(`\r${(i / FPS).toFixed(0)}s / ${duration}s`);
}
ff.stdin.end();
await done;
await browser.close();
console.log(`\nWrote ${out} (${frames} frames @ ${FPS}fps)`);
