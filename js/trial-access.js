/* Server-enforced access with visible trial reminders. This module never writes medical data. */
(function () {
  'use strict';
  const API = 'https://doctorqr-backend-production.up.railway.app';
  const CACHE = 'doctorqr_access_state';
  const editor = /\/(?:index(?:\.html)?)?$/.test(location.pathname), emergencyPage = /\/emergencia(?:\.html)?$/.test(location.pathname);
  // Opening prepared public QR references must not wait for login, a plan
  // request or the network. The medical reader still enforces server access.
  if (!editor) return;
  if (editor || emergencyPage) document.documentElement.dataset.accessGate = 'checking';
  const source = {
    title:'Prueba gratuita: quedan {days} días',today:'Últimas 24 horas de tu prueba gratuita',
    copy:'Dispones de 30 días gratuitos. Después necesitarás activar un plan para consultar, editar y compartir tus datos médicos.',
    ends:'Finaliza el {date}.',countdown:'{days} d · {hours} h · {minutes} min',action:'Ver planes y activar acceso',
    checking_title:'Comprobando el acceso',checking_copy:'Estamos verificando la vigencia de tu cuenta.',
    expired_title:'Tu prueba de 30 días ha terminado',expired_copy:'El acceso a tus datos médicos y a sus QR está suspendido hasta activar un plan. Tus datos y tu borrador no se han eliminado.',
    unverified_title:'Conecta para comprobar tu acceso',unverified_copy:'No se ha podido verificar la vigencia de la cuenta. Conéctate y vuelve a comprobarla.',
    retry:'Volver a comprobar',signin:'Iniciar sesión',web_manage:'Gestiona el plan desde la aplicación principal de tu móvil. Después pulsa Volver a comprobar en este ordenador.',web_exit:'Cerrar sesión web'
  };
  function text(key,values={}) {
    const raw=typeof window.uiMessage==='function'?window.uiMessage('trial_notice.'+key,source[key]):source[key];
    return raw.replace(/\{(\w+)\}/g,(match,name)=>values[name]??match);
  }
  const own = () => window.MedicalOwner?.current() && MedicalOwner.id();
  let state=null,anchor=null,busy=null,timer=null,gate,notice,previousTitle='',lastFetch=0;
  function cache() {
    try {const record=JSON.parse(localStorage.getItem(CACHE)||'null');if(record?.owner!==own()||!valid(record.state)||!Number.isFinite(record.wall)||Date.now()<record.wall-1000)return null;return record;}
    catch(_){return null;}
  }
  function adopt(next,persist=true,wall=Date.now()) {
    state=next;anchor={wall,mono:performance.now(),elapsed:Math.max(0,Date.now()-wall)};
    if(persist&&own())try{localStorage.setItem(CACHE,JSON.stringify({owner:own(),state,wall}));}catch(_){}
    render();
  }
  function seconds() {
    if(state?.status==='paid')return Infinity;
    if(!state?.access||!Number.isFinite(Number(state.remaining_seconds)))return 0;
    const elapsed=Math.max(Date.now()-anchor.wall,anchor.elapsed+performance.now()-anchor.mono);
    return Math.max(0,Number(state.remaining_seconds)-elapsed/1000);
  }
  function nodes() {
    if(gate)return;
    gate=document.createElement('aside');gate.id='account-access-gate';gate.hidden=true;gate.setAttribute('aria-live','polite');
    gate.innerHTML='<div class="trial-gate-card"><h2></h2><p></p><p class="trial-web-note" hidden></p><div class="trial-gate-actions"><a class="trial-action" href="/paywall.html"></a><button class="trial-action trial-secondary" type="button"></button><a class="trial-action trial-secondary trial-signin" href="/login.html"></a><button class="trial-action trial-secondary trial-linked-exit" type="button" hidden></button></div></div>';
    gate.querySelector('button').addEventListener('click',()=>verify(true));document.body.append(gate);
    gate.querySelector('.trial-linked-exit').addEventListener('click',()=>window.WebSession?.logout());
    const host=document.querySelector('.account-overview');
    if(host){notice=document.createElement('aside');notice.id='trial-notice';notice.hidden=true;notice.innerHTML='<h2 role="status" aria-live="polite"></h2><p class="trial-description"></p><p class="trial-end-date"></p><time aria-live="off"></time><p class="trial-web-note" hidden></p><a class="trial-action" href="/paywall.html"></a>';host.append(notice);}
  }
  function lock(reason) {
    nodes();document.documentElement.dataset.accessGate=reason;
    const dialog=document.getElementById('web-qr-preview');if(dialog?.open)dialog.close();
    const quick=document.getElementById('emergency-quick-view');if(quick)quick.style.display='none';
    gate.hidden=false;gate.querySelector('h2').textContent=text(reason+'_title');gate.querySelector('p').textContent=text(reason+'_copy');
    gate.querySelector('a').textContent=text('action');gate.querySelector('button').textContent=text('retry');gate.querySelector('.trial-signin').textContent=text('signin');
    const linked=document.documentElement.dataset.webLinked==='true';
    gate.querySelector('a').hidden=linked;gate.querySelector('.trial-signin').hidden=linked;gate.querySelector('.trial-linked-exit').hidden=!linked;gate.querySelector('.trial-linked-exit').textContent=text('web_exit');
    gate.querySelector('.trial-web-note').hidden=!linked;gate.querySelector('.trial-web-note').textContent=text('web_manage');
    document.querySelectorAll('body[data-medical-surface] > :not(#account-access-gate):not(.web-session-banner)').forEach(el=>{if(!el.hasAttribute('inert')){el.dataset.trialInert='1';el.inert=true;}});
    if(notice)notice.hidden=true;
    window.dispatchEvent(new CustomEvent('doctorqr:access-blocked',{detail:{reason}}));
  }
  function unlock() {
    delete document.documentElement.dataset.accessGate;if(gate)gate.hidden=true;
    document.querySelectorAll('[data-trial-inert]').forEach(el=>{el.inert=false;delete el.dataset.trialInert;});
    // The existing chip helper observes class changes, not an ancestor's temporary inert state.
    // Restore accessibility from the guards that remain, preserving clinical/identity restrictions.
    document.querySelectorAll('.chip[aria-disabled]').forEach(el=>el.setAttribute('aria-disabled',String(!!el.closest('[inert],.chips-disabled'))));
  }
  function render() {
    if(!document.body)return;
    nodes();clearTimeout(timer);
    if(!own()) {if(editor||emergencyPage)lock('unverified');return;}
    if(!state){if(editor||emergencyPage)lock('checking');return;}
    const remaining=seconds();
    if(!state.access||remaining<=0){lock(state.status==='trial_expired'||state.status==='trial_active'?'expired':'unverified');return;}
    unlock();
    if(state.status==='paid'){
      if(notice)notice.hidden=true;
      const badge=document.getElementById('plan-badge');
      if(badge&&['pro','lifetime'].includes(state.plan_type)){const key='index.plan_badge.'+state.plan_type;badge.dataset.i18n=key;badge.removeAttribute('data-i18n-param-n');badge.textContent=window.t?window.t(key):state.plan_type;}
      return;
    }
    if(notice){
      const days=Math.ceil(remaining/86400),title=text(remaining<=86400?'today':'title',{days:new Intl.NumberFormat(window.currentLanguage||'es').format(days)});
      notice.hidden=false;notice.dataset.urgent=String(remaining<=3*86400);
      if(title!==previousTitle){notice.querySelector('h2').textContent=title;previousTitle=title;}
      notice.querySelector('.trial-description').textContent=text('copy');
      const date=new Intl.DateTimeFormat(window.currentLanguage||'es',{dateStyle:'long',timeStyle:'short'}).format(new Date(state.trial_ends_at*1000));
      notice.querySelector('.trial-end-date').textContent=text('ends',{date});
      notice.querySelector('time').dateTime=new Date(state.trial_ends_at*1000).toISOString();
      notice.querySelector('time').textContent=text('countdown',{days:Math.floor(remaining/86400),hours:Math.floor(remaining%86400/3600),minutes:Math.floor(remaining%3600/60)});
      notice.querySelector('a').textContent=text('action');
      const linked=document.documentElement.dataset.webLinked==='true';notice.querySelector('a').hidden=linked;notice.querySelector('.trial-web-note').hidden=!linked;notice.querySelector('.trial-web-note').textContent=text('web_manage');
      const badge=document.getElementById('plan-badge');if(badge){badge.dataset.i18n=remaining<=86400?'trial_notice.today':'index.plan_badge.free';badge.setAttribute('data-i18n-param-n',days);badge.textContent=remaining<=86400?text('today'):window.t?window.t('index.plan_badge.free').replace('{n}',days):title;}
      const count=document.getElementById('plans-days');if(count)count.textContent=days;
    }
    timer=setTimeout(render,Math.min(60000,Math.max(20,remaining*1000)));
  }
  function valid(next) {
    if(!next||typeof next.access!=='boolean'||!Number.isSafeInteger(next.server_now))return false;
    if(next.status==='paid')return next.access;
    if(next.status==='trial_expired'||next.status==='unverified')return !next.access;
    return next.status==='trial_active'&&next.access&&Number.isSafeInteger(next.trial_ends_at)&&Number.isSafeInteger(next.remaining_seconds)&&next.remaining_seconds>0&&next.remaining_seconds<=30*86400&&next.trial_ends_at-next.server_now===next.remaining_seconds;
  }
  async function publicStatus(id) {
    const r=await fetch(API+'/api/profile/load?id='+encodeURIComponent(id),{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(10000)}),d=await r.json();
    if(r.status===402&&d.code==='trial_expired')return {access:false,status:'trial_expired',server_now:Math.floor(Date.now()/1000)};
    if(!r.ok||d.doctorqr_id!==id||!MedicalOwner.matches(d.profile)||!valid(d.access_status))throw Error('public_status_unverified');
    return d.access_status;
  }
  async function verify(force=false) {
    if(busy)return busy;
    const id=own(),token=localStorage.getItem('doctorqr_token');if(!id){render();return false;}
    busy=(async()=>{
      lastFetch=Date.now();const requestedAt=lastFetch;
      try {
        let next;
        if(token){
          const r=await fetch(API+'/api/access/status',{cache:'no-store',credentials:'omit',headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(10000)});
          if(r.status===401)next=await publicStatus(id);
          else{const d=await r.json();if(!r.ok||d.doctorqr_id!==id||!valid(d))throw Error('status_unverified');next=d;}
        }else next=await publicStatus(id);
        if(own()!==id||token!==localStorage.getItem('doctorqr_token'))return false;
        // Count network time conservatively; a delayed response must not extend the trial.
        adopt(next,true,requestedAt);return next.access&&seconds()>0;
      }catch(_){
        if(own()!==id)return false;
        const saved=cache();if(saved)adopt(saved.state,false,saved.wall);else{state={access:false,status:'unverified'};render();}
        return !!state?.access&&seconds()>0;
      }finally{busy=null;}
    })();return busy;
  }
  async function ensure() {if(await verify(true))return true;lock(state?.status==='trial_expired'||(state?.status==='trial_active'&&seconds()<=0)?'expired':'unverified');return false;}
  window.TrialAccess={ensure,refresh:verify,get state(){return state},get remaining(){return seconds()}};
  document.addEventListener('DOMContentLoaded',()=>{
    nodes();const saved=cache();if(saved)adopt(saved.state,false,saved.wall);else render();
    const original=window.handleEmergencyQuickAccess;if(typeof original==='function')window.handleEmergencyQuickAccess=async function(){if(!MedicalOwner.read())return original();if(await ensure())return original();};
    if(editor||emergencyPage)verify();
    setInterval(()=>{if(!document.hidden&&(editor||emergencyPage))verify();},60000);
  });
  window.addEventListener('doctorqr:language-changed',()=>{previousTitle='';render();});
  window.addEventListener('online',()=>verify());
  window.addEventListener('pageshow',()=>{render();if(Date.now()-lastFetch>5000&&(editor||emergencyPage))verify();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();if(Date.now()-lastFetch>5000&&(editor||emergencyPage))verify();}});
})();
