// ============================================
// CAMPOS UNIVERSALES — presentes en los 8 QR adultos sin excepción
// ============================================
const BASE_FIELDS = [
  'nombre','apellidos','fecha_nacimiento','sangre','sexo_biologico',
  'ec1_name','ec1_phone_prefix','ec1_phone_num','ec1_rel',
  'ec2_name','ec2_phone_prefix','ec2_phone_num','ec2_rel',
  'doctor_name','doctor_phone_prefix','doctor_phone_num',
  'insurer','policy','health_card_num'
];

// ============================================
// DEFINICIÓN DE LAS 8 VISTAS QR ADULTAS
// ============================================
const QR_TYPES = [
  {
    id: 'qr-emergency',
    title: 'QR EMERGENCIA',
    subtitle: 'Imprimible · Tarjeta sanitaria',
    color: '#ff556e',
    darkColor: '#cc0000',
    always: true,
    extra: [
      'allergy_food','conditions',
      'diseases','guardian_name',
      'guardian_phone_num','weight','height',
      'profesion','email','doc_type','doc_number'
    ]
  },
  {
    id: 'qr-u1',
    title: 'QR-U1 CRÍTICO GENERAL',
    subtitle: 'Urgencias · Visión 360°',
    color: '#ff9b3d',
    darkColor: '#cc4400',
    always: true,
    extra: [
      'allergy_food','allergy_env',
      'diseases','conditions',
      'surgeries','vaccines',
      'medicacion_alto_riesgo',
      'alcohol','drogas',
      'country_visit_1','country_visit_2',
      'country_visit_3','weight','height',
      'profesion','last_surgery_date',
      'material_osteosintesis',
      'guardian_name','guardian_phone_num',
      'insurer'
    ]
  },
  {
    id: 'qr-u2',
    title: 'QR-U2 CARDIO / NEURO',
    subtitle: 'Marcapasos · Epilepsia · ACV',
    color: '#ff6945',
    darkColor: '#cc1100',
    condition: (d) =>
      affirmative(d, ['pacemaker','dai','acv_previo','stents','anticoagulado','muerte_subita_familiar']) ||
      hasAny(d, [
        'Marcapasos','Desfibrilador',
        'Stent coronario','Válvula cardíaca',
        'Fibrilación auricular','Arritmia',
        'Insuficiencia cardíaca','Epilepsia',
        'Ictus previo','SÍ — ANTICOAGULADO']),
    extra: [
      'diseases','conditions',
      'medicacion_alto_riesgo',
      'dificultad_intubacion',
      'muerte_subita_familiar',
      'enfermedades_familiares',
      'tabaco','weight','height',
      'insurer'
    ]
  },
  {
    id: 'qr-u3',
    title: 'QR-U3 ALERGIAS GRAVES',
    subtitle: 'Anafilaxia · EpiPen · Látex',
    color: '#ffe066',
    darkColor: '#956f00',
    condition: (d) => affirmative(d, ['anafilaxia_previa','latex_guantes','epipen']) ||
      Object.values(d.allergy_severity || {}).some(value => ['grave','anafilactica'].includes(qrSignal(value))) || hasAny(d, [
      'SÍ — anafilaxia confirmada',
      'SÍ — ALERGIA AL LÁTEX',
      'Sí — llevo EpiPen encima']) || hasAny(d, [
      'Anestesia general','Lidocaína',
      'Propofol'], ['allergy_anesthesia']),
    extra: [
      'allergy_food','allergy_env',
      'diseases','conditions',
      'medicacion_alto_riesgo',
      'alcohol',
      'insurer'
    ]
  },
  {
    id: 'qr-e1',
    title: 'QR-E1 CIRUGÍA',
    subtitle: 'Implantes · Anestesia · Quirófano',
    color: '#4d9dff',
    darkColor: '#0044cc',
    condition: (d) =>
      affirmative(d, ['pacemaker','stents','hipertermia_maligna_familiar','material_osteosintesis','dificultad_intubacion','complicaciones_anestesia','puerto_cateter']) ||
      hasRecordedEntries(d.surgeries) ||
      hasAny(d, [
        'Marcapasos','Prótesis',
        'Stent coronario','Válvula','Implante','Port-a-cath',
        'SÍ — intubación difícil',
        'Colostomía','Ileostomía',
        'Fístula arteriovenosa']),
    extra: [
      'surgeries','conditions','diseases',
      'material_osteosintesis',
      'protesis_dental_removible',
      'audifono','gafas_lentillas',
      'dificultad_intubacion',
      'complicaciones_anestesia',
      'hipertermia_maligna_familiar',
      'medicacion_alto_riesgo',
      'last_surgery_date','weight','height',
      'organ_donor','advance_directive',
      'religion_restrictions',
      'insurer',
      'policy'
    ]
  },
  {
    id: 'qr-e2',
    title: 'QR-E2 ONCOLOGÍA',
    subtitle: 'Cáncer · Quimio · Inmunoterapia',
    color: '#bd79ff',
    darkColor: '#6600cc',
    condition: (d) => affirmative(d,['tratamiento_oncologico']) || hasAny(d, [
      'Cáncer activo','Cáncer en remisión',
      'Port-a-cath','Inmunosupresores',
      'Rituximab','Metotrexato']),
    extra: [
      'diseases','conditions',
      'surgeries','medicacion_alto_riesgo',
      'allergy_food',
      'country_visit_1','country_visit_2',
      'country_visit_3','weight','height',
      'insurer',
      'policy','doctor_phone_num',
      'vaccines'
    ]
  },
  {
    id: 'qr-e4',
    title: 'QR-E4 OBSTETRICIA',
    subtitle: 'Embarazo · Semanas · Parto',
    color: '#ff62c5',
    darkColor: '#cc0088',
    condition: (d) => {
      return affirmative(d,['embarazo','lactancia']) || hasAny(d,['Embarazo','Sí — lactancia materna activa'],['conditions']);
    },
    extra: [
      'embarazo','embarazo_semanas',
      'lactancia','surgeries',
      'allergy_food','conditions',
      'diseases',
      'medicacion_alto_riesgo',
      'weight','height',
      'guardian_name','guardian_phone_num',
      'insurer',
      'policy'
    ]
  },
  {
    id: 'qr-e5',
    title: 'QR-E5 SALUD Y BIENESTAR EMOCIONAL',
    subtitle: 'Psiquiatría · Tutor · Crisis',
    color: '#00ffcc',
    darkColor: '#008564',
    condition: (d) => affirmative(d,['salud_emocional_dx']) || hasRecordedEntries(d.salud_emocional_diagnostico) ||
      hasRecordedEntries(d.meds_psiquiatria) || hasAny(d, [
      'Esquizofrenia','Trastorno bipolar',
      'Depresión mayor','IMAO',
      'Litio','Ansiedad crónica','TOC',
      'Trastorno de ansiedad','TEPT','TDAH',
      'Trastorno de personalidad','Trastorno alimentario',
      'Clozapina','Alprazolam','Lorazepam',
      'Valproato','Carbamazepina']),
    extra: [
      'diseases','conditions',
      'medicacion_alto_riesgo',
      'alcohol','drogas',
      'guardian_name','guardian_phone_num',
      'insurer',
      'can_decide'
    ]
  }
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function qrEscapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function qrSignal(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}
function signalEntries(value) {
  const values = Array.isArray(value) ? value : value && typeof value === 'object' ? Object.values(value) : [value];
  return values.flatMap(item => item && typeof item === 'object' ? signalEntries(item) : [qrSignal(item)])
    .filter(value => value && value !== 'false' && !/^(?:no|ningun[oa]?s?|desconocid[oa])(?:\b|$)/.test(value));
}
function hasRecordedEntries(value) { return signalEntries(value).length > 0; }
function affirmative(data,fields) {
  return fields.some(field => data[field] === true || /^(?:si|yes)(?:\b|$)/.test(qrSignal(data[field])));
}
function hasAny(data, keywords, fields = ['diseases','conditions','meds','meds_psiquiatria','medicacion_alto_riesgo','salud_emocional_diagnostico']) {
  const values = fields.flatMap(field => signalEntries(data[field]));
  return keywords.some(keyword => values.some(value => value.includes(qrSignal(keyword))));
}

function calcAge(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || '')) return null;
  const birth = new Date(dateStr+'T00:00:00.000Z');
  if (!Number.isFinite(birth.getTime()) || birth.toISOString().slice(0,10) !== dateStr) return null;
  const today = new Date();
  let age = today.getFullYear()-birth.getUTCFullYear();
  if (today.getMonth()<birth.getUTCMonth() || (today.getMonth()===birth.getUTCMonth() && today.getDate()<birth.getUTCDate())) age--;
  return age>=0 ? age : null;
}

