// Loader i18n compartido por register.html, login.html, index.html y recovery.html.
// Fase 2: multiidioma (es/en/fr/pt/de).
//
// Carga con fetch() ASÍNCRONO a propósito -- un XHR síncrono choca con
// Service Workers que interceptan toda petición GET con un handler `fetch`
// basado en promesas (verificado empíricamente en IDENTIFLY: deja al script
// que sigue al loader sin ejecutarse con normalidad, sin ningún error visible
// en consola). fetch() es la API para la que los Service Workers están
// diseñados, así que no tiene ese problema.
//
// Selección de idioma, en orden de prioridad:
//   1. doctorqr_user.language -- el usuario ya se registró (o ya inició
//      sesión en este dispositivo tras registrarse en otro) y fijó un
//      idioma para su cuenta. DOCTORQR usa login real email+contraseña
//      contra un backend (Railway), no PIN local como IDENTIFLY -- el
//      backend NO conoce ni devuelve este campo, así que login.html debe
//      preservarlo explícitamente al reconstruir doctorqr_user en cada
//      inicio de sesión (ver login.html) en vez de perderlo.
//   2. navigator.language / navigator.languages -- dispositivo sin sesión
//      guardada todavía: se usa el idioma del navegador como default
//      razonable.
//   3. 'es' -- fallback final, tanto si el idioma detectado no está entre
//      los soportados como si el fetch del diccionario correspondiente
//      fallara por cualquier motivo (red, 404, etc.).
//
// Cada página debe arrancar su propio bootstrap (renderizado inmediato de
// teclados, listeners que pintan texto al cargar, etc.) DENTRO de
// `window.i18nReady.finally(fn)` en vez de invocarlo directo -- así se
// asegura que t()/data-i18n ya tengan el diccionario cargado antes del
// primer render. `.finally()` (no `.then()`) para que la página arranque
// igual, con las claves crudas como fallback, si ningún diccionario
// llegara a cargar por cualquier motivo.
//
// Diccionario completamente separado del T={es,en,fr} de card.html (el
// contenido médico que ve el paramédico al escanear el QR) -- ese sistema
// no se toca ni se fusiona con este. El idioma de cuenta (este) y el
// idioma del QR (card.html) son dos mecanismos independientes.
(function () {
  var SUPPORTED_LANGS = ['es', 'en', 'fr', 'pt', 'de'];
  var DICT = {};

  function detectLanguage() {
    try {
      var user = JSON.parse(localStorage.getItem('doctorqr_user') || 'null');
      if (user && user.language && SUPPORTED_LANGS.indexOf(user.language) !== -1) {
        return user.language;
      }
    } catch (e) {}
    var navLangs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'es'];
    for (var i = 0; i < navLangs.length; i++) {
      var code = String(navLangs[i] || '').slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.indexOf(code) !== -1) return code;
    }
    return 'es';
  }

  var LANG = detectLanguage();
  window.currentLanguage = LANG;

  window.t = function (key) {
    return Object.prototype.hasOwnProperty.call(DICT, key) ? DICT[key] : key;
  };

  function applyI18n(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (Object.prototype.hasOwnProperty.call(DICT, key)) el.textContent = DICT[key];
    });
    root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (Object.prototype.hasOwnProperty.call(DICT, key)) el.innerHTML = DICT[key];
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (Object.prototype.hasOwnProperty.call(DICT, key)) el.placeholder = DICT[key];
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (Object.prototype.hasOwnProperty.call(DICT, key)) el.setAttribute('aria-label', DICT[key]);
    });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (Object.prototype.hasOwnProperty.call(DICT, key)) el.title = DICT[key];
    });
  }
  window.applyI18n = applyI18n;

  // Cambio de idioma EN VIVO -- usado por el selector de idioma de la
  // pantalla de datos de identidad en register.html: el usuario debe ver
  // el resto del formulario (pantallas siguientes, toasts, validaciones)
  // en el idioma que acaba de elegir, sin esperar a completar el
  // registro. Recarga el diccionario y vuelve a aplicar data-i18n sobre
  // todo el documento; el valor persistido en doctorqr_user.language se
  // guarda aparte, al completar el registro (ver register.html).
  window.setLanguage = function (lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = 'es';
    return fetch('/i18n/' + lang + '.json')
      .then(function (res) { return res.ok ? res.json() : {}; })
      .catch(function () { return {}; })
      .then(function (dict) {
        DICT = dict || {};
        window.currentLanguage = lang;
        applyI18n(document);
        return DICT;
      });
  };

  window.i18nReady = fetch('/i18n/' + LANG + '.json')
    .then(function (res) { return res.ok ? res.json() : null; })
    .catch(function () { return null; })
    .then(function (dict) {
      // Si el idioma detectado no cargó (red caída, archivo ausente, etc.)
      // y no era ya español, reintenta con español antes de rendirse --
      // nunca debe llegarse a una página sin ningún diccionario cargado
      // si se puede evitar.
      if (dict) return dict;
      if (LANG === 'es') return {};
      window.currentLanguage = 'es';
      return fetch('/i18n/es.json')
        .then(function (res) { return res.ok ? res.json() : {}; })
        .catch(function () { return {}; });
    })
    .then(function (dict) {
      DICT = dict || {};
      applyI18n(document);
      return DICT;
    });
})();
