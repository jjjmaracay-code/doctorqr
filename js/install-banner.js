// Banner de instalacion PWA: solo register.html (unica pantalla de entrada
// donde vive). Nunca en login.html, index.html (ya tiene su propio
// "Instalar app" en el menu del editor), ni card.html/emergencia.html.
// Sin desplazamientos automaticos de la pagina bajo ninguna circunstancia.
// Traduce solo su propio subarbol, dentro de window.i18nReady, sin volver a
// traducir toda la pagina (ver i18n/loader.js).
(function () {
  'use strict';
  try {
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    var DISMISS_KEY = 'doctorqr_install_banner_dismissed';
    var DISMISS_MS = 7 * 24 * 60 * 60 * 1000;
    try {
      var dismissedAt = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
      if (dismissedAt && (Date.now() - dismissedAt) < DISMISS_MS) return;
    } catch (_) {}

    var ua = navigator.userAgent || '';
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    var isAndroid = /Android/i.test(ua);
    var isMobile = isIOS || isAndroid || /Mobile/i.test(ua);
    if (!isMobile) return;

    var banner, closeBtn, cta, titleEl, androidBlock, iosBlock, fallbackEl;
    var deferredPrompt = null;
    var shown = false;
    var resizeObserver = null;

    function reserveSpace() {
      if (!banner || !shown) return;
      document.body.style.paddingBottom = banner.offsetHeight + 'px';
    }
    function releaseSpace() {
      document.body.style.paddingBottom = '';
    }

    function dismiss() {
      hide();
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (_) {}
    }

    function hide() {
      if (!banner) return;
      shown = false;
      banner.hidden = true;
      releaseSpace();
    }

    function show() {
      if (shown || !banner) return;
      shown = true;
      banner.hidden = false;
      reserveSpace();
    }

    function retranslate() {
      if (!banner || typeof window.applyI18n !== 'function') return;
      window.applyI18n(banner);
      reserveSpace();
    }

    function buildBanner() {
      banner = document.getElementById('install-banner');
      if (!banner) return;
      closeBtn = document.getElementById('install-banner-close');
      cta = document.getElementById('install-banner-cta');
      titleEl = document.getElementById('install-banner-title');
      androidBlock = document.getElementById('install-banner-android');
      iosBlock = document.getElementById('install-banner-ios');
      fallbackEl = document.getElementById('install-banner-fallback');

      if (isIOS) {
        if (androidBlock) androidBlock.hidden = true;
        if (iosBlock) iosBlock.hidden = false;
        if (titleEl) {
          titleEl.setAttribute('data-i18n', 'install_banner.title_ios');
          titleEl.textContent = window.t ? window.t('install_banner.title_ios') : 'Instalar en iPhone / iPad';
        }
      } else {
        if (iosBlock) iosBlock.hidden = true;
        if (androidBlock) androidBlock.hidden = false;

        if (cta) {
          cta.addEventListener('click', function () {
            if (deferredPrompt) {
              var prompted = deferredPrompt;
              deferredPrompt = null;
              prompted.prompt();
              prompted.userChoice.catch(function () {});
            } else if (fallbackEl) {
              fallbackEl.hidden = false;
              reserveSpace();
            }
          });
        }
        window.addEventListener('beforeinstallprompt', function (e) {
          e.preventDefault();
          deferredPrompt = e;
        });
      }

      if (closeBtn) closeBtn.addEventListener('click', dismiss);
      window.addEventListener('appinstalled', hide);

      if (typeof ResizeObserver === 'function') {
        resizeObserver = new ResizeObserver(reserveSpace);
        resizeObserver.observe(banner);
      } else {
        window.addEventListener('resize', reserveSpace);
      }
    }

    document.addEventListener('DOMContentLoaded', function () {
      buildBanner();
      if (!banner) return;
      if (window.i18nReady && typeof window.i18nReady.finally === 'function') {
        window.i18nReady.finally(retranslate);
      }
      window.addEventListener('doctorqr:language-changed', retranslate);
      setTimeout(show, 3000);
    });
  } catch (_) {}
})();