function getFormData() {
  return window.MedicalOwner?.current() ? (MedicalOwner.read() || {}) : {};
}

// Extrae campos simples no vacíos
function _p(profile, fields) {
  const out = {};
  fields.forEach(f => {
    const v = profile[f];
    if (v !== undefined && v !== null && v !== '' &&
        !(Array.isArray(v) && !v.length))
      out[f] = v;
  });
  return out;
}

// Extrae un campo array con límite opcional
function _pa(profile, field, max) {
  const v = profile[field];
  if (!v) return {};
  const a = Array.isArray(v) ? v.filter(Boolean)
    : String(v).split(/[,;]\s*/).filter(Boolean);
  const s = max ? a.slice(0, max) : a;
  return s.length ? { [field]: s } : {};
}

// Construye el payload específico para cada tipo de QR
function buildQRData(type, profile) {
  // Datos universales — en los 9 QR
  const base = _p(profile, BASE_FIELDS);

  // Núcleo de emergencia — en todos los tipos
  const core = {
    ..._p(profile, [
      'allergy_med','allergy_anesthesia','allergy_severity',
      'allergy_food','allergy_env','allergy_insect',
      'epipen','glucagon','anafilaxia_previa','anaphylaxis_trigger',
      'anticoagulado','pacemaker',
      'dialisis_activa','lateralidad_fistula',
      'dificultad_intubacion','complicaciones_anestesia',
      'religion_restrictions',
      'vih','hepatitis','tuberculosis',
      'advance_directive_otro','advance_directive_ubicacion',
      'terapia_hormonal_activa',
      'terapia_hormonal_otra',
      'terapia_hormonal_dosis_frecuencia',
      'terapia_hormonal_duracion_valor',
      'terapia_hormonal_duracion_unidad'
    ]),
    ..._pa(profile, 'meds', 3),
    ..._pa(profile, 'advance_directive_instrucciones', null),
    ..._pa(profile, 'terapia_hormonal_tipos', null)
  };

  // Idioma si no es español (lang_spoken puede ser array o string)
  const langArr = [].concat(profile.lang_spoken || profile.lang || []).filter(Boolean);
  const nonEs = langArr.filter(l => !l.toLowerCase().startsWith('es'));
  if (nonEs.length) core.lang_spoken = nonEs;

  // Campos específicos por tipo
  let extra = {};

  switch (type.id) {
    case 'qr-emergency':
      // Solo base + core
      break;

    case 'qr-u1':
      extra = {
        ..._p(profile, [
          'ultima_toma_medicacion','material_osteosintesis','hipertermia_maligna_familiar',
          'dai','puerto_cateter'
        ]),
        ..._pa(profile, 'meds', 5),
        ..._pa(profile, 'diseases', 5),
        ..._pa(profile, 'conditions', 5),
        ..._pa(profile, 'surgeries', 3)
      };
      break;

    case 'qr-u2':
      extra = _p(profile, [
        'stents','stents_year','acv_previo','acv_year',
        'epilepsia','dai',
        'muerte_subita_familiar','desfibrilador'
      ]);
      break;

    case 'qr-u3':
      extra = {
        ..._p(profile, ['latex_guantes','anafilaxia_descripcion']),
        ..._pa(profile, 'allergy_food', null),
        ..._pa(profile, 'allergy_env', null)
      };
      break;

    case 'qr-e1':
      extra = {
        ..._p(profile, [
          'ultima_toma_medicacion','material_osteosintesis','material_osteo_detalle',
          'hipertermia_maligna_familiar','organ_donor','advance_directive'
        ]),
        ..._pa(profile, 'meds', 5),
        ..._pa(profile, 'diseases', 5),
        ..._pa(profile, 'conditions', 5),
        ..._pa(profile, 'surgeries', null)
      };
      break;

    case 'qr-e2':
      extra = {
        ..._p(profile, [
          'cancer_tipo','cancer_estadio','tratamiento_oncologico',
          'ultimo_ciclo','neutropenia','puerto_cateter',
          'ultima_toma_medicacion'
        ]),
        ..._pa(profile, 'meds', 5),
        ..._pa(profile, 'diseases', 5),
        ..._pa(profile, 'conditions', 5),
        ..._pa(profile, 'surgeries', 3)
      };
      break;

    case 'qr-e4':
      extra = _p(profile, [
        'embarazo','embarazo_semanas','lactancia','semanas_lactancia',
        'cesarea_previa','complicaciones_embarazo','diabetes_gestacional'
      ]);
      break;

    case 'qr-e5':
      extra = {
        ..._p(profile, [
          'salud_emocional_dx','salud_emocional_diagnostico','salud_emocional_cual',
          'puede_decidir_salud','tutor_legal',
          'riesgo_suicida_previo','can_decide'
        ]),
        ..._pa(profile, 'meds', 5),
        ..._pa(profile, 'meds_psiquiatria', null)
      };
      break;
  }

  const payload = { ...base, ...core, ...extra };
  payload.qr = type.id;
  payload.ts = new Date().toISOString().split('T')[0];
  return payload;
}

const QR_TYPE_CODES = {
  'qr-emergency': 'emergency',
  'qr-u1':        'critical',
  'qr-u2':        'cardio',
  'qr-u3':        'allergy',
  'qr-e1':        'surgery',
  'qr-e2':        'oncology',
  'qr-e4':        'obstetric',
  'qr-e5':        'mental'
};

function getOrCreateUserID() {
  return window.MedicalOwner?.current() && MedicalOwner.read() ? MedicalOwner.id() : 'UNKNOWN';
}

