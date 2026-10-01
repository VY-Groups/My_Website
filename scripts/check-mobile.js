import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
});
const page = await b.newPage();
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto('http://localhost:8080', { waitUntil: 'networkidle2', timeout: 45000 });
await page.waitForSelector('#collaboration');
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
});
const res = await page.evaluate(() => {
  const out = {};
  const cs = (s) => getComputedStyle(document.querySelector(s));
  out.hOverflowPx = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  const wide = [];
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 376 && r.height > 0 && getComputedStyle(el).position !== 'fixed') {
      wide.push(el.tagName + '.' + (el.className || '').toString().slice(0, 25) + ':' + Math.round(r.width));
    }
  });
  out.widerThanViewport = wide.slice(0, 6);
  out.collabGrid = cs('.collaboration-content').gridTemplateColumns;
  out.formRowGrid = cs('.form-row').gridTemplateColumns;
  out.inputFontPx = cs('.collaboration-form input').fontSize;
  out.textareaFontPx = cs('.collaboration-form textarea').fontSize;
  out.quickCols = cs('.collab-quick').gridTemplateColumns;
  out.statsCols = cs('.collab-stats').gridTemplateColumns;
  out.badgeW = Math.round(document.querySelector('.collab-badge').getBoundingClientRect().width);
  out.iconTile = cs('.info-icon').width + ' x ' + cs('.info-icon').height;
  out.categoryHeaderFont = cs('.category-header').fontSize;
  out.categoryHeaderPad = cs('.category-header').padding;
  out.noticeRadius = cs('.collaboration-notice').borderRadius;
  const ham = document.querySelector('[class*="hamburger"], [class*="nav-toggle"]');
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
  return out;
});
console.log(JSON.stringify(res, null, 1));
await b.close();
