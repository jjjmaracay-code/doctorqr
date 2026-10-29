/* Account-bound device data. Unowned legacy data is never adopted into a session. */
(function () {
  'use strict';
  const storage = localStorage;
  const keys = ['doctorqr_profile', 'doctorqr_profile_owner', 'doctorqr_qr_cache',
    'doctorqr_medical_draft', 'doctorqr_medical_changes', 'doctorqr_profile_revision', 'doctorqr_tutor_consent_huella', 'doctorqr_tutor_consent_fecha', 'doctorqr_pending_sync_notice', 'doctorqr_emergency_link'];
  const norm = v => String(v || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  function clearEmergency() {
    storage.removeItem('doctorqr_emergency_access');
    if (typeof window.CustomEvent === 'function') window.dispatchEvent(new window.CustomEvent('doctorqr:emergency-invalidated'));
  }
  function purge(options = {}) {
    keys.forEach(k => storage.removeItem(k));
    if (!options.keepEmergency) clearEmergency();
  }
  function conceal() {
    document.documentElement.style.visibility = 'hidden';
    for (const key of ['qr-carousel','qr-dots','emergency-quick-view']) document.getElementById?.(key)?.replaceChildren();
    if (typeof window.CustomEvent === 'function') window.dispatchEvent(new window.CustomEvent('doctorqr:account-invalidated'));
  }
  function account() {
    try { return JSON.parse(storage.getItem('doctorqr_user') || '{}'); } catch (_) { return {}; }
  }
  function id() { return storage.getItem('doctorqr_id') || ''; }
  const fingerprint = u => JSON.stringify([u.id ?? null, norm(u.nombre), norm(u.apellidos), norm(u.email),
    norm(u.doc_type), norm(u.doc_number).replace(/[\s-]/g,''), String(u.fecha_nacimiento || '').slice(0,10)]);
  function clearPublished() {
    if (!current()) return;
    for (const key of ['doctorqr_profile','doctorqr_qr_cache']) storage.removeItem(key);
    clearEmergency();
  }
  function matches(p, u = account()) {
    if (!p || !u.email) return false;
    const doc = v => norm(v).replace(/[\s-]/g, '');
    const name = norm([u.nombre, u.apellidos].filter(Boolean).join(' '));
    if ((p._profile_owner !== undefined && p._profile_owner !== id()) ||
        (p.doctorqr_id !== undefined && p.doctorqr_id !== id()) ||
        (u.id !== undefined && p._account_id !== undefined && p._account_id !== u.id) ||
        (p.nombre && p.name && norm(p.name) !== name) ||
        (p.doc_number && p.dni && doc(p.dni) !== doc(u.doc_number)) ||
        (p.fecha_nacimiento && p.birthdate && String(p.birthdate).slice(0,10) !== String(u.fecha_nacimiento || '').slice(0,10))) return false;
    return norm([p.nombre || p.name, p.apellidos].filter(Boolean).join(' ')) ===
      norm([u.nombre, u.apellidos].filter(Boolean).join(' ')) &&
      norm(p.email) === norm(u.email) && norm(p.doc_type) === norm(u.doc_type) &&
      doc(p.doc_number || p.dni) === doc(u.doc_number) &&
      String(p.fecha_nacimiento || p.birthdate || '').slice(0,10) === String(u.fecha_nacimiento || '').slice(0,10);
  }
  function validOwner() { return !!id() && storage.getItem('doctorqr_profile_owner') === id(); }
  function read() {
    try {
      const p = JSON.parse(storage.getItem('doctorqr_profile') || 'null');
      return initialId && initialId === id() && initialUser === fingerprint(account()) && validOwner() && matches(p) ? p : null;
    } catch (_) { return null; }
  }
  function bindSession(data) {
    if (!data.token || !data.doctorqr_id || !data.user || !data.user.email) throw Error('Sesión sin identidad verificable');
    if (id() !== data.doctorqr_id || storage.getItem('doctorqr_token') !== data.token || fingerprint(account()) !== fingerprint(data.user)) conceal();
    if (id() !== data.doctorqr_id || !validOwner() || fingerprint(account()) !== fingerprint(data.user)) {
      let sameEmergencyOwner = false;
      try {
        const kit = JSON.parse(storage.getItem('doctorqr_emergency_access') || 'null');
        sameEmergencyOwner = !id() && !storage.getItem('doctorqr_token') && !account().email && kit?.owner === data.doctorqr_id;
      } catch (_) {}
      purge({keepEmergency:sameEmergencyOwner});
    }
    storage.setItem('doctorqr_token', data.token);
    storage.setItem('doctorqr_id', data.doctorqr_id);
    storage.setItem('doctorqr_user', JSON.stringify(data.user));
    storage.setItem('doctorqr_profile_owner', data.doctorqr_id);
    if (storage.getItem('doctorqr_profile') && !read()) { storage.removeItem('doctorqr_profile'); storage.removeItem('doctorqr_qr_cache'); clearEmergency(); }
    storage.setItem('doctorqr_profile_owner', data.doctorqr_id);
  }
  const initialId = id(), initialToken = storage.getItem('doctorqr_token'), initialUser = fingerprint(account());
  function current() { return !!initialId && initialId === id() && initialToken === storage.getItem('doctorqr_token') && initialUser === fingerprint(account()) && validOwner(); }
  function write(profile) {
    if (!current() || !matches(profile)) throw Error('El perfil no coincide con la sesión. Vuelve a iniciar sesión.');
    storage.setItem('doctorqr_profile', JSON.stringify(profile));
  }
  // Quarantine on upgrade, before any form or QR reader can consume old shared data.
  if (!validOwner()) purge({keepEmergency:!id() && !initialToken && !account().email});
  else if (storage.getItem('doctorqr_profile') && !read()) { storage.removeItem('doctorqr_profile'); storage.removeItem('doctorqr_qr_cache'); clearEmergency(); }
  function discardProfile() {
    const own = current(); purge();
    if (own) storage.setItem('doctorqr_profile_owner', initialId);
  }
  window.MedicalOwner = { clearPublished, discardProfile, read, write, matches, validOwner, bindSession, purge, current, id };
  window.addEventListener('storage', event => {
    if (['doctorqr_token','doctorqr_id','doctorqr_user','doctorqr_profile_owner'].includes(event.key) || event.key === null) {
      if (initialId && !current()) {
        conceal();
        window.location.replace('login.html');
      }
    }
  });
  // Back/forward cache must never revive a tab belonging to a replaced account.
  window.addEventListener('pageshow', event => {
    if (initialId && !current()) {
      conceal();
      window.location.replace('login.html');
    } else if (!initialId && event?.persisted && document.documentElement.style.visibility === 'hidden') {
      // A login page concealed while binding a session can be restored by BFCache.
      // Reload its public UI; never revive an old credential/2FA flow.
      window.location.replace('login.html');
    }
  });
})();
