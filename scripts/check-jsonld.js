import fs from 'fs';
const html = fs.readFileSync('dist/index.html', 'utf8');
const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
let match, i = 0, ok = true;
while ((match = re.exec(html)) !== null) {
  i++;
  try {
    const data = JSON.parse(match[1]);
    console.log(`JSON-LD block ${i}: valid JSON (@type: ${data['@type']})`);
  } catch (e) {
    ok = false;
    console.log(`JSON-LD block ${i}: INVALID - ${e.message}`);
  }
}
console.log(`total blocks: ${i}`);
process.exit(ok ? 0 : 1);
