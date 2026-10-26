/* Approximate page openings by country only. No account, URL, cookies or storage IDs. */
(() => {
  'use strict';
  const pages=new Set(['/','/index','/index.html','/login','/login.html','/register','/register.html','/web','/web.html','/install','/install.html']);
  if(!pages.has(location.pathname)||navigator.doNotTrack==='1'||navigator.globalPrivacyControl||navigator.webdriver)return;
  async function report(){
    let country='ZZ';
    try{
      const response=await fetch('/cdn-cgi/trace',{credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(3500)});
      if(response.ok){const match=(await response.text()).match(/^loc=([A-Z]{2})\s*$/m);if(match&&match[1]!=='XX')country=match[1];}
    }catch(_){}
    try{await fetch('https://doctorqr-backend-production.up.railway.app/api/metrics/country',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({country}),credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',keepalive:true,signal:AbortSignal.timeout(3500)});}catch(_){}
  }
  if(document.readyState==='complete')void report();else window.addEventListener('load',report,{once:true});
})();
