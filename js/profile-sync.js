/* Owner-bound drafts; changed fields merge atomically into the latest server snapshot. */
(function () {
  'use strict';
  const API='https://doctorqr-backend-production.up.railway.app/api/profile/';
  const DRAFT='doctorqr_medical_changes',LEGACY_DRAFT='doctorqr_medical_draft',META='doctorqr_profile_revision';
  const identityKeys=new Set(['nombre','apellidos','name','email','doc_type','doc_number','dni','fecha_nacimiento','birthdate','updated_at','ts','qr','id','doctorqr_id','created_at','plan_type','twofa_method','token','password','password_hash','totp_secret','snapshot_token','base_revision']);
  let baseRevision='',snapshotToken='',serverProfile=null,pendingChanges={},working=null;
  let busy=false,checking=false,message='',formReader=null,formWriter=null,formBaseline=null,queued=false,readSequence=0,lastCheckedAt=0,identityRejected=false;
  const requests=new Set();
  const owner=()=>window.MedicalOwner;
  const hex=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
  const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'null');}catch(_){return null;}};
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  function stable(value){if(Array.isArray(value))return value.map(stable);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));return value;}
  const same=(a,b)=>JSON.stringify(stable(a))===JSON.stringify(stable(b));
  const empty=value=>value===undefined||value===null||value===''||(Array.isArray(value)&&!value.length)||(value&&typeof value==='object'&&!Object.keys(value).length);
  function clinical(profile){return Object.fromEntries(Object.entries(profile||{}).filter(([key])=>/^[a-z][a-z0-9_]{0,79}$/.test(key)&&!identityKeys.has(key)&&!['constructor','prototype'].includes(key)));}
  function owned(record){return owner()?.current()&&record?.owner===owner().id()&&record.profile&&owner().matches(record.profile);}
  const cached=read(META);
  if(owner()?.current()&&cached?.owner===owner().id()&&hex(cached.revision)&&hex(cached.snapshot_token)){baseRevision=cached.revision;snapshotToken=cached.snapshot_token;}
  const saved=read(DRAFT);
  if(owned(saved)&&saved.format===2&&saved.changes&&typeof saved.changes==='object'&&!Array.isArray(saved.changes)){pendingChanges=clinical(saved.changes);working=saved.profile;}
  const copy={
    es:['Última versión sincronizada. Los cambios sin guardar de este dispositivo se conservan.','Sin cambios nuevos. Se mantiene la última versión guardada.','Actualizar','Sincronizando…'],
    en:['Latest version synchronized. Unsaved edits on this device are kept.','No new changes. The latest saved version is kept.','Refresh','Synchronizing…'],
    fr:['Dernière version synchronisée. Les modifications non enregistrées sont conservées.','Aucune nouvelle modification. La dernière version enregistrée est conservée.','Actualiser','Synchronisation…'],
    de:['Neueste Version synchronisiert. Ungespeicherte Änderungen bleiben erhalten.','Keine neuen Änderungen. Die zuletzt gespeicherte Version bleibt erhalten.','Aktualisieren','Synchronisieren…'],
    pt:['Última versão sincronizada. As alterações não guardadas são conservadas.','Sem alterações novas. Mantém-se a última versão guardada.','Atualizar','A sincronizar…'],
    eu:['Azken bertsioa sinkronizatuta. Gailuko gorde gabeko aldaketak mantendu dira.','Ez dago aldaketa berririk. Gordetako azken bertsioa mantentzen da.','Eguneratu','Sinkronizatzen…'],
    hi:['नवीनतम संस्करण सिंक हो गया है। इस डिवाइस के बिना सहेजे बदलाव सुरक्षित हैं।','कोई नया बदलाव नहीं। अंतिम सहेजा गया संस्करण सुरक्षित है।','अपडेट करें','सिंक हो रहा है…'],
    zh:['已同步最新版本，并保留本设备尚未保存的修改。','没有新修改，保留最新保存的版本。','刷新','正在同步…'],
    ru:['Последняя версия синхронизирована. Несохранённые изменения сохранены.','Новых изменений нет. Сохранена последняя записанная версия.','Обновить','Синхронизация…'],
    ja:['最新の情報を同期しました。この端末の未保存の変更は保持されます。','新しい変更はありません。最後に保存した情報を保持します。','更新','同期中…'],
    ar:['تمت مزامنة أحدث نسخة مع الاحتفاظ بالتعديلات غير المحفوظة على هذا الجهاز.','لا توجد تغييرات جديدة. تم الاحتفاظ بآخر نسخة محفوظة.','تحديث','جارٍ المزامنة…']
  };
  const text=()=>copy[window.currentLanguage||document.documentElement.lang]||copy.es;
  const ui=(key,fallback)=>typeof window.uiMessage==='function'?window.uiMessage(key,fallback):fallback;
  function render(){
    const panel=document.getElementById('profile-sync-panel');if(!panel)return;
    panel.hidden=!message;document.getElementById('profile-sync-message').textContent=message;
    const choices=document.getElementById('profile-sync-choices');if(choices)choices.hidden=true;
    const refresh=document.getElementById('profile-sync-refresh');if(refresh){refresh.disabled=busy||checking;refresh.textContent=checking?text()[3]:text()[2];refresh.setAttribute('aria-busy',String(checking));}
  }
  function notify(value){message=value;render();}
  function draft(){return owner()?.current()&&Object.keys(pendingChanges).length&&working&&owner().matches(working)?{format:2,owner:owner().id(),profile:clone(working),changes:clone(pendingChanges),base_revision:baseRevision}:null;}
  function persist(){
    if(identityRejected||!owner()?.current())return false;
    const d=draft();
    try{if(d)localStorage.setItem(DRAFT,JSON.stringify({...d,edited_at:Date.now()}));else localStorage.removeItem(DRAFT);return true;}
    catch(_){notify('No se pudo conservar una copia local. Mantén esta pestaña abierta y guarda cuando tengas conexión.');return false;}
  }
  function collect(profile){
    if(identityRejected||!owner()?.current()||!owner().matches(profile))return false;
    const current=clinical(profile),baseline=formBaseline||clinical(serverProfile),changes={...pendingChanges};
    for(const key of new Set([...Object.keys(changes),...Object.keys(baseline),...Object.keys(current)])){
      if(!Object.prototype.hasOwnProperty.call(changes,key)&&same(current[key],baseline[key]))continue;
      const value=Object.prototype.hasOwnProperty.call(current,key)?current[key]:null;
      if(same(value,serverProfile?.[key])||(empty(value)&&empty(serverProfile?.[key])))delete changes[key];else changes[key]=clone(value);
    }
    pendingChanges=changes;working=clone(profile);return true;
  }
  function saveDraft(profile){if(!collect(profile))return false;const ok=persist();if(ok&&!busy)notify(Object.keys(pendingChanges).length?ui('extra.5a8bd95ec7271930','Borrador conservado en este dispositivo. Pulsa Guardar y actualizar mis QR para publicarlo.'):text()[1]);return ok;}
  function checked(data){
    if(!owner()?.current())throw Error('La sesión cambió. La respuesta anterior se ha descartado.');
    const reject=message=>{identityRejected=true;owner().clearPublished();throw Object.assign(Error(message),{identityRejected:true});};
    if(!data||data.doctorqr_id!==owner().id()||!hex(data.profile_revision)||!hex(data.snapshot_token))reject('No se pudo verificar la versión de tus datos médicos. Actualiza la aplicación y vuelve a intentarlo.');
    if((data.profile&&!owner().matches(data.profile))||(data.review_profile&&!owner().matches(data.review_profile)))reject('La identidad del perfil no coincide con tu cuenta.');identityRejected=false;return data;
  }
  async function request(path,payload){
    if(!owner()?.current())throw Error('La sesión cambió. Vuelve a entrar antes de guardar.');
    const token=localStorage.getItem('doctorqr_token'),id=owner().id();
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);requests.add(controller);
    try{
      const res=await fetch(API+path,{method:payload?'POST':'GET',credentials:'include',cache:'no-store',signal:controller.signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(payload?{body:JSON.stringify(payload)}:{})});
      const data=await res.json().catch(()=>({error:'Respuesta no válida del servidor.'}));
      if(!owner().current()||id!==owner().id()||token!==localStorage.getItem('doctorqr_token'))throw Error('La sesión cambió. La respuesta anterior se ha descartado.');
      if([401,403].includes(res.status)){identityRejected=true;owner().clearPublished();}return{res,data};
    }finally{clearTimeout(timeout);requests.delete(controller);}
  }
  function setMetadata(data){baseRevision=data.profile_revision;snapshotToken=data.snapshot_token;try{localStorage.setItem(META,JSON.stringify({owner:owner().id(),revision:baseRevision,snapshot_token:snapshotToken}));}catch(_){} }
  const editing=()=>{const el=document.activeElement;return !!el&&(el.matches('input,select,textarea')||el.isContentEditable);};
  function applyForm(){
    if(identityRejected||!formWriter||!owner()?.current())return;if(editing()){queued=true;return;}
    if(formReader)collect(formReader());working=serverProfile?{...serverProfile,...pendingChanges}:working;
    formWriter(clone(working));formBaseline=clinical(formReader());queued=false;persist();
  }
  function connectForm(reader,writer){formReader=reader;formWriter=writer;if(identityRejected)return;formBaseline=serverProfile?clinical(reader()):{};collect(reader());persist();}
  function adopt(data){
    serverProfile=data.profile?clone(data.profile):null;setMetadata(data);
    if(serverProfile)owner().write({...serverProfile,updated_at:data.updated_at});else{localStorage.removeItem('doctorqr_profile');localStorage.removeItem('doctorqr_qr_cache');}
    for(const key of Object.keys(pendingChanges))if(same(pendingChanges[key],serverProfile?.[key])||(empty(pendingChanges[key])&&empty(serverProfile?.[key])))delete pendingChanges[key];
    working=serverProfile?{...serverProfile,...pendingChanges}:working;persist();
  }
  async function load(){
    if(!owner()?.current())return null;
    const sequence=++readSequence,legacy=read(LEGACY_DRAFT),cachedProfile=owner()?.read();
    try{
      const {res,data:raw}=await request('me');if(!owner()?.current())return null;if(sequence!==readSequence)return clone(working);
      if(![200,404,409].includes(res.status)){
        if([401,403,402].includes(res.status)){notify(raw.error||'Vuelve a identificarte para verificar tus datos médicos.');return null;}
        throw Error(raw.error||'No se pudieron cargar tus datos médicos.');
      }
      let data;try{data=checked(raw);}catch(error){owner().clearPublished();throw Object.assign(error,{identityRejected:true});}
      if(!data.profile&&!working)working=clone(data.review_profile||(owned(legacy)?legacy.profile:res.status===404?cachedProfile:null));adopt(data);
      notify(Object.keys(pendingChanges).length?ui('extra.3a85c7c6e26f3266','Tienes un borrador local pendiente de publicar. La lectura del QR utiliza la última versión confirmada.'):data.profile?ui('extra.2628e7f8db8b14b8','Perfil cargado desde el servidor.'):working?ui('extra.9378f9ae23004ccf','Tu borrador está recuperado. Revisa los datos y pulsa Guardar y actualizar mis QR para publicar un perfil verificado.'):ui('extra.b53b993669905ab3','Completa tu perfil y publícalo. El perfil anterior no se mostrará si su identidad no coincide.'));
      return clone(working);
    }catch(error){if(!owner()?.current())return null;if(sequence!==readSequence)return clone(working);if(error.identityRejected){notify(error.message);return null;}serverProfile=cachedProfile||null;working=serverProfile?{...serverProfile,...pendingChanges}:working||(owned(legacy)?legacy.profile:null);notify(error.message+' Tu borrador local se conserva.');return clone(working);}
  }
  async function save(profile){
    if(busy)return{success:false};if(!collect(profile)){notify(identityRejected?'Vuelve a entrar antes de guardar. Tu borrador se conserva.':'La identidad del borrador no coincide con tu sesión.');return{success:false};}
    persist();busy=true;++readSequence;const submitted=clone(profile),sent=clone(pendingChanges);
    try{
      if(!hex(baseRevision)||!hex(snapshotToken)){await load();throw Error('Se cargó la última versión. Revisa tus datos antes de guardar.');}
      notify(ui('extra.f99bd7d05938dac1','Publicando y verificando el guardado en el servidor…'));
      const identity=Object.fromEntries(['nombre','apellidos','name','email','doc_type','doc_number','dni','fecha_nacimiento','birthdate','_account_id'].filter(key=>Object.prototype.hasOwnProperty.call(profile,key)).map(key=>[key,profile[key]]));
      const {res,data:raw}=await request('save',{profile:identity,changes:sent,doctorqr_id:owner().id(),base_revision:baseRevision,snapshot_token:snapshotToken});
      if(!res.ok)throw Error(raw.error||'No se pudo confirmar el guardado.');const data=checked(raw);if(!data.success)throw Error('El servidor no confirmó el guardado.');
      const latest=clinical(formReader?formReader():working),original=clinical(submitted),later={};
      for(const key of new Set([...Object.keys(original),...Object.keys(latest)]))if(!same(original[key],latest[key]))later[key]=Object.prototype.hasOwnProperty.call(latest,key)?clone(latest[key]):null;
      pendingChanges=later;adopt(data);applyForm();
      notify(Object.keys(pendingChanges).length?ui('extra.eb9b60d1d1f0bd5c','Se publicó la versión enviada. Hay cambios posteriores en tu borrador pendientes de publicar.'):data.changed===false?text()[1]:ui('extra.ffc66ed80c2c2ad1','Guardado en el servidor. Tus QR consultan esta versión verificada.'));
      if(data.profile)window.dispatchEvent(new CustomEvent('doctorqr:profile-published',{detail:{profile:data.profile,pendingDraft:!!draft(),changed:data.changed!==false}}));return{success:true,changed:data.changed!==false};
    }catch(error){notify(error.message+' Los cambios de este dispositivo se conservan para volver a intentarlo.');return{success:false};}finally{busy=false;render();}
  }
  async function checkRemote(manual=false){
    if(document.hidden||busy||checking||!owner()?.current()||(!manual&&(editing()||Date.now()-lastCheckedAt<60000)))return false;
    lastCheckedAt=Date.now();
    if(formReader)collect(formReader());const initial=baseRevision,sequence=++readSequence;checking=true;render();
    try{
      const {res,data:raw}=await request('me');if(![200,404,409].includes(res.status))throw Error(raw.error||'No se pudo sincronizar tus datos médicos.');const data=checked(raw);
      if(busy||initial!==baseRevision||sequence!==readSequence)return false;const changed=data.profile_revision!==baseRevision;adopt(data);applyForm();
      notify(changed?text()[0]:Object.keys(pendingChanges).length?ui('extra.3a85c7c6e26f3266','Tienes un borrador local pendiente de publicar. La lectura del QR utiliza la última versión confirmada.'):text()[1]);
      if(changed&&data.profile)window.dispatchEvent(new CustomEvent('doctorqr:profile-synchronized',{detail:{profile:data.profile,pendingDraft:!!draft()}}));return true;
    }catch(error){if(manual)notify(error.message+' Tu borrador se conserva.');return false;}finally{checking=false;render();}
  }
  window.addEventListener('doctorqr:account-invalidated',()=>{
    ++readSequence;for(const request of requests)request.abort();requests.clear();
    baseRevision='';snapshotToken='';serverProfile=null;working=null;pendingChanges={};formBaseline=null;queued=false;
  });
  window.ProfileSync={load,save,saveDraft,draft,render,connectForm,checkRemote,inspectConflict:()=>checkRemote(true),get revision(){return baseRevision;}};
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('profile-sync-choices')?.replaceChildren();const refresh=document.createElement('button');refresh.type='button';refresh.id='profile-sync-refresh';
    refresh.style.cssText='padding:12px 16px;margin:8px 0;border:1px solid #77c7ff;border-radius:10px;background:#183e5e;color:#f2f9ff;font:inherit;cursor:pointer';refresh.addEventListener('click',()=>checkRemote(true));document.getElementById('profile-sync-panel')?.appendChild(refresh);render();setInterval(()=>checkRemote(),60000);
  });
  window.addEventListener('focus',()=>checkRemote());window.addEventListener('online',()=>checkRemote());
  window.addEventListener('storage',event=>{if(event.key===META||event.key==='doctorqr_profile')checkRemote();});window.addEventListener('doctorqr:language-changed',render);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkRemote();});
  document.addEventListener('focusout',()=>setTimeout(()=>{if(queued)applyForm();else checkRemote();},0));
})();
