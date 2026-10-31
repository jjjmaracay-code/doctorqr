// v2: sube la versión para forzar que activate() purgue la caché v1 —
// necesario porque js/qr-generator.js se sirve con estrategia "cache
// primero" (ver el handler de fetch más abajo), así que sin este cambio
// de versión los usuarios con la PWA ya instalada seguirían recibiendo
// indefinidamente la versión anterior (con el bug del spinner atascado)
// desde su propia caché, sin importar qué se despliegue en el servidor.
// Se añaden también los archivos de vendor/ (antes cargados desde CDN
// externo) para que la app funcione realmente sin red desde el primer
// arranque, no solo después de una primera visita online.
// v4: mismo motivo que v2 -- el despliegue del gate de 2FA obligatorio
// (login.html/index.html/css/styles.css/js/*) cambió varios de los
// archivos servidos con estrategia "cache primero", así que sin este
// bump los usuarios con la PWA ya instalada seguirían viendo la mezcla
// de HTML nuevo (red primero) + CSS/JS viejos (caché primero) hasta que
// algo distinto forzara la purga.
// v5: precarga la capa visual para conservarla al abrir la app sin red.
// v6: actualiza el dibujo orgánico del QR, conservando sus datos.
// v7: incluye la recuperación segura del autenticador.
// v36: incluye el módulo de fondos de pantalla con QR (los vídeos se guardan al usarse).
// v37: wallpaper studio and end-of-form tools, including offline styles.
// v38: local iPhone video preparation, fixed medical QR and depth animation.
// v39: deliberate form editing; controls start disabled in HTML.
// v40: translucent floating lock without reducing the form width.
// v41: compact, owner-bound medical accessory QR and 30 x 40 mm watch plate.
// v42: single-piece watch tabs, adjustable openings and enlarged liquid QR.
// v43: larger app keyboards and minimal, viewport-aware alignment.
// v44: close both commemorative card borders; keep fold marks outside the artwork.
// v45: frame the actual login password keyboard and show the full form when it fits.
// v46: reveal emergency access with the keyboard and allow both orientations.
// v47: visible neon feedback on touch, pointer and keyboard presses.
// v48: personal medical-information wording; emergency bag tag on both sides.
// v49: wallet appearance controls and desktop/touch 3D section navigation.
// v50: named emergency contacts in white accessory panels.
// v51: prepared emergency QR access survives ordinary mobile logout.
// v52: larger responsive keyboards and satin keycap depth.
// v53: raised linking screens and a live, account-bound device list.
// v54: bounded 2FA verification and a continuous handoff to the editor.
// v55: lower, unbranded wallpaper foreground with a larger medical QR.
// v56: optional passkeys, account-bound recovery and gated Wallet preparation.
// v57: ordered account panels, tactile controls and a dedicated read-only notice row.
const CACHE_NAME = 'doctorqr-v58';
const CACHE_URLS = [
  '/',
  './index.html',
  './vendor/simplewebauthn/browser.umd.min.js?v=14',
  './js/account-tools-i18n.js?v=58',
  './js/account-tools.js?v=56',
  './js/account-access.js?v=56',
  './js/account-wallet.js?v=57',
  './css/account-tools.css?v=58',
  './css/account-layout.css?v=58',
  './css/keyboard-comfort.css?v=5',
  './js/keyboard-comfort.js?v=5',
  './js/country-metrics.js?v=1',
  './login.html',
  './register.html',
  './recovery.html',
  './card.html',
  './emergencia.html',
  './sos',
  './emergencias.html',
  './emergencias',
  './css/emergency-directory.css?v=31',
  './js/emergency-directory.js?v=48',
  './js/emergency-numbers.js?v=31',
  './js/personal-phone.js?v=31',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './css/styles.css',
  './css/atabey-refresh.css?v=18',
  './css/access-hub.css?v=21',
  './css/button-depth.css?v=23',
  './css/trial-access.css?v=23',
  './js/trial-access.js?v=51',
  './js/access-hub.js?v=21',
  './css/web-qr-preview.css?v=22',
  './js/web-qr-preview.js?v=48',
  './js/totp-recovery.js?v=14',
  './js/emergency-access.js?v=51',
  './js/qr-generator.js?v=51',
  './js/qr-wallpaper.js?v=55',
  './css/qr-wallpaper.css?v=37',
  './js/qr-wallpaper-iphone.js?v=38',
  './css/qr-wallpaper-iphone.css?v=38',
  './vendor/mp4-muxer/mp4-muxer-5.2.2.js',
  './css/medical-tools.css?v=37',
  './css/section-navigation.css?v=49',
  './js/section-navigation.js?v=49',
  './js/form-edit-lock.js?v=57',
  './css/form-edit-lock.css?v=40',
  './js/qr-wallpaper-catalog.json',
  './js/card-png.js?v=31',
  './js/compact-emergency-qr.js?v=42',
  './js/emergency-accessories.js?v=50',
  './js/emergency-card.js?v=49',
  './js/medical-owner.js?v=51',
  './js/birthdate.js?v=14',
  './js/profile-sync.js?v=56',
  './js/form.js?v=48',
  './js/form-accessibility.js?v=12.1',
  './js/register-sw.js?v=58',
  './js/web-session.js?v=48',
  './js/web-link.js?v=53',
  './js/qr-visual.js?v=17',
  './css/web-link.css?v=53',
  './css/web-editor.css?v=15',
  './web.html',
  './dispositivos.html',
  './vincular.html',
  './vendor/jsqr/jsQR.js',
  './js/search.js?v=12',
  './js/validation.js?v=14',
  './i18n/loader.js?v=49',
  './i18n/es.json?v=49',
  './i18n/en.json?v=49',
  './i18n/fr.json?v=49',
  './i18n/pt.json?v=49',
  './i18n/de.json?v=49',
  './i18n/eu.json?v=49',
  './i18n/hi.json?v=49',
  './i18n/zh.json?v=49',
  './i18n/ru.json?v=49',
  './i18n/ja.json?v=49',
  './i18n/ar.json?v=49',
  './js/qr-languages.js?v=48',
  './vendor/qrcodejs/qrcode.min.js',
  './vendor/lz-string/lz-string-1.4.4.min.js',
  './vendor/lz-string/lz-string-1.5.0.min.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Admin has its own short session and is never an offline medical application view.
  if (/^\/admin(?:\/|\.html|$)/.test(url.pathname) || url.pathname === '/js/admin.js' || url.pathname === '/css/admin.css') {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }
  if (url.pathname === '/cdn-cgi/trace' || url.pathname.startsWith('/api/') || url.origin !== self.location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }

  const appCode = url.pathname.startsWith('/js/') || url.pathname.startsWith('/i18n/');
  if (appCode) {
    event.respondWith(fetch(event.request, { cache: 'no-cache' }).then(response => {
      if (response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); }
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }

  const isHTML = event.request.mode === 'navigate' ||
                 url.pathname.endsWith('.html');

  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const toCache = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith('doctorqr-') && k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

