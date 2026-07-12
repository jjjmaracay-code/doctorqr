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

    // ===== SEVERIDAD DE ALERGIAS (medicamentos + insectos) =====
    const ALLERGY_SEVERITY = ['Leve', 'Moderada', 'Grave', 'Anafiláctica'];

    function renderAllergySeverity(savedSeverity) {
      const activeChips = [
        ...document.querySelectorAll('[data-group="allergy-med"] .chip.active'),
        ...document.querySelectorAll('[data-group="allergy-insect"] .chip.active'),
        ...document.querySelectorAll('[data-group="allergy-food"] .chip.active'),
        ...document.querySelectorAll('[data-group="allergy-env"] .chip.active'),
        ...document.querySelectorAll('[data-group="allergy-anesthesia"] .chip.active')
      ];
      const container = document.getElementById('allergy-severity-container');
      const current = {};
      container.querySelectorAll('.allergy-severity-row').forEach(row => {
        current[row.dataset.allergen] = row.querySelector('select').value;
      });
      container.innerHTML = '';
      if (activeChips.length === 0) return;
      activeChips.forEach(chip => {
        const allergen = chip.dataset.value;
        const row = document.createElement('div');
        row.className = 'allergy-severity-row';
        row.dataset.allergen = allergen;
        const label = document.createElement('span');
        label.className = 'allergy-severity-label';
        label.textContent = allergen;
        const sel = document.createElement('select');
        ALLERGY_SEVERITY.forEach(sev => {
          const opt = document.createElement('option');
          opt.value = sev; opt.textContent = sev;
          sel.appendChild(opt);
        });
        if (current[allergen]) sel.value = current[allergen];
        else if (savedSeverity && savedSeverity[allergen]) sel.value = savedSeverity[allergen];
        row.appendChild(label);
        row.appendChild(sel);
        container.appendChild(row);
      });
    }

    function getAllergySeverity() {
      const severity = {};
      document.querySelectorAll('#allergy-severity-container .allergy-severity-row').forEach(row => {
        severity[row.dataset.allergen] = row.querySelector('select').value;
      });
      return severity;
    }

    // ===== DESENCADENANTE DE ANAFILAXIA =====
    function updateAnaphylaxisTrigger(savedTrigger, savedTriggerOtro) {
      const wrap = document.getElementById('anaphylaxis-trigger-wrap');
      const sel  = document.getElementById('f-anaphylaxis-trigger');
      if (!wrap || !sel) return;
      const anaphChip = document.querySelector('[data-group="anafilaxia-previa"] .chip.active');
      const show = !!anaphChip && anaphChip.dataset.value === 'SÍ — anafilaxia confirmada';
      if (!show) { wrap.style.display = 'none'; return; }
      const current = sel.value;
      const activeChips = [
        ...document.querySelectorAll('[data-group="allergy-med"] .chip.active'),
        ...document.querySelectorAll('[data-group="allergy-food"] .chip.active'),
        ...document.querySelectorAll('[data-group="allergy-insect"] .chip.active')
      ];
      sel.innerHTML = '';
      activeChips.forEach(chip => {
        const opt = document.createElement('option');
        opt.value = chip.dataset.value; opt.textContent = chip.dataset.value;
        sel.appendChild(opt);
      });
      const otraOpt = document.createElement('option');
      otraOpt.value = 'Otro / no especificado'; otraOpt.textContent = 'Otro / no especificado';
      sel.appendChild(otraOpt);
      if (current) sel.value = current;
      else if (savedTrigger) sel.value = savedTrigger;
      wrap.style.display = 'block';

      const otraWrap = document.getElementById('anaphylaxis-trigger-otro-wrap');
      if (otraWrap) {
        const showOtra = sel.value === 'Otro / no especificado';
        otraWrap.style.display = showOtra ? 'block' : 'none';
        if (showOtra && savedTriggerOtro) {
          const inp = document.getElementById('f-anaphylaxis-trigger-otro');
          if (inp) inp.value = savedTriggerOtro;
        }
      }
    }

    // ===== DESENCADENANTE — TEXTO LIBRE "OTRO" =====
    document.getElementById('f-anaphylaxis-trigger').addEventListener('change', function() {
      const otraWrap = document.getElementById('anaphylaxis-trigger-otro-wrap');
      if (!otraWrap) return;
      if (this.value === 'Otro / no especificado') {
        otraWrap.style.display = 'block';
      } else {
        otraWrap.style.display = 'none';
        const inp = document.getElementById('f-anaphylaxis-trigger-otro');
        if (inp) inp.value = '';
      }
    });

    // ===== VISIBILIDAD CONDICIONAL: GLUCAGÓN =====
    function updateGlucagonVisibility() {
      const diseasesActive = getChips('diseases');
      const conditionsActive = getChips('conditions');
      const show = diseasesActive.includes('Diabetes T1') ||
                   diseasesActive.includes('Diabetes T2') ||
                   conditionsActive.includes('Bomba insulina');
      const wrap = document.getElementById('glucagon-wrap');
      if (wrap) wrap.style.display = show ? 'block' : 'none';
    }

    // ===== VISIBILIDAD CONDICIONAL: DIÁLISIS =====
    function updateDialisisVisibility() {
      const conditionsActive = getChips('conditions');
      const show = conditionsActive.includes('Fístula arteriovenosa');
      const wrap = document.getElementById('dialisis-wrap');
      if (wrap) wrap.style.display = show ? 'block' : 'none';
      updateLateralidadVisibility();
    }

    function updateLateralidadVisibility() {
      const dialisisActiva = getChip('dialisis-activa');
      const show = dialisisActiva === 'Sí';
      const wrap = document.getElementById('lateralidad-wrap');
      if (wrap) wrap.style.display = show ? 'block' : 'none';
    }

    // ===== VISIBILIDAD CONDICIONAL: VOLUNTADES ANTICIPADAS =====
    function updateAdvanceDirectiveVisibility() {
      const show = getChip('advance-directive') === 'Sí — documento existe';
      const wrap = document.getElementById('advance-directive-wrap');
      if (wrap) wrap.style.display = show ? 'block' : 'none';
    }

    // ===== GUARDADO DE EMERGENCIA: bandera de cambios sin guardar =====
    let hasUnsavedChanges = false;
    document.addEventListener('input',  () => { hasUnsavedChanges = true; });
    document.addEventListener('change', () => { hasUnsavedChanges = true; });

    // ===== CHIPS =====
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        hasUnsavedChanges = true;
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
        if (group && (group.dataset.group === 'diseases' || group.dataset.group === 'conditions')) updateGlucagonVisibility();
        if (group && group.dataset.group === 'conditions') updateDialisisVisibility();
        if (group && group.dataset.group === 'dialisis-activa') updateLateralidadVisibility();
        if (group && group.dataset.group === 'advance-directive') updateAdvanceDirectiveVisibility();
        if (group && group.dataset.group === 'advance-directive-instrucciones') {
          const otroActive = document.querySelector('[data-group="advance-directive-instrucciones"] .chip[data-value="Otro"].active');
          const otroWrap = document.getElementById('advance-directive-otro-wrap');
          if (otroWrap) otroWrap.style.display = otroActive ? 'block' : 'none';
          if (!otroActive) { const el = document.getElementById('f-advance-directive-otro'); if (el) el.value = ''; }
        }
        if (group && (group.dataset.group === 'allergy-med' || group.dataset.group === 'allergy-insect' ||
                      group.dataset.group === 'allergy-food' || group.dataset.group === 'allergy-env' ||
                      group.dataset.group === 'allergy-anesthesia')) renderAllergySeverity();
        if (group && (group.dataset.group === 'allergy-med' || group.dataset.group === 'allergy-food' ||
                      group.dataset.group === 'allergy-insect' || group.dataset.group === 'anafilaxia-previa')) updateAnaphylaxisTrigger();
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
        if (group && group.dataset.group === 'terapia-hormonal-activa') {
          const siChip = document.querySelector('[data-group="terapia-hormonal-activa"] .chip[data-value="Sí"]');
          const detalle = document.getElementById('terapia-hormonal-detalle');
          const show = siChip && siChip.classList.contains('active');
          if (detalle) detalle.style.display = show ? 'block' : 'none';
          if (!show) {
            document.querySelectorAll('[data-group="terapia-hormonal-tipos"] .chip').forEach(c => c.classList.remove('active'));
            ['f-terapia-hormonal-otra', 'f-terapia-hormonal-dosis', 'f-terapia-hormonal-duracion-valor'].forEach(id => {
              const el = document.getElementById(id); if (el) el.value = '';
            });
            const otraWrap = document.getElementById('terapia-hormonal-otra-wrap');
            if (otraWrap) otraWrap.style.display = 'none';
            const durUnit = document.getElementById('f-terapia-hormonal-duracion-unidad');
            if (durUnit) durUnit.value = '';
          }
        }
        if (group && group.dataset.group === 'terapia-hormonal-tipos') {
          const otraActive = document.querySelector('[data-group="terapia-hormonal-tipos"] .chip[data-value="Otra"].active');
          const otraWrap = document.getElementById('terapia-hormonal-otra-wrap');
          if (otraWrap) otraWrap.style.display = otraActive ? 'block' : 'none';
          if (!otraActive) { const el = document.getElementById('f-terapia-hormonal-otra'); if (el) el.value = ''; }
        }
        clearChipsSearch(chip);
      });
    });

    // ===== EXCLUSIÓN MUTUA: GRUPOS CON OPCIÓN "NINGUNA/NINGUNO" =====
    function setupExclusiveGroup(container) {
      if (!container) return;
      const groupName  = container.dataset.group;
      const noneChips  = container.querySelectorAll('.chip[data-exclusive-none]');
      const otherChips = container.querySelectorAll('.chip:not([data-exclusive-none])');
      // campo(s) de texto libre asociados a este grupo (fuera del propio
      // contenedor .chips — ningún grupo tiene inputs anidados dentro),
      // enlazados por nombre de grupo igual que data-sino-target
      const targets    = document.querySelectorAll(`[data-exclusive-target~="${groupName}"]`);

      function afterExclusion() {
        if (groupName === 'allergy-med' || groupName === 'allergy-insect' ||
            groupName === 'allergy-food' || groupName === 'allergy-env' ||
            groupName === 'allergy-anesthesia') {
          renderAllergySeverity();
          updateAnaphylaxisTrigger();
        }
        if (groupName === 'diseases' || groupName === 'conditions') updateGlucagonVisibility();
        if (groupName === 'conditions') updateDialisisVisibility();
      }

      function syncTargets() {
        const ningunaActiva = Array.from(noneChips).some(c => c.classList.contains('active'));
        targets.forEach(t => {
          if (t.classList.contains('chips')) {
            if (ningunaActiva) {
              t.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
              t.classList.add('chips-disabled');
            } else {
              t.classList.remove('chips-disabled');
            }
          } else {
            if (ningunaActiva) { t.value = ''; t.disabled = true; }
            else { t.disabled = false; }
          }
        });
      }

      noneChips.forEach(noneChip => {
        noneChip.addEventListener('click', () => {
          if (noneChip.classList.contains('active')) {
            otherChips.forEach(c => c.classList.remove('active'));
            afterExclusion();
          }
          syncTargets();
        });
      });

      otherChips.forEach(chip => {
        chip.addEventListener('click', () => {
          if (chip.closest('.chips-disabled')) return;
          if (chip.classList.contains('active')) {
            noneChips.forEach(noneChip => noneChip.classList.remove('active'));
            afterExclusion();
          }
          syncTargets();
        });
      });
    }
    document.querySelectorAll('[data-exclusive-group]').forEach(setupExclusiveGroup);

    // ===== TOGGLES SÍ/NO QUE LIMPIAN SUB-CAMPOS FANTASMA =====
    function setupSiNoToggle(toggleContainer) {
      const groupName = toggleContainer.dataset.sinoGroup;
      // data-sino-target admite varios nombres separados por espacio (ej. un select
      // limpiado tanto por su propio toggle como por uno que lo oculta en cascada)
      const targets = document.querySelectorAll(`[data-sino-target~="${groupName}"]`);

      function clearTargets() {
        targets.forEach(target => {
          if (target.classList.contains('chips')) {
            target.querySelectorAll('.chip.active').forEach(c => c.classList.remove('active'));
          } else if (target.classList.contains('chip')) {
            target.classList.remove('active');
          } else {
            target.value = '';
          }
        });
      }

      // disabled solo aplica a campos reales (input/select/textarea) — los
      // chips/grupos de chips no tienen un equivalente nativo, se dejan como
      // ya estaban (solo se limpian, vía clearTargets)
      function setDisabled(disabled) {
        targets.forEach(target => {
          if (target.classList.contains('chips') || target.classList.contains('chip')) return;
          target.disabled = disabled;
        });
      }

      toggleContainer.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const siActivo = toggleContainer.querySelector('.chip.active[data-sino="si"]');
          if (!siActivo) {
            clearTargets();
            setDisabled(true);
          } else {
            setDisabled(false);
          }
        });
      });
    }
    document.querySelectorAll('[data-sino-group]').forEach(setupSiNoToggle);

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
    // ===== VALIDACIÓN NO BLOQUEANTE =====
    const SECCIONES_VALIDACION = [
      { id: 'sec-1',           nombre: '01 — Idiomas y comunicación' },
      { id: 'sec-2',           nombre: '02 — Datos físicos' },
      { id: 'sec-3',           nombre: '03 — Identificación' },
      { id: 'sec-4',           nombre: '04 — Datos críticos' },
      { id: 'sec-5',           nombre: '05 — Enfermedades y condiciones' },
      { id: 'sec-6',           nombre: '06 — Medicación actual' },
      { id: 'sec-suplementos', nombre: 'Suplementos y sustancias' },
      { id: 'sec-7',           nombre: '07 — Cirugías y hospitalizaciones' },
      { id: 'sec-8',           nombre: '08 — Vacunas' },
      { id: 'sec-habitos',     nombre: 'Hábitos y estilo de vida' },
      { id: 'sec-familiar',    nombre: 'Historial familiar' },
      { id: 'sec-9',           nombre: '09 — Religión y restricciones' },
      { id: 'sec-10',          nombre: '10 — Contactos de emergencia' },
      { id: 'sec-11',          nombre: '11 — Médico y seguro' },
    ];

    function seccionTieneValor(secEl) {
      // chip activo visible
      const chips = secEl.querySelectorAll('.chip.active');
      for (const c of chips) {
        if (c.offsetParent !== null) return true;
      }
      // input / select / textarea visible con valor
      const fields = secEl.querySelectorAll('input, select, textarea');
      for (const f of fields) {
        if (f.offsetParent !== null && f.value.trim() !== '') return true;
      }
      return false;
    }

    function checkSeccionesVacias() {
      return SECCIONES_VALIDACION
        .filter(({ id }) => {
          const el = document.getElementById(id);
          return el && !seccionTieneValor(el);
        })
        .map(({ nombre }) => nombre);
    }

    function mostrarModalValidacion(seccionesVacias) {
      return new Promise(resolve => {
        const modal   = document.getElementById('modal-validacion');
        const texto   = document.getElementById('modal-validacion-texto');
        const btnSi   = document.getElementById('btn-continuar-igual');
        const btnNo   = document.getElementById('btn-volver-revisar');

        texto.innerHTML = 'Faltan estas secciones: <strong>'
          + seccionesVacias.join(', ')
          + '</strong>. ¿Continuar igual?';

        modal.classList.add('open');

        function cerrar(resultado) {
          modal.classList.remove('open');
          btnSi.removeEventListener('click', onSi);
          btnNo.removeEventListener('click', onNo);
          resolve(resultado);
        }
        function onSi() { cerrar(true);  }
        function onNo() { cerrar(false); }

        btnSi.addEventListener('click', onSi);
        btnNo.addEventListener('click', onNo);
      });
    }

    function buildProfileFromForm() {
      const v = id => document.getElementById(id).value;
      return {
        lang_spoken:           getChips('lang-spoken'),
        lang_levels:           getLangLevels(),
        lang_written:          getChips('lang-written'),
        comm_difficulty:       getChips('comm-difficulty'),
        sign_lang:             getChips('sign-lang'),
        can_decide:            getChip('can-decide'),
        profesion: (() => {
          const chips = getChips('profesion');
          const idx = chips.indexOf('Otra');
          if (idx !== -1) {
            const otraText = document.getElementById('profesion-otra-text')?.value.trim();
            chips[idx] = otraText || 'Otra';
          }
          return chips;
        })(),
        ayudas_tecnicas:       getChips('ayudas-tecnicas'),
        weight:                getChip('weight'),
        height:                getChip('height'),
        embarazo:              getChip('embarazo'),
        embarazo_semanas:      v('pregnancy-weeks'),
        lactancia:             getChip('lactancia'),
        organ_donor:           getChip('organ-donor'),
        advance_directive:     getChip('advance-directive'),
        advance_directive_instrucciones: getChips('advance-directive-instrucciones'),
        advance_directive_otro: v('f-advance-directive-otro'),
        advance_directive_ubicacion: v('f-advance-directive-ubicacion'),
        nombre:                v('f-name'),
        apellidos:             '',
        fecha_nacimiento:      v('f-birthdate'),
        doc_type:              getActiveDocType(),
        doc_number:            getDocNumber(),
        passport_country:      v('passport-country'),
        email:                 getEmailValue(),
        sexo_biologico:        getChip('sexo-biologico'),
        identidad_genero:      getChip('identidad-genero'),
        terapia_hormonal_activa:          getChip('terapia-hormonal-activa') || 'No',
        terapia_hormonal_tipos:           getChips('terapia-hormonal-tipos'),
        terapia_hormonal_otra:            v('f-terapia-hormonal-otra'),
        terapia_hormonal_dosis_frecuencia: v('f-terapia-hormonal-dosis'),
        terapia_hormonal_duracion_valor:  v('f-terapia-hormonal-duracion-valor'),
        terapia_hormonal_duracion_unidad: v('f-terapia-hormonal-duracion-unidad'),
        lang:                  v('f-lang'),
        sangre:                v('f-blood'),
        allergy_med:           getChips('allergy-med'),
        allergy_food:          getChips('allergy-food'),
        allergy_env:           getChips('allergy-env'),
        allergy_insect:        getChips('allergy-insect'),
        allergy_severity:      getAllergySeverity(),
        allergy_anesthesia:    getChips('allergy-anesthesia'),
        epipen:                getChip('epipen'),
        glucagon:              getChip('glucagon'),
        latex_guantes:         getChip('latex-guantes'),
        anafilaxia_previa:     getChip('anafilaxia-previa'),
        anaphylaxis_trigger:   v('f-anaphylaxis-trigger'),
        anaphylaxis_trigger_otro: v('f-anaphylaxis-trigger-otro'),
        diseases:              getChips('diseases'),
        conditions:            getChips('conditions'),
        dialisis_activa:       getChip('dialisis-activa'),
        lateralidad_fistula:   getChip('lateralidad-fistula'),
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
        semanas_gestacion_aplica: getChip('semanas-gestacion-aplica'),
        semanas_lactancia_aplica: getChip('semanas-lactancia-aplica'),
        cesarea_previa:        getChip('cesarea-previa'),
        material_osteo_detalle: v('f-material-osteo-detalle'),
        suplementos: (() => {
          const fromChips = getChips('suplementos');
          const extras = Array.from(document.querySelectorAll('#suplementos-extra-wrap .extra-med-input')).map(i => i.value.trim()).filter(Boolean);
          return [...fromChips, ...extras];
        })(),
        updated_at:            (JSON.parse(localStorage.getItem('doctorqr_profile') || '{}').updated_at) || null,
      };
    }

    async function generate() {
      const vacias = checkSeccionesVacias();
      if (vacias.length > 0) {
        const continuar = await mostrarModalValidacion(vacias);
        if (!continuar) return;
      }

      const profile = buildProfileFromForm();
      localStorage.setItem('doctorqr_profile', JSON.stringify(profile));
      hasUnsavedChanges = false;
      mostrarIndicadorGuardado();

      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2800);

      const _tok = localStorage.getItem('doctorqr_token');
      if (_tok && !_tok.startsWith('biometric_')) {
        const _qrId = localStorage.getItem('doctorqr_id');
        fetch('https://doctorqr-backend-production.up.railway.app/api/profile/save', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _tok },
          body: JSON.stringify({ profile, doctorqr_id: _qrId })
        })
        .then(async r => {
          if (r.status === 402) {
            const tb = document.getElementById('trial-expired-banner');
            if (tb) tb.style.display = 'flex';
            setTimeout(() => { window.location.href = 'paywall.html'; }, 3000);
            return; // trial expirado — no guardar ni generar QR
          }
          if (r.status === 409) {
            const tc = document.getElementById('toast-conflict');
            if (tc) { tc.classList.add('show'); setTimeout(() => tc.classList.remove('show'), 8000); }
            return; // datos del servidor más recientes — no generar QR desincronizado
          }
          if (r.ok) {
            const json = await r.json();
            if (json?.success) {
              if (json.updated_at) {
                const stored = JSON.parse(localStorage.getItem('doctorqr_profile') || '{}');
                stored.updated_at = json.updated_at;
                localStorage.setItem('doctorqr_profile', JSON.stringify(stored));
              }
              const ts = document.getElementById('toast-sync');
              if (ts) { ts.classList.add('show'); setTimeout(() => ts.classList.remove('show'), 2500); }
            }
          }
          generateAllQRs();
          mostrarRecordatorioQR();
        })
        .catch(() => {
          generateAllQRs(); // error de red: el save local ocurrió, generar igualmente
          mostrarRecordatorioQR();
        });
      } else {
        generateAllQRs(); // sin autenticación: flujo local directo
        mostrarRecordatorioQR();
      }
    }

    // ===== RECORDATORIO: REGENERAR QR TRAS CADA CAMBIO =====
    // Se dispara siempre que se llama a generateAllQRs() (primera vez o
    // regeneración) — no toca qr-generator.js, solo re-anima el aviso ya
    // presente junto al carrusel para que el usuario lo note de nuevo.
    function mostrarRecordatorioQR() {
      const banner = document.getElementById('qr-reminder-banner');
      if (!banner) return;
      banner.classList.remove('pulse');
      void banner.offsetWidth; // fuerza reflow para poder reiniciar la animación en clics consecutivos
      banner.classList.add('pulse');
      banner.addEventListener('animationend', () => banner.classList.remove('pulse'), { once: true });
    }

    // ===== INDICADOR DISCRETO "GUARDADO ✓" =====
    function mostrarIndicadorGuardado() {
      const ind = document.getElementById('save-indicator');
      if (!ind) return;
      ind.classList.add('show');
      setTimeout(() => ind.classList.remove('show'), 2500);
    }

    // ===== GUARDADO DE EMERGENCIA AL CERRAR LA PESTAÑA =====
    // sendBeacon no sirve aquí: la cookie doctorqr_token es sameSite=lax y
    // frontend/backend son sitios distintos (atabeyapp.app vs *.up.railway.app),
    // así que el navegador no la adjunta en peticiones POST cross-site — y
    // sendBeacon no permite fijar el header Authorization como alternativa.
    // fetch con keepalive:true sí sobrevive al cierre de la pestaña y sí
    // permite mandar el header Authorization (el mecanismo que realmente
    // autentica hoy, igual que en generate()).
    window.addEventListener('beforeunload', () => {
      if (!hasUnsavedChanges) return;
      const _tok = localStorage.getItem('doctorqr_token');
      if (!_tok || _tok.startsWith('biometric_')) return;

      const profile = buildProfileFromForm();
      localStorage.setItem('doctorqr_profile', JSON.stringify(profile));
      localStorage.setItem('doctorqr_pending_sync_notice', '1');

      fetch('https://doctorqr-backend-production.up.railway.app/api/profile/save', {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _tok },
        body: JSON.stringify({ profile, doctorqr_id: localStorage.getItem('doctorqr_id') })
      }).catch(() => {});
    });

    // ===== LOAD SAVED =====
    async function loadSaved() {
      if (localStorage.getItem('doctorqr_pending_sync_notice') === '1') {
        localStorage.removeItem('doctorqr_pending_sync_notice');
        mostrarIndicadorGuardado();
      }

      let saved = null;

      const _tok = localStorage.getItem('doctorqr_token');
      if (_tok) {
        try {
          const _res = await fetch('https://doctorqr-backend-production.up.railway.app/api/profile/me', {
            credentials: 'include',
            headers: { Authorization: 'Bearer ' + _tok }
          });
          if (_res.ok) {
            const _data = await _res.json();
            saved = _data.profile;
            if (_data.updated_at) saved.updated_at = _data.updated_at;
            localStorage.setItem('doctorqr_profile', JSON.stringify(saved));
            if (_data.plan_type) {
              const _u = JSON.parse(localStorage.getItem('doctorqr_user') || '{}');
              _u.plan_type  = _data.plan_type;
              _u.created_at = _data.created_at;
              localStorage.setItem('doctorqr_user', JSON.stringify(_u));
            }
          }
        } catch (_) {
          // sin red o error del servidor — cae a localStorage
        }
      }

      if (!saved) {
        saved = JSON.parse(localStorage.getItem('doctorqr_profile') || 'null');
      }

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

      restoreChip ('sexo-biologico',        saved.sexo_biologico);
      restoreChip ('identidad-genero',      saved.identidad_genero);
      restoreChip ('terapia-hormonal-activa',       saved.terapia_hormonal_activa);
      restoreChips('terapia-hormonal-tipos',        saved.terapia_hormonal_tipos);
      set('f-terapia-hormonal-otra',                saved.terapia_hormonal_otra);
      set('f-terapia-hormonal-dosis',               saved.terapia_hormonal_dosis_frecuencia);
      set('f-terapia-hormonal-duracion-valor',      saved.terapia_hormonal_duracion_valor);
      set('f-terapia-hormonal-duracion-unidad',     saved.terapia_hormonal_duracion_unidad);
      if (saved.terapia_hormonal_activa === 'Sí') {
        const _det = document.getElementById('terapia-hormonal-detalle');
        if (_det) _det.style.display = 'block';
        if (Array.isArray(saved.terapia_hormonal_tipos) && saved.terapia_hormonal_tipos.includes('Otra')) {
          const _ow = document.getElementById('terapia-hormonal-otra-wrap');
          if (_ow) _ow.style.display = 'block';
        }
      }
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

      restoreChips('lang-spoken',           saved.lang_spoken);
      restoreChips('lang-written',          saved.lang_written);
      restoreChips('comm-difficulty',       saved.comm_difficulty);
      restoreChips('sign-lang',             saved.sign_lang);
      restoreChip ('can-decide',            saved.can_decide);
      {
        const PROFESIONES_CONOCIDAS = ['Sanitario','Agricultor/Ganadero','Minero/Construcción',
          'Químico/Laboratorio','Militar/Policía','Educación','Oficina/Administración',
          'Transporte','Hostelería','Jubilado','Estudiante'];
        let lista = saved.profesion;
        if (typeof lista === 'string') lista = lista ? [lista] : [];
        if (!Array.isArray(lista)) lista = [];
        let otraTexto = null;
        lista.forEach(val => {
          if (!val) return;
          const esConocida = PROFESIONES_CONOCIDAS.includes(val);
          const valorChip = esConocida ? val : 'Otra';
          if (!esConocida) otraTexto = val;
          const chip = document.querySelector(`[data-group="profesion"] .chip[data-value="${valorChip}"]`);
          if (chip) chip.classList.add('active');
        });
        if (otraTexto) {
          const otraWrap = document.getElementById('profesion-otra-wrap');
          if (otraWrap) otraWrap.style.display = 'block';
          set('profesion-otra-text', otraTexto);
        }
      }
      restoreChips('ayudas-tecnicas',       saved.ayudas_tecnicas);
      restoreChip ('weight',                saved.weight);
      restoreChip ('height',                saved.height);
      restoreChip ('organ-donor',           saved.organ_donor);
      restoreChip ('advance-directive',     saved.advance_directive);
      restoreChips('advance-directive-instrucciones', saved.advance_directive_instrucciones);
      set('f-advance-directive-otro',       saved.advance_directive_otro);
      set('f-advance-directive-ubicacion',  saved.advance_directive_ubicacion);
      updateAdvanceDirectiveVisibility();
      if ((saved.advance_directive_instrucciones || []).includes('Otro')) {
        const _adOw = document.getElementById('advance-directive-otro-wrap');
        if (_adOw) _adOw.style.display = 'block';
      }
      restoreChip ('embarazo',              saved.embarazo);
      set('pregnancy-weeks',               saved.embarazo_semanas);
      restoreChip ('lactancia',             saved.lactancia);
      restoreChips('allergy-med',           saved.allergy_med);
      restoreChips('allergy-food',          saved.allergy_food);
      restoreChips('allergy-env',           saved.allergy_env);
      restoreChips('allergy-insect',        saved.allergy_insect);
      restoreChips('allergy-anesthesia',    saved.allergy_anesthesia);
      restoreChip ('epipen',                saved.epipen);
      restoreChip ('glucagon',              saved.glucagon);
      restoreChip ('latex-guantes',         saved.latex_guantes);
      restoreChip ('anafilaxia-previa',     saved.anafilaxia_previa);
      restoreChips('diseases',              saved.diseases);
      restoreChips('conditions',            saved.conditions);
      restoreChip ('dialisis-activa',       saved.dialisis_activa);
      restoreChip ('lateralidad-fistula',   saved.lateralidad_fistula);
      updateGlucagonVisibility();
      updateDialisisVisibility();
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
      restoreChips('suplementos', saved.suplementos);
      if (Array.isArray(saved.suplementos)) {
        const supVals = Array.from(document.querySelectorAll('[data-group="suplementos"] .chip')).map(c => c.dataset.value);
        saved.suplementos.filter(s => !supVals.includes(s)).forEach(s => addSupExtraWithValue(s));
      }
      if (['Sí — tornillos/placas/clavos','Sí — prótesis metálica'].includes(saved.material_osteosintesis))
        document.getElementById('material-osteo-detalle-wrap').style.display = 'block';

      if (saved.lang_spoken && saved.lang_spoken.length > 0) {
        renderLangLevels(saved.lang_levels || {});
      }
      if ((saved.allergy_med && saved.allergy_med.length > 0) || (saved.allergy_insect && saved.allergy_insect.length > 0) ||
          (saved.allergy_food && saved.allergy_food.length > 0) || (saved.allergy_env && saved.allergy_env.length > 0) ||
          (saved.allergy_anesthesia && saved.allergy_anesthesia.length > 0)) {
        renderAllergySeverity(saved.allergy_severity || {});
      }
      updateAnaphylaxisTrigger(saved.anaphylaxis_trigger, saved.anaphylaxis_trigger_otro);

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

    function addSupExtra() {
      const wrap = document.getElementById('suplementos-extra-wrap');
      if (!wrap) return;
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'extra-med-input';
      inp.placeholder = 'Nombre del suplemento...';
      inp.style.cssText = 'display:block;margin-top:6px;width:100%';
      wrap.appendChild(inp);
    }

    function addSupExtraWithValue(value) {
      addSupExtra();
      const wrap = document.getElementById('suplementos-extra-wrap');
      if (!wrap) return;
      const inputs = wrap.querySelectorAll('.extra-med-input');
      if (inputs.length) inputs[inputs.length - 1].value = value;
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

    // ===== ICONOS SVG =====
    const SVG_PATHS = {
      warn:     '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
      bolt:     '<path d="M7 2v11h3v9l7-12h-4l4-8z"/>',
      heart:    '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
      thermo:   '<path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0zm-3 7a3 3 0 0 1-3-3c0-1.12.63-2.1 1.5-2.64V5a1.5 1.5 0 0 1 3 0v9.36A3 3 0 0 1 15 17a3 3 0 0 1-3 3z"/>',
      syringe:  '<path d="M11 15h2v-2h2v-2h-2V9h-2v2H9v2h2v2zm10-7.59L18.59 3l-2.42 2.42 1.42 1.41-1.42 1.42-1.41-1.42-1.41 1.42 1.41 1.41-2.12 2.13-1.42-1.42-1.41 1.42 1.41 1.41-2.22 2.22c-.78.78-.78 2.05 0 2.83.78.78 2.05.78 2.83 0l2.22-2.22 1.42 1.42 1.41-1.42-1.41-1.41 2.12-2.13 1.41 1.42 1.42-1.42-1.42-1.41 2.43-2.43-1.41-1.41z"/>',
      clip:     '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>',
      pill:     '<path d="M4.22 11.29l7.07-7.07a5 5 0 0 1 7.07 7.07l-7.07 7.07a5 5 0 0 1-7.07-7.07zM12 9.17l-2.83 2.83 1.41 1.41 2.84-2.83z"/>',
      run:      '<path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9 1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 12.3V17h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>',
      family:   '<path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05C16.19 13.9 17 15.04 17 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
      hands:    '<path d="M12 3 9 9H4v12h16V9h-5L12 3zm3 16H9v-5h2v3h2v-3h2v5zm2-7H7v-1h10v1z"/>',
      phone:    '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z"/>',
      hospital: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z"/>',
    };

    function svgIcon(key, cls) {
      return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${SVG_PATHS[key]}</svg>`;
    }

    function initIcons() {
      const SECT_MAP = [
        { match: 'Idiomas',            icon: 'clip',     cls: 'section-icon sect-norm' },
        { match: 'Datos físicos',      icon: 'thermo',   cls: 'section-icon sect-norm' },
        { match: 'Identificación',     icon: 'clip',     cls: 'section-icon sect-norm' },
        { match: 'Datos críticos',     icon: 'bolt',     cls: 'section-icon sect-crit' },
        { match: 'Enfermedades',       icon: 'heart',    cls: 'section-icon sect-crit ico-pulse' },
        { match: 'Medicación',         icon: 'pill',     cls: 'section-icon sect-crit' },
        { match: 'Cirugías',           icon: 'hospital', cls: 'section-icon sect-norm' },
        { match: 'Vacunas',            icon: 'syringe',  cls: 'section-icon sect-norm' },
        { match: 'Hábitos',            icon: 'run',      cls: 'section-icon sect-norm' },
        { match: 'Historial familiar', icon: 'family',   cls: 'section-icon sect-norm' },
        { match: 'Religión',           icon: 'hands',    cls: 'section-icon sect-norm' },
        { match: 'Contactos',          icon: 'phone',    cls: 'section-icon sect-norm' },
        { match: 'Médico',             icon: 'hospital', cls: 'section-icon sect-norm' },
      ];

      // Iconos en títulos de sección
      document.querySelectorAll('.section-title').forEach(el => {
        const text = el.textContent.trim();
        const entry = SECT_MAP.find(e => text.includes(e.match));
        if (entry) el.insertAdjacentHTML('afterbegin', svgIcon(entry.icon, entry.cls));
      });

      // Reemplazar ⚠ en field-labels y critical-warning (no dentro de chips)
      document.querySelectorAll('.field-label, .critical-warning').forEach(el => {
        if (!el.closest('.chip') && /⚠/.test(el.innerHTML)) {
          el.innerHTML = el.innerHTML.replace(/⚠️?/g, svgIcon('warn', 'ico ico-crit'));
        }
      });

      // Reemplazar ⚠️ en chips peligrosos
      document.querySelectorAll('.chip.chip-danger').forEach(chip => {
        if (/⚠️/.test(chip.innerHTML)) {
          chip.innerHTML = chip.innerHTML.replace(/⚠️/g, svgIcon('warn', 'chip-ico ico-crit'));
        }
      });

      // Reemplazar ⚡ en botones GENERAR
      document.querySelectorAll('button').forEach(btn => {
        if (/⚡/.test(btn.innerHTML)) {
          btn.innerHTML = btn.innerHTML.replace(/⚡/g, svgIcon('bolt', 'ico ico-crit'));
        }
      });
    }

    // ===== RANGOS DE AÑO DINÁMICOS =====
    function actualizarRangosAnio() {
      const anioActual = new Date().getFullYear();

      document.querySelectorAll('#year-visit-1, #year-visit-2, #year-visit-3')
        .forEach(el => el.max = anioActual);

      ['f-tetanus-year', 'f-surgery-year'].forEach(id => {
        const sel = document.getElementById(id);
        if (!sel || !sel.options.length) return;
        const ultimaOpcion = sel.options[sel.options.length - 1];
        ultimaOpcion.value = `2020-${anioActual}`;
        ultimaOpcion.textContent = `2020 – ${anioActual}`;
      });
    }

    // ===== INIT =====
    initCountrySelects();
    setupValidation();
    actualizarRangosAnio();
    loadSaved();
    initIcons();
