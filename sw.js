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
const CACHE_NAME = 'doctorqr-v12.1';
const CACHE_URLS = [
  '/',
  './index.html',
  './login.html',
  './register.html',
  './recovery.html',
  './card.html',
  './emergencia.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './css/styles.css',
  './css/atabey-refresh.css?v=12',
  './js/totp-recovery.js?v=12',
  './js/qr-generator.js?v=12',
  './js/medical-owner.js?v=12',
  './js/birthdate.js?v=12',
  './js/profile-sync.js?v=12',
  './js/form.js?v=12.1',
  './js/form-accessibility.js?v=12.1',
  './js/register-sw.js?v=12.1',
  './js/search.js?v=12',
  './js/validation.js?v=12',
  './i18n/loader.js?v=12',
  './i18n/es.json?v=12',
  './i18n/en.json?v=12',
  './i18n/fr.json?v=12',
  './i18n/pt.json?v=12',
  './i18n/de.json?v=12',
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
  if (url.pathname.startsWith('/api/') || url.origin !== self.location.origin) {
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

