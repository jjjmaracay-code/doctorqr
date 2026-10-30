(function(){'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const A=window.AccountTools;if(!A)return;
 const stamp=()=>JSON.stringify(['doctorqr_id','doctorqr_token','doctorqr_user'].map(k=>localStorage.getItem(k)));
 const unchanged=value=>{if(value!==stamp())throw Object.assign(Error('account_changed'),{code:'context_changed'});};
 const login=document.getElementById('passkey-login');
 if(login){
  login.hidden=!A.supported();
  login.onclick=()=>A.run(login,document.getElementById('passkey-login-status'),async()=>{
   const normal=document.getElementById('btn-login');if(normal.disabled)return;
   const initial=stamp();normal.disabled=true;window.passkeyLoginBusy=true;let attempt;
   try {
    const start=await A.request('atabey','login/options');unchanged(initial);
    const credential=await SimpleWebAuthnBrowser.startAuthentication({optionsJSON:start.options});unchanged(initial);
    attempt=beginLoginVerification();if(!attempt)return;
    const result=await A.request('atabey','login/verify',{challenge_id:start.challenge_id,credential},'passkeys',attempt.controller.signal);
    assertLoginVerification(attempt);if(!result.success||result.user?.twofa_method!=='totp')throw Error('invalid_session');
    guardarSesionYRedirigir(result,attempt);
   }catch(e){if(e?.name!=='NotAllowedError'&&e?.name!=='AbortError')throw e;}
   finally{if(attempt)finishLoginVerification(attempt);normal.disabled=false;window.passkeyLoginBusy=false;}
  });
 }
 const panel=document.getElementById('account-access-tools');
 if(!panel || window.WebSession || !window.MedicalOwner?.current())return;
 const status=panel.querySelector('[role="status"]'),enable=document.getElementById('passkey-enable'),remove=document.getElementById('passkey-remove');let keys=[];
 async function call(path,body={}){
  const initial=stamp();let result;
  try{result=await A.request('atabey',path,body);}catch(e){
   if(e.code!=='reauth_required')throw e;
   const code=await A.prompt('totp','totp');unchanged(initial);if(code===null)return null;
   result=await A.request('atabey',path,{...body,code});
  }
  unchanged(initial);return result;
 }
 async function refresh(){
  const data=await call('list');keys=data?.keys||[];
  remove.hidden=!keys.length;enable.hidden=!A.supported();
  if(keys.length)A.message(status,'active');
 }
 panel.addEventListener('toggle',()=>{if(panel.open)refresh().catch(()=>A.message(status,'failure'));});
 enable.onclick=()=>A.run(enable,status,async()=>{
  const initial=stamp(),start=await call('register/options');if(!start)return;
  const credential=await SimpleWebAuthnBrowser.startRegistration({optionsJSON:start.options});unchanged(initial);
  const done=await call('register/verify',{challenge_id:start.challenge_id,credential});if(!done)return;
  await refresh();A.message(status,'enabled');
 });
 remove.onclick=()=>A.run(remove,status,async()=>{
  const initial=stamp();if(!await A.prompt('remove'))return;unchanged(initial);
  for(const key of keys){if(!await call('remove',{credential_id:key.id}))return;unchanged(initial);}
  await refresh();status.textContent='';
 });
});
})();
