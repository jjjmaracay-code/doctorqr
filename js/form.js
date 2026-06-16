    // ===== TOGGLE SECCIONES =====
    function toggleSection(id) {
      document.getElementById(id).classList.toggle('open');
    }

    // ===== NIVELES DE IDIOMA =====
    const LANG_LEVELS = ['Básico', 'Conversacional', 'Fluido', 'Nativo'];

    function renderLangLevels(savedLevels) {
      const activeChips = document.querySelectorAll('[data-group="lang-spoken"] .chip.active');
      const container = document.getElementById('lang-levels-container');
      const current = {};
      container.querySelectorAll('.lang-level-row').forEach(row => {
        current[row.dataset.lang] = row.querySelector('select').value;
      });
      container.innerHTML = '';
      if (activeChips.length === 0) return;
      activeChips.forEach(chip => {
        const lang = chip.dataset.value;
        const row = document.createElement('div');
        row.className = 'lang-level-row';
        row.dataset.lang = lang;
        const label = document.createElement('span');
        label.className = 'lang-level-label';
        label.textContent = lang;
        const sel = document.createElement('select');
        LANG_LEVELS.forEach(lvl => {
          const opt = document.createElement('option');
          opt.value = lvl; opt.textContent = lvl;
          sel.appendChild(opt);
        });
        if (current[lang]) sel.value = current[lang];
        else if (savedLevels && savedLevels[lang]) sel.value = savedLevels[lang];
        row.appendChild(label);
        row.appendChild(sel);
        container.appendChild(row);
      });
    }

    // ===== CHIPS =====
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.closest('[data-group]');
        const isSingle = group && group.dataset.single === 'true';
        if (isSingle) {
          const wasActive = chip.classList.contains('active');
          group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          if (!wasActive) chip.classList.add('active');
        } else {
          chip.classList.toggle('active');
        }
        if (group && group.dataset.group === 'lang-spoken') renderLangLevels();
        if (group && group.dataset.group === 'profesion') {
          const otraWrap = document.getElementById('profesion-otra-wrap');
          if (otraWrap) {
            otraWrap.style.display = chip.dataset.value === 'Otra' && chip.classList.contains('active') ? 'block' : 'none';
          }
        }
        if (group && group.dataset.group === 'semanas-gestacion-aplica') {
          const noAplica = chip.classList.contains('active');
          const wrap = document.getElementById('semanas-gestacion-input-wrap');
          if (wrap) wrap.style.display = noAplica ? 'none' : '';
          if (noAplica) { const inp = document.getElementById('f-semanas-gestacion'); if (inp) inp.value = ''; }
        }
        if (group && group.dataset.group === 'semanas-lactancia-aplica') {
          const noAplica = chip.classList.contains('active');
          const wrap = document.getElementById('semanas-lactancia-input-wrap');
          if (wrap) wrap.style.display = noAplica ? 'none' : '';
          if (noAplica) { const inp = document.getElementById('f-semanas-lactancia'); if (inp) inp.value = ''; }
        }
        clearChipsSearch(chip);
      });
    });

    // ===== PAÍSES VISITADOS =====
    const VISITED_COUNTRIES_HTML = `
      <option value="">— No aplica —</option>
      <option value="Afghanistan">Afghanistan</option>
      <option value="Albania">Albania</option>
      <option value="Alemania">Alemania</option>
      <option value="Algeria">Algeria</option>
      <option value="Angola">Angola</option>
      <option value="Arabia Saudí">Arabia Saudí</option>
      <option value="Argentina">Argentina</option>
      <option value="Armenia">Armenia</option>
      <option value="Australia">Australia</option>
      <option value="Austria">Austria</option>
      <option value="Azerbaiyán">Azerbaiyán</option>
      <option value="Bahréin">Bahréin</option>
      <option value="Bangladesh">Bangladesh</option>
      <option value="Bélgica">Bélgica</option>
      <option value="Bielorrusia">Bielorrusia</option>
      <option value="Bolivia">Bolivia</option>
      <option value="Bosnia">Bosnia</option>
      <option value="Brasil">Brasil</option>
      <option value="Bulgaria">Bulgaria</option>
      <option value="Camboya">Camboya</option>
      <option value="Camerún">Camerún</option>
      <option value="Canadá">Canadá</option>
      <option value="Chile">Chile</option>
      <option value="China">China</option>
      <option value="Colombia">Colombia</option>
      <option value="Congo">Congo</option>
      <option value="Corea del Norte">Corea del Norte</option>
      <option value="Corea del Sur">Corea del Sur</option>
      <option value="Costa Rica">Costa Rica</option>
      <option value="Costa de Marfil">Costa de Marfil</option>
      <option value="Croacia">Croacia</option>
      <option value="Cuba">Cuba</option>
      <option value="Dinamarca">Dinamarca</option>
      <option value="Ecuador">Ecuador</option>
      <option value="Egipto">Egipto</option>
      <option value="El Salvador">El Salvador</option>
      <option value="Emiratos Árabes">Emiratos Árabes</option>
      <option value="Eritrea">Eritrea</option>
      <option value="Eslovaquia">Eslovaquia</option>
      <option value="Eslovenia">Eslovenia</option>
      <option value="España">España</option>
      <option value="Estados Unidos">Estados Unidos</option>
      <option value="Estonia">Estonia</option>
      <option value="Etiopía">Etiopía</option>
      <option value="Filipinas">Filipinas</option>
      <option value="Finlandia">Finlandia</option>
      <option value="Francia">Francia</option>
      <option value="Georgia">Georgia</option>
      <option value="Ghana">Ghana</option>
      <option value="Grecia">Grecia</option>
      <option value="Guatemala">Guatemala</option>
      <option value="Honduras">Honduras</option>
      <option value="Hong Kong">Hong Kong</option>
      <option value="Hungría">Hungría</option>
      <option value="India">India</option>
      <option value="Indonesia">Indonesia</option>
      <option value="Irak">Irak</option>
      <option value="Irán">Irán</option>
      <option value="Irlanda">Irlanda</option>
      <option value="Israel">Israel</option>
      <option value="Italia">Italia</option>
      <option value="Jamaica">Jamaica</option>
      <option value="Japón">Japón</option>
      <option value="Jordania">Jordania</option>
      <option value="Kazajistán">Kazajistán</option>
      <option value="Kenia">Kenia</option>
      <option value="Kosovo">Kosovo</option>
      <option value="Kuwait">Kuwait</option>
      <option value="Laos">Laos</option>
      <option value="Letonia">Letonia</option>
      <option value="Líbano">Líbano</option>
      <option value="Libia">Libia</option>
      <option value="Lituania">Lituania</option>
      <option value="Luxemburgo">Luxemburgo</option>
      <option value="Macedonia">Macedonia</option>
      <option value="Madagascar">Madagascar</option>
      <option value="Malasia">Malasia</option>
      <option value="Mali">Mali</option>
      <option value="Malta">Malta</option>
      <option value="Marruecos">Marruecos</option>
      <option value="México">México</option>
      <option value="Moldova">Moldova</option>
      <option value="Mongolia">Mongolia</option>
      <option value="Montenegro">Montenegro</option>
      <option value="Mozambique">Mozambique</option>
      <option value="Myanmar">Myanmar</option>
      <option value="Nepal">Nepal</option>
      <option value="Nicaragua">Nicaragua</option>
      <option value="Nigeria">Nigeria</option>
      <option value="Noruega">Noruega</option>
      <option value="Nueva Zelanda">Nueva Zelanda</option>
      <option value="Omán">Omán</option>
      <option value="Países Bajos">Países Bajos</option>
      <option value="Pakistán">Pakistán</option>
      <option value="Palestina">Palestina</option>
      <option value="Panamá">Panamá</option>
      <option value="Paraguay">Paraguay</option>
      <option value="Perú">Perú</option>
      <option value="Polonia">Polonia</option>
      <option value="Portugal">Portugal</option>
      <option value="Puerto Rico">Puerto Rico</option>
      <option value="Qatar">Qatar</option>
      <option value="Reino Unido">Reino Unido</option>
      <option value="República Checa">República Checa</option>
      <option value="República Dominicana">República Dominicana</option>
      <option value="Rumanía">Rumanía</option>
      <option value="Rusia">Rusia</option>
      <option value="Rwanda">Rwanda</option>
      <option value="Senegal">Senegal</option>
      <option value="Serbia">Serbia</option>
      <option value="Singapur">Singapur</option>
      <option value="Siria">Siria</option>
      <option value="Somalia">Somalia</option>
      <option value="Sri Lanka">Sri Lanka</option>
      <option value="Sudáfrica">Sudáfrica</option>
      <option value="Sudán">Sudán</option>
      <option value="Suecia">Suecia</option>
      <option value="Suiza">Suiza</option>
      <option value="Tailandia">Tailandia</option>
      <option value="Tanzania">Tanzania</option>
      <option value="Túnez">Túnez</option>
      <option value="Turquía">Turquía</option>
      <option value="Ucrania">Ucrania</option>
      <option value="Uganda">Uganda</option>
      <option value="Uruguay">Uruguay</option>
      <option value="Uzbekistán">Uzbekistán</option>
      <option value="Venezuela">Venezuela</option>
      <option value="Vietnam">Vietnam</option>
      <option value="Yemen">Yemen</option>
      <option value="Zambia">Zambia</option>
      <option value="Zimbabwe">Zimbabwe</option>`;

    // ===== INICIALIZAR SELECTS DE PAÍS =====
    function initCountrySelects() {
      document.querySelectorAll('.phone-prefix').forEach(sel => {
        sel.innerHTML = COUNTRIES_HTML;
      });
      const hcSel = document.getElementById('f-health-card-country');
      if (hcSel) hcSel.innerHTML = HEALTH_CARD_COUNTRIES_HTML;
      document.querySelectorAll('.form-select').forEach(sel => {
        sel.innerHTML = VISITED_COUNTRIES_HTML;
      });
    }

    // ===== HELPERS CHIPS =====
    function getChips(group) {
      return Array.from(
        document.querySelectorAll(`[data-group="${group}"] .chip.active`)
      ).map(c => c.dataset.value);
    }

    function getChip(group) {
      const active = document.querySelector(`[data-group="${group}"] .chip.active`);
      return active ? active.dataset.value : '';
    }

    function getLangLevels() {
      const levels = {};
      document.querySelectorAll('#lang-levels-container .lang-level-row').forEach(row => {
        levels[row.dataset.lang] = row.querySelector('select').value;
      });
      return levels;
    }

    // ===== GENERATE =====
    function generate() {
      const v = id => document.getElementById(id).value;
      const profile = {
        lang_spoken:           getChips('lang-spoken'),
        lang_levels:           getLangLevels(),
        lang_written:          getChips('lang-written'),
        comm_difficulty:       getChips('comm-difficulty'),
        sign_lang:             getChips('sign-lang'),
        can_decide:            getChip('can-decide'),
        profesion:             getChip('profesion') === 'Otra'
                               ? (document.getElementById('profesion-otra-text')?.value.trim() || 'Otra')
                               : getChip('profesion'),
        ayudas_tecnicas:       getChips('ayudas-tecnicas'),
        weight:                getChip('weight'),
        height:                getChip('height'),
        embarazo:              getChip('embarazo'),
        embarazo_semanas:      v('pregnancy-weeks'),
        lactancia:             getChip('lactancia'),
        organ_donor:           getChip('organ-donor'),
        advance_directive:     getChip('advance-directive'),
        nombre:                v('f-name'),
        apellidos:             '',
        fecha_nacimiento:      v('f-birthdate'),
        doc_type:              getActiveDocType(),
        doc_number:            getDocNumber(),
        passport_country:      v('passport-country'),
        email:                 getEmailValue(),
        sexo_biologico:        getChip('sexo-biologico'),
        identidad_genero:      getChip('identidad-genero'),
        terapia_hormonal:      getChips('terapia-hormonal'),
        tiempo_terapia_hormonal: getChip('tiempo-terapia-hormonal'),
        lang:                  v('f-lang'),
        sangre:                v('f-blood'),
        allergy_med:           getChips('allergy-med'),
        allergy_food:          getChips('allergy-food'),
        allergy_env:           getChips('allergy-env'),
        allergy_anesthesia:    getChips('allergy-anesthesia'),
        epipen:                getChip('epipen'),
        latex_guantes:         getChip('latex-guantes'),
        anafilaxia_previa:     getChip('anafilaxia-previa'),
        diseases:              getChips('diseases'),
        conditions:            getChips('conditions'),
        anticoagulado:         getChip('anticoagulado'),
        meds: (() => {
          const fromChips = getChips('meds');
          const extras = Array.from(document.querySelectorAll('#meds-extra-wrap .extra-med-input')).map(i => i.value.trim()).filter(Boolean);
          return [...fromChips, ...extras];
        })(),
        med_doses:             v('f-med-doses'),
        med_last_adjust:       getChip('med-last-adjust'),
        ultima_toma_medicacion: getChip('ultima-toma-medicacion'),
        medicacion_alto_riesgo: getChips('medicacion-alto-riesgo'),
        surgeries:             getChips('surgeries'),
        surgery_year:          v('f-surgery-year'),
        last_surgery_date:     v('last-surgery-date'),
        material_osteosintesis: getChip('material-osteosintesis'),
        dificultad_intubacion:  getChip('dificultad-intubacion'),
        complicaciones_anestesia: getChip('complicaciones-anestesia'),
        hipertermia_maligna_familiar: getChip('hipertermia-familiar'),
        implant_detail:        v('f-implant-detail'),
        pacemaker:             getChip('pacemaker'),
        vaccines:              getChips('vaccines'),
        tetanus_year:          v('f-tetanus-year'),
        vaccine_complete:      getChip('vaccine-complete'),
        tabaco:                getChip('tabaco'),
        alcohol:               getChip('alcohol'),
        drogas:                getChips('drogas'),
        actividad_fisica:      getChip('actividad-fisica'),
        enfermedades_familiares: getChips('enfermedades-familiares'),
        muerte_subita_familiar: getChip('muerte-subita-familiar'),
        religion:              getChip('religion'),
        religion_restrictions: getChips('religion-restrictions'),
        ec1_name:              v('f-ec1-name'),
        ec1_rel:               v('f-ec1-rel'),
        ec1_phone_prefix:      v('f-ec1-phone-prefix'),
        ec1_phone_num:         v('f-ec1-phone-num'),
        ec2_name:              v('f-ec2-name'),
        ec2_rel:               v('f-ec2-rel'),
        ec2_phone_prefix:      v('f-ec2-phone-prefix'),
        ec2_phone_num:         v('f-ec2-phone-num'),
        guardian_name:         v('f-guardian-name'),
        guardian_phone_prefix: v('f-guardian-phone-prefix'),
        guardian_phone_num:    v('f-guardian-phone-num'),
        guardian_doc:          v('f-guardian-doc'),
        doctor_name:           v('f-doctor-name'),
        doctor_phone_prefix:   v('f-doctor-phone-prefix'),
        doctor_phone_num:      v('f-doctor-phone-num'),
        insurer:               getChips('insurer'),
        policy:                v('f-policy'),
        health_card_country:   v('f-health-card-country'),
        health_card_num:       v('f-health-card-num'),
        ss_country:            v('f-ss-country'),
        country_visit_1:       v('country-visit-1'),
        year_visit_1:          v('year-visit-1'),
        country_visit_2:       v('country-visit-2'),
        year_visit_2:          v('year-visit-2'),
        country_visit_3:       v('country-visit-3'),
        year_visit_3:          v('year-visit-3'),
        semanas_gestacion:     v('f-semanas-gestacion'),
        semanas_lactancia:     v('f-semanas-lactancia'),
        vih:                   getChip('vih'),
        hepatitis:             getChip('hepatitis'),
        tuberculosis:          getChip('tuberculosis'),
        dai:                   getChip('dai'),
        acv_previo:            getChip('acv-previo'),
        acv_year:              v('f-acv-year'),
        stents:                getChip('stents'),
        stents_year:           v('f-stents-year'),
        tratamiento_oncologico: getChip('tratamiento-oncologico'),
        puerto_cateter:        getChip('puerto-cateter'),
        salud_emocional_dx:    getChip('salud-emocional-dx'),
        salud_emocional_diagnostico: getChips('salud-emocional-diagnostico'),
        salud_emocional_cual:  v('f-salud-emocional-cual'),
        meds_psiquiatria: (() => {
          const fromChips = getChips('meds-psiquiatria');
          const extras = Array.from(document.querySelectorAll('#meds-psiq-extra-wrap .extra-med-input')).map(i => i.value.trim()).filter(Boolean);
          return [...fromChips, ...extras];
        })(),
        puede_decidir_salud:   getChip('puede-decidir-salud'),
        tutor_legal:           getChip('tutor-legal'),
        tutor_legal_nombre:    v('f-tutor-legal-nombre'),
        tutor_legal_phone:     v('f-tutor-legal-phone'),
        semanas_gestacion_aplica: getChip('semanas-gestacion-aplica'),
        semanas_lactancia_aplica: getChip('semanas-lactancia-aplica'),
        cesarea_previa:        getChip('cesarea-previa'),
        material_osteo_detalle: v('f-material-osteo-detalle'),
        updated_at:            new Date().toISOString(),
      };
      localStorage.setItem('doctorqr_profile', JSON.stringify(profile));
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2800);
      generateAllQRs();
    }

    // ===== LOAD SAVED =====
    function loadSaved() {
      const saved = JSON.parse(localStorage.getItem('doctorqr_profile') || 'null');

      const refreshVal = () => {
        document.querySelectorAll('.phone-field').forEach(pf => validatePhoneField(pf));
        validateHealthCard();
      };

      if (!saved) { refreshVal(); return; }

      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined && val !== null && val !== '') el.value = val;
      };

      set('f-name',                 saved.nombre || saved.name);
      set('f-birthdate',            saved.fecha_nacimiento || saved.birthdate);
      set('f-lang',                 saved.lang);

      // Restaurar tipo documento y número
      const docType = saved.doc_type || (saved.dni ? 'dni' : '');
      if (docType) {
        selectDocType(docType);
        const docNum = saved.doc_number || saved.dni || '';
        const docInp = document.getElementById('input-' + docType);
        if (docInp && docNum) docInp.value = docNum;
        if (docType === 'pasaporte' && saved.passport_country) {
          set('passport-country', saved.passport_country);
          updatePassportHint();
        }
      }

      // Restaurar email
      if (saved.email) {
        const at = saved.email.indexOf('@');
        if (at > 0) {
          document.getElementById('email-alias').value = saved.email.substring(0, at);
          const dom = saved.email.substring(at + 1);
          const domSel = document.getElementById('email-domain');
          const isKnown = Array.from(domSel.options).some(o => o.value === dom);
          if (isKnown) {
            domSel.value = dom;
          } else {
            domSel.value = 'custom';
            const custEl = document.getElementById('email-custom-domain');
            custEl.value = dom;
            custEl.style.display = 'block';
          }
        }
      }
      restoreChip ('sexo-biologico',        saved.sexo_biologico);
      restoreChip ('identidad-genero',      saved.identidad_genero);
      restoreChips('terapia-hormonal',      saved.terapia_hormonal);
      restoreChip ('tiempo-terapia-hormonal', saved.tiempo_terapia_hormonal);
      set('f-blood',                saved.sangre || saved.blood);
      set('f-med-doses',            saved.med_doses);
      set('f-surgery-year',         saved.surgery_year);
      set('f-implant-detail',       saved.implant_detail);
      set('f-tetanus-year',         saved.tetanus_year);
      set('f-ec1-name',             saved.ec1_name);
      set('f-ec1-rel',              saved.ec1_rel);
      set('f-ec1-phone-prefix',     saved.ec1_phone_prefix);
      set('f-ec1-phone-num',        saved.ec1_phone_num);
      set('f-ec2-name',             saved.ec2_name);
      set('f-ec2-rel',              saved.ec2_rel);
      set('f-ec2-phone-prefix',     saved.ec2_phone_prefix);
      set('f-ec2-phone-num',        saved.ec2_phone_num);
      set('f-guardian-name',        saved.guardian_name);
      set('f-guardian-phone-prefix',saved.guardian_phone_prefix);
      set('f-guardian-phone-num',   saved.guardian_phone_num);
      set('f-guardian-doc',         saved.guardian_doc);
      set('f-doctor-name',          saved.doctor_name);
      set('f-doctor-phone-prefix',  saved.doctor_phone_prefix);
      set('f-doctor-phone-num',     saved.doctor_phone_num);
      set('f-policy',               saved.policy);
      set('f-health-card-country',  saved.health_card_country);
      set('f-health-card-num',      saved.health_card_num);
      set('f-ss-country',           saved.ss_country);
      set('country-visit-1',        saved.country_visit_1);
      set('year-visit-1',           saved.year_visit_1);
      set('country-visit-2',        saved.country_visit_2);
      set('year-visit-2',           saved.year_visit_2);
      set('country-visit-3',        saved.country_visit_3);
      set('year-visit-3',           saved.year_visit_3);

      const restoreChips = (group, values) => {
        if (!Array.isArray(values)) return;
        document.querySelectorAll(`[data-group="${group}"] .chip`).forEach(chip => {
          if (values.includes(chip.dataset.value)) chip.classList.add('active');
        });
      };
      const restoreChip = (group, value) => {
        if (!value) return;
        document.querySelectorAll(`[data-group="${group}"] .chip`).forEach(chip => {
          if (chip.dataset.value === value) chip.classList.add('active');
        });
      };

      restoreChips('lang-spoken',           saved.lang_spoken);
      restoreChips('lang-written',          saved.lang_written);
      restoreChips('comm-difficulty',       saved.comm_difficulty);
      restoreChips('sign-lang',             saved.sign_lang);
      restoreChip ('can-decide',            saved.can_decide);
      restoreChip ('profesion',             saved.profesion);
      restoreChips('ayudas-tecnicas',       saved.ayudas_tecnicas);
      restoreChip ('weight',                saved.weight);
      restoreChip ('height',                saved.height);
      restoreChip ('organ-donor',           saved.organ_donor);
      restoreChip ('advance-directive',     saved.advance_directive);
      restoreChip ('embarazo',              saved.embarazo);
      set('pregnancy-weeks',               saved.embarazo_semanas);
      restoreChip ('lactancia',             saved.lactancia);
      restoreChips('allergy-med',           saved.allergy_med);
      restoreChips('allergy-food',          saved.allergy_food);
      restoreChips('allergy-env',           saved.allergy_env);
      restoreChips('allergy-anesthesia',    saved.allergy_anesthesia);
      restoreChip ('epipen',                saved.epipen);
      restoreChip ('latex-guantes',         saved.latex_guantes);
      restoreChip ('anafilaxia-previa',     saved.anafilaxia_previa);
      restoreChips('diseases',              saved.diseases);
      restoreChips('conditions',            saved.conditions);
      restoreChip ('anticoagulado',         saved.anticoagulado);
      restoreChips('meds',                  saved.meds);
      restoreChip ('med-last-adjust',       saved.med_last_adjust);
      restoreChip ('ultima-toma-medicacion',saved.ultima_toma_medicacion);
      restoreChips('medicacion-alto-riesgo',saved.medicacion_alto_riesgo);
      set('last-surgery-date',              saved.last_surgery_date);
      restoreChips('surgeries',             saved.surgeries);
      restoreChip ('material-osteosintesis',saved.material_osteosintesis);
      restoreChip ('dificultad-intubacion', saved.dificultad_intubacion);
      restoreChip ('complicaciones-anestesia', saved.complicaciones_anestesia);
      restoreChip ('hipertermia-familiar',  saved.hipertermia_maligna_familiar);
      restoreChip ('pacemaker',             saved.pacemaker);
      restoreChips('vaccines',              saved.vaccines);
      restoreChip ('vaccine-complete',      saved.vaccine_complete);
      restoreChip ('tabaco',                saved.tabaco);
      restoreChip ('alcohol',               saved.alcohol);
      restoreChips('drogas',                saved.drogas);
      restoreChip ('actividad-fisica',      saved.actividad_fisica);
      restoreChips('enfermedades-familiares', saved.enfermedades_familiares);
      restoreChip ('muerte-subita-familiar', saved.muerte_subita_familiar);
      restoreChip ('religion',              saved.religion);
      restoreChips('religion-restrictions', saved.religion_restrictions);
      restoreChips('insurer',               saved.insurer);

      set('f-semanas-gestacion',            saved.semanas_gestacion);
      set('f-semanas-lactancia',            saved.semanas_lactancia);
      restoreChip ('vih',                   saved.vih);
      restoreChip ('hepatitis',             saved.hepatitis);
      restoreChip ('tuberculosis',          saved.tuberculosis);
      restoreChip ('dai',                   saved.dai);
      restoreChip ('acv-previo',            saved.acv_previo);
      set('f-acv-year',                     saved.acv_year);
      if (saved.acv_previo === 'Sí') document.getElementById('acv-year-wrap').style.display = 'block';
      restoreChip ('stents',                saved.stents);
      set('f-stents-year',                  saved.stents_year);
      if (saved.stents === 'Sí') document.getElementById('stents-year-wrap').style.display = 'block';
      restoreChip ('tratamiento-oncologico',saved.tratamiento_oncologico);
      restoreChip ('puerto-cateter',        saved.puerto_cateter);
      restoreChip ('salud-emocional-dx',    saved.salud_emocional_dx);
      if (saved.salud_emocional_dx === 'Sí') document.getElementById('salud-emocional-cual-wrap').style.display = 'block';
      restoreChips('salud-emocional-diagnostico', saved.salud_emocional_diagnostico);
      if ((saved.salud_emocional_diagnostico || []).includes('Otro')) {
        const oWrap = document.getElementById('salud-emocional-otro-wrap');
        if (oWrap) oWrap.style.display = 'block';
      }
      set('f-salud-emocional-cual',         saved.salud_emocional_cual);
      restoreChips('meds-psiquiatria',       saved.meds_psiquiatria);
      if (Array.isArray(saved.meds_psiquiatria)) {
        const psiqVals = Array.from(document.querySelectorAll('[data-group="meds-psiquiatria"] .chip')).map(c => c.dataset.value);
        saved.meds_psiquiatria.filter(m => !psiqVals.includes(m)).forEach(m => addMedExtraWithValue('psiq', m));
      }
      restoreChip ('puede-decidir-salud',   saved.puede_decidir_salud);
      restoreChip ('tutor-legal',           saved.tutor_legal);
      set('f-tutor-legal-nombre',           saved.tutor_legal_nombre);
      set('f-tutor-legal-phone',            saved.tutor_legal_phone);
      if (saved.tutor_legal === 'Sí') { const tw = document.getElementById('tutor-legal-wrap'); if (tw) tw.style.display = 'block'; }
      restoreChip ('semanas-gestacion-aplica', saved.semanas_gestacion_aplica);
      if (saved.semanas_gestacion_aplica === 'No aplica') { const w = document.getElementById('semanas-gestacion-input-wrap'); if (w) w.style.display = 'none'; }
      restoreChip ('semanas-lactancia-aplica', saved.semanas_lactancia_aplica);
      if (saved.semanas_lactancia_aplica === 'No aplica') { const w = document.getElementById('semanas-lactancia-input-wrap'); if (w) w.style.display = 'none'; }
      if (Array.isArray(saved.meds)) {
        const medsVals = Array.from(document.querySelectorAll('[data-group="meds"] .chip')).map(c => c.dataset.value);
        saved.meds.filter(m => !medsVals.includes(m)).forEach(m => addMedExtraWithValue('meds', m));
      }
      restoreChip ('cesarea-previa',        saved.cesarea_previa);
      set('f-material-osteo-detalle',       saved.material_osteo_detalle);
      if (['Sí — tornillos/placas/clavos','Sí — prótesis metálica'].includes(saved.material_osteosintesis))
        document.getElementById('material-osteo-detalle-wrap').style.display = 'block';

      if (saved.lang_spoken && saved.lang_spoken.length > 0) {
        renderLangLevels(saved.lang_levels || {});
      }

      checkGenderFields(null);
      refreshVal();
    }

    // ===== DOCUMENTO / EMAIL =====
    function getActiveDocType() {
      const chip = document.querySelector('[data-group="doc-type"].active');
      return chip ? chip.dataset.value : '';
    }

    function getDocNumber() {
      const type = getActiveDocType();
      if (!type) return '';
      const inp = document.getElementById('input-' + type);
      return inp ? inp.value : '';
    }

    function selectDocType(type) {
      document.querySelectorAll('[data-group="doc-type"]').forEach(c => c.classList.remove('active'));
      const chip = document.querySelector(`[data-group="doc-type"][data-value="${type}"]`);
      if (chip) chip.classList.add('active');
      ['dni','nie','pasaporte'].forEach(t => {
        document.getElementById('field-' + t).style.display = t === type ? 'block' : 'none';
      });
    }

    function checkGenderHormone(el) {
      const val = el.dataset.value || el.textContent.trim();
      const block = document.getElementById('hormone-block');
      const showHormone = ['Hombre trans', 'Mujer trans', 'No binario'];
      block.style.display = showHormone.includes(val) ? 'block' : 'none';
    }

    function checkPregnancy(el) {
      const val = el.dataset.value || el.textContent.trim();
      const block = document.getElementById('pregnancy-weeks-block');
      block.style.display = val === 'Sí — estoy embarazada' ? 'block' : 'none';
    }

    function checkAcv(el) {
      const val = el.dataset.value || el.textContent.trim();
      document.getElementById('acv-year-wrap').style.display = val === 'Sí' ? 'block' : 'none';
    }

    function checkStents(el) {
      const val = el.dataset.value || el.textContent.trim();
      document.getElementById('stents-year-wrap').style.display = val === 'Sí' ? 'block' : 'none';
    }

    function checkMaterialOsteo(el) {
      const val = el.dataset.value || el.textContent.trim();
      const show = val === 'Sí — tornillos/placas/clavos' || val === 'Sí — prótesis metálica';
      document.getElementById('material-osteo-detalle-wrap').style.display = show ? 'block' : 'none';
    }

    function checkSaludEmocional(el) {
      const val = el.dataset.value || el.textContent.trim();
      document.getElementById('salud-emocional-cual-wrap').style.display = val === 'Sí' ? 'block' : 'none';
    }

    function checkGenderFields(el) {
      let isMale;
      if (el) {
        const wasActive = el.classList.contains('active');
        isMale = !wasActive && el.dataset.value === 'Masculino';
      } else {
        const active = document.querySelector('[data-group="sexo-biologico"] .chip.active');
        isMale = !!(active && active.dataset.value === 'Masculino');
      }
      ['pregnancy-block','pregnancy-weeks-block','field-lactancia',
       'field-semanas-gestacion','field-semanas-lactancia','field-cesarea-previa'
      ].forEach(id => {
        const f = document.getElementById(id);
        if (f) f.style.display = isMale ? 'none' : '';
      });
    }

    function checkSaludEmocionalOtro(chipEl) {
      const willActivate = !chipEl.classList.contains('active');
      const wrap = document.getElementById('salud-emocional-otro-wrap');
      if (wrap) {
        wrap.style.display = willActivate ? 'block' : 'none';
        if (!willActivate) { const inp = document.getElementById('f-salud-emocional-cual'); if (inp) inp.value = ''; }
      }
    }

    function checkTutorLegal(chipEl) {
      const willActivate = !chipEl.classList.contains('active');
      const wrap = document.getElementById('tutor-legal-wrap');
      if (wrap) wrap.style.display = (willActivate && chipEl.dataset.value === 'Sí') ? 'block' : 'none';
    }

    function addMedExtra(type) {
      const ispsiq = type === 'psiq';
      const wrap = document.getElementById(ispsiq ? 'meds-psiq-extra-wrap' : 'meds-extra-wrap');
      const btn  = document.getElementById(ispsiq ? 'btn-add-psiq-med' : 'btn-add-med');
      if (!wrap) return;
      const count = wrap.querySelectorAll('.extra-med-input').length;
      if (count >= 5) { if (btn) btn.style.display = 'none'; return; }
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'extra-med-input';
      inp.placeholder = 'Nombre del medicamento...';
      inp.style.cssText = 'display:block;margin-top:6px;width:100%';
      wrap.appendChild(inp);
      if (count + 1 >= 5 && btn) btn.style.display = 'none';
    }

    function addMedExtraWithValue(type, value) {
      addMedExtra(type);
      const wrap = document.getElementById(type === 'psiq' ? 'meds-psiq-extra-wrap' : 'meds-extra-wrap');
      if (!wrap) return;
      const inputs = wrap.querySelectorAll('.extra-med-input');
      if (inputs.length) inputs[inputs.length - 1].value = value;
    }

    // ===== INIT =====
    initCountrySelects();
    setupValidation();
    loadSaved();
