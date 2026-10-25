// Loader i18n compartido por register.html, login.html, index.html y recovery.html.
// Once idiomas de interfaz; textos médicos originales preservados.
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
  var SUPPORTED_LANGS = ["es", "en", "fr", "de", "pt", "eu", "hi", "zh", "ru", "ja", "ar"];
  var DICT = {};
  var FALLBACK = {};
  var sequence = 0;
  window.atabeySupportedLanguages = SUPPORTED_LANGS.slice();
  window.uiMessage = function(key, source, values) {
    var value=window.t ? window.t(key) : source;
    if (!value || value === key) value=source;
    return value.replace(/\{(\d+)\}/g,function(match,index){return values && index in values ? String(values[index]) : match;});
  };

  window.uiServerMessage = function(message) {
    var normalize=function(value){return String(value || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9À-ÿ]+/g,'');};
    var wanted=normalize(message);
    var key=Object.keys(FALLBACK).find(function(k){return normalize(FALLBACK[k]) === wanted;});
    return key && DICT[key] ? DICT[key] : String(message || DICT['ui.server_error'] || '');
  };
  function flatten(dict) {
    var output = {};
    function visit(obj, prefix) { Object.keys(obj || {}).forEach(function(key) {
      var value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) visit(value, prefix + key + '.');
      else if (typeof value === 'string') output[prefix + key] = value;
    }); }
    visit(dict, ''); return output;
  }
  function updateLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-app-language],#r-language,#r-language-s1').forEach(function(el) { el.value = lang; });
    if (window.AtabeyDates) window.AtabeyDates.renderDisplay();
  }

  function detectLanguage() {
    try {
      var preference = localStorage.getItem('doctorqr_ui_language');
      if (SUPPORTED_LANGS.indexOf(preference) !== -1) return preference;
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
    return Object.prototype.hasOwnProperty.call(DICT, key) ? DICT[key] : (FALLBACK[key] || key);
  };

  function applyI18n(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (Object.prototype.hasOwnProperty.call(DICT, key)) el.textContent = DICT[key].replace(/\{([A-Za-z0-9_]+)\}/g,function(match,name){var value=el.getAttribute('data-i18n-param-'+name);return value === null ? match : value;});
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
  function fetchDictionary(lang) {
    return fetch('/i18n/' + lang + '.json?v=14', { cache: 'no-cache' }).then(function(res) {
      if (!res.ok) throw new Error('Dictionary unavailable');
      return res.json();
    }).then(flatten);
  }
  window.setLanguage = function (lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) return Promise.resolve(false);
    var request = ++sequence;
    return fetchDictionary(lang).then(function(dict) {
      if (request !== sequence) return false;
      DICT = Object.assign({}, FALLBACK, dict);
      LANG = lang; window.currentLanguage = lang;
      try { localStorage.setItem('doctorqr_ui_language',lang); } catch (_) {}
      updateLanguage(lang); applyI18n(document);
      window.dispatchEvent(new CustomEvent('doctorqr:language-changed',{detail:{language:lang}}));
      return DICT;
    }).catch(function() {
      if (request === sequence) updateLanguage(window.currentLanguage);
      return false; // Keep the existing visible language and preference on network failure.
    });
  };

  var spanishDictionary = fetchDictionary('es').catch(function(){return {}; });
  window.i18nReady = Promise.all([
    spanishDictionary,
    LANG === 'es' ? spanishDictionary : fetchDictionary(LANG).catch(function(){return null;})
  ]).then(function(dicts) {
    FALLBACK = dicts[0];
    if (!dicts[1]) { LANG = 'es'; window.currentLanguage = LANG; }
    DICT = Object.assign({}, FALLBACK, dicts[1] || {});
    updateLanguage(LANG); applyI18n(document);
    var holder=document.createElement('div');
    holder.className='app-language-control';
    holder.style.cssText='display:flex;justify-content:center;gap:8px;padding:8px;position:relative;z-index:1';
    var label=document.createElement('label');label.textContent=window.t('qr.language');label.setAttribute('data-i18n','qr.language');
    label.htmlFor='app-language-select';
    var select=document.createElement('select');select.id='app-language-select';
    select.setAttribute('data-app-language','');select.setAttribute('aria-label','Language');
    var names={"es": "Español", "en": "English", "fr": "Français", "de": "Deutsch", "pt": "Português", "eu": "Euskara", "hi": "हिन्दी", "zh": "简体中文", "ru": "Русский", "ja": "日本語", "ar": "العربية"};
    SUPPORTED_LANGS.forEach(function(code){var option=document.createElement('option');option.value=code;option.textContent=names[code]||code;select.appendChild(option);});
    select.value=LANG;select.style.cssText='max-width:100%;padding:8px;border:1px solid #738ba3;border-radius:8px;background:#102337;color:#fff';
    select.addEventListener('change',function(){window.setLanguage(select.value);});
    holder.append(label,select);document.body.prepend(holder);
    holder.title=window.t('ui.translation_notice');
    return DICT;
  });
})();
