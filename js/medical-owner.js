/* Account-bound device data. Unowned legacy data is never adopted into a session. */
(function () {
  'use strict';
  const storage = localStorage;
  const keys = ['doctorqr_profile', 'doctorqr_profile_owner', 'doctorqr_qr_cache',
    'doctorqr_medical_draft', 'doctorqr_medical_changes', 'doctorqr_profile_revision', 'doctorqr_tutor_consent_huella', 'doctorqr_tutor_consent_fecha', 'doctorqr_pending_sync_notice'];
  const norm = v => String(v || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  function purge() { keys.forEach(k => storage.removeItem(k)); }
  function account() {
    try { return JSON.parse(storage.getItem('doctorqr_user') || '{}'); } catch (_) { return {}; }
  }
  function id() { return storage.getItem('doctorqr_id') || ''; }
  function matches(p, u = account()) {
    if (!p || !u.email) return false;
    const doc = v => norm(v).replace(/[\s-]/g, '');
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
      return validOwner() && matches(p) ? p : null;
    } catch (_) { return null; }
  }
  function bindSession(data) {
    if (!data.token || !data.doctorqr_id || !data.user || !data.user.email) throw Error('Sesión sin identidad verificable');
    if (id() !== data.doctorqr_id || !validOwner() || norm(account().email) !== norm(data.user.email)) purge();
    storage.setItem('doctorqr_token', data.token);
    storage.setItem('doctorqr_id', data.doctorqr_id);
    storage.setItem('doctorqr_user', JSON.stringify(data.user));
    storage.setItem('doctorqr_profile_owner', data.doctorqr_id);
    if (storage.getItem('doctorqr_profile') && !read()) { storage.removeItem('doctorqr_profile'); storage.removeItem('doctorqr_qr_cache'); }
    storage.setItem('doctorqr_profile_owner', data.doctorqr_id);
  }
  const initialId = id(), initialToken = storage.getItem('doctorqr_token');
  function current() { return !!initialId && initialId === id() && initialToken === storage.getItem('doctorqr_token') && validOwner(); }
  function write(profile) {
    if (!current() || !matches(profile)) throw Error('El perfil no coincide con la sesión. Vuelve a iniciar sesión.');
    storage.setItem('doctorqr_profile', JSON.stringify(profile));
  }
  // Quarantine on upgrade, before any form or QR reader can consume old shared data.
  if (!validOwner()) purge();
  else if (storage.getItem('doctorqr_profile') && !read()) { storage.removeItem('doctorqr_profile'); storage.removeItem('doctorqr_qr_cache'); }
  function discardProfile() {
    const own = current(); purge();
    if (own) storage.setItem('doctorqr_profile_owner', initialId);
  }
  window.MedicalOwner = { discardProfile, read, write, matches, validOwner, bindSession, purge, current, id };
  window.addEventListener('storage', event => {
    if (['doctorqr_token','doctorqr_id','doctorqr_user','doctorqr_profile_owner'].includes(event.key) || event.key === null) {
      if (initialToken && !current()) {
        document.documentElement.style.visibility = 'hidden';
        window.location.replace('login.html');
      }
    }
  });
})();
