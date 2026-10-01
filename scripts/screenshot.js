import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import os from 'os';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = path.join(os.tmpdir(), 'portfolio-shots');
const URL = process.env.SHOT_URL || 'http://localhost:8080';

fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'mobile', width: 375, height: 812, dsf: 2, mobile: true },
];

async function sectionBox(page, sel) {
  return page.evaluate((s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
  }, sel);
}

async function sliceShots(page, sel, vpName, sliceH) {
  const box = await sectionBox(page, sel);
  if (!box) return console.log(`SKIP ${sel} not found`);
  const id = sel.replace('#', '').replace(/\./g, '_');
  const slices = Math.ceil(box.height / sliceH);
  for (let i = 0; i < slices; i++) {
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y)), box.y + i * sliceH);
    await new Promise((r) => setTimeout(r, 550));
    const file = path.join(OUT, `${vpName}-${id}-p${i + 1}.png`);
    await page.screenshot({ path: file });
    console.log(`saved ${file}`);
  }
}

async function clipShot(page, sel, vpName) {
  const found = await page.evaluate((s) => !!document.querySelector(s), sel);
  if (!found) return console.log(`SKIP ${sel} not found`);
  const ok = await page.evaluate((s) => {
    const e = document.querySelector(s);
    if (e.getBoundingClientRect().height > 820) return false;
    e.scrollIntoView({ block: 'center' });
    return true;
  }, sel);
  if (!ok) return console.log(`SKIP ${sel} too tall`);
  await new Promise((r) => setTimeout(r, 550));
  const file = path.join(OUT, `${vpName}-${sel.replace('#', '').replace(/\./g, '_')}.png`);
  await page.screenshot({ path: file });
  console.log(`saved ${file}`);
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  });

  const only = process.argv[2]; // optional: 'desktop' | 'mobile'

  for (const vp of viewports) {
    if (only && vp.name !== only) continue;
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dsf,
      isMobile: !!vp.mobile,
      hasTouch: !!vp.mobile,
    });
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.waitForSelector('#collaboration', { timeout: 15000 });

    // Auto-scroll whole page first to trigger ScrollReveal animations
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, h);
      await new Promise((r) => setTimeout(r, 400));
    });
    await new Promise((r) => setTimeout(r, 900));

    // Key shots
    await sliceShots(page, '#collaboration', vp.name, vp.name === 'mobile' ? 780 : 880);
    await clipShot(page, '.empty-stories-message', vp.name); // PatchOps coming-soon box
    await clipShot(page, '.collab-stats', vp.name);
    await clipShot(page, '.collab-quick', vp.name);

    // Hero (top of page)
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 600));
    const heroFile = path.join(OUT, `${vp.name}-hero.png`);
    await page.screenshot({ path: heroFile });
    console.log(`saved ${heroFile}`);

    await page.close();
  }

  await browser.close();
  console.log('DONE');
}

run().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
