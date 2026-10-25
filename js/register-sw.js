/* Refreshes application code without clearing patient storage or silently reloading edits. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      await registration.update();
    } catch (_) { /* A temporary offline connection must not erase local work. */ }
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (document.getElementById('app-update-ready')) return;
    const panel = document.createElement('aside'); panel.id = 'app-update-ready';
    panel.style.cssText = 'position:fixed;bottom:12px;left:12px;right:12px;z-index:9999;padding:14px;border:1px solid #73c9ff;border-radius:12px;background:#123149;color:white;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap';
    const text = document.createElement('span');text.textContent = 'Actualización lista. Aplica la nueva versión para continuar.';
    const button = document.createElement('button');button.type='button';button.textContent='Aplicar actualización';
    button.style.cssText = 'padding:10px 16px;border-radius:8px;background:#8dd6ff;color:#071b29;border:0;font:inherit;cursor:pointer';
    button.addEventListener('click', () => {
      try {
        if (typeof window.buildProfileFromForm === 'function' && window.MedicalOwner?.current()) {
          const profile = window.buildProfileFromForm();
          if (window.MedicalOwner.matches(profile)) {
            if (window.ProfileSync) window.ProfileSync.saveDraft(profile);
            else localStorage.setItem('doctorqr_medical_draft',JSON.stringify({owner:window.MedicalOwner.id(),profile,base_revision:'',edited_at:Date.now()}));
          }
        }
        window.location.reload();
      } catch (_) { text.textContent='No se pudo conservar el borrador. Guarda una copia de tus cambios antes de recargar.'; }
    });
    panel.append(text,button);document.body.appendChild(panel);
  });
}
