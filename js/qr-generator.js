// ============================================
// DATOS BASE — VAN EN ABSOLUTAMENTE TODOS LOS QR
// ============================================
const BASE_FIELDS = [
  // Identidad
  'nombre','apellidos','fecha_nacimiento',
  'doc_type','doc_number','sangre',
  // Alergias
  'allergy_med','allergy_anesthesia',
  'allergy_food','allergy_env',
  'latex_guantes','epipen','anafilaxia_previa',
  // Medicación
  'anticoagulado','pacemaker',
  'meds','med_doses','medicacion_alto_riesgo',
  'ultima_toma_medicacion',
  // Condiciones
  'diseases','conditions',
  'implant_detail',
  'dificultad_intubacion','complicaciones_anestesia',
  'material_osteosintesis',
  // Decisiones
  'can_decide','religion_restrictions',
  'advance_directive','organ_donor',
  // Historial
  'surgeries','last_surgery_date',
  'vaccines',
  'tabaco','alcohol','drogas','actividad_fisica',
  'enfermedades_familiares','muerte_subita_familiar',
  'hipertermia_maligna_familiar',
  // Biométrico
  'weight','height',
  // Contactos emergencia
  'ec1_name','ec1_rel','ec1_phone_prefix','ec1_phone_num',
  'ec2_name','ec2_rel','ec2_phone_prefix','ec2_phone_num',
  'guardian_name','guardian_phone_prefix','guardian_phone_num',
  // Médico
  'doctor_name','doctor_phone_prefix','doctor_phone_num',
  // Seguro
  'insurer','policy','health_card_num','ss_country',
  // Idioma
  'lang'
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
    condition: (d) => hasAny(d, [
      'Marcapasos','Desfibrilador',
      'Stent coronario','Válvula cardíaca',
      'Fibrilación auricular','Arritmia',
      'Insuficiencia cardíaca','Epilepsia',
      'Ictus previo','SÍ — ANTICOAGULADO',
      'Muerte súbita']),
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
    condition: (d) => hasAny(d, [
      'Marcapasos','Prótesis','Stent',
      'Válvula','Implante','Port-a-cath',
      'SÍ — intubación difícil',
      'SÍ — hipertermia maligna',
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
    condition: (d) => hasAny(d, [
      'Sí — estoy embarazada',
      'Sí — lactancia materna activa']),
    extra: [
      'embarazo','embarazo_semanas',
      'lactancia','surgeries',
      'allergy_food','conditions',
      'diseases','terapia_hormonal',
      'medicacion_alto_riesgo',
      'weight','height',
      'guardian_name','guardian_phone_num',
      'insurer',
      'policy'
    ]
  },
  {
    id: 'qr-e5',
    title: 'QR-E5 SALUD MENTAL',
    subtitle: 'Psiquiatría · Tutor · Crisis',
    color: '#00ffcc',
    darkColor: '#00cc99',
    condition: (d) => hasAny(d, [
      'Esquizofrenia','Trastorno bipolar',
      'Depresión mayor','IMAO',
      'Litio','No — tutor legal',
      'Ansiedad crónica','TOC']),
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

function buildQRUrl(type, formData) {
  const d = formData;
  const payload = {};

  BASE_FIELDS.forEach(f => {
    if (d[f]) payload[f] = d[f];
  });

  if (type.extra) {
    type.extra.forEach(f => {
      if (d[f]) payload[f] = d[f];
    });
  }

  payload.qr = type.id;
  payload.ts = new Date().toISOString().split('T')[0];

  const json = JSON.stringify(payload);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return 'https://doctorqr.app/card.html#' + compressed;
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

  const logo = document.createElement('div');
  logo.style.cssText = `
    position:absolute;
    top:50%;left:50%;
    transform:translate(-50%,-50%);
    width:38px;height:38px;
    background:#000;border-radius:6px;
    display:flex;align-items:center;
    justify-content:center;
    font-size:7px;font-weight:900;
    letter-spacing:0.5px;
    text-align:center;line-height:1.3;
    color:${type.color};
    border:1px solid ${type.color};
    font-family:inherit;z-index:2;
  `;
  logo.innerHTML = 'D<br>QR';
  wrap.appendChild(logo);

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
      colorLight: '#000000',
      correctLevel: QRCode.CorrectLevel.H
    });
    wrap.appendChild(logo);
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
            active[j]?.color || '#00ff41' :
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
  const d = getFormData();
  const type = QR_TYPES[0];
  const url = buildQRUrl(type, d);

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#fff;font-family:Arial,sans-serif;
    display:flex;flex-direction:column;
    align-items:center;padding:10mm}
  .card{width:85.6mm;height:53.98mm;
    border:2px solid #cc0000;border-radius:4mm;
    padding:3mm 4mm;display:flex;
    flex-direction:column;align-items:center;
    justify-content:space-between}
  .card-title{font-size:7pt;font-weight:900;
    color:#cc0000;letter-spacing:2px;
    text-transform:uppercase}
  .card-name{font-size:8pt;font-weight:bold;text-align:center}
  .card-info{font-size:6pt;color:#333;text-align:center}
  @media print{body{padding:0}}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
</head><body>
<div class="card">
  <div class="card-title">QR EMERGENCIA — DOCTORQR</div>
  <div id="qr-print"></div>
  <div class="card-name">${d.nombre || ''} ${d.apellidos || ''}</div>
  <div class="card-info">${d.sangre || ''} · doctorqr.app</div>
</div>
<script>
  new QRCode(document.getElementById('qr-print'), {
    text: \`${url}\`,
    width: 110, height: 110,
    colorDark: '#cc0000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
  setTimeout(() => window.print(), 800);
<\/script>
</body></html>`);
  win.document.close();
}

document.getElementById('btn-print-emergency')
  ?.addEventListener('click', printEmergencyQR);
