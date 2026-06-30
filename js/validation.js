    // ===== OPCIONES DE PAÍSES =====
    const COUNTRIES_HTML = `
      <optgroup label="Unión Europea">
        <option value="+34">+34 España</option>
        <option value="+33">+33 Francia</option>
        <option value="+49">+49 Alemania</option>
        <option value="+39">+39 Italia</option>
        <option value="+351">+351 Portugal</option>
        <option value="+32">+32 Bélgica</option>
        <option value="+31">+31 Países Bajos</option>
        <option value="+43">+43 Austria</option>
        <option value="+30">+30 Grecia</option>
        <option value="+48">+48 Polonia</option>
        <option value="+40">+40 Rumanía</option>
        <option value="+359">+359 Bulgaria</option>
        <option value="+420">+420 Rep. Checa</option>
        <option value="+36">+36 Hungría</option>
        <option value="+46">+46 Suecia</option>
        <option value="+45">+45 Dinamarca</option>
        <option value="+358">+358 Finlandia</option>
        <option value="+353">+353 Irlanda</option>
        <option value="+386">+386 Eslovenia</option>
        <option value="+421">+421 Eslovaquia</option>
        <option value="+372">+372 Estonia</option>
        <option value="+371">+371 Letonia</option>
        <option value="+370">+370 Lituania</option>
        <option value="+356">+356 Malta</option>
        <option value="+357">+357 Chipre</option>
        <option value="+352">+352 Luxemburgo</option>
        <option value="+385">+385 Croacia</option>
      </optgroup>
      <optgroup label="Fuera UE">
        <option value="+44">+44 Reino Unido</option>
        <option value="+41">+41 Suiza</option>
        <option value="+47">+47 Noruega</option>
        <option value="+1">+1 EEUU/Canadá</option>
        <option value="+52">+52 México</option>
        <option value="+54">+54 Argentina</option>
        <option value="+57">+57 Colombia</option>
        <option value="+58">+58 Venezuela</option>
        <option value="+51">+51 Perú</option>
        <option value="+56">+56 Chile</option>
        <option value="+55">+55 Brasil</option>
        <option value="+593">+593 Ecuador</option>
        <option value="+591">+591 Bolivia</option>
        <option value="+598">+598 Uruguay</option>
        <option value="+595">+595 Paraguay</option>
        <option value="+966">+966 Arabia Saudí</option>
        <option value="+971">+971 Emiratos Árabes</option>
        <option value="+81">+81 Japón</option>
        <option value="+82">+82 Corea del Sur</option>
        <option value="+86">+86 China</option>
        <option value="+91">+91 India</option>
        <option value="+61">+61 Australia</option>
        <option value="+64">+64 Nueva Zelanda</option>
        <option value="+27">+27 Sudáfrica</option>
        <option value="+20">+20 Egipto</option>
        <option value="+212">+212 Marruecos</option>
        <option value="+213">+213 Argelia</option>
        <option value="+216">+216 Túnez</option>
      </optgroup>`;

    // ===== PAÍSES TARJETA SANITARIA (sin prefijo) =====
    const HEALTH_CARD_COUNTRIES_HTML = `
      <option value="">— País tarjeta —</option>
      <optgroup label="Unión Europea">
        <option value="+34">España</option>
        <option value="+33">Francia</option>
        <option value="+49">Alemania</option>
        <option value="+39">Italia</option>
        <option value="+351">Portugal</option>
        <option value="+31">Países Bajos</option>
        <option value="+32">Bélgica</option>
        <option value="+43">Austria</option>
        <option value="+30">Grecia</option>
        <option value="+48">Polonia</option>
        <option value="+40">Rumanía</option>
        <option value="+359">Bulgaria</option>
        <option value="+420">Rep. Checa</option>
        <option value="+36">Hungría</option>
        <option value="+46">Suecia</option>
        <option value="+45">Dinamarca</option>
        <option value="+358">Finlandia</option>
        <option value="+353">Irlanda</option>
        <option value="+386">Eslovenia</option>
        <option value="+421">Eslovaquia</option>
        <option value="+372">Estonia</option>
        <option value="+371">Letonia</option>
        <option value="+370">Lituania</option>
        <option value="+356">Malta</option>
        <option value="+357">Chipre</option>
        <option value="+352">Luxemburgo</option>
        <option value="+385">Croacia</option>
      </optgroup>
      <optgroup label="Fuera UE">
        <option value="+44">Reino Unido</option>
        <option value="+41">Suiza</option>
        <option value="+47">Noruega</option>
        <option value="+1">EEUU</option>
        <option value="other">Fuera de la UE</option>
      </optgroup>`;

    // ===== REGLAS VALIDACIÓN TELÉFONO =====
    const PHONE_RULES = {
      '+34':  { len:[9],      starts:/^[6789]/, hint:'Formato: 6XX XXX XXX' },
      '+33':  { len:[10],     starts:/^0/,      hint:'Formato: 0X XX XX XX XX' },
      '+49':  { len:[10,11],                    hint:'10-11 dígitos' },
      '+39':  { len:[9,10],                     hint:'9-10 dígitos' },
      '+351': { len:[9],      starts:/^9/,      hint:'Formato: 9XX XXX XXX' },
      '+32':  { len:[9,10],                     hint:'9-10 dígitos' },
      '+31':  { len:[9],                        hint:'9 dígitos' },
      '+43':  { len:[10,11],                    hint:'10-11 dígitos' },
      '+30':  { len:[10],                       hint:'10 dígitos' },
      '+48':  { len:[9],                        hint:'9 dígitos' },
      '+40':  { len:[10],                       hint:'10 dígitos' },
      '+359': { len:[8,9],                      hint:'8-9 dígitos' },
      '+420': { len:[9],                        hint:'9 dígitos' },
      '+36':  { len:[8,9],                      hint:'8-9 dígitos' },
      '+46':  { len:[9,10],                     hint:'9-10 dígitos' },
      '+45':  { len:[8],                        hint:'8 dígitos' },
      '+358': { len:[9,10],                     hint:'9-10 dígitos' },
      '+353': { len:[9],                        hint:'9 dígitos' },
      '+386': { len:[8],                        hint:'8 dígitos' },
      '+421': { len:[9],                        hint:'9 dígitos' },
      '+372': { len:[7,8],                      hint:'7-8 dígitos' },
      '+371': { len:[8],                        hint:'8 dígitos' },
      '+370': { len:[8],                        hint:'8 dígitos' },
      '+356': { len:[8],                        hint:'8 dígitos' },
      '+357': { len:[8],                        hint:'8 dígitos' },
      '+352': { len:[9],                        hint:'9 dígitos' },
      '+385': { len:[8,9],                      hint:'8-9 dígitos' },
      '+44':  { len:[10,11],                    hint:'10-11 dígitos' },
      '+41':  { len:[9],                        hint:'9 dígitos' },
      '+47':  { len:[8],                        hint:'8 dígitos' },
      '+1':   { len:[10],                       hint:'10 dígitos' },
      '+52':  { len:[10],                       hint:'10 dígitos' },
      '+54':  { len:[10],                       hint:'10 dígitos' },
      '+57':  { len:[10],                       hint:'10 dígitos' },
      '+58':  { len:[10],                       hint:'10 dígitos' },
    };

    // ===== REGLAS VALIDACIÓN TARJETA SANITARIA =====
    const HEALTH_CARD_RULES = {
      '+34':  { re:/^[A-Z]{4}\d{8}$/,        hint:'Formato: CCCC99999999 (4 letras + 8 números)' },
      '+33':  { re:/^\d{15}$/,               hint:'15 dígitos numéricos' },
      '+49':  { re:/^[A-Z]\d{9}$/,           hint:'1 letra + 9 dígitos' },
      '+39':  { re:/^[A-Z0-9]{16}$/,         hint:'16 caracteres — letras y números' },
      '+351': { re:/^\d{9}$/,                hint:'9 dígitos numéricos' },
      '+44':  { re:/^\d{10}$/,               hint:'10 dígitos — formato NHS' },
      '+31':  { re:/^\d{9}$/,                hint:'9 dígitos — BSN' },
      '+32':  { re:/^\d{12}$/,               hint:'12 dígitos numéricos' },
      '+43':  { re:/^\d{10}$/,               hint:'10 dígitos' },
      '+30':  { re:/^\d{11}$/,               hint:'11 dígitos — AMKA' },
      '+48':  { re:/^\d{11}$/,               hint:'11 dígitos — PESEL' },
      '+40':  { re:/^\d{13}$/,               hint:'13 dígitos — CNP' },
      '+359': { re:/^\d{10}$/,               hint:'10 dígitos — EGN' },
      '+46':  { re:/^\d{10,12}$/,            hint:'10-12 dígitos' },
      '+45':  { re:/^\d{10}$/,               hint:'10 dígitos — CPR' },
      '+353': { re:/^\d{7}[A-Z]{1,2}$/,      hint:'7 dígitos + 1-2 letras' },
      '+41':  { re:/^\d{13}$/,               hint:'13 dígitos — AHV' },
      '+47':  { re:/^\d{11}$/,               hint:'11 dígitos' },
      '+1':   { re:null,                     hint:'Insurance Member ID (variable)' },
    };

    const EU_CODES = new Set(['+34','+33','+49','+39','+351','+32','+31','+43','+30','+48',
      '+40','+359','+420','+36','+46','+45','+358','+353','+386','+421','+372','+371','+370',
      '+356','+357','+352','+385']);

    // ===== VALIDACIÓN TELÉFONO =====
    function validatePhoneField(pf) {
      const prefix  = pf.querySelector('select').value;
      const inp     = pf.querySelector('input');
      const hintEl  = pf.querySelector('.phone-hint');
      const warnEl  = pf.querySelector('.phone-warning');
      const num     = inp.value.replace(/[\s\-\(\)\.]/g, '');
      const rule    = PHONE_RULES[prefix];

      // Hint siempre visible según país
      if (!hintEl) return;
      hintEl.textContent = rule ? rule.hint : (num ? 'Solo dígitos' : '');

      if (!num) {
        warnEl.style.display = 'none';
        inp.style.borderColor = '';
        return;
      }

      let valid;
      if (!rule) {
        valid = /^\d+$/.test(num);
      } else {
        valid = /^\d+$/.test(num) && rule.len.includes(num.length);
        if (valid && rule.starts) valid = rule.starts.test(num);
      }

      if (valid) {
        warnEl.style.display = 'none';
        inp.style.borderColor = '#12A5FF';
        hintEl.innerHTML = (rule ? rule.hint : 'Solo dígitos') + ' <span style="color:#12A5FF;font-weight:700">✓</span>';
      } else {
        warnEl.style.display = 'block';
        inp.style.borderColor = '#ff4444';
      }
    }

    // ===== VALIDACIÓN TARJETA SANITARIA =====
    function validateHealthCard() {
      const sel    = document.getElementById('f-health-card-country');
      const inp    = document.getElementById('f-health-card-num');
      const hintEl = document.querySelector('.health-card-hint');
      const warnEl = document.querySelector('.health-card-warning');
      if (!sel || !inp) return;

      const code = sel.value;
      const num  = inp.value.trim().replace(/[\s\-]/g, '').toUpperCase();
      const rule = HEALTH_CARD_RULES[code];
      const defaultHint = EU_CODES.has(code) ? 'Número de tarjeta sanitaria' : 'Número de documento sanitario';

      hintEl.textContent = rule ? rule.hint : defaultHint;

      if (!num) {
        warnEl.style.display = 'none';
        inp.style.borderColor = '';
        return;
      }

      if (!rule || !rule.re) {
        warnEl.style.display = 'none';
        inp.style.borderColor = '#12A5FF';
        return;
      }

      const valid = rule.re.test(num);
      if (valid) {
        warnEl.style.display = 'none';
        inp.style.borderColor = '#12A5FF';
        hintEl.innerHTML = rule.hint + ' <span style="color:#12A5FF;font-weight:700">✓</span>';
      } else {
        warnEl.style.display = 'block';
        inp.style.borderColor = '#ff4444';
        hintEl.textContent = rule.hint;
      }
    }

    // ===== SETUP VALIDACIÓN =====
    function setupValidation() {
      document.querySelectorAll('.phone-field').forEach(pf => {
        pf.querySelector('select').addEventListener('change', () => validatePhoneField(pf));
        pf.querySelector('input').addEventListener('input',  () => validatePhoneField(pf));
        validatePhoneField(pf);
      });
      const hcSel = document.getElementById('f-health-card-country');
      const hcInp = document.getElementById('f-health-card-num');
      if (hcSel) hcSel.addEventListener('change', validateHealthCard);
      if (hcInp) hcInp.addEventListener('input',  validateHealthCard);
      validateHealthCard();
    }

    function validateDNI(input) {
      const val = input.value.toUpperCase();
      input.value = val;
      const warn = document.getElementById('warn-dni');
      warn.style.display = (val.length === 9 && !/^[0-9]{8}[A-Z]$/.test(val)) ? 'block' : 'none';
    }

    function validateNIE(input) {
      const val = input.value.toUpperCase();
      input.value = val;
      const warn = document.getElementById('warn-nie');
      warn.style.display = (val.length === 9 && !/^[XYZ][0-9]{7}[A-Z]$/.test(val)) ? 'block' : 'none';
    }

    function validatePassport(input) {
      const val = input.value.toUpperCase();
      input.value = val;
      const country = document.getElementById('passport-country').value;
      const warn = document.getElementById('warn-pasaporte');
      const patterns = {
        es: /^[A-Z]{3}[0-9]{6}$/,
        fr: /^[A-Z]{2}[0-9]{7}$/,
        de: /^[A-Z0-9]{9}$/,
        it: /^[A-Z]{2}[0-9]{7}$/,
        pt: /^[A-Z]{1,2}[0-9]{6,7}$/,
        gb: /^[A-Z0-9]{9}$/,
        us: /^[0-9]{9}$/,
        mx: /^[A-Z]{1,2}[0-9]{8}$/,
        ar: /^[0-9]{8}$/,
        co: /^[0-9]{6,9}$/
      };
      if (val.length < 6) { warn.style.display = 'none'; return; }
      if (country === 'other') {
        warn.style.display = (val.length >= 6 && val.length <= 20) ? 'none' : 'block';
        return;
      }
      const pattern = patterns[country];
      warn.style.display = (pattern && !pattern.test(val)) ? 'block' : 'none';
    }

    function updatePassportHint() {
      const country = document.getElementById('passport-country').value;
      const hints = {
        es: 'Formato España: 3 letras + 6 dígitos — ejemplo: AAA123456',
        fr: 'Formato Francia: 2 letras + 7 dígitos — ejemplo: AB1234567',
        de: 'Formato Alemania: 9 caracteres alfanuméricos — ejemplo: C01X00T47',
        it: 'Formato Italia: 2 letras + 7 dígitos — ejemplo: AA1234567',
        pt: 'Formato Portugal: 1-2 letras + 6-7 dígitos — ejemplo: A123456',
        gb: 'Formato Reino Unido: 9 caracteres — ejemplo: 123456789',
        us: 'Formato EEUU: 9 dígitos — ejemplo: 123456789',
        mx: 'Formato México: 1-2 letras + 8 dígitos — ejemplo: G12345678',
        ar: 'Formato Argentina: 8 dígitos — ejemplo: 12345678',
        co: 'Formato Colombia: 6-9 dígitos — ejemplo: 1234567',
        other: 'Introduce el número de pasaporte (6-20 caracteres)'
      };
      const el = document.getElementById('hint-pasaporte');
      if (el) el.textContent = hints[country] || hints.other;
    }

    function toggleCustomDomain() {
      const sel = document.getElementById('email-domain');
      const custom = document.getElementById('email-custom-domain');
      custom.style.display = sel.value === 'custom' ? 'block' : 'none';
    }

    function getEmailValue() {
      const alias = document.getElementById('email-alias').value.trim();
      const domSel = document.getElementById('email-domain').value;
      const domain = domSel === 'custom'
        ? document.getElementById('email-custom-domain').value.trim()
        : domSel;
      return alias && domain ? alias + '@' + domain : '';
    }
