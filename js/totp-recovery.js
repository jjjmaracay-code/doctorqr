/* Recovery state stays in memory; no password, secret or challenge is stored. */
(function () {
  'use strict';
  const byId = id => document.getElementById(id);
  let challenge = '', generation = 0;
  const status = message => { byId('tr-status').textContent = message; };
  function clear() {
    generation++;
    challenge = '';
    byId('tr-email-code').value = '';
    byId('tr-totp-code').value = '';
    byId('tr-secret').textContent = '';
    byId('tr-qr').removeAttribute('src');
    byId('tr-email-step').style.display = 'none';
    byId('tr-totp-step').style.display = 'none';
    for (const id of ['tr-verify-email', 'tr-confirm']) byId(id).disabled = false;
  }
  async function request(path, payload) {
    const res = await fetch(API + '/api/auth/totp-recovery/' + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', cache: 'no-store', body: JSON.stringify(payload)
    });
    let data;
    try { data = await res.json(); } catch (_) {
      throw new Error(res.status === 429 ? 'Demasiados intentos. Espera antes de volver a intentarlo.' :
        'No se pudo completar la solicitud. Inténtalo de nuevo más tarde.');
    }
    if (!res.ok || !data.success) throw new Error(data.error || 'No se pudo completar la recuperación.');
    return data;
  }
  document.addEventListener('doctorqr:totp-unreadable', () => {
    byId('btn-totp-recovery').style.display = 'block';
  });
  byId('btn-totp-recovery').addEventListener('click', async () => {
    clear();
    const active = generation;
    goTo('screen-totp-recovery');
    status('Comprobando tu contraseña y enviando el código al correo…');
    try {
      const data = await request('start', { email: byId('login-email').value.trim(),
        password: byId('login-password').value });
      if (active !== generation) return;
      challenge = data.challenge;
      status('Introduce el código nuevo que acabamos de enviar a tu correo. Es válido durante 10 minutos.');
      byId('tr-email-step').style.display = 'block';
      byId('tr-email-code').focus();
    } catch (err) { if (active === generation) status(err.message); }
  });
  byId('tr-verify-email').addEventListener('click', async () => {
    const code = byId('tr-email-code').value.trim();
    if (!/^\d{6}$/.test(code)) return status('Introduce los seis dígitos del correo.');
    const btn = byId('tr-verify-email');
    if (btn.disabled) return;
    btn.disabled = true;
    const active = generation;
    try {
      const data = await request('verify-email', { challenge, code });
      if (active !== generation) return;
      challenge = data.challenge;
      byId('tr-email-code').value = '';
      byId('tr-email-step').style.display = 'none';
      byId('tr-secret').textContent = data.secret;
      byId('tr-qr').src = data.qr_url;
      byId('tr-totp-step').style.display = 'block';
      status('Correo confirmado. Vincula el autenticador y confirma un código de la entrada nueva.');
      byId('tr-totp-code').focus();
    } catch (err) { if (active === generation) status(err.message); }
    finally { if (active === generation) btn.disabled = false; }
  });
  byId('tr-confirm').addEventListener('click', async () => {
    const code = byId('tr-totp-code').value.trim();
    if (!/^\d{6}$/.test(code)) return status('Introduce los seis dígitos del autenticador nuevo.');
    const btn = byId('tr-confirm');
    if (btn.disabled) return;
    btn.disabled = true;
    const active = generation;
    try {
      const data = await request('confirm', { challenge, code });
      if (active !== generation) return;
      clear();
      localStorage.removeItem('doctorqr_token');
      byId('login-password').value = '';
      goTo('screen-l1');
      showToast(data.message || 'Autenticador recuperado. Inicia sesión con el código nuevo.');
    } catch (err) { if (active === generation) status(err.message); }
    finally { if (active === generation) btn.disabled = false; }
  });
  byId('tr-back').addEventListener('click', () => { clear(); status(''); goTo('screen-l1'); });
  window.addEventListener('pagehide', clear);
})();
