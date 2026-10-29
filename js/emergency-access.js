/* Read-only emergency QR references. No session token, clinical fields or drafts. */
(function () {
  'use strict';
  const KEY = 'doctorqr_emergency_access';
  const codes = Object.freeze({
    'qr-emergency':'emergency', 'qr-u1':'critical', 'qr-u2':'cardio',
    'qr-u3':'allergy', 'qr-e1':'surgery', 'qr-e2':'oncology',
    'qr-e4':'obstetric', 'qr-e5':'mental'
  });
  const known = type => typeof type === 'string' && Object.prototype.hasOwnProperty.call(codes, type);
  function clear() { try { localStorage.removeItem(KEY); } catch (_) {} hideView(); }
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!value) return null;
      if (value.version !== 1 || typeof value.owner !== 'string' || !value.owner || value.owner.length > 128 ||
          typeof value.name !== 'string' || !value.name.trim() || value.name.length > 300 ||
          !Array.isArray(value.types) || value.types.length > 8 || new Set(value.types).size !== value.types.length ||
          !value.types.includes('qr-emergency') || !value.types.includes('qr-u1') ||
          value.types.some(type => !known(type)) || !Number.isSafeInteger(value.savedAt)) {
        clear(); return null;
      }
      const id = localStorage.getItem('doctorqr_id');
      if (id && (id !== value.owner || !window.MedicalOwner?.current())) return null;
      // Reconstruct a whitelist: never accept a persisted URL, image or extra fields.
      return {version:1, owner:value.owner, name:value.name, types:value.types.slice(), savedAt:value.savedAt};
    } catch (_) { clear(); return null; }
  }
  function save(types) {
    if (window.WebSession || !window.MedicalOwner?.current()) return null;
    const profile = MedicalOwner.read();
    if (!profile) return null;
    const value = {version:1, owner:MedicalOwner.id(),
      name:[profile.nombre, profile.apellidos].filter(Boolean).join(' ').trim(),
      types:Array.from(new Set(types)).filter(known), savedAt:Date.now()};
    const old = read();
    if (old && old.owner === value.owner && old.name === value.name && JSON.stringify(old.types) === JSON.stringify(value.types)) return old;
    try { localStorage.setItem(KEY, JSON.stringify(value)); return read(); } catch (_) { return null; }
  }
  function current(snapshot) {
    const value = read();
    return !!value && JSON.stringify(value) === JSON.stringify(snapshot);
  }
  function url(snapshot, type) {
    return current(snapshot) && snapshot.types.includes(type) && known(type)
      ? 'https://atabeyapp.app/card.html?id=' + encodeURIComponent(snapshot.owner) + '&t=' + codes[type] : null;
  }
  function hideView() {
    const view = document.getElementById('emergency-quick-view');
    if (view) { view.replaceChildren(); view.style.display = 'none'; }
  }
  window.EmergencyAccess = Object.freeze({read, save, current, url, clear});
  window.addEventListener('doctorqr:account-invalidated', hideView);
  window.addEventListener('doctorqr:emergency-invalidated', hideView);
  window.addEventListener('storage', event => {
    if (event.key === null || [KEY,'doctorqr_token','doctorqr_id','doctorqr_user','doctorqr_profile_owner'].includes(event.key)) hideView();
  });
})();
