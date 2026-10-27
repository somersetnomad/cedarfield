// Builds companion-guide.pdf from print.html (which reads content/chapter-NN.js).
// Usage: node scripts/build-pdf.js [chapters]   e.g. `node scripts/build-pdf.js 1` for a one-chapter test.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const chapters = +process.argv[2] || 56;
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2', '.svg':'image/svg+xml' };
const srv = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
srv.listen(0, async () => {
  const port = srv.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`http://localhost:${port}/print.html?chapters=${chapters}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('body[data-ready="1"]', { timeout: 120000 });
  const out = path.join(root, 'companion-guide.pdf');
  await page.pdf({
    path: out, format: 'A4', printBackground: true, outline: true, tagged: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font:8px Georgia,serif;color:#444;padding:0 17mm;display:flex;justify-content:space-between"><span>Cedarfield After Dark · a fan-made companion to The Stranger</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    margin: { top: '18mm', bottom: '20mm', left: '17mm', right: '17mm' }
  });
  await browser.close(); srv.close();
  try { console.log(require('child_process').execFileSync('python3', [path.join(__dirname, 'fix-outline.py'), out]).toString().trim()); } catch (e) { console.warn('Skipped outline fix (needs python3 + pypdf).'); }
  console.log('Wrote', out, (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
});
