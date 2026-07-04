// ============================================
// CAMPOS UNIVERSALES — presentes en los 9 QR sin excepción
// ============================================
const BASE_FIELDS = [
  'nombre','apellidos','fecha_nacimiento','sangre','sexo_biologico',
  'ec1_name','ec1_phone_prefix','ec1_phone_num','ec1_rel',
  'ec2_name','ec2_phone_prefix','ec2_phone_num','ec2_rel',
  'doctor_name','doctor_phone_prefix','doctor_phone_num',
  'insurer','policy','health_card_num'
];

// ============================================
// DEFINICIÓN CLÍNICA DE LOS 9 QR
// ============================================
const QR_TYPES = [
  {
    id: 'qr-emergency',
    title: 'QR EMERGENCIA',
    subtitle: 'Imprimible · Tarjeta sanitaria',
    color: '#ff0000',
    darkColor: '#cc0000',
    always: true,
    extra: [
      'allergy_food','conditions',
      'diseases','guardian_name',
      'guardian_phone_num','weight','height'
    ]
  },
  {
    id: 'qr-u1',
    title: 'QR-U1 CRÍTICO GENERAL',
    subtitle: 'Urgencias · Visión 360°',
    color: '#ff6600',
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
    color: '#ff3300',
    darkColor: '#cc1100',
    condition: (d) =>
      d.pacemaker === 'SÍ' ||
      (d.muerte_subita_familiar || '').startsWith('SÍ') ||
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
    color: '#ffcc00',
    darkColor: '#cc9900',
    condition: (d) => hasAny(d, [
      'SÍ — anafilaxia confirmada',
      'SÍ — ALERGIA AL LÁTEX',
      'Sí — llevo EpiPen encima',
      'Anestesia general','Lidocaína',
      'Propofol']),
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
    color: '#0066ff',
    darkColor: '#0044cc',
    condition: (d) =>
      d.pacemaker === 'SÍ' ||
      d.stents === 'Sí' ||
      (d.hipertermia_maligna_familiar || '').startsWith('SÍ') ||
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
    color: '#9900ff',
    darkColor: '#6600cc',
    condition: (d) => hasAny(d, [
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
    id: 'qr-e3',
    title: 'QR-E3 PEDIATRÍA',
    subtitle: 'Peso · Vacunas · Tutor legal',
    color: '#00ccff',
    darkColor: '#0099cc',
    condition: (d) => {
      if (!d.fecha_nacimiento) return false;
      return calcAge(d.fecha_nacimiento) < 16;
    },
    extra: [
      'weight','height','vaccines',
      'vaccine_complete',
      'allergy_food','allergy_env',
      'diseases','conditions',
      'medicacion_alto_riesgo',
      'guardian_name','guardian_phone_num',
      'insurer',
      'can_decide'
    ]
  },
  {
    id: 'qr-e4',
    title: 'QR-E4 OBSTETRICIA',
    subtitle: 'Embarazo · Semanas · Parto',
    color: '#ff00aa',
    darkColor: '#cc0088',
    condition: (d) => {
      const sex = (d.sexo_biologico || '').toLowerCase();
      if (sex === 'masculino') return false;
      return hasAny(d, ['Sí — estoy embarazada', 'Sí — lactancia materna activa']);
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
    darkColor: '#00cc99',
    condition: (d) => hasAny(d, [
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

function hasAny(data, keywords) {
  const str = JSON.stringify(data).toLowerCase();
  return keywords.some(k =>
    str.includes(k.toLowerCase()));
}

function calcAge(dateStr) {
  if (!dateStr) return 99;
  const birth = new Date(dateStr);
  const today = new Date();
  return Math.floor(
    (today - birth) /
    (365.25 * 24 * 3600 * 1000));
}

function getFormData() {
  try {
    const saved = localStorage.getItem('doctorqr_profile');
    return saved ? JSON.parse(saved) : {};
  } catch(e) { return {}; }
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
      'allergy_med','allergy_anesthesia',
      'epipen','anafilaxia_previa',
      'anticoagulado','pacemaker',
      'dificultad_intubacion','complicaciones_anestesia',
      'religion_restrictions',
      'vih','hepatitis','tuberculosis',
      'terapia_hormonal_activa',
      'terapia_hormonal_otra',
      'terapia_hormonal_dosis_frecuencia',
      'terapia_hormonal_duracion_valor',
      'terapia_hormonal_duracion_unidad'
    ]),
    ..._pa(profile, 'meds', 3),
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

    case 'qr-e3':
      extra = {
        ..._p(profile, ['weight','height','prematuro','semanas_gestacion',
          'guardian_name','guardian_phone_prefix','guardian_phone_num']),
        ..._pa(profile, 'vaccines', null),
        ..._pa(profile, 'diseases', 5),
        ..._pa(profile, 'allergy_food', null)
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
          'puede_decidir_salud','tutor_legal','tutor_legal_nombre','tutor_legal_phone',
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
  'qr-e3':        'pediatric',
  'qr-e4':        'obstetric',
  'qr-e5':        'mental'
};

function getOrCreateUserID() {
  return localStorage.getItem('doctorqr_id') || 'UNKNOWN';
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

// ============================================
// GENERACIÓN VISUAL DE CADA TARJETA QR
// ============================================

function generateQRCard(type, formData, container) {
  const url = buildQRUrl(type, formData);
  const d = formData;

  const card = document.createElement('div');
  card.style.cssText = `
    flex-shrink:0;width:260px;
    border-radius:16px;padding:20px;
    display:flex;flex-direction:column;
    align-items:center;gap:10px;
    scroll-snap-align:start;
    background:rgba(0,0,0,0.8);
    border:1.5px solid ${type.color};
    box-shadow:0 0 20px ${type.color}22;
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
    color:${type.color};opacity:0.7;
    font-family:inherit;
  `;
  sub.textContent = type.subtitle;

  const wrap = document.createElement('div');
  wrap.style.cssText = `
    position:relative;width:200px;height:200px;
  `;
  wrap.id = type.id + '-wrap';

  const age = d.fecha_nacimiento ?
    calcAge(d.fecha_nacimiento) + ' años' : '';

  const info = document.createElement('div');
  info.style.cssText = `
    font-size:10px;text-align:center;
    color:rgba(255,255,255,0.65);
    line-height:1.7;letter-spacing:0.5px;
    font-family:inherit;
  `;
  info.innerHTML = `
    <strong style="color:${type.color};word-break:break-word;white-space:normal;font-size:clamp(10px,2.5vw,14px);display:block;">
      ${d.nombre || ''} ${d.apellidos || ''}
    </strong><br>
    ${d.sangre ? '🩸 ' + d.sangre : ''}
    ${age ? ' · ' + age : ''}
  `;

  card.appendChild(title);
  card.appendChild(sub);
  card.appendChild(wrap);
  card.appendChild(info);
  container.appendChild(card);

  setTimeout(() => {
    new QRCode(wrap, {
      text: url,
      width: 200,
      height: 200,
      colorDark: type.darkColor,
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }, 100);
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

function generateAllQRs() {
  const formData = getFormData();

  if (!formData.nombre && !formData.apellidos) {
    alert('Completa al menos tu nombre y apellidos antes de generar los QR.');
    return;
  }

  if (getOrCreateUserID() === 'UNKNOWN') {
    alert('Tu sesión no tiene un ID de perfil válido.\nCierra sesión, vuelve a iniciarla y recarga la página.');
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
  document.getElementById('qr-section').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// IMPRIMIR QR EMERGENCIA — FORMATO TARJETA
// ============================================

function printEmergencyQR() {
  if (getOrCreateUserID() === 'UNKNOWN') {
    alert('No es posible imprimir el QR: tu perfil no tiene un ID válido.\nCierra sesión, vuelve a entrar y recarga la página.');
    return;
  }
  const d = getFormData();
  const patientUrl = buildQRUrl(QR_TYPES[0], d);
  const nombre = ((d.nombre || '') + ' ' + (d.apellidos || '')).trim();
  const sangre = d.sangre || '';

  const MONTHLY_THEME = {
    0:  { color: '#4fc3f7', cause: 'Salud Mental',                    ong: 'Teléfono de la Esperanza',       tel: '717 003 717', web: 'telefonodelaesperanza.org' },
    1:  { color: '#e53935', cause: 'Salud del Corazón',               ong: 'Fundación Española del Corazón', tel: '900 150 080', web: 'fundaciondelcorazon.com' },
    2:  { color: '#43a047', cause: 'Salud Global',                    ong: 'Cruz Roja',                      tel: '900 10 11 10', web: 'cruzroja.es' },
    3:  { color: '#1565c0', cause: 'Autismo y Salud Mental',          ong: 'FEAFES',                         tel: '91 523 17 46', web: 'feafes.com' },
    4:  { color: '#f48fb1', cause: 'Cáncer',                          ong: 'AECC',                           tel: '900 100 036', web: 'aecc.es' },
    5:  { color: '#ff6f00', cause: 'Diversidad e Inclusión',          ong: 'FELGTBI+',                       tel: '91 360 46 05', web: 'felgtbi.org' },
    6:  { color: '#ff6d00', cause: 'Salud en Verano',                 ong: 'Cruz Roja Mayores',              tel: '900 22 22 92', web: 'cruzroja.es' },
    7:  { color: '#00acc1', cause: 'Seguridad en Viaje',              ong: 'DYA',                            tel: '900 11 33 55', web: 'dya.es' },
    8:  { color: '#f9a825', cause: 'Alzheimer',                       ong: 'CEAFA',                          tel: '948 17 47 17', web: 'ceafa.es' },
    9:  { color: '#e91e63', cause: 'Cáncer de Mama',                  ong: 'AECC',                           tel: '900 100 036', web: 'aecc.es' },
    10: { color: '#1565c0', cause: 'Diabetes',                        ong: 'FEDE',                           tel: '91 539 06 36', web: 'fede.es' },
    11: { color: '#b71c1c', cause: 'VIH/SIDA y Donación de Sangre',  ong: 'CESIDA / Cruz Roja',             tel: '91 523 41 18', web: 'cesida.org' }
  };
  const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const month = new Date().getMonth();
  const theme = MONTHLY_THEME[month];
  const monthName = MONTH_NAMES[month];
  const gratuito = theme.tel.startsWith('900') ? ' · gratuito' : '';

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Atabeyapp — ${nombre || 'Tarjeta de emergencia'}</title>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;font-family:'Courier New',Courier,monospace}
.page{width:190mm;padding:8mm;margin:0 auto}
.instr{text-align:center;font-size:7pt;color:#555;letter-spacing:1px;
  padding:3mm;border:1px solid #ddd;border-radius:2mm;margin-bottom:6mm}
.section-label{text-align:center;font-size:7pt;font-weight:900;
  letter-spacing:2px;text-transform:uppercase;color:#999;margin:5mm 0 2mm}
.face-label{text-align:center;font-size:6.5pt;letter-spacing:1.5px;
  text-transform:uppercase;margin:2mm 0 1.5mm}
.face-label.front{color:${theme.color}}
.face-label.back{color:#12A5FF;background:#111;padding:1mm 0}
.cut{border:none;border-top:1.5px dashed #bbb;margin:4mm 0;text-align:center}
.cut-text{display:inline-block;background:#fff;color:#aaa;
  font-size:6pt;letter-spacing:1px;padding:0 3mm;position:relative;top:-8px}
.card-wrap{display:flex;justify-content:center}
.card{width:85.6mm;height:74mm;border-radius:3.5mm;padding:1.1mm 4mm;
  display:flex;flex-direction:column;align-items:center;justify-content:space-between}
.card-front{background:#fff;border:2px solid ${theme.color}}
.card-back{background:#000;border:2px solid #12A5FF;
  justify-content:center;gap:3mm}
.stamp-strip{width:100%;background:${theme.color};color:#fff;font-size:6pt;
  font-weight:900;letter-spacing:1.2px;text-transform:uppercase;
  text-align:center;padding:1.2mm 1mm;border-radius:1.5mm}
.front-name{font-size:8.5pt;font-weight:900;color:#000;
  text-align:center;word-break:break-word}
.front-blood{background:#cc0000;color:#fff;font-size:7pt;font-weight:900;
  padding:1mm 3mm;border-radius:2mm;letter-spacing:1px}
.front-footer{font-size:5pt;color:#888;letter-spacing:0.5px;text-align:center}
.phone-112{display:flex;align-items:baseline;gap:2mm;background:#000;
  color:#fff;border-radius:2mm;padding:0.8mm 3.5mm}
.phone-112-num{font-size:11.5pt;font-weight:900;letter-spacing:1px}
.phone-112-label{font-size:5pt;font-weight:700;letter-spacing:1px;
  text-transform:uppercase;opacity:0.85}
.phone-ong{font-size:4.5pt;line-height:1.2;color:#666;text-align:center;letter-spacing:0.3px}
.back-logo{font-size:14pt;font-weight:900;letter-spacing:3.5px;
  color:#12A5FF;text-shadow:0 0 8px #12A5FF}
.back-tagline{font-size:7pt;font-weight:900;letter-spacing:1.8px;
  color:#12A5FF;text-align:center;text-transform:uppercase;line-height:1.5}
.back-sep{width:70%;border-top:0.5pt solid ${theme.color};margin:0}
.cause-name{font-size:7.5pt;font-weight:900;color:${theme.color};
  letter-spacing:1px;text-transform:uppercase;text-align:center}
.cause-ong{font-size:6.5pt;color:${theme.color};text-align:center;
  letter-spacing:0.3px;line-height:1.6}
.cause-web{font-size:5.5pt;color:${theme.color};opacity:0.65;text-align:center}
.brace-wrap{display:flex;justify-content:center}
.brace{width:185mm;height:22mm;border-radius:3mm;padding:2mm 4mm;
  display:flex;align-items:center;gap:3mm}
.brace-front{background:linear-gradient(135deg,#fff 0%,${theme.color}1a 100%);
  border:3px solid ${theme.color}}
.brace-accent{width:3mm;align-self:stretch;background:${theme.color};
  border-radius:1.5mm;flex-shrink:0}
.brace-info{flex:1;overflow:hidden}
.brace-name{font-size:8pt;font-weight:900;color:#000;letter-spacing:0.3px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brace-badges{display:flex;align-items:center;gap:2mm;margin:0.3mm 0}
.brace-meta{font-size:6.5pt;color:#cc0000;font-weight:700;
  border:1px solid #cc0000;background:#fff;
  padding:0.4mm 1.8mm;border-radius:4mm}
.brace-112{background:#000;color:#fff;font-size:5.5pt;font-weight:900;
  padding:0.5mm 2mm;border-radius:4mm;letter-spacing:0.5px}
.brace-site{font-size:5.5pt;color:${theme.color};letter-spacing:0.5px}
.brace-more-info{font-size:5.5pt;font-weight:900;color:#cc0000;
  letter-spacing:0.4px;text-transform:uppercase;margin-top:0.3mm}
.grommet{width:8mm;height:8mm;border-radius:50%;border:1.5pt solid ${theme.color};
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  color:${theme.color};font-size:8pt}
.brace-fold-hint{text-align:center;font-size:5.5pt;color:#aaa;
  margin:1.5mm 0;letter-spacing:0.5px}
.instr-sub{display:block;opacity:0.55;font-size:85%;margin-top:0.8mm}
.eco-msg{text-align:center;font-size:6pt;color:#888;letter-spacing:0.4px;
  margin-top:5mm;padding:2mm 0;border-top:0.5pt solid #ddd}
@media print{.instr{display:none}}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
</head>
<body><div class="page">

<div class="instr">
  Imprimir &rarr; Plastificar &rarr; Doblar la tarjeta por la l&iacute;nea de corte &nbsp;|&nbsp; Pulsera: recortar la tira, pasar una brida de un solo uso por ambos ojales y plastificar
  <span class="instr-sub">Print &rarr; Laminate &rarr; Fold the card along the cut line &nbsp;|&nbsp; Bracelet: cut out the strip, thread a single-use zip tie through both holes, then laminate</span>
  <span class="instr-sub">Imprimer &rarr; Plastifier &rarr; Plier la carte le long de la ligne de d&eacute;coupe &nbsp;|&nbsp; Bracelet&nbsp;: d&eacute;couper la bande, passer un collier de serrage &agrave; usage unique dans les deux &oelig;illets, puis plastifier</span>
</div>

<div class="section-label">&#9632; TARJETA SANITARIA</div>
<div class="face-label front">CARA FRONTAL &mdash; visible</div>
<div class="card-wrap"><div class="card card-front">
  <div class="stamp-strip">EMERGENCIA &middot; ${monthName} &mdash; ${theme.cause}</div>
  <div id="qcf"></div>
  <div class="front-footer">atabeyapp.app</div>
  <div class="front-name">${nombre || '&mdash;'}</div>
  ${sangre ? '<div class="front-blood">&#129656; ' + sangre + '</div>' : ''}
  <div class="phone-112">
    <span class="phone-112-num">112</span>
    <span class="phone-112-label">Emergencias</span>
  </div>
  <div class="phone-ong">${theme.ong} &middot; ${theme.tel}${gratuito}</div>
</div></div>

<div class="cut"><span class="cut-text">&#9988; &nbsp; DOBLAR AQU&Iacute; &nbsp; &#9988;</span></div>

<div class="face-label back">CARA DORSAL &mdash; interior al doblar</div>
<div class="card-wrap"><div class="card card-back">
  <div class="back-logo">ATABEY<span style="opacity:0.4">APP</span></div>
  <div id="qcb"></div>
  <div class="back-tagline">TU HISTORIAL M&Eacute;DICO<br>DE EMERGENCIA</div>
  <div class="back-sep"></div>
  <div class="cause-name">&#9632; ${theme.cause}</div>
  <div class="cause-ong">${theme.ong} &middot; ${theme.tel}${gratuito}</div>
  <div class="cause-web">${theme.web}</div>
</div></div>

<div class="cut"><span class="cut-text">&#9988; &mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;&mdash; &#9988;</span></div>

<div class="section-label">&#9675; PULSERA M&Eacute;DICA</div>
<div class="brace-wrap"><div class="brace brace-front">
  <div class="grommet">&#9675;</div>
  <div class="brace-accent"></div>
  <div class="brace-info">
    <div class="brace-name">${nombre || '&mdash;'}</div>
    <div class="brace-badges">
      <span class="brace-meta">${sangre ? '&#129656; ' + sangre : ''}</span>
      <span class="brace-112">&#10010; 112</span>
    </div>
    <div class="brace-site">atabeyapp.app</div>
    <div class="brace-more-info">VER TARJETA QR &mdash; M&Aacute;S INFO</div>
  </div>
  <div class="grommet">&#9675;</div>
</div></div>
<div class="brace-fold-hint">
  Pasar brida de un solo uso por ambos ojales &mdash; no reutilizable
  <span class="instr-sub">Thread a single-use zip tie through both holes &mdash; not reusable</span>
  <span class="instr-sub">Passer un collier de serrage &agrave; usage unique dans les deux &oelig;illets &mdash; non r&eacute;utilisable</span>
</div>

<div class="eco-msg">
  &#127807; Tarjeta y pulsera en un solo folio &middot; Colaboramos con el medio ambiente &middot; Plastifica para mayor durabilidad
  <span class="instr-sub">Card and bracelet on a single sheet &middot; We help protect the environment &middot; Laminate for extra durability</span>
  <span class="instr-sub">Carte et bracelet sur une seule feuille &middot; Nous prot&eacute;geons l'environnement &middot; Plastifiez pour plus de durabilit&eacute;</span>
</div>

</div>
<script>
  var pUrl=\`${patientUrl}\`,bUrl='https://atabeyapp.app',M=QRCode.CorrectLevel.M;
  new QRCode(document.getElementById('qcf'),{text:pUrl,width:178,height:178,colorDark:'${theme.color}',colorLight:'#ffffff',correctLevel:M});
  new QRCode(document.getElementById('qcb'),{text:bUrl,width:88,height:88,colorDark:'#12A5FF',colorLight:'#000000',correctLevel:M});
  setTimeout(function(){window.print()},1500);
<\/script>
</body></html>`);
  win.document.close();
}

document.getElementById('btn-print-emergency')
  ?.addEventListener('click', printEmergencyQR);
