/* Confirmed server snapshots and owner-bound local drafts are intentionally separate. */
(function () {
  'use strict';
  const API = 'https://doctorqr-backend-production.up.railway.app/api/profile/';
  const DRAFT = 'doctorqr_medical_draft', META = 'doctorqr_profile_revision';
  let baseRevision = '', busy = false, pending = null, message = '', conflict = false;
  const owner = () => window.MedicalOwner;
  const validRevision = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; } };
  function draft() {
    const d = read(DRAFT);
    return owner()?.current() && d?.owner === owner().id() && owner().matches(d.profile) ? d : null;
  }
  function saveDraft(profile) {
    if (!owner()?.current() || !owner().matches(profile)) return false;
    localStorage.setItem(DRAFT, JSON.stringify({ owner: owner().id(), profile,
      base_revision: baseRevision, edited_at: Date.now() }));
    if (!busy && !conflict) notify('Borrador conservado en este dispositivo. Pulsa Guardar y actualizar mis QR para publicarlo.');
    return true;
  }
  function setRevision(value) {
    if (!validRevision(value)) throw Error('El servidor no ha confirmado la revisión del perfil.');
    baseRevision = value;
    localStorage.setItem(META, JSON.stringify({ owner: owner().id(), revision: value }));
  }
  const cachedMeta = read(META);
  if (owner()?.current() && cachedMeta?.owner === owner().id() && validRevision(cachedMeta.revision)) baseRevision = cachedMeta.revision;
  async function request(path, payload) {
    if (!owner()?.current()) throw Error('La sesión cambió. Vuelve a entrar antes de publicar.');
    const token = localStorage.getItem('doctorqr_token'), id = owner().id();
    const res = await fetch(API + path, { method: payload ? 'POST' : 'GET',
      credentials: 'include', cache: 'no-store', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      ...(payload ? { body: JSON.stringify(payload) } : {}) });
    const data = await res.json().catch(() => ({ error: 'Respuesta no válida del servidor.' }));
    if (!owner().current() || id !== owner().id() || token !== localStorage.getItem('doctorqr_token')) throw Error('La sesión cambió. Tu respuesta anterior se ha descartado.');
    return { res, data };
  }
  function checkedMetadata(data) {
    if (data.doctorqr_id !== owner().id() || !validRevision(data.profile_revision)) throw Error('No se pudo confirmar la identidad del perfil. Tu borrador se conserva.');
    if (data.profile && !owner().matches(data.profile)) throw Error('La identidad del perfil no coincide con tu cuenta.');
    return data;
  }
  function notify(text, hasConflict = false) { message = text; conflict = hasConflict; render(); }
  function render() {
    const panel = document.getElementById('profile-sync-panel');
    if (!panel) return;
    panel.hidden = !message;
    document.getElementById('profile-sync-message').textContent = message;
    document.getElementById('profile-sync-choices').hidden = !conflict;
  }
  async function load() {
    let local = draft();
    const legacy = owner()?.read();
    try {
      const { res, data: raw } = await request('me');
      if (![200,404,409].includes(res.status)) throw Error(raw.error || 'No se pudo cargar el perfil.');
      const data = checkedMetadata(raw);
      const clinical = p => JSON.stringify(Object.keys(p || {}).filter(k => k !== 'updated_at' && !k.startsWith('_')).sort().map(k => [k,p[k]]));
      if (!local && legacy && data.profile && clinical(legacy) !== clinical(data.profile)) { saveDraft(legacy); local = draft(); }
      const oldRevision = local?.base_revision;
      if (data.profile) owner().write({ ...data.profile, updated_at: data.updated_at });
      else {
        // The old server data is quarantined; keep only the user's identity-matched draft for review.
        if (!local && legacy) saveDraft(legacy);
        localStorage.removeItem('doctorqr_profile'); localStorage.removeItem('doctorqr_qr_cache');
      }
      setRevision(data.profile_revision);
      const working = draft();
      if (data.profile && local && oldRevision !== data.profile_revision) {
        // Retain the original baseline until the owner explicitly resolves the conflict.
        baseRevision = oldRevision || '';
        pending = data;
        notify('Otro dispositivo publicó una versión distinta. Tu borrador sigue intacto. Compara las versiones antes de publicar.', true);
      } else if (!data.profile) {
        if (working) saveDraft(working.profile);
        notify(working ? 'Tu borrador está recuperado. Revisa los datos y pulsa Guardar y actualizar mis QR para publicar un perfil verificado.' : 'Completa tu perfil y publícalo. El perfil anterior no se mostrará si su identidad no coincide.');
      } else if (working) notify('Tienes un borrador local pendiente de publicar. La lectura del QR utiliza la última versión confirmada.');
      else notify('Perfil cargado desde el servidor.');
      return working?.profile || data.profile || null;
    } catch (error) {
      notify(error.message + ' Si tienes un borrador local de esta cuenta, se conserva.');
      return draft()?.profile || owner()?.read() || null;
    }
  }
  async function inspectConflict() {
    const { res, data } = await request('me');
    if (![200,404,409].includes(res.status)) throw Error(data.error || 'No se pudo comparar el perfil.');
    pending = checkedMetadata(data);
    const local = draft()?.profile || {};
    const remote = data.profile || {};
    const box = document.getElementById('profile-sync-differences');
    box.replaceChildren();
    if (!data.profile) { box.textContent = 'El servidor no tiene un perfil médico verificable. Puedes publicar tu borrador revisado.'; return; }
    const table = document.createElement('table'); table.style.cssText = 'width:100%;text-align:left;border-spacing:8px;overflow-wrap:anywhere';
    const header = document.createElement('tr');
    for (const label of ['Dato','Tu borrador','Última versión publicada']) { const th=document.createElement('th');th.textContent=label;header.appendChild(th); } table.appendChild(header);
    const labels={nombre:'Nombre',apellidos:'Apellidos',fecha_nacimiento:'Nacimiento',sangre:'Grupo sanguíneo',allergy_med:'Alergias a medicamentos',allergy_food:'Alergias alimentarias',allergy_insect:'Alergias a insectos',doc_type:'Tipo de documento',doc_number:'Documento',email:'Correo',medicamentos:'Medicación'};
    for (const key of new Set([...Object.keys(local),...Object.keys(remote)])) {
      if (key.startsWith('_') || key === 'updated_at' || JSON.stringify(local[key]) === JSON.stringify(remote[key])) continue;
      const row=document.createElement('tr');
      for(const value of [labels[key] || key.replace(/_/g,' '), local[key], remote[key]]) {
        const td=document.createElement('td');td.style.cssText='vertical-align:top;border-top:1px solid #456;padding:8px';
        td.textContent = value === null || value === undefined || value === '' ? 'Sin dato' : typeof value === 'object' ? JSON.stringify(value) : String(value);
        row.appendChild(td);
      }
      table.appendChild(row);
    }
    box.appendChild(table);
  }
  async function save(profile, reviewed = false) {
    if (busy) return { success: false };
    if (!saveDraft(profile)) { notify('La identidad del borrador no coincide con tu sesión. No se ha publicado.'); return { success:false }; }
    busy = true;
    try {
      if (reviewed) {
        if (!pending) throw Error('Compara primero la versión publicada.');
        setRevision(pending.profile_revision);
      }
      if (!baseRevision) { await load(); throw Error('Revisa el perfil cargado antes de publicar. Tu borrador está conservado.'); }
      notify('Publicando y verificando el guardado en el servidor…');
      const { res, data } = await request('save', { profile, doctorqr_id: owner().id(), base_revision: baseRevision });
      if (!res.ok) {
        if (data.code === 'profile_conflict') {
          await inspectConflict();
          notify('Otro dispositivo cambió el perfil. Nada de este borrador se ha publicado. Compara y elige qué versión conservar.', true);
          return { success:false, conflict:true };
        }
        throw Error(data.error || 'No se ha guardado en el servidor.');
      }
      checkedMetadata(data);
      if (!data.success || !data.profile) throw Error('El servidor no ha confirmado el guardado.');
      setRevision(data.profile_revision);
      owner().write({ ...data.profile, updated_at: data.updated_at });
      const newest = draft();
      const submitted = JSON.stringify(profile);
      if (!newest || JSON.stringify(newest.profile) === submitted) localStorage.removeItem(DRAFT);
      else saveDraft(newest.profile);
      pending = null;
      notify(draft() ? 'Se publicó la versión enviada. Hay cambios posteriores en tu borrador pendientes de publicar.' : 'Guardado en el servidor. Tus QR consultan esta versión verificada.');
      window.dispatchEvent(new CustomEvent('doctorqr:profile-published', { detail: { profile:data.profile, pendingDraft:!!draft() } }));
      return { success:true };
    } catch (error) { notify(error.message + ' Tu borrador se conserva en este dispositivo.'); return { success:false }; }
    finally { busy=false; }
  }
  window.ProfileSync = { load, save, saveDraft, draft, render, inspectConflict,
    get revision() { return baseRevision; } };
  document.addEventListener('DOMContentLoaded', () => {
    render();
    document.querySelectorAll('#profile-sync-choices > button').forEach(button => { button.style.cssText = 'padding:12px 16px;margin:6px;border:1px solid #77c7ff;border-radius:10px;background:#183e5e;color:#f2f9ff;font:inherit;cursor:pointer'; });
    document.getElementById('profile-sync-compare')?.addEventListener('click', () => inspectConflict().catch(e=>notify(e.message,true)));
    document.getElementById('profile-sync-use-server')?.addEventListener('click', async () => {
      try {
        await inspectConflict();
        if (!pending.profile) { notify('No hay un perfil publicado verificable. Conserva y revisa tu borrador.',true);return; }
        if (!confirm('¿Cargar la última versión publicada y descartar este borrador local?')) return;
        setRevision(pending.profile_revision);owner().write({...pending.profile,updated_at:pending.updated_at});localStorage.removeItem(DRAFT);
        window.dispatchEvent(new CustomEvent('doctorqr:load-latest'));window.location.reload();
      } catch(e) { notify(e.message,true); }
    });
    document.getElementById('profile-sync-use-draft')?.addEventListener('click', async () => {
      const p = draft()?.profile;
      if (!p) return;
      if (!confirm('¿Has revisado las diferencias? Se publicará tu borrador completo en lugar de la versión del servidor.')) return;
      await save(p,true);
    });
  });
})();
