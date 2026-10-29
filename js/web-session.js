/* Linked computers use tab storage, never the mobile account's persistent storage. */
(function(){
 'use strict';
 if(sessionStorage.getItem('atabey_web_session')!=='1')return;
 const store=sessionStorage;
 document.documentElement.dataset.webLinked='true';
 const css=document.createElement('link');css.rel='stylesheet';css.href='/css/web-editor.css?v=15';document.head.append(css);
 Object.defineProperty(window,'localStorage',{configurable:true,value:store});
 const API='https://doctorqr-backend-production.up.railway.app';
 const nativeFetch=window.fetch.bind(window);
 let ended=false,lastActivity=Date.now(),lastHeartbeat=0,overlay;
 document.documentElement.style.visibility='hidden';
 const token=store.getItem('doctorqr_token');
 function identity(){try{const u=JSON.parse(store.getItem('doctorqr_user')||'{}');return JSON.stringify([store.getItem('doctorqr_id'),u.nombre,u.apellidos,u.email,u.doc_type,u.doc_number,u.fecha_nacimiento]);}catch(_){return '';}}
 const initialIdentity=identity();
 const current=()=>store.getItem('doctorqr_token')===token&&identity()===initialIdentity;
 function clear(){for(const key of Object.keys(store))if(key.startsWith('doctorqr_')||key==='atabey_web_session')store.removeItem(key);}
 function lock(message){
  document.documentElement.style.visibility='hidden';
  if(!document.body)return;
  if(!overlay){overlay=document.createElement('div');overlay.setAttribute('role','alert');overlay.style.cssText='visibility:visible;position:fixed;inset:0;z-index:2147483647;display:grid;place-content:center;gap:20px;padding:28px;text-align:center;background:#071626;color:#fff;font:18px/1.6 system-ui';const p=document.createElement('p'),b=document.createElement('button');b.textContent='Volver a comprobar';b.style.cssText='padding:15px;font:inherit;cursor:pointer';b.onclick=()=>check();overlay.append(p,b);document.body.append(overlay);}
  overlay.firstChild.textContent=message;
 }
 function end(){if(ended)return;ended=true;document.documentElement.style.visibility='hidden';if(current())clear();location.replace('/web.html?sesion=finalizada');}
 async function check(){
  if(ended)return false;
  if(!current()){end();return false;}
  if(Date.now()-lastActivity>15*60000){await logout();return false;}
  try{const r=await nativeFetch(API+'/api/devices/current',{cache:'no-store',credentials:'omit',headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(10000)});
   if(ended||!current()){end();return false;}
   if(r.status===401||r.status===403){end();return false;}
   if(!r.ok)throw Error();const d=await r.json();if(ended||!current()){end();return false;}if(!d.linked){end();return false;}
   overlay?.remove();overlay=null;document.documentElement.style.visibility='';return true;
  }catch(_){if(!current()){end();return false;}lock('Conexión interrumpida. La información médica queda bloqueada hasta verificar de nuevo la sesión. Los cambios pendientes de esta pestaña se conservan.');return false;}
 }
 async function logout(){try{await nativeFetch(API+'/api/devices/logout',{method:'POST',credentials:'omit',headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(5000)});}catch(_){}end();}
 // Existing profile requests retain their identity/revision checks. No backend cookies from another account.
 window.fetch=async(input,init={})=>{
  const url=typeof input==='string'?new URL(input,location.href):new URL(input.url);
  if(url.origin===API){if(ended||!current()){end();throw Error('Sesión finalizada');}if(url.pathname.startsWith('/api/profile/')&&!(await ready))throw Error('Sesión web bloqueada hasta verificar la conexión');const r=await nativeFetch(input,{...init,credentials:'omit'});if(ended||!current()){end();throw Error('La sesión cambió. La respuesta anterior se ha descartado.');}if(r.status===401)end();return r;}
  return nativeFetch(input,init);
 };
 const ready=check();
 window.WebSession={ready,logout,check};
 document.addEventListener('DOMContentLoaded',()=>{
  if(document.body.dataset.atabeyUi==='editor'){const banner=document.createElement('aside');banner.className='web-session-banner';const text=document.createElement('span'),button=document.createElement('button');text.textContent='Sesión web vinculada · Cambios sincronizados al guardar · Cierre por inactividad';button.type='button';button.textContent='Cerrar acceso web';button.onclick=logout;banner.append(text,button);document.body.prepend(banner);}
  // Security/account changes belong to the primary application, not the delegated session.
  for(const id of ['btn-logout']){const b=document.getElementById(id);if(b)b.onclick=logout;}
  document.querySelectorAll('[data-primary-only]').forEach(e=>{e.hidden=true;e.style.display='none';});
  check();
 });
 for(const name of ['pointerdown','keydown','input'])document.addEventListener(name,event=>{
  if(!event.isTrusted||ended)return;lastActivity=Date.now();
  if(Date.now()-lastHeartbeat<60000)return;lastHeartbeat=Date.now();
  nativeFetch(API+'/api/devices/activity',{method:'POST',credentials:'omit',headers:{Authorization:'Bearer '+token}}).then(r=>{if(r.status===401)end();}).catch(()=>{});
 },{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)lock('Sesión protegida.');else check();});
 window.addEventListener('pagehide',()=>lock('Sesión protegida.'));
 window.addEventListener('pageshow',()=>{if(store.getItem('doctorqr_token')!==token){ended=false;end();}else check();});
 window.addEventListener('offline',()=>lock('Sin conexión. Reconecta para acceder a tus datos médicos.'));
 window.addEventListener('online',check);
 setInterval(check,30000);
})();
