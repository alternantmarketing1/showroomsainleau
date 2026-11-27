// Captures de la préprod avec ou sans le module sainleaurefonte simulé.
// La feuille et le script du module sont ajoutés dans le navigateur de test
// (rien n'est modifié sur le site). Les traceurs sont bloqués.
// Usage : node capture.js taches.json <dossier du module>
// taches : [{url, out, width, height, full, css, scroll, hover, click, wait, eval}]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const NM = path.join(__dirname, 'node_modules');
const BLOCK = /googletagmanager|google-analytics|googleadservices|doubleclick|hotjar|facebook\.(com|net)|fbcdn|doofinder|klaviyo|clarity\.ms|bing\.com|googlesyndication|recaptcha|cloudflareinsights|tiktok|linkedin\.com|tawk/i;
// Widgets affichés sur la page (chat, avis, paiement) : chargés, sauf avec sansTiers
const TIERS = /smartsupp|societe-des-avis-garantis|fintecture/i;
const MIME = { '.css': 'text/css', '.js': 'application/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
function local(url) {
  let m;
  if (/code\.jquery\.com\/jquery-3\.6\.0\.min\.js/.test(url)) return path.join(NM, 'jquery/dist/jquery.min.js');
  if ((m = url.match(/slick-carousel@1\.8\.1\/(slick\/[^?\s]+)/))) return path.join(NM, 'slick-carousel', m[1]);
  if ((m = url.match(/sweetalert2@11\.22\.0\/(dist\/[^?\s]+)/))) return path.join(NM, 'sweetalert2', m[1]);
  return null;
}
async function injecter(page) {
  await page.evaluate(() => new Promise(res => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = '/__module__/views/css/sainleau.css?' + Date.now();
    l.onload = res; l.onerror = res;
    document.head.appendChild(l);
  }));
  await page.evaluate(() => new Promise(res => {
    const s = document.createElement('script');
    s.src = '/__module__/views/js/sainleau.js?' + Date.now();
    s.onload = res; s.onerror = res;
    document.body.appendChild(s);
  }));
  await page.evaluate(() => document.fonts.ready);
}
async function defiler(page) {
  await page.evaluate(async () => {
    const pas = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += pas) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 180));
    }
    window.scrollTo(0, 0);
  });
  // attendre les images différées
  await page.waitForFunction(() => [...document.images].filter(i => i.getBoundingClientRect().width > 0).every(i => i.complete), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(600);
}
(async () => {
  const taches = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const moduleDir = process.argv[3];
  const browser = await chromium.launch();
  for (const t of taches) {
    const ctx = await browser.newContext({ viewport: { width: t.width, height: t.height || 900 }, deviceScaleFactor: t.scale || 1, locale: 'fr-FR' });
    const page = await ctx.newPage();
    if (t.journal) {
      page.on('requestfailed', q => { if (TIERS.test(q.url())) console.log('échec', q.url().slice(0, 120), q.failure() && q.failure().errorText); });
      page.on('pageerror', e => console.log('erreur JS', e.message.split('\n')[0]));
    }
    await page.route('**/*', async r => {
      const u = r.request().url();
      // Fichiers du module : la copie de travail remplace la version installée
      const m = u.match(/\/__module__\/(.+?)(\?.*)?$/) || u.match(/\/modules\/sainleaurefonte\/(.+?)(\?.*)?$/);
      if (m) {
        const p = path.join(moduleDir, m[1]);
        return fs.existsSync(p) ? r.fulfill({ path: p, contentType: MIME[path.extname(p)] || 'application/octet-stream' }) : r.fulfill({ status: 404, body: '' });
      }
      // Page principale : feuille et script du module insérés dans le HTML,
      // comme le fait le module (feuille chargée avant les scripts du thème)
      if (t.css && r.request().resourceType() === 'document' && r.request().isNavigationRequest() && r.request().frame() === page.mainFrame()) {
        try {
          let html = execFileSync('curl', ['-sS', '-L', '--max-time', '60', '-A', 'Mozilla/5.0 (X11; Linux x86_64) Chrome/130 Safari/537.36', u], { maxBuffer: 50 * 1024 * 1024 }).toString('utf8');
          if (!/modules\/sainleaurefonte\//.test(html)) {
            html = html.replace('</head>', '<link rel="stylesheet" href="/__module__/views/css/sainleau.css" media="all"></head>');
            html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, '<script src="/__module__/views/js/sainleau.js"></script></body>');
          }
          return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
        } catch (e) { console.log('curl ?', e.message.split('\n')[0]); }
      }
      if (BLOCK.test(u) || (t.sansTiers && TIERS.test(u))) return r.abort();
      const f = local(u);
      if (f && fs.existsSync(f)) return r.fulfill({ path: f, contentType: MIME[path.extname(f)] || 'text/plain' });
      if (/^https?:\/\/(?!dev\.sainleau\.com|sainleau\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)/.test(u) && !TIERS.test(u)) return r.abort();
      return r.continue();
    });
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch (e) {}
      await page.addStyleTag({ content: '.eupopup-container{display:none!important}' + (t.full ? '.add_to_cart_sticky{display:none!important}' : '') });
      if (t.css) await page.evaluate(() => document.fonts.ready);
      // carrousels figés pour des captures stables
      await page.evaluate(() => { try { const $ = window.jQuery; if ($) { $('.slick-slider.slick-initialized').slick('slickPause').slick('slickGoTo', 0, true); $('.owl-carousel').trigger('stop.owl.autoplay').trigger('to.owl.carousel', [0, 0]); } } catch (e) {} });
      if (t.full) await defiler(page);
      if (t.eval) { const res = await page.evaluate(t.eval); if (res !== undefined) console.log(typeof res === 'string' ? res : JSON.stringify(res)); }
      if (t.click) { try { await page.click(t.click, { timeout: 4000 }); } catch (e) { console.log('clic ?', t.click); } }
      if (t.scroll) { await page.evaluate(y => window.scrollTo(0, y), t.scroll); await page.waitForTimeout(900); }
      if (t.hover) { try { await page.hover(t.hover, { timeout: 4000 }); } catch (e) { console.log('survol ?', t.hover); } }
      await page.waitForTimeout(t.wait || 1000);
      if (t.clip) {
        const el = await page.$(t.clip);
        if (el) { await el.screenshot({ path: t.out }); console.log('ok', t.out); await ctx.close(); continue; }
      }
      await page.screenshot({ path: t.out, fullPage: !!t.full });
      console.log('ok', t.out);
    } catch (e) { console.log('ERREUR', t.out, e.message.split('\n')[0]); }
    await ctx.close();
  }
  await browser.close();
})();