function buildQRUrl(type, formData) {
  const id = getOrCreateUserID();
  const t  = QR_TYPE_CODES[type.id] || type.id;
  const n  = encodeURIComponent(((formData.nombre || '') + ' ' + (formData.apellidos || '')).trim());
  const s  = encodeURIComponent(formData.sangre || '');
  const al = Array.isArray(formData.allergy_med)
    ? formData.allergy_med[0] : (formData.allergy_med || '');
  const a  = encodeURIComponent(al);
  const ec = (formData.ec1_phone_prefix || '') + (formData.ec1_phone_num || '');
  const e  = encodeURIComponent(ec);

  let url = `https://atabeyapp.app/card.html?id=${encodeURIComponent(id)}&t=${t}`;
  if (n) url += `&n=${n}`;
  if (s) url += `&s=${s}`;
  if (a) url += `&a=${a}`;
  if (e) url += `&e=${e}`;
  return url;
}

// URL reducida (solo id+t), exclusiva del QR impreso de printEmergencyQR() —
// El lector consulta el perfil confirmado en el servidor; no usa n/s/a/e como historia clínica.
function buildEmergencyQRUrl() {
  const id = getOrCreateUserID();
  const t  = QR_TYPE_CODES[QR_TYPES[0].id] || QR_TYPES[0].id;
  return `https://atabeyapp.app/card.html?id=${encodeURIComponent(id)}&t=${t}`;
}

// ============================================
// CARGA RESILIENTE DE LA LIBRERÍA QRCode
// ============================================
// Auto-hospedada en vendor/ (mismo archivo, mismo hash SRI, verificado
// byte a byte contra el original de cdnjs) — ya NO depende de ningún CDN
// externo ni de la red del dispositivo, que era la causa raíz confirmada
// del spinner "Generando QR…" atascado indefinidamente: antes, si por
// cualquier motivo (bloqueador de contenido, proxy que interfiere con
// CORS, red inestable) el script del CDN no llegaba a ejecutarse, este
// bucle reintentaba PARA SIEMPRE sin límite de tiempo total ni de
// intentos, y sin rechazar nunca la promesa — dejando la tarjeta
// atascada sin ningún aviso al usuario.
//
// Se conserva el reintento con backoff (2s, 4s, 8s, tope 10s) como red de
// seguridad por si el archivo local tarda en estar disponible (arranque
// en frío del Service Worker, caché intermedia, etc.), pero ahora con un
// LÍMITE TOTAL (QR_TOTAL_TIMEOUT_MS): agotado ese tiempo, la promesa se
// RECHAZA y renderQRWhenReady() reemplaza el spinner por un error visible
// con botón "Reintentar" — nunca queda un estado de carga sin salida.
const QR_LIB_URL = '/vendor/qrcodejs/qrcode.min.js';
const QR_LIB_INTEGRITY = 'sha384-3zSEDfvllQohrq0PHL1fOXJuC/jSOO34H46t6UQfobFOmxE5BpjjaIJY5F2/bMnU';
const QR_LOAD_TIMEOUT_MS = 5000;
const QR_BACKOFF_START_MS = 2000;
const QR_BACKOFF_MAX_MS = 10000;
const QR_TOTAL_TIMEOUT_MS = 9000; // presupuesto entre intentos; el intento en curso (hasta QR_LOAD_TIMEOUT_MS más) puede excederlo un poco, pero nunca queda sin cota

let _qrCodeLoadingPromise = null;

function ensureQRCodeLoaded() {
  if (window.QRCode) return Promise.resolve();
  if (_qrCodeLoadingPromise) return _qrCodeLoadingPromise;

  const startedAt = Date.now();

  _qrCodeLoadingPromise = new Promise((resolve, reject) => {
    function intentar(proximoBackoffMs) {
      if (window.QRCode) { resolve(); return; }

      if (Date.now() - startedAt >= QR_TOTAL_TIMEOUT_MS) {
        _qrCodeLoadingPromise = null; // limpia el caché para permitir un reintento manual limpio
        reject(new Error('qrcode_load_timeout'));
        return;
      }

      const script = document.createElement('script');
      script.src = QR_LIB_URL;
      script.integrity = QR_LIB_INTEGRITY;

      let resuelto = false;
      const timeoutId = setTimeout(() => {
        if (resuelto) return;
        resuelto = true;
        script.remove();
        reintentar(proximoBackoffMs);
      }, QR_LOAD_TIMEOUT_MS);

      script.onload = () => {
        if (resuelto) return;
        resuelto = true;
        clearTimeout(timeoutId);
        if (window.QRCode) {
          resolve();
        } else {
          // el SRI no coincidió: el navegador bloquea la ejecución sin lanzar onerror
          script.remove();
          reintentar(proximoBackoffMs);
        }
      };

      script.onerror = () => {
        if (resuelto) return;
        resuelto = true;
        clearTimeout(timeoutId);
        script.remove();
        reintentar(proximoBackoffMs);
      };

      document.head.appendChild(script);
    }

    function reintentar(delayMs) {
      const restante = QR_TOTAL_TIMEOUT_MS - (Date.now() - startedAt);
      if (restante <= 0) {
        _qrCodeLoadingPromise = null;
        reject(new Error('qrcode_load_timeout'));
        return;
      }
      setTimeout(() => intentar(Math.min(delayMs * 2, QR_BACKOFF_MAX_MS)), Math.min(delayMs, restante));
    }

    intentar(QR_BACKOFF_START_MS);
  });

  return _qrCodeLoadingPromise;
}

