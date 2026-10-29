/* Linked desktop preview. Uses the existing owner checks, confirmed snapshot and QR encoder. */
(function () {
  'use strict';
  function init() {
    const trigger = document.getElementById('open-web-qr-preview');
    if (!trigger || !window.WebSession || document.documentElement.dataset.webLinked !== 'true') return;
    const fallback = {
      title: 'Mis QR médicos', close: 'Cerrar vista previa', saved: 'Se muestra la última versión guardada de tus datos médicos. Los cambios sin guardar no aparecen en estos QR.',
      loading: 'Comprobando la sesión y tus datos médicos guardados…', empty: 'Todavía no hay datos médicos guardados para mostrar sus QR. Guarda tus datos médicos y vuelve a abrir esta vista.',
      error: 'No se pudieron comprobar tus datos médicos guardados. Revisa la conexión y vuelve a intentarlo.', retry: 'Volver a comprobar',
      content: 'Abrir la información de este QR', content_note: 'La información se abre en otra pestaña con el lector médico habitual.', list: 'Selecciona un QR'
    };
    const text = key => typeof window.uiMessage === 'function' ? window.uiMessage('qr_preview.' + key, fallback[key]) : fallback[key];
    const dialog = document.createElement('dialog');
    dialog.id = 'web-qr-preview'; dialog.className = 'web-qr-preview';
    dialog.setAttribute('aria-labelledby', 'web-qr-preview-title');
    dialog.setAttribute('aria-describedby', 'web-qr-preview-saved');
    // Static markup only. Patient data and URLs are assigned through DOM properties below.
    dialog.innerHTML = '<header class="web-qr-preview-header"><div><h2 id="web-qr-preview-title" data-i18n="qr_preview.title"></h2><p class="web-qr-preview-patient"></p></div><button type="button" class="web-qr-preview-close" data-i18n="qr_preview.close"></button></header>' +
      '<p id="web-qr-preview-saved" class="web-qr-preview-note" data-i18n="qr_preview.saved"></p>' +
      '<p class="web-qr-preview-status" role="status" aria-live="polite"></p><button type="button" class="web-qr-preview-retry" data-i18n="qr_preview.retry" hidden></button>' +
      '<div class="web-qr-preview-layout" hidden><nav class="web-qr-preview-picker"><h3 data-i18n="qr_preview.list"></h3><p class="web-qr-preview-count"></p><div class="web-qr-preview-list"></div></nav>' +
      '<section class="web-qr-preview-detail" aria-labelledby="web-qr-preview-selected"><h3 id="web-qr-preview-selected"></h3><img class="web-qr-preview-image" width="380" height="380" alt="" hidden>' +
      '<a class="web-qr-preview-content" target="_blank" rel="noopener noreferrer" data-i18n="qr_preview.content"></a><p class="web-qr-preview-note" data-i18n="qr_preview.content_note"></p></section></div>';
    document.body.append(dialog);
    const one = selector => dialog.querySelector(selector);
    const close = one('.web-qr-preview-close'), retry = one('.web-qr-preview-retry'), status = one('.web-qr-preview-status');
    const layout = one('.web-qr-preview-layout'), list = one('.web-qr-preview-list'), image = one('.web-qr-preview-image'), link = one('.web-qr-preview-content');
    let records = [], selectedId = '', generation = 0, opening = 0, nextOpening = 0, stateKey = '';
    const eligible = () => window.MedicalOwner?.current() && document.documentElement.dataset.webLinked === 'true' && document.documentElement.style.visibility !== 'hidden' && !document.hidden;
    function labels() {
      dialog.querySelectorAll('[data-i18n]').forEach(el => { const key = el.dataset.i18n.slice('qr_preview.'.length); el.textContent = text(key); });
      if (stateKey) status.textContent = text(stateKey);
      if (records.length) one('.web-qr-preview-count').textContent = new Intl.NumberFormat(window.currentLanguage || 'es').format(records.length);
    }
    function setState(key) { stateKey = key; status.textContent = key ? text(key) : ''; retry.hidden = key !== 'error'; }
    function clear() {
      ++generation; records = []; layout.hidden = true; list.replaceChildren();
      image.removeAttribute('src'); image.alt = ''; image.hidden = true; link.removeAttribute('href');
      one('#web-qr-preview-selected').textContent = ''; one('.web-qr-preview-patient').textContent = ''; one('.web-qr-preview-count').textContent = '';
    }
    function dismiss() { opening = 0; clear(); if (dialog.open) dialog.close(); trigger.setAttribute('aria-expanded', 'false'); }
    function choose(id) {
      if (!eligible() || !dialog.open) return dismiss();
      const record = records.find(item => item.type.id === id); if (!record) return;
      selectedId = id; image.src = record.src; image.alt = record.type.title; image.hidden = false; link.href = record.url;
      one('#web-qr-preview-selected').textContent = record.type.title;
      for (const button of list.children) button.setAttribute('aria-pressed', String(button.dataset.qrId === id));
    }
    async function renderConfirmed() {
      clear(); const nonce = generation, ownerId = MedicalOwner.id(), revision = ProfileSync.revision;
      const current = () => nonce === generation && dialog.open && eligible() && MedicalOwner.id() === ownerId && ProfileSync.revision === revision;
      if (!current()) return;
      const profile = MedicalOwner.read();
      if (!profile) { setState('empty'); return; }
      setState('loading');
      try {
        await ensureQRCodeLoaded(); if (!current()) return;
        const available = QR_TYPES.filter(type => type.always || (type.condition && type.condition(profile))), result = [];
        for (const type of available) {
          if (!current()) return;
          const url = buildQRUrl(type, profile), parsed = new URL(url);
          if (parsed.origin !== 'https://atabeyapp.app' || parsed.pathname !== '/card.html' || parsed.searchParams.get('id') !== ownerId) throw Error('preview_owner_mismatch');
          // Yield between symbols; do not use the QR cache writer or the editable form.
          await new Promise(resolve => setTimeout(resolve, 0)); if (!current()) return;
          const target = document.createElement('div');
          createOrganicQRCode(target, {text: url, width: 380, height: 380, colorDark: type.darkColor, colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M, visualStyle: getQRVisualStyle(type.id)});
          const generated = await esperarImagenQR(target, 1500); if (!current()) return;
          if (!generated?.src.startsWith('data:image/')) throw Error('preview_image_unavailable');
          result.push({type, url, src: generated.src});
        }
        if (!current()) return;
        records = result;
        for (const record of records) {
          const button = document.createElement('button'), thumb = document.createElement('img'), name = document.createElement('span');
          button.type = 'button'; button.className = 'web-qr-preview-choice'; button.dataset.qrId = record.type.id;
          button.style.setProperty('--preview-tone', record.type.color); button.setAttribute('aria-controls', 'web-qr-preview-selected');
          thumb.src = record.src; thumb.alt = ''; thumb.width = thumb.height = 56; name.textContent = record.type.title;
          button.append(thumb, name); button.addEventListener('click', () => choose(record.type.id)); list.append(button);
        }
        one('.web-qr-preview-patient').textContent = [profile.nombre, profile.apellidos].filter(Boolean).join(' ');
        setState(''); layout.hidden = false; labels(); choose(records.some(item => item.type.id === selectedId) ? selectedId : records[0].type.id);
      } catch (_) { if (current()) { clear(); setState('error'); } }
    }
    // Focus may already have started the normal background refresh. Wait for it rather than treating "busy" as a failed verification.
    async function waitForSyncIdle() {
      await new Promise(resolve => setTimeout(resolve, 0));
      const control = document.getElementById('profile-sync-refresh');
      if (!control || !window.ProfileSync) throw Error('sync_unavailable');
      if (!control.disabled) return;
      await new Promise((resolve, reject) => {
        const finish = error => { observer.disconnect(); clearTimeout(timeout); error ? reject(error) : resolve(); };
        const observer = new MutationObserver(() => { if (!control.disabled) finish(); });
        const timeout = setTimeout(() => finish(Error('sync_busy_timeout')), 10000);
        observer.observe(control, {attributes: true, attributeFilter: ['disabled']});
      });
    }
    async function open() {
      if (opening || !eligible()) return;
      const task = ++nextOpening; opening = task; clear(); const nonce = generation;
      if (!dialog.open) dialog.showModal(); trigger.setAttribute('aria-expanded', 'true'); labels(); setState('loading'); close.focus();
      try {
        if (!(await WebSession.check()) || !eligible() || nonce !== generation || !dialog.open) return;
        await waitForSyncIdle(); if (!eligible() || nonce !== generation || !dialog.open) return;
        let timeout;
        const checked = await Promise.race([ProfileSync.checkRemote(true), new Promise(resolve => { timeout = setTimeout(() => resolve(false), 12000); })]).finally(() => clearTimeout(timeout));
        if (!eligible() || nonce !== generation || !dialog.open) return;
        if (!checked) throw Error('profile_unconfirmed');
        await renderConfirmed();
      } catch (_) { if (nonce === generation && eligible() && dialog.open) { clear(); setState('error'); } }
      finally { if (opening === task) opening = 0; }
    }
    trigger.addEventListener('click', open); retry.addEventListener('click', open); close.addEventListener('click', dismiss);
    dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
    dialog.addEventListener('close', () => { if (!dialog.open) { opening = 0; clear(); trigger.setAttribute('aria-expanded', 'false'); } });
    for (const name of ['doctorqr:profile-published', 'doctorqr:profile-synchronized']) window.addEventListener(name, () => { if (dialog.open && !opening && eligible()) renderConfirmed(); });
    window.addEventListener('doctorqr:language-changed', labels);
    new MutationObserver(() => { if (dialog.open && !eligible()) dismiss(); }).observe(document.documentElement, {attributes: true, attributeFilter: ['style', 'data-web-linked']});
    window.addEventListener('pagehide', dismiss); labels();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
