/* Browser-held proof and mobile approval are independent. QR has no patient data. */
(function(){
 'use strict';
 const API='https://doctorqr-backend-production.up.railway.app/api/devices';
 const page=document.body.dataset.linkPage;
 let primaryIdentity=null;
 function samePrimary(){return primaryIdentity&&localStorage.getItem('doctorqr_token')===primaryIdentity.token&&localStorage.getItem('doctorqr_id')===primaryIdentity.id&&localStorage.getItem('doctorqr_user')===primaryIdentity.user;}

 const $=id=>document.getElementById(id);
 const status=text=>{$('link-status').textContent=text;};
 const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
 const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
 async function request(path,body,authenticated=false){
  const headers={'Content-Type':'application/json'};
  if(authenticated){if(!samePrimary())throw Error('La cuenta cambió. Cierra esta pantalla y vuelve a escanear desde la cuenta correcta.');headers.Authorization='Bearer '+primaryIdentity.token;}
  const r=await fetch(API+path,{method:body?'POST':'GET',headers,cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(12000),...(body?{body:JSON.stringify(body)}:{})});
  const data=await r.json().catch(()=>({}));if(authenticated&&!samePrimary())throw Error('La cuenta cambió durante la solicitud. Vuelve a abrir la vinculación.');if(!r.ok){const e=Error(data.error||'No se pudo conectar. Vuelve a intentarlo.');e.code=data.code;e.status=r.status;throw e;}return data;
 }
 function primary(){
  if(window.WebSession){status('Esta acción debe realizarse desde la aplicación principal del móvil.');return false;}
  let u;try{u=JSON.parse(localStorage.getItem('doctorqr_user')||'null');}catch(_){}
  if(!u||!localStorage.getItem('doctorqr_token')||u.twofa_method!=='totp'){
   status('Abre ATABEYAPP en este móvil e inicia sesión con tu autenticador. Después vuelve a «Vincular ordenador» y escanea un QR nuevo.');
   const a=document.createElement('a');a.href='/login.html';a.className='button';a.textContent='Iniciar sesión en la aplicación';$('link-status').after(a);return false;
  }
  primaryIdentity={token:localStorage.getItem('doctorqr_token'),id:localStorage.getItem('doctorqr_id'),user:localStorage.getItem('doctorqr_user')};
  $('link-account').textContent='Autorizarás el historial de: '+u.email;return true;
 }
 function validLink(value){try{const u=new URL(value);if(u.origin!=='https://atabeyapp.app'||u.pathname!=='/vincular.html'||u.search)return null;return /^[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(u.hash.slice(1))?u:null;}catch(_){return null;}}
 async function web(){
  let generation=0,timer=null;
  async function start(){
   const mine=++generation;clearTimeout(timer);$('link-qr').replaceChildren();$('confirmation').textContent='—';$('new-link').disabled=true;status('Preparando conexión segura…');
   const verifier=random(),poll_secret=random();let challenge;
   try{
    challenge=await request('/challenges',{poll_secret,proof_hash:await digest(verifier)});if(mine!==generation)return;
    const options={text:challenge.qr_url,width:380,height:380,colorDark:'#1475b8',colorLight:'#ffffff',visualStyle:'pulse',correctLevel:QRCode.CorrectLevel.M};
    const target=$('link-qr');target.style.removeProperty('padding');
    const rendered=window.AtabeyQR?.draw?AtabeyQR.draw(target,options):new QRCode(target,{...options,colorDark:'#08121e'});
    // Styled PNGs include their own quiet zone. The native fallback needs that margin in its container.
    if(!target.querySelector('img[data-qr-style]')){
     const count=rendered?._oQRCode?.getModuleCount();target.style.padding=(count?400/(count+8):14)+'%';
    }
    const image=$('link-qr').querySelector('img');if(image)image.alt='QR temporal para vincular este ordenador';
    $('confirmation').textContent=challenge.confirmation;
   }catch(e){if(mine===generation)status(e.message);$('new-link').disabled=false;return;}
   $('new-link').disabled=false;
   async function poll(){
    if(mine!==generation)return;
    const remaining=Math.ceil((challenge.expires-Date.now())/1000);
    if(remaining<=0){$('link-qr').replaceChildren();status('QR caducado. Genera otro para continuar.');return;}
    status('Esperando tu confirmación en el móvil · '+remaining+' s');
    try{
     const state=await request('/status',{id:challenge.id,poll_secret});if(mine!==generation)return;
     if(state.state==='approved'){
      const session=await request('/claim',{id:challenge.id,poll_secret,verifier});if(mine!==generation)return;
      if(!session.success||!session.user?.email||!session.doctorqr_id||!session.token)throw Error('El servidor no ha confirmado una sesión válida.');
      // Deliberately isolated from any account already open in localStorage on this computer.
      for(const key of Object.keys(sessionStorage))if(key.startsWith('doctorqr_')||key==='atabey_web_session')sessionStorage.removeItem(key);
      sessionStorage.setItem('doctorqr_token',session.token);sessionStorage.setItem('doctorqr_user',JSON.stringify(session.user));
      sessionStorage.setItem('doctorqr_id',session.doctorqr_id);sessionStorage.setItem('doctorqr_profile_owner',session.doctorqr_id);sessionStorage.setItem('atabey_web_session','1');
      location.replace('/index.html');return;
     }
    }catch(e){
     if(mine!==generation)return;
     if(e.status===401||e.status===410){$('link-qr').replaceChildren();status('Solicitud finalizada. Genera otro QR.');return;}
     status('Conexión interrumpida. Reintentando mientras el QR siga vigente…');
    }
    timer=setTimeout(poll,3000);
   }
   poll();
  }
  $('new-link').onclick=start;window.addEventListener('pagehide',()=>{generation++;clearTimeout(timer)});start();
 }
 async function devices(){
  if(!primary())return;
  async function refresh(){
   try{const {devices}=await request('/',null,true);const list=$('device-list');list.replaceChildren();if(!devices.length){list.textContent='No hay ordenadores vinculados activos.';return;}
    for(const device of devices){const box=document.createElement('article');box.className='device';const title=document.createElement('strong'),detail=document.createElement('p'),button=document.createElement('button');title.textContent=device.browser_label;detail.textContent='Vinculado: '+new Date(Number(device.created_at)).toLocaleString()+' · Última actividad: '+new Date(Number(device.last_seen)).toLocaleString();button.textContent='Cerrar acceso de este ordenador';button.className='secondary';button.onclick=async()=>{if(!confirm('¿Cerrar el acceso de '+device.browser_label+'? Sus cambios sin publicar no llegarán al servidor.'))return;button.disabled=true;try{await request('/revoke',{id:device.id},true);await refresh();status('Acceso cerrado.');}catch(e){status(e.message);button.disabled=false;}};box.append(title,detail,button);list.append(box);}
   }catch(e){status(e.message);}
  }
  let stream,frame=0,lastFrame=0,scanning=false;
  const video=$('scan-video'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
  function stop(){scanning=false;cancelAnimationFrame(frame);stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;$('scanner').hidden=true;}
  function decoded(text){const url=validLink(text);if(!url){status('Este no es un QR de vinculación de ATABEYAPP.');return false;}stop();location.href=url.href;return true;}
  function scan(now){
   if(!scanning)return;
   if(now-lastFrame>250&&video.readyState>=2&&window.jsQR){lastFrame=now;const scale=Math.min(1,800/video.videoWidth);canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);ctx.drawImage(video,0,0,canvas.width,canvas.height);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);const qr=jsQR(pixels.data,pixels.width,pixels.height,{inversionAttempts:'dontInvert'});if(qr&&decoded(qr.data))return;}
   frame=requestAnimationFrame(scan);
  }
  $('scan-start').onclick=async()=>{stop();$('scanner').hidden=false;try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});video.srcObject=stream;await video.play();scanning=true;frame=requestAnimationFrame(scan);status('Encuadra el QR del ordenador.');}catch(_){status('No se pudo abrir la cámara. Permite su uso en el navegador o selecciona una foto del QR.');}};
  $('scan-stop').onclick=stop;window.addEventListener('pagehide',stop);
  $('scan-image').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>10*1024*1024){status('La imagen es demasiado grande. Usa una foto de menos de 10 MB.');return;}try{const bitmap=await createImageBitmap(file);const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();const pixels=ctx.getImageData(0,0,canvas.width,canvas.height),qr=jsQR(pixels.data,pixels.width,pixels.height);if(!qr)throw Error();decoded(qr.data);}catch(_){status('No se pudo leer el QR de esa imagen. Prueba otra foto más nítida.');}finally{event.target.value='';}};
  $('refresh-devices').onclick=refresh;refresh();
 }
 async function approve(){
  const fragment=location.hash.slice(1);history.replaceState(null,'',location.pathname); // Never retain the approval secret in browser history/referrers.
  if(!primary())return;
  const pieces=fragment.split('.');if(pieces.length!==2||!/^[a-f0-9-]{36}$/.test(pieces[0])||!/^[a-f0-9]{64}$/.test(pieces[1])){status('QR no válido. Escanea uno nuevo desde el móvil.');return;}
  const [id,qr_secret]=pieces;
  let expires=0;
  try{const data=await request('/inspect',{id,qr_secret},true);if(data.account?.doctorqr_id!==primaryIdentity.id||data.account?.email?.toLowerCase()!==JSON.parse(primaryIdentity.user).email.toLowerCase())throw Error('La identidad de la sesión no coincide. Vuelve a iniciar sesión en la aplicación.');expires=Number(data.expires);$('browser-label').textContent=data.browser_label;$('confirmation').textContent=data.confirmation;$('approve-button').disabled=false;status('Comprueba el ordenador antes de autorizar.');}catch(e){status(e.message);return;}
  $('approve-form').onsubmit=async event=>{event.preventDefault();if(Date.now()>=expires){status('El QR ha caducado. Genera otro en el ordenador.');return;}
   $('approve-button').disabled=true;
   try{await request('/approve',{id,qr_secret,code:$('totp-input').value,confirmation:$('confirmation-input').value},true);$('totp-input').value='';$('approve-form').hidden=true;status('Ordenador autorizado. La sesión se abrirá allí en unos segundos. Puedes cerrar su acceso desde «Ordenadores vinculados».');}catch(e){$('totp-input').value='';status(e.code==='totp_already_used'?'Ese código ya se utilizó para una vinculación. Espera al siguiente código del autenticador.':e.code==='link_confirmation_invalid'?'Comprueba el número del ordenador y el código del autenticador.':e.message);$('approve-button').disabled=false;}
  };
 }
 if(page==='web')web();else if(page==='devices')devices();else if(page==='approve')approve();
})();
