// Fondos de pantalla con QR. Chromium real, servidor local, perfil ficticio, sin peticiones a producción.
// Comprueba: montaje del botón, galería, PNG y MP4 legibles por jsQR, aviso de fondo desactualizado,
// tamaños de pantalla, RTL, ausencia de escrituras de red y archivos protegidos intactos.
const { chromium } = require('playwright'), fs = require('fs'), path = require('path'), http = require('http');
const { execFileSync } = require('child_process'), assert = require('node:assert/strict'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png' };

function serve() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://x');
      if (url.pathname === '/harness.html') { res.writeHead(200, { 'content-type': 'text/html' }); res.end(HARNESS); return; }
      const file = path.join(ROOT, decodeURIComponent(url.pathname));
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
      const data = fs.readFileSync(file), type = TYPES[path.extname(file)] || 'application/octet-stream';
      const range = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
      if (range) {
        const start = +range[1], end = range[2] ? +range[2] : data.length - 1;
        res.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${data.length}`, 'content-length': end - start + 1 });
        res.end(data.subarray(start, end + 1)); return;
      }
      res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': data.length }); res.end(data);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

// Página de prueba: el botón de imprimir y la sección de QR existen como en index.html.
// Se cargan qr-generator.js REAL (sin cambios) y el módulo nuevo; solo el perfil es ficticio.
const HARNESS = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/css/qr-wallpaper.css?v=37"></head><body style="background:#000;color:#fff;margin:0">
<div id="qr-section" style="display:none;padding:0 16px"><div id="qr-carousel"></div><div id="qr-dots"></div>
<button id="btn-print-emergency">IMPRIMIR</button></div>
<script>
  window.__profile = { nombre: 'Prueba', apellidos: 'Ficticia', sangre: 'O+', ec1_phone_prefix: '+34', ec1_phone_num: '600000000' };
  window.MedicalOwner = { current: () => true, read: () => window.__profile, id: () => 'TEST-0000-FICTICIO' };
</script>
<script src="/vendor/qrcodejs/qrcode.min.js"></script>
<script src="/js/qr-generator.js?v=31"></script>
<script>window.getFormData = () => window.__profile;</script>
<script src="/js/qr-wallpaper.js?v=37"></script></body></html>`;

(async () => {
  const server = await serve(), base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || chromium.executablePath(), args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const report = {};
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, acceptDownloads: true });
    const page = await ctx.newPage();
    const errors = [], writes = [], external = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errors.push(m.text()); });
    page.on('request', r => {
      if (!r.url().startsWith(base) && !r.url().startsWith('blob:') && !r.url().startsWith('data:')) external.push(r.url());
      if (!['GET', 'HEAD'].includes(r.method())) writes.push(r.method() + ' ' + r.url());
    });
    await page.goto(base + '/harness.html');
    await page.evaluate(() => { document.getElementById('qr-section').style.display = 'block'; });

    // 1. Botón montado justo después de "Imprimir", sin tocar el botón existente.
    const order = await page.evaluate(() => [...document.getElementById('qr-section').children].map(e => e.id));
    assert.deepEqual(order.slice(-3), ['btn-print-emergency', 'btn-qr-wallpaper', 'qrw-stale']);
    report.boton = 'ok';

    // 2. Abrir: galería completa y vista previa dibujada.
    await page.click('#btn-qr-wallpaper');
    await page.waitForSelector('.qrw-bg[aria-pressed=true]');
    const gallery = await page.$$eval('.qrw-bg', b => b.length);
    const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'js/qr-wallpaper-catalog.json'), 'utf8')).fondos.length;
    assert.equal(gallery, catalog); report.galeria = gallery;
    await page.waitForFunction(() => { const v = document.querySelector('#qrw-overlay video'); return v && v.readyState >= 2; }, null, { timeout: 15000 });
    await page.waitForTimeout(400);
    const lit = await page.evaluate(() => { const c = document.querySelector('.qrw-preview'), d = c.getContext('2d').getImageData(0, 0, c.width, 60).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; return s / (d.length / 4); });
    assert.ok(lit > 10, 'la vista previa muestra el fondo'); report.vista_previa = 'ok';

    // 3. PNG: se crea, se verifica dentro de la app y lo vuelve a leer un decodificador aparte.
    const expected = await page.evaluate(() => buildEmergencyQRUrl());
    assert.equal(expected, 'https://atabeyapp.app/card.html?id=TEST-0000-FICTICIO&t=emergency');
    await page.click('text=' + 'Crear imagen (PNG)');
    await page.waitForSelector('.qrw-status[data-kind=ok]', { timeout: 20000 });
    const png = await page.evaluate(async () => {
      const a = document.querySelector('.qrw-result a'), blob = await (await fetch(a.href)).blob();
      const bmp = await createImageBitmap(blob), c = document.createElement('canvas'); c.width = Math.round(bmp.width * 0.4); c.height = Math.round(bmp.height * 0.4);
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(bmp, 0, 0, c.width, c.height);
      const code = jsQR(g.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
      return { w: bmp.width, h: bmp.height, type: blob.type, data: code && code.data, name: a.download };
    });
    assert.equal(png.data, expected); assert.equal(png.w, 1080); assert.ok(png.h >= 1920 && png.h <= 2400); assert.equal(png.type, 'image/png');
    report.png = png;

    // 4. MP4: H.264 real (WebCodecs + mp4-muxer) y lectura del QR en fotogramas extraídos con ffmpeg.
    await page.click('#qrw-mp4');
    await page.waitForSelector('.qrw-status[data-kind=ok]:has-text("Vídeo")', { timeout: 180000 });
    const mp4b64 = await page.evaluate(async () => {
      const a = document.querySelector('.qrw-result a'), buf = await (await fetch(a.href)).arrayBuffer();
      let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return { b64: btoa(s), name: a.download, webcodecs: typeof VideoEncoder !== 'undefined' };
    });
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qrw-')), mp4 = path.join(tmp, mp4b64.name);
    fs.writeFileSync(mp4, Buffer.from(mp4b64.b64, 'base64'));
    const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,width,height,nb_frames:format=duration', '-of', 'json', mp4]).toString());
    const frames = [0.2, 3.5, 7.5].map((t, i) => { const out = path.join(tmp, `f${i}.png`); execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', mp4, '-frames:v', '1', '-vf', 'scale=432:-2', out]); return 'data:image/png;base64,' + fs.readFileSync(out).toString('base64'); });
    const decoded = await page.evaluate(async list => Promise.all(list.map(async src => {
      const img = new Image(); img.src = src; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const code = jsQR(g.getImageData(0, 0, c.width, c.height).data, c.width, c.height); return code && code.data;
    })), frames);
    assert.ok(decoded.every(d => d === expected), 'QR legible en los fotogramas del MP4: ' + JSON.stringify(decoded));
    assert.equal(probe.streams[0].codec_name, 'h264');
    report.mp4 = { webcodecs: mp4b64.webcodecs, codec: probe.streams[0].codec_name, size: `${probe.streams[0].width}x${probe.streams[0].height}`, duracion: probe.format.duration, kb: Math.round(fs.statSync(mp4).size / 1024), fotogramas_leidos: decoded.length };
    fs.copyFileSync(mp4, path.join(os.tmpdir(), 'qrw-ultimo.mp4'));

    // 4b. Segundo lector independiente (ZXing) y jsQR en los 24 fondos, 4 momentos y varias escalas de cámara.
    let zxing = null; try { zxing = require.resolve('@zxing/library/umd/index.min.js'); } catch (_) {}
    if (zxing) {
      await page.addScriptTag({ path: zxing });
      const sweep = await page.evaluate(async scales => {
        const W = AtabeyQRWallpaper, mask = W._qr(), url = buildEmergencyQRUrl();
        const pals = [...document.querySelectorAll('#qrw-qrcolor option')].map(x => x.value);
        const cat = (await (await fetch('/js/qr-wallpaper-catalog.json')).json()).fondos;
        const v = document.createElement('video'); v.muted = true; v.playsInline = true; document.body.appendChild(v);
        let total = 0; const fails = [];
        for (const f of cat) {
          v.src = f.video; await new Promise(r => v.addEventListener('loadeddata', r, { once: true }));
          for (const t of [0.3, 2.3, 4.3, 6.3]) {
            v.currentTime = t; await new Promise(r => v.addEventListener('seeked', r, { once: true }));
            for (const pal of (t === 0.3 ? pals : ['azul'])) {
            const o = Object.assign(W._opts(), { palette: pal });
            const c = document.createElement('canvas'); c.width = 1080; c.height = 2338; const L = W._compose(c.getContext('2d'), 1080, 2338, v, mask, o);
            const crop = sc => { const k = document.createElement('canvas'); k.width = Math.ceil(L.pw * sc); k.height = Math.ceil(L.ph * sc);
              const g = k.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(c, L.px, L.py, L.pw, L.ph, 0, 0, k.width, k.height);
              return { k, d: g.getImageData(0, 0, k.width, k.height) }; };
            // ZXing: debe leer en las 2 escalas (la menor deja ~4 px por módulo, más exigente que una cámara real).
            for (const sc of scales) {
              const { k, d } = crop(sc), gray = new Uint8ClampedArray(k.width * k.height);
              for (let i = 0; i < gray.length; i++) gray[i] = (d.data[i * 4] + 2 * d.data[i * 4 + 1] + d.data[i * 4 + 2]) / 4;
              let z = ''; try { z = new ZXing.QRCodeReader().decode(new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.RGBLuminanceSource(gray, k.width, k.height)))).getText(); } catch (_) {}
              total++; if (z !== url) fails.push(f.id + '@' + t + ' ' + pal + ' ZXing x' + sc);
            }
            // jsQR: misma regla que la app (al menos 4 de 6 anchos de cámara).
            let ok = 0;
            for (const wpx of [420, 370, 330, 290, 250, 210]) { const { k, d } = crop(wpx / L.pw); const j = jsQR(d.data, k.width, k.height, { inversionAttempts: 'dontInvert' }); if (j && j.data === url) ok++; }
            total++; if (ok < 4) fails.push(f.id + '@' + t + ' ' + pal + ' jsQR ' + ok + '/6');
            }
          }
        }
        v.remove(); return { total, fails };
      }, [0.43, 0.3]);
      if (sweep.fails.length) console.log('FALLOS', JSON.stringify(sweep.fails));
      assert.deepEqual(sweep.fails, [], 'lecturas fallidas');
      report.lectura_24_fondos = `${sweep.total}/${sweep.total} comprobaciones (ZXing en 2 escalas + jsQR >= 4/6)`;
    }

    // 5. Modo QR a pantalla completa: dibuja, mantiene el QR legible y se cierra.
    await page.click('text=Modo QR a pantalla completa');
    await page.waitForSelector('#qrw-full canvas'); await page.waitForTimeout(500);
    const fullRead = await page.evaluate(() => { const src = document.querySelector('#qrw-full canvas'), c = document.createElement('canvas'); c.width = Math.round(src.width * 0.5); c.height = Math.round(src.height * 0.5); c.getContext('2d').drawImage(src, 0, 0, c.width, c.height); const code = jsQR(c.getContext('2d').getImageData(0, 0, c.width, c.height).data, c.width, c.height); return code && code.data; });
    assert.equal(fullRead, expected);
    await page.click('.qrw-full-exit'); assert.equal(await page.$('#qrw-full'), null);
    report.pantalla_completa = 'ok';

    // 6. Aviso de desactualizado: QR U1 (incluye nombre) y luego cambia el perfil.
    await page.selectOption('#qrw-type', 'qr-u1'); await page.waitForTimeout(300);
    await page.click('text=Crear imagen (PNG)');
    await page.waitForSelector('.qrw-status[data-kind=ok]', { timeout: 20000 });
    await page.click('.qrw-close');
    assert.equal(await page.$eval('#qrw-stale', e => e.hidden), true);
    await page.evaluate(() => { window.__profile.nombre = 'Cambiado'; document.getElementById('qr-section').style.display = 'none'; document.getElementById('qr-section').style.display = 'block'; });
    await page.waitForFunction(() => !document.getElementById('qrw-stale').hidden, null, { timeout: 5000 });
    report.aviso_desactualizado = 'ok';
    const stored = await page.evaluate(() => localStorage.getItem('doctorqr_qr_wallpaper'));
    assert.ok(!/Prueba|Cambiado|atabeyapp\.app/.test(stored), 'solo se guarda una huella, no la URL ni el nombre');

    // 7. Tamaños de pantalla y RTL: sin desbordamiento horizontal, controles >= 44px.
    const sizes = [];
    for (const [w, h] of [[320, 568], [360, 640], [390, 844], [768, 1024], [844, 390]]) {
      await page.setViewportSize({ width: w, height: h });
      await page.click('#btn-qr-wallpaper'); await page.waitForSelector('.qrw-preview');
      const m = await page.evaluate(() => ({ overflow: document.getElementById('qrw-overlay').scrollWidth > window.innerWidth + 1, small: [...document.querySelectorAll('#qrw-overlay button, #qrw-overlay select, #qrw-overlay label.qrw-secondary')].filter(b => b.getBoundingClientRect().height && b.getBoundingClientRect().height < 44).length }));
      assert.equal(m.overflow, false, `desbordamiento a ${w}px`); assert.equal(m.small, 0, `controles pequeños a ${w}px`);
      sizes.push(`${w}x${h}`); await page.click('.qrw-close');
    }
    report.tamanos = sizes;
    await page.evaluate(() => { document.documentElement.lang = 'ar'; document.documentElement.dir = 'rtl'; });
    await page.click('#btn-qr-wallpaper'); await page.waitForSelector('.qrw-title');
    assert.equal(await page.$eval('.qrw-title', e => e.textContent), 'خلفية شاشة مع QR');
    await page.click('.qrw-close'); report.rtl = 'ok';

    assert.deepEqual(errors, [], 'errores de JavaScript'); assert.deepEqual(writes, [], 'peticiones de escritura'); assert.deepEqual(external, [], 'peticiones externas');
    report.errores = 0; report.escrituras = 0; report.externas = 0;
    console.log(JSON.stringify(report, null, 1));
    console.log('qr-wallpaper-browser: OK');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exit(1); });
