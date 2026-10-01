import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
});
const results = {};

// Desktop checks
const page = await b.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle2', timeout: 45000 });

// 1. CountUp: wait for hero animation to finish (visible at load)
await new Promise((r) => setTimeout(r, 1600));
results.countUpHero = await page.evaluate(() =>
  [...document.querySelectorAll('.hero-stats .stat-number')].map((e) => e.textContent)
);

// 2. Nav chip
results.navChip = await page.evaluate(() => {
  const chip = document.querySelector('.nav-status');
  if (!chip) return 'MISSING';
  const cs = getComputedStyle(chip);
  return { visible: cs.display !== 'none', text: chip.textContent.trim(), color: cs.color };
});

// 4. Divider pseudo-elements on 2nd section
results.divider = await page.evaluate(() => {
  const s = document.querySelector('#experience');
  const before = getComputedStyle(s, '::before');
  const after = getComputedStyle(s, '::after');
  return { line: before.backgroundImage.includes('gradient'), glow: after.backgroundImage.includes('gradient'), z: before.zIndex };
});

// 3. BackToTop hidden at top
results.backToTopAtTop = await page.evaluate(() => {
  const btn = document.querySelector('.back-to-top');
  return { exists: !!btn, visibleClass: btn?.classList.contains('visible') };
});

// Scroll: count-up in other sections + back-to-top appears + click works
await page.evaluate(() => window.scrollTo(0, 5000));
await new Promise((r) => setTimeout(r, 700));
results.backToTopAfterScroll = await page.evaluate(() => {
  const btn = document.querySelector('.back-to-top');
  return { visibleClass: btn?.classList.contains('visible'), ariaHidden: btn?.getAttribute('aria-hidden') };
});
await page.click('.back-to-top');
await new Promise((r) => setTimeout(r, 1500));
results.afterBackToTopClick = await page.evaluate(() => Math.round(window.scrollY));

// Success stories count-up (scroll there, wait, read)
await page.evaluate(() => document.getElementById('success-stories')?.scrollIntoView());
await new Promise((r) => setTimeout(r, 1700));
results.successStats = await page.evaluate(() =>
  [...document.querySelectorAll('.product-stat-value')].map((e) => e.textContent)
);
// Skills + collaboration count-ups
await page.evaluate(() => document.getElementById('skills')?.scrollIntoView());
await new Promise((r) => setTimeout(r, 1700));
results.skillsSummary = await page.evaluate(() =>
  [...document.querySelectorAll('.summary-number')].map((e) => e.textContent)
);

// Footer clock
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 400));
results.footerClock = await page.evaluate(() => document.querySelector('.footer-time')?.textContent.trim());

// Horizontal overflow at multiple widths
results.overflow = {};
for (const w of [1440, 1366, 1281, 1200, 1024, 768, 375]) {
  await page.setViewport({ width: w, height: 900 });
  await new Promise((r) => setTimeout(r, 250));
  results.overflow[w] = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}
await page.close();
await b.close();
console.log(JSON.stringify(results, null, 1));
