/* Refreshes application code without clearing patient storage or silently reloading edits. */
if ('serviceWorker' in navigator) {
  const workerRelease = document.currentScript ? new URL(document.currentScript.src, location.href).searchParams.get('v') || '11' : '11';
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js?v=' + encodeURIComponent(workerRelease), { scope: '/', updateViaCache: 'none' });
      await registration.update();
    } catch (_) { /* A temporary offline connection must not erase local work. */ }
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (document.getElementById('app-update-ready')) return;
    const panel = document.createElement('aside'); panel.id = 'app-update-ready';
    panel.style.cssText = 'position:fixed;bottom:12px;left:12px;right:12px;z-index:9999;padding:14px;border:1px solid #73c9ff;border-radius:12px;background:#123149;color:white;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap';
    const text = document.createElement('span');text.setAttribute('data-i18n','extra.05cfaf93c639cd67');text.textContent = (typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.05cfaf93c639cd67","Actualización lista. Aplica la nueva versión para continuar.",[]);
    const button = document.createElement('button');button.type='button';button.setAttribute('data-i18n','extra.844483aa0f4fb166');button.textContent=(typeof uiMessage === 'function' ? uiMessage : ((key,source,values=[])=>source.replace(/\{(\d+)\}/g,(match,index)=>values[index]??match)))("extra.844483aa0f4fb166","Aplicar actualización",[]);
    button.style.cssText = 'padding:10px 16px;border-radius:8px;background:#8dd6ff;color:#071b29;border:0;font:inherit;cursor:pointer';
    // The form's guarded beforeunload handler preserves actual edits. Never snapshot an uninitialized form here.
    button.addEventListener('click', () => window.location.reload());
    panel.append(text,button);document.body.appendChild(panel);
  });
}
