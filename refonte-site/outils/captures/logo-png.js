const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const svg = fs.readFileSync(process.argv[2], 'utf8');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 178, height: 38 }, deviceScaleFactor: 2 });
  await p.setContent('<html><body style="margin:0;background:transparent">' + svg.replace('<svg ', '<svg style="display:block" ') + '</body></html>');
  await p.screenshot({ path: process.argv[3], omitBackground: true, clip: { x: 0, y: 0, width: 178, height: 38 } });
  await b.close();
})();