(function injectQRSpinnerStyle() {
  if (document.getElementById('qr-spin-style')) return;
  const style = document.createElement('style');
  style.id = 'qr-spin-style';
  style.textContent = (typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.aac8691d20dcdb77","@keyframes qr-spin { to { transform: rotate(360deg); } }",[]);
  document.head.appendChild(style);
})();

// ============================================
// GENERACIÓN VISUAL DE CADA TARJETA QR
// ============================================

function buildQRLoadingIndicator(type) {
  const el = document.createElement('div');
  el.style.cssText = `
    display:flex;flex-direction:column;align-items:center;gap:10px;
    color:${type.color};font-size:10px;letter-spacing:1px;
    font-family:inherit;opacity:0.8;text-align:center;
  `;
  el.innerHTML = `
    <div style="width:28px;height:28px;border-radius:50%;
      border:2.5px solid ${type.color}33;border-top-color:${type.color};
      animation:qr-spin 0.8s linear infinite;"></div>
    <span>Generando QR…</span>
  `;
  return el;
}

// Estado final de fallo — reemplaza el spinner cuando ensureQRCodeLoaded()
// se agota (Capa 2) o cuando el propio constructor de QRCode sigue
// fallando tras QR_CONSTRUCTOR_MAX_RETRIES intentos. Nunca se llega aquí
// silenciosamente: siempre hay un botón para que el usuario reintente.
function showQRLoadError(wrap, url, type, sizePx, correctLevel) {
  if (!isOwnedQRUrl(url)) return;
  wrap.innerHTML = '';
  const box = document.createElement('div');
  box.style.cssText = `
    display:flex;flex-direction:column;align-items:center;gap:10px;
    color:${type.color};font-size:10px;letter-spacing:1px;
    font-family:inherit;text-align:center;padding:0 12px;
  `;
  box.innerHTML = `
    <span style="font-size:22px;">&#9888;&#65039;</span>
    <span>No se pudo generar el QR</span>
  `;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = (typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.a9254c5f812829af","Reintentar",[]);
  btn.style.cssText = `
    background:transparent;border:2px solid ${type.color};color:${type.color};
    font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
    padding:6px 14px;border-radius:20px;cursor:pointer;font-family:inherit;
  `;
  btn.addEventListener('click', () => {
    wrap.innerHTML = '';
    wrap.appendChild(buildQRLoadingIndicator(type));
    _qrCodeLoadingPromise = null; // fuerza un intento de carga nuevo en vez de reutilizar el rechazo anterior
    renderQRWhenReady(wrap, url, type, 0, sizePx, correctLevel);
  });
  box.appendChild(btn);
  wrap.appendChild(box);
}

// Construye el armazón visual de una tarjeta (título, subtítulo, hueco del
// QR, línea de datos) sin decidir todavía qué mostrar dentro del hueco —
// lo reutilizan tanto la generación en vivo (generateQRCard) como la
// restauración desde caché (Capa 3, restoreQRCacheAndRefresh).
function buildQRCardShell(type, formData, container) {
  const d = formData;

  const card = document.createElement('div');
  card.className='atabey-qr-card';card.dataset.qrStyle=getQRVisualStyle(type.id);
  card.style.cssText = `
    flex-shrink:0;width:260px;
    --qr-neon:${type.color};
    border-radius:28px;padding:22px 20px;
    display:flex;flex-direction:column;
    align-items:center;gap:10px;
    scroll-snap-align:start;
    background:linear-gradient(150deg,${type.color}18,#08111f 65%);
    border:1.5px solid ${type.color};
    box-shadow:0 0 24px ${type.color}33,inset 0 1px 0 ${type.color}55;
  `;

  const title = document.createElement('div');
  title.style.cssText = `
    font-size:10px;font-weight:900;
    letter-spacing:3px;text-transform:uppercase;
    text-align:center;color:${type.color};
    text-shadow:0 0 8px ${type.color};
    font-family:inherit;
  `;
  title.textContent = type.title;

  const sub = document.createElement('div');
  sub.style.cssText = `
    font-size:9px;letter-spacing:1px;
    text-align:center;
    color:${type.color};opacity:1;line-height:1.6;
    font-family:inherit;
  `;
  sub.textContent = type.subtitle;

  const wrap = document.createElement('div');
  wrap.style.cssText = `
    position:relative;width:200px;height:200px;
    background:#fff;border-radius:18px;box-shadow:0 0 0 4px #fff,0 0 0 6px ${type.color};
    display:flex;align-items:center;justify-content:center;
  `;
  wrap.id = type.id + '-wrap';
  wrap.className='atabey-qr-surface';

  const years = calcAge(d.fecha_nacimiento);
  const age = years === null ? '' : years + ' años';

  const info = document.createElement('div');
  info.style.cssText = `
    font-size:10px;text-align:center;
    color:rgba(255,255,255,0.65);
    line-height:1.7;letter-spacing:0.5px;
    font-family:inherit;
  `;
  info.innerHTML = `
    <strong style="color:${type.color};word-break:break-word;white-space:normal;font-size:clamp(10px,2.5vw,14px);display:block;">
      ${qrEscapeHtml(d.nombre)} ${qrEscapeHtml(d.apellidos)}
    </strong><br>
    ${d.sangre ? '🩸 ' + qrEscapeHtml(d.sangre) : ''}
    ${age ? ' · ' + age : ''}
  `;

  card.appendChild(title);
  card.appendChild(sub);
  card.appendChild(wrap);
  card.appendChild(info);
  container.appendChild(card);

  return { cardEl: card, wrap };
}

function generateQRCard(type, formData, container) {
  const url = buildQRUrl(type, formData);
  const { wrap } = buildQRCardShell(type, formData, container);
  wrap.appendChild(buildQRLoadingIndicator(type));
  renderQRWhenReady(wrap, url, type);
}

// Visual selection is independent of clinical QR types, conditions and encoded URLs.
function getQRVisualStyle(typeId) {
  return ({'qr-emergency':'flow','qr-u1':'flow','qr-u2':'pulse','qr-u3':'dots',
    'qr-e1':'pulse','qr-e2':'flow','qr-e4':'dots','qr-e5':'flow'})[typeId] || 'flow';
}

// Presentation only. The encoded matrix, correction level and four-module quiet zone stay intact.
// This function is self-contained because the print document embeds its source.
function createOrganicQRCode(target, options) {
  const original = document.createElement('div');
  const qr = new QRCode(original, { ...options, text: '' });
  const drawing = qr._oDrawing;
  const originalDraw = drawing && drawing.draw;
  if (typeof originalDraw === 'function') drawing.draw = () => {};
  try { qr.makeCode(options.text); }
  finally { if (typeof originalDraw === 'function') drawing.draw = originalDraw; }
  try {
    const matrix = qr._oQRCode, count = matrix.getModuleCount();
    const requested = ['flow','pulse','dots'].includes(options.visualStyle) ? options.visualStyle : 'flow';
    // At low displayed resolution, use the conservative geometry of the original renderer.
    const style = count > 57 || options.width / (count + 8) < 2.8 ? 'classic' : requested;
    const cell = Math.max(8, Math.ceil(options.width / (count + 8)));
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = (count + 8) * cell;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas_unavailable');
    let rgb = /^#[0-9a-f]{6}$/i.test(options.colorDark || '')
      ? options.colorDark.slice(1).match(/../g).map(x => parseInt(x, 16)) : [17, 34, 51];
    const contrast = () => {
      const linear = rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
      return 1.05 / (.2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2] + .05);
    };
    while (contrast() < 5) rgb = rgb.map(v => Math.floor(v * .9));
    const ink = 'rgb(' + rgb.join(',') + ')';
    ctx.fillStyle = '#ffffff';ctx.fillRect(0, 0, canvas.width, canvas.height);
    function rounded(x, y, w, h, radius) {
      ctx.beginPath();ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();ctx.fill();
    }
    const dark = (r,c) => r>=0 && c>=0 && r<count && c<count && matrix.isDark(r,c);
    const finder = (r,c) => (r<7 && (c<7 || c>=count-7)) || (r>=count-7 && c<7);
    // Function patterns (timing, format, version and every alignment target) retain square modules.
    const reserved = new Uint8Array(count * count);
    function protect(row,col,height,width) {
      for(let r=Math.max(0,row);r<Math.min(count,row+height);r++)
        for(let c=Math.max(0,col);c<Math.min(count,col+width);c++)reserved[r*count+c]=1;
    }
    protect(0,0,9,9);protect(0,count-8,9,8);protect(count-8,0,8,9);
    protect(6,0,1,count);protect(0,6,count,1);
    const version=(count-17)/4;
    if(version>=7){protect(0,count-11,6,3);protect(count-11,0,3,6);}
    if(version>=2){
      const n=Math.floor(version/7)+2;
      const step=version===32?26:Math.floor((version*4+n*2+1)/(n*2-2))*2;
      const positions=[6];for(let pos=count-7;positions.length<n;pos-=step)positions.splice(1,0,pos);
      for(let i=0;i<n;i++)for(let j=0;j<n;j++){
        if((i===0&&j===0)||(i===0&&j===n-1)||(i===n-1&&j===0))continue;
        protect(positions[i]-2,positions[j]-2,5,5);
      }
    }
    const structural=(r,c)=>r<0||c<0||r>=count||c>=count||!!reserved[r*count+c];
    ctx.fillStyle=ink;
    for(let r=0;r<count;r++)for(let c=0;c<count;c++){
      if(!dark(r,c)||finder(r,c))continue;
      const x=(c+4)*cell,y=(r+4)*cell;
      if(style==='classic'||structural(r,c)){ctx.fillRect(x,y,cell,cell);continue;}
      if(style==='dots'){
        ctx.beginPath();ctx.arc(x+cell/2,y+cell/2,cell*.49,0,Math.PI*2);ctx.fill();
      }else if(style==='pulse'){
        // Capsules follow only existing horizontal dark runs. Every original module centre is retained.
        let end=c;while(end+1<count&&dark(r,end+1)&&!finder(r,end+1)&&!structural(r,end+1))end++;
        const inset=cell*.025;
        rounded(x+inset,y+inset,(end-c+1)*cell-inset*2,cell-inset*2,cell*.475);c=end;
      }else{
        // Smooth connected paths. Joins never extend beyond the original dark cells.
        rounded(x,y,cell,cell,cell*.48);
        if(dark(r-1,c))ctx.fillRect(x,y,cell,cell/2);
        if(dark(r+1,c))ctx.fillRect(x,y+cell/2,cell,cell/2);
        if(dark(r,c-1))ctx.fillRect(x,y,cell/2,cell);
        if(dark(r,c+1))ctx.fillRect(x+cell/2,y,cell/2,cell);
      }
    }
    for(const [r,c] of [[0,0],[0,count-7],[count-7,0]]){
      const x=(c+4)*cell,y=(r+4)*cell;
      ctx.fillStyle=ink;rounded(x,y,7*cell,7*cell,style==='classic'?0:cell*1.5);
      ctx.fillStyle='#ffffff';rounded(x+cell,y+cell,5*cell,5*cell,style==='classic'?0:cell*1.15);
      ctx.fillStyle=ink;
      rounded(x+2*cell,y+2*cell,3*cell,3*cell,style==='classic'?0:cell*(style==='dots'?1.1:.9));
    }
    const img=document.createElement('img');img.src=canvas.toDataURL('image/png');
    img.alt='Código QR';img.width=options.width;img.height=options.height;
    img.dataset.qrStyle=style;
    img.style.cssText='display:block;max-width:100%;height:auto;image-rendering:pixelated;';
    target.appendChild(img);
  }catch(_){
    if(typeof originalDraw==='function'){originalDraw.call(drawing,qr._oQRCode);qr.makeImage();}
    while(original.firstChild)target.appendChild(original.firstChild);
  }
  return qr;
}

const QR_CONSTRUCTOR_MAX_RETRIES = 2; // 3 intentos en total — un fallo del constructor (p.ej. payload demasiado largo) no se arregla reintentando indefinidamente

// qrcodejs detecta soporte de data-URI la primera vez que dibuja cada
// instancia cargando una imagen de prueba internamente — según el estado
// del navegador en ese momento, el <img> real puede tardar en aparecer
// unos milisegundos tras el constructor, no siempre está listo en el
// mismo tick síncrono (confirmado con pruebas reales: a veces sí, a
// veces no). Por eso no se puede asumir que wrap.querySelector('img')
// ya existe justo después de `new QRCode(...)` — hay que esperarlo.
function esperarImagenQR(contenedor, maxEsperaMs) {
  return new Promise(resolve => {
    const limite = Date.now() + (maxEsperaMs || 1500);
    (function poll() {
      const img = contenedor.querySelector('img');
      if (img && img.src) { resolve(img); return; }
      if (Date.now() >= limite) { resolve(null); return; }
      setTimeout(poll, 50);
    })();
  });
}

// Espera (con reintento acotado por QR_TOTAL_TIMEOUT_MS, ver
// ensureQRCodeLoaded) a que la librería QRCode esté disponible y solo
// entonces dibuja el QR. Si el propio constructor falla (no solo la carga
// del script), reintenta un número limitado de veces. En cualquiera de
// los dos casos de agotamiento, muestra un error visible con botón
// "Reintentar" — nunca deja la tarjeta atascada sin explicación ni salida.
// correctLevel: clave de QRCode.CorrectLevel ('M' por defecto, igual que
// antes). Se pasa como string, no como QRCode.CorrectLevel.X, porque esta
// función puede llamarse antes de que la librería termine de cargar --
// referenciar el objeto QRCode en la firma/valor por defecto reventaría
// con un ReferenceError si aún no existe. Se resuelve más abajo, ya
// dentro del .then(), donde QRCode está garantizado.
// Yield between symbols: resolved library promises must not build every QR in one microtask.
let qrRenderQueue = Promise.resolve();
function scheduleQRRender(work) {
  const task = qrRenderQueue.then(() => new Promise(resolve => setTimeout(resolve, 0))).then(work);
  qrRenderQueue = task.catch(() => {});
  return task;
}

function renderQRWhenReady(wrap, url, type, intento, sizePx, correctLevel) {
  intento = intento || 0;
  sizePx = sizePx || 200;
  correctLevel = correctLevel || 'M';
  ensureQRCodeLoaded().then(() => scheduleQRRender(() => {
    if (!wrap.isConnected || !isOwnedQRUrl(url)) return;
    try {
      wrap.innerHTML = '';
      createOrganicQRCode(wrap, {
        text: url,
        width: sizePx,
        height: sizePx,
        visualStyle: getQRVisualStyle(type.id),
        colorDark: type.color,
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel[correctLevel]
      });
      esperarImagenQR(wrap).then(img => {
        if (!wrap.isConnected || !isOwnedQRUrl(url)) return;
        if (img && img.src) saveQRCacheEntry(type.id, img.src, url);
        const banner = wrap.parentElement && wrap.parentElement.querySelector('.qr-stale-banner');
        if (banner) banner.remove();
      });
    } catch (err) {
      if (intento >= QR_CONSTRUCTOR_MAX_RETRIES) {
        showQRLoadError(wrap, url, type, sizePx, correctLevel);
        return;
      }
      setTimeout(() => renderQRWhenReady(wrap, url, type, intento + 1, sizePx, correctLevel), QR_BACKOFF_START_MS);
    }
  })).catch(() => {
    if (!wrap.isConnected || !isOwnedQRUrl(url)) return;
    showQRLoadError(wrap, url, type, sizePx, correctLevel);
  });
}

// ============================================
// CAPA 3 — CACHÉ DEL ÚLTIMO QR VÁLIDO (RESPALDO)
// ============================================
// Si la generación en vivo falla o se agota (Capa 2), el usuario no debe
// ver una pantalla vacía ni solo un error — debe ver, como mínimo, el
// último QR que sí se generó con éxito, con un aviso claro de que puede
// estar desactualizado. Nota de seguridad importante: el QR únicamente
// codifica el id + un puñado de campos de "vistazo rápido" (nombre,
// sangre, una alergia, contacto) en su propia URL — card.html usa ese id
// para pedir SIEMPRE el historial médico completo y actual al backend en
// el momento del escaneo (ver card.html, fetch a /api/profile/load). Un
// QR en caché desactualizado NO expone un historial médico obsoleto
// completo; el único dato que podría no estar al día son esos campos de
// vistazo rápido, hasta que termine la actualización en segundo plano —
// por eso el aviso se mantiene visible mientras tanto y nunca se retira
// sin una regeneración real confirmada.
const QR_CACHE_KEY = 'doctorqr_qr_cache';

function isOwnedQRUrl(value) {
  if (!window.MedicalOwner?.current() || !MedicalOwner.read() || typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.origin === 'https://atabeyapp.app' && url.pathname === '/card.html' &&
      url.searchParams.getAll('id').length === 1 && url.searchParams.get('id') === MedicalOwner.id();
  } catch (_) { return false; }
}

function getQRCache() {
  try { const cache = JSON.parse(localStorage.getItem(QR_CACHE_KEY) || '{}');
    if (!window.MedicalOwner?.current() || !MedicalOwner.read() || cache.owner !== MedicalOwner.id()) return {};
    const images = {}, urls = {};
    for (const type of QR_TYPES) if (typeof cache.images?.[type.id] === 'string' &&
        cache.images[type.id].startsWith('data:image/png;base64,') && isOwnedQRUrl(cache.urls?.[type.id])) {
      images[type.id] = cache.images[type.id]; urls[type.id] = cache.urls[type.id];
    }
    return { owner:cache.owner, savedAt:cache.savedAt, images, urls }; }
  catch (e) { return {}; }
}

// `url` es la URL exacta que se codificó en el QR (buildQRUrl(type,
// formData)) -- se guarda como "huella" de qué datos produjeron esta
// imagen. Como buildQRUrl() es la única fuente de lo que el QR codifica
// hoy (buildQRData() no se usa en ningún sitio), comparar esta URL contra
// la que produciría el perfil ACTUAL basta para saber con certeza si la
// imagen en caché sigue reflejando los datos de hoy o quedó obsoleta --
// ver isQRCacheFresh().
function saveQRCacheEntry(typeId, dataUrl, url) {
  try {
    if (!isOwnedQRUrl(url) || !QR_TYPES.some(type => type.id === typeId)) return;
    const cache = getQRCache();
    if (!window.MedicalOwner?.read()) return;
    cache.owner = MedicalOwner.id();
    cache.images = cache.images || {};
    cache.urls = cache.urls || {};
    cache.images[typeId] = dataUrl;
    if (url) cache.urls[typeId] = url;
    cache.savedAt = Date.now();
    localStorage.setItem(QR_CACHE_KEY, JSON.stringify(cache));
  } catch (e) { /* localStorage lleno o no disponible: se pierde solo el respaldo, no es crítico */ }
}

// Cierto solo si hay una imagen en caché para este tipo Y la URL que se
// codificó en ella coincide EXACTAMENTE con la que codificaría el perfil
// actual -- si el usuario cambió cualquier dato desde el último cacheo,
// la URL difiere y esto devuelve false, forzando una regeneración real.
function isQRCacheFresh(cache, typeId, urlActual) {
  return !!(cache.images && cache.images[typeId] &&
            cache.urls && cache.urls[typeId] === urlActual);
}

function buildStaleBanner() {
  const b = document.createElement('div');
  b.className = 'qr-stale-banner';
  b.style.cssText = `
    font-size:8.5px;letter-spacing:0.4px;color:#ffcc00;
    background:rgba(255,204,0,0.12);border:1px solid rgba(255,204,0,0.4);
    border-radius:6px;padding:3px 8px;text-align:center;line-height:1.4;
    font-family:inherit;
  `;
  b.textContent = (typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.ede49ddd5dd87733","⏳ Posiblemente desactualizado — actualizando…",[]);
  return b;
}

// Restaura, al abrir la app, el último QR válido conocido (si existe)
// mientras se confirma en segundo plano que sigue reflejando los datos
// actuales — nunca sustituye al botón "Generar mis QR", solo evita que la
// pantalla se quede vacía o atascada mientras se confirma.
function restoreQRCacheAndRefresh() {
  const formData = getFormData();
  if (!formData.nombre && !formData.apellidos) return;
  if (getOrCreateUserID() === 'UNKNOWN') return;

  const cache = getQRCache();
  if (!cache.images || !Object.keys(cache.images).length) return;

  const carousel = document.getElementById('qr-carousel');
  const dotsWrap = document.getElementById('qr-dots');
  const qrSection = document.getElementById('qr-section');
  if (!carousel || !dotsWrap || !qrSection) return;

  const active = QR_TYPES.filter(t => t.always || (t.condition && t.condition(formData)));
  const conCache = active.filter(t => cache.images[t.id]);
  if (!conCache.length) return; // nada útil que restaurar todavía

  carousel.innerHTML = '';
  dotsWrap.innerHTML = '';

  const wraps = {};
  const urls = {};
  active.forEach((type, i) => {
    const { cardEl, wrap } = buildQRCardShell(type, formData, carousel);
    wraps[type.id] = wrap;
    const url = buildQRUrl(type, formData);
    urls[type.id] = url;

    if (isQRCacheFresh(cache, type.id, url)) {
      const img = document.createElement('img');
      img.src = cache.images[type.id];
      img.width = 200;
      img.height = 200;
      img.style.cssText = 'display:block;border-radius:4px;';
      wrap.appendChild(img);
      // Solo se avisa de "posible desactualización" si NO podemos
      // confirmar que la imagen en caché sigue vigente -- si la huella
      // (URL codificada) coincide con la que produciría el perfil actual,
      // ya sabemos con certeza que está al día y no hace falta el aviso.
      if (!isQRCacheFresh(cache, type.id, url)) cardEl.appendChild(buildStaleBanner());
    } else {
      wrap.appendChild(buildQRLoadingIndicator(type));
    }

    const dot = document.createElement('div');
    dot.style.cssText = `
      width:8px;height:8px;border-radius:50%;
      background:${i === 0 ? type.color : 'rgba(255,255,255,0.2)'};
      cursor:pointer;transition:background 0.2s;
    `;
    dot.onclick = () => cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    dotsWrap.appendChild(dot);
  });

  qrSection.style.display = 'block';

  active.forEach(type => {
    refreshQRCardSilently(wraps[type.id], urls[type.id], type);
  });
}

// Igual que renderQRWhenReady, pero SIN destino de error visible: si la
// confirmación en segundo plano falla o se agota, se deja tal cual lo que
// ya había en pantalla (imagen en caché + aviso, o spinner) — nunca se
// reemplaza una imagen válida por un hueco vacío o un mensaje de error.
function refreshQRCardSilently(wrap, url, type, sizePx, correctLevel) {
  sizePx = sizePx || 200;
  correctLevel = correctLevel || 'M';
  ensureQRCodeLoaded().then(() => {
    if (!wrap.isConnected || !isOwnedQRUrl(url)) return;
    try {
      const tmp = document.createElement('div');
      createOrganicQRCode(tmp, {
        text: url,
        width: sizePx,
        height: sizePx,
        visualStyle: getQRVisualStyle(type.id),
        colorDark: type.color,
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel[correctLevel]
      });
      esperarImagenQR(tmp).then(img => {
        if (!img || !img.src) return; // no llegó a tiempo: se deja intacto lo que ya había en pantalla
        if (!wrap.isConnected || !isOwnedQRUrl(url)) return;
        wrap.innerHTML = '';
        wrap.appendChild(img);
        const banner = wrap.parentElement && wrap.parentElement.querySelector('.qr-stale-banner');
        if (banner) banner.remove();
        saveQRCacheEntry(type.id, img.src, url);
      });
    } catch (err) {
      // el constructor falló: se deja intacto lo que ya había en pantalla
    }
  }).catch(() => {
    // Capa 2 se agotó: se deja intacto lo que ya había en pantalla
  });
}

// ============================================
// ACCESO RÁPIDO DE EMERGENCIA — VISTA DE CUADRÍCULA (8 QR, sin sesión)
// ============================================
// Punto de entrada único, compartido por login.html, emergencia.html (el
// acceso directo de la PWA declarado en manifest.json) e index.html --
// antes cada página tenía su propia copia casi idéntica de esta función;
// ahora vive solo aquí. Sustituye a la antigua llamada a
// printEmergencyQR() (esa sigue existiendo, pero solo para el botón
// "IMPRIMIR QR EMERGENCIA — FORMATO TARJETA" dentro de la app, que es una
// función distinta: imprimir una tarjeta física, no navegar los 8 QR).
function handleEmergencyQuickAccess() {
  const formData = getFormData();
  if (!formData.nombre && !formData.apellidos) {
    mostrarSinPerfilParaEmergencia();
    return;
  }
  renderEmergencyQuickView();
}

// Cada una de las 3 páginas tiene un HTML ligeramente distinto para el
// estado "sin perfil" (login.html/index.html usan #emergency-quick-msg
// junto al botón; emergencia.html reemplaza su propio bloque #msg con un
// enlace de vuelta) -- se respeta el que exista en cada página en vez de
// forzar una única estructura.
function mostrarSinPerfilParaEmergencia() {
  const msgEl = document.getElementById('emergency-quick-msg');
  if (msgEl) {
    msgEl.textContent = (typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.6cec6f26235cfad0","No hay ningún perfil guardado en este dispositivo. Si ya tienes una cuenta, inicia sesión para sincronizarlo aquí.",[]);
    msgEl.style.display = 'block';
    return;
  }
  const msg2 = document.getElementById('msg');
  if (msg2) {
    msg2.innerHTML = `
      <h1>No hay ningún perfil guardado en ESTE dispositivo</h1>
      <p>Si ya tienes una cuenta, inicia sesión para sincronizarlo aquí.</p>
      <a class="btn" href="login.html">Ir a Atabeyapp</a>
    `;
  }
}

(function injectEmergencyQuickViewStyle() {
  if (document.getElementById('eqv-style')) return;
  const style = document.createElement('style');
  style.id = 'eqv-style';
  style.textContent = (typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.69584882b10d35ad","\n    #emergency-quick-view{position:fixed;inset:0;z-index:9999;display:none;\n      background:#000;color:#fff;overflow-y:auto;\n      font-family:Inter,system-ui,sans-serif;}\n    .eqv-header{position:sticky;top:0;z-index:2;\n      background:rgba(0,0,0,0.92);backdrop-filter:blur(6px);\n      padding:16px;display:flex;align-items:center;justify-content:space-between;\n      border-bottom:1px solid rgba(255,255,255,0.08);}\n    .eqv-title{font-size:12px;font-weight:900;letter-spacing:2.5px;\n      color:#12A5FF;text-shadow:0 0 8px #12A5FF;text-transform:uppercase;}\n    .eqv-close{background:transparent;border:1.5px solid rgba(255,255,255,0.35);\n      color:#fff;border-radius:20px;padding:8px 16px;font-size:11px;\n      font-weight:700;letter-spacing:1px;cursor:pointer;text-transform:uppercase;\n      font-family:inherit;}\n    .eqv-close:hover{background:rgba(255,255,255,0.08);}\n    .eqv-grid{display:flex;flex-direction:column;align-items:center;\n      gap:36px;padding:20px 20px 40px;max-width:480px;margin:0 auto;}\n    .eqv-card{display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;}\n    .eqv-type-header{display:flex;align-items:center;justify-content:center;\n      gap:9px;width:100%;}\n    .eqv-type-dot{width:13px;height:13px;border-radius:50%;flex-shrink:0;}\n    .eqv-type-title{font-size:16px;font-weight:900;letter-spacing:1.2px;\n      text-transform:uppercase;text-align:center;line-height:1.25;}\n    .eqv-cover{position:relative;border-radius:30px;background:#0a1422;\n      display:flex;align-items:center;justify-content:center;overflow:hidden;}\n    .eqv-cover img, .eqv-cover canvas{width:90%;height:90%;object-fit:contain;\n      border-radius:10px;background:#fff;display:block;}\n    .eqv-name{font-size:13px;color:rgba(255,255,255,0.75);text-align:center;\n      letter-spacing:0.3px;word-break:break-word;}\n  ",[]);
  document.head.appendChild(style);
})();

function getEmergencyQuickViewContainer() {
  return document.getElementById('emergency-quick-view');
}

// "Salir" siempre debe llevar a la pantalla de login. Si ya se está en
// login.html, el contenedor es un overlay SOBRE esa misma pantalla, así
// que basta con ocultarlo (evita una recarga innecesaria); desde
// emergencia.html o index.html sí hace falta navegar de verdad.
function closeEmergencyQuickView() {
  const el = getEmergencyQuickViewContainer();
  if (el) el.style.display = 'none';
  const path = window.location.pathname;
  const yaEnLogin = /(^|\/)login(\.html)?\/?$/.test(path);
  if (!yaEnLogin) window.location.href = 'login.html';
}

function renderEmergencyQuickView() {
  const container = getEmergencyQuickViewContainer();
  if (!container) return; // la página no incluye el contenedor -- no debería ocurrir en las 3 páginas soportadas

  const formData = getFormData();
  const active = QR_TYPES.filter(t => t.always || (t.condition && t.condition(formData)));
  const nombreCompleto = ((formData.nombre || '') + ' ' + (formData.apellidos || '')).trim() || 'Perfil sin nombre';

  container.innerHTML = `
    <div class="eqv-header">
      <div class="eqv-title">Acceso rápido de emergencia</div>
      <button type="button" class="eqv-close" id="eqv-close-btn">✕ Salir</button>
    </div>
    <div class="eqv-grid" id="eqv-grid"></div>
  `;
  container.style.display = 'block';
  document.getElementById('eqv-close-btn').addEventListener('click', closeEmergencyQuickView);

  const grid = document.getElementById('eqv-grid');
  const cache = getQRCache();

  active.forEach(type => {
    const url = buildQRUrl(type, formData);

    const card = document.createElement('div');
    card.className = 'eqv-card';

    // Cabecera del tipo: punto de color + título grande, como bloque
    // propio ENCIMA del QR (no superpuesto sobre el propio patrón) --
    // así el título se lee sin competir visualmente con el QR y puede
    // usar un tamaño de fuente mucho mayor.
    const header = document.createElement('div');
    header.className = 'eqv-type-header';

    const dot = document.createElement('div');
    dot.className = 'eqv-type-dot';
    dot.style.cssText = `background:${type.color};box-shadow:0 0 8px ${type.color};`;

    const title = document.createElement('div');
    title.className = 'eqv-type-title';
    title.style.color = type.color;
    title.style.textShadow = `0 0 8px ${type.color}`;
    title.textContent = type.title;

    header.appendChild(dot);
    header.appendChild(title);

    const cover = document.createElement('div');
    cover.className = 'eqv-cover';
    // Tamaño en px explícito (no aspect-ratio): en Android hay WebViews que
    // no soportan aspect-ratio de forma consistente -- sin él, .eqv-cover
    // queda sin altura definida, el <img> (que nunca tiene width/height
    // propio, ver qrcode.min.js) cae a su tamaño intrínseco de 400px, y
    // overflow:hidden lo recorta. Con alto y ancho fijos en px no hay
    // ambigüedad, sea cual sea el soporte de aspect-ratio del navegador.
    const coverSizePx = Math.round(Math.min(window.innerWidth * 0.88, 420));
    cover.style.cssText = `border:2px solid ${type.color};box-shadow:0 0 18px ${type.color}44;
      width:${coverSizePx}px;height:${coverSizePx}px;`;

    // renderQRWhenReady()/showQRLoadError() hacen wrap.innerHTML='' antes
    // de dibujar -- se les pasa este "slot" interno (todo el contenido
    // de "cover" ahora) para que el QR se pueda limpiar y redibujar sin
    // afectar a nada fuera de "cover".
    const slot = document.createElement('div');
    slot.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
    cover.appendChild(slot);

    const name = document.createElement('div');
    name.className = 'eqv-name';
    name.textContent = nombreCompleto;

    card.appendChild(header);
    card.appendChild(cover);
    card.appendChild(name);
    grid.appendChild(card);

    // Regla central de frescura: si la huella coincide, la caché refleja
    // los datos actuales -- se muestra al instante. Si no coincide (o no
    // existe), se regenera en el momento desde el perfil actual (100%
    // local gracias a las Capas 1-2) -- nunca se muestra una imagen que
    // no se pueda confirmar que corresponde al perfil de HOY.
    if (isQRCacheFresh(cache, type.id, url)) {
      const img = document.createElement('img');
      img.src = cache.images[type.id];
      slot.appendChild(img);
      // Keep the valid cached image while updating only its appearance.
      refreshQRCardSilently(slot, url, type, 400, 'H');
    } else {
      slot.appendChild(buildQRLoadingIndicator(type));
      // 400px de resolución nativa (frente a los 200px del carrusel) --
      // el hueco del QR aquí puede mostrarse hasta a ~380px de ancho, y
      // un QR de 200px estirado a ese tamaño se vería borroso.
      // correctLevel 'H' (frente al 'M' del carrusel normal): el contenido
      // codificado aquí es corto a propósito (id + un puñado de campos de
      // vistazo rápido, ver buildQRUrl()), lo que produce muy pocos módulos
      // y por tanto bloques muy grandes al mostrarse a 400px. Con 'H' el
      // mismo contenido exige más módulos (patrón más denso/fino) sin
      // cambiar ni un carácter de lo que se codifica ni tocar
      // buildEmergencyQRUrl()/card.html.
      renderQRWhenReady(slot, url, type, 0, 400, 'H');
    }
  });
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

function generateAllQRs(scrollToQR = true) {
  const formData = getFormData();

  if (!formData.nombre && !formData.apellidos) {
    alert((typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.3c3feadba112b672","Completa al menos tu nombre y apellidos antes de generar los QR.",[]));
    return;
  }

  if (getOrCreateUserID() === 'UNKNOWN') {
    alert((typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.0313fc5d5778a014","Tu sesión no tiene un ID de perfil válido.\nCierra sesión, vuelve a iniciarla y recarga la página.",[]));
    return;
  }

  const carousel = document.getElementById('qr-carousel');
  const dotsWrap = document.getElementById('qr-dots');

  carousel.innerHTML = '';
  dotsWrap.innerHTML = '';

  const active = QR_TYPES.filter(t =>
    t.always || (t.condition && t.condition(formData))
  );

  active.forEach((type, i) => {
    generateQRCard(type, formData, carousel);

    const dot = document.createElement('div');
    dot.style.cssText = `
      width:8px;height:8px;border-radius:50%;
      background:${i === 0 ? type.color : 'rgba(255,255,255,0.2)'};
      cursor:pointer;transition:background 0.2s;
    `;
    dot.onclick = () => {
      carousel.children[i]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    };
    dotsWrap.appendChild(dot);
  });

  carousel.addEventListener('scroll', () => {
    const dots = dotsWrap.children;
    Array.from(carousel.children).forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const cr = carousel.getBoundingClientRect();
      if (r.left >= cr.left - 10 && r.left < cr.right - 50) {
        Array.from(dots).forEach((d, j) => {
          d.style.background = i === j ?
            active[j]?.color || '#12A5FF' :
            'rgba(255,255,255,0.2)';
        });
      }
    });
  });

  document.getElementById('qr-section').style.display = 'block';
  if (scrollToQR) document.getElementById('qr-section').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// IMPRIMIR QR EMERGENCIA — FORMATO TARJETA
// ============================================

function printEmergencyQR() {
  if (getOrCreateUserID() === 'UNKNOWN' || !window.AtabeyEmergencyCard) {
    alert((typeof uiMessage === 'function' ? uiMessage : ((key,source)=>source))("extra.d7ddd52db3987d78","No es posible imprimir el QR: tu perfil no tiene un ID válido.\nCierra sesión, vuelve a entrar y recarga la página."));
    return Promise.resolve(null);
  }
  const profile = getFormData(), patientUrl = buildEmergencyQRUrl(), id = MedicalOwner.id();
  const snapshot = JSON.stringify(profile);
  const risk = Array.isArray(profile.allergy_insect) && profile.allergy_insect.some(value => value !== 'Ninguna conocida') &&
    (profile.epipen === 'Sí — llevo EpiPen encima' || profile.epipen === 'Sí — lo tengo en casa') && profile.anafilaxia_previa === 'SÍ — anafilaxia confirmada';
  return AtabeyEmergencyCard.open({profile,patientUrl,risk,language:document.documentElement.lang||'es',
    ready:ensureQRCodeLoaded,draw:createOrganicQRCode,
    current:()=>MedicalOwner.current() && MedicalOwner.id()===id && JSON.stringify(MedicalOwner.read())===snapshot
  }).catch(()=>null);
}

document.getElementById('btn-print-emergency')
  ?.addEventListener('click', printEmergencyQR);

// Capa 3: al cargar la página, restaura el último QR válido conocido (si
// existe) mientras se confirma en segundo plano — ver restoreQRCacheAndRefresh.
restoreQRCacheAndRefresh();

