import puppeteer from 'puppeteer-core';

// Cross-platform browser resolution: CI (ubuntu) uses the runner's Chrome,
// Windows dev machines use Edge, CHROME_PATH always wins.
const executablePath =
  process.env.CHROME_PATH ||
  (process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    : '/usr/bin/google-chrome');

const b = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
});
const page = await b.newPage();
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto(process.env.BASE_URL || 'http://localhost:8080', { waitUntil: 'networkidle2', timeout: 45000 });
await page.waitForSelector('#collaboration', { timeout: 60000 });
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
});
// Lazy section chunks may still be streaming in after the scroll pass
await page.waitForSelector('.collab-bento', { timeout: 60000 });
await new Promise((r) => setTimeout(r, 500));
const res = await page.evaluate(() => {
  const out = {};
  const missing = [];
  const style = (s, prop) => {
    const el = document.querySelector(s);
    if (!el) {
      if (!missing.includes(s)) missing.push(s);
      return 'MISSING';
    }
    return getComputedStyle(el)[prop];
  };
  const box = (s) => {
    const el = document.querySelector(s);
    if (!el) {
      if (!missing.includes(s)) missing.push(s);
      return 'MISSING';
    }
    return Math.round(el.getBoundingClientRect().width);
  };
  out.hOverflowPx = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  const wide = [];
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 376 && r.height > 0 && getComputedStyle(el).position !== 'fixed') {
      wide.push(el.tagName + '.' + (el.className || '').toString().slice(0, 25) + ':' + Math.round(r.width));
    }
  });
  out.widerThanViewport = wide.slice(0, 6);
  out.collabGrid = style('.collab-bento', 'gridTemplateColumns');
  out.formRowGrid = style('.form-row', 'gridTemplateColumns');
  out.inputFontPx = style('.collaboration-form input', 'fontSize');
  out.textareaFontPx = style('.collaboration-form textarea', 'fontSize');
  out.quickCols = style('.bento-quick', 'gridTemplateColumns');
  out.statsCols = style('.bento-stats', 'gridTemplateColumns');
  out.badgeW = box('.collab-badge');
  out.iconTile = style('.method-icon', 'width') + ' x ' + style('.method-icon', 'height');
  out.categoryHeaderFont = style('.category-header', 'fontSize');
  out.categoryHeaderPad = style('.category-header', 'padding');
  out.noticeRadius = style('.collaboration-notice', 'borderRadius');
  const ham = document.querySelector('.menu-toggle, [class*="hamburger"], [class*="nav-toggle"]');
  out.hamburger = ham ? ham.tagName + '.' + ham.className : 'none';
  const menu = document.querySelector('[class*="nav-menu"], [class*="nav-links"]');
  out.navMenuDisplay = menu ? getComputedStyle(menu).display : 'notfound';
  let maxRight = 0;
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.right > maxRight) maxRight = r.right;
  });
  out.maxRightEdge = Math.round(maxRight);
  out.docHeight = document.body.scrollHeight;
  out.missingSelectors = missing;
  return out;
});
console.log(JSON.stringify(res, null, 1));
await b.close();

// Gate for CI: fail the job on real, user-facing layout breakage.
const failures = [];
if (res.hOverflowPx > 0) {
  failures.push(`horizontal overflow: ${res.hOverflowPx}px wider than the 375px viewport`);
}
if (res.hamburger === 'none') {
  failures.push('mobile hamburger toggle not found at 375px');
}
if (res.missingSelectors.length) {
  failures.push('selectors not found (renamed components?): ' + res.missingSelectors.join(', '));
}
if (failures.length) {
  console.error('\nMOBILE CHECK FAILED:');
  failures.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log('\nmobile check passed: no horizontal overflow, nav collapsed, selectors present');
