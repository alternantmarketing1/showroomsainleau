// Captures du site en ligne, avec ou sans la feuille SAINLEAU injectée.
// La feuille est ajoutée dans le navigateur de test seulement : rien n'est
// enregistré sur le site. Les traceurs (GA4, Google Ads, Hotjar, Smartsupp,
// Doofinder…) sont bloqués pour ne pas fausser les statistiques.
// jQuery, slick et sweetalert2 sont servis depuis node_modules (npm install).
//
// Usage : node captures.js taches.json refonte-site/theme/PRS005_07_sainleau
// taches.json : [{ "url": "...", "out": "x.png", "width": 1440, "height": 900,
//   "full": false, "css": true, "hover": "sélecteur", "scroll": 1400,
//   "focusSel": "sélecteur" }]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const NM = path.join(__dirname, 'node_modules');
const BLOCK = /googletagmanager|google-analytics|googleadservices|doubleclick|hotjar|smartsupp|facebook|fbcdn|doofinder|klaviyo|clarity\.ms|bing\.com|googlesyndication|recaptcha|societe-des-avis-garantis|cloudflareinsights|tiktok|linkedin|sumo|crisp/i;
const MIME = { '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
function local(url) {
  let m;
  if (/code\.jquery\.com\/jquery-3\.6\.0\.min\.js/.test(url)) return path.join(NM, 'jquery/dist/jquery.min.js');
  if ((m = url.match(/slick-carousel@1\.8\.1\/(slick\/[^?]+)/))) return path.join(NM, 'slick-carousel', m[1]);
  if ((m = url.match(/sweetalert2@11\.22\.0\/(dist\/[^?\s]+)/))) return path.join(NM, 'sweetalert2', m[1]);
  return null;
}
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const themeDir = process.argv[3];
  const browser = await chromium.launch();
  for (const j of jobs) {
    const ctx = await browser.newContext({ viewport: { width: j.width, height: j.height || 900 }, deviceScaleFactor: j.scale || 1, locale: 'fr-FR' });
    // cookie déjà accepté pour ne pas avoir le bandeau sur les captures (sauf demande)
    const page = await ctx.newPage();
    await page.route('**/*', async r => {
      const u = r.request().url();
      if (BLOCK.test(u) && !/__sainleau__/.test(u)) return r.abort();
      const f = local(u);
      if (f && fs.existsSync(f)) return r.fulfill({ path: f, contentType: MIME[path.extname(f)] || 'text/plain' });
      const m = u.match(/\/__sainleau__\/(.+?)(\?.*)?$/);
      if (m && themeDir) {
        const p = path.join(themeDir, m[1]);
        if (fs.existsSync(p)) return r.fulfill({ path: p, contentType: MIME[path.extname(p)] || 'application/octet-stream' });
        return r.fulfill({ status: 404, body: '' });
      }
      if (/^https?:\/\/(?!sainleau\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)/.test(u) && !/^data:/.test(u)) return r.abort();
      return r.continue();
    });
    try {
      await page.goto(j.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) {}
      if (j.css) {
        await page.evaluate(() => {
          const l = document.createElement('link');
          l.rel = 'stylesheet'; l.href = '/__sainleau__/assets/css/sainleau.css?' + Date.now();
          document.head.appendChild(l);
        });
        await page.waitForTimeout(800);
        await page.evaluate(() => document.fonts.ready);
      }
      if (!j.cookies) await page.evaluate(() => { const c = document.querySelector('.ttcookie, #ttcookie, #tt-cookie, .cookie-notice, #cookie-notice, .tt-cookie-banner'); if (c) c.remove(); });
      if (j.full) { await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); }); await page.waitForTimeout(800); }
      if (j.scroll) { await page.evaluate(y => window.scrollTo(0, y), j.scroll); await page.waitForTimeout(900); }
      if (j.tabs) { for (let i = 0; i < j.tabs; i++) await page.keyboard.press('Tab'); }
      if (j.focusSel) { await page.evaluate(s => { const e = document.querySelector(s); if (e) { e.scrollIntoView({block:'center'}); } }, j.focusSel); await page.focus(j.focusSel); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); }
      if (j.hover) { try { await page.hover(j.hover, { timeout: 3000 }); } catch (e) { console.log('hover?', j.hover); } }
      if (j.focus) { try { await page.keyboard.press('Tab'); await page.focus(j.focus); } catch (e) { console.log('focus?', j.focus); } }
      await page.waitForTimeout(j.wait || 1200);
      const opts = { path: j.out, fullPage: !!j.full };
      if (j.clip) {
        const el = await page.$(j.clip);
        if (el) { await el.screenshot({ path: j.out }); console.log('ok', j.out); await ctx.close(); continue; }
      }
      await page.screenshot(opts);
      console.log('ok', j.out);
    } catch (e) { console.log('ERR', j.out, e.message); }
    await ctx.close();
  }
  await browser.close();
})();
