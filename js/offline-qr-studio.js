/* Independent creation screen. Never writes the medical profile or QR caches. */
(function () {
  'use strict';
  const api=window.AtabeyOfflineEmergencyQR,$=id=>document.getElementById('offline-'+id);
  const sampleContact={ec1_name:'Maria Lopez Fernandez',ec1_rel:'Cónyuge/Pareja',ec1_phone_prefix:'+34',ec1_phone_num:'600123456'};
  const samples={
    scarce:{nombre:'Ana Perez Lopez',sangre:'B-',...sampleContact},
    moderate:{nombre:'Ana Perez Lopez',sangre:'A+',...sampleContact,allergy_med:['Ninguna conocida'],meds:['Ninguna'],anticoagulado:'No',dificultad_intubacion:'No',diseases:['Dermatitis atópica','Migraña'],ayudas_tecnicas:['Gafas'],tabaco:'No fumador'},
    full:{nombre:'Juan Antonio Perez Garcia',sangre:'O+',...sampleContact,allergy_med:['Penicilina','AINE'],allergy_food:['Cacahuetes'],allergy_env:['Polen'],allergy_insect:['Picadura avispa'],allergy_severity:{Penicilina:'Anafiláctica',Polen:'Leve'},anticoagulado:'SÍ — ANTICOAGULADO',dificultad_intubacion:'SÍ — intubación difícil documentada',pacemaker:'SÍ',dai:'SÍ — llevo DAI',stents:'Sí',diseases:['Diabetes T1','Asma','Dermatitis atópica','Hipotiroidismo'],conditions:['Bomba insulina','DIU'],meds:['Insulina','Warfarina','Levotiroxina'],epipen:'Sí — llevo EpiPen encima',glucagon:'Sí — lo tengo en casa',ayudas_tecnicas:['Gafas','Audífono'],comm_difficulty:['Sordera'],lang_spoken:['Español'],surgeries:['Apendicectomía'],tabaco:'No fumador',alcohol:'No consumo',fecha_nacimiento:'1985-04-19',weight:'70-90kg',vih:'Sí',hepatitis:'Sí',tuberculosis:'Sí — activa'}
  };
  let revision=0,ready=null;
  function own(){return localStorage.getItem('doctorqr_token')&&window.MedicalOwner?.current()?window.MedicalOwner.read():null;}
  const fingerprint=p=>JSON.stringify(p);
  function status(text,error=false){$('status').textContent=text;$('status').dataset.error=String(error);}
  function invalidate(){
    revision++;ready=null;$('front').replaceChildren();$('scratch').replaceChildren();
    for(const id of ['payload','printed','omitted','dimensions'])$(id).textContent='';
    $('output').hidden=true;$('png').disabled=$('svg').disabled=true;
    $('generate').disabled=!$('consent').checked;
  }
  function describeSource(){
    const available=!!own(),option=$('source').querySelector('option[value="own"]');
    option.disabled=!available;
    if($('source').value==='own'&&!available)$('source').value='moderate';
    $('source-note').textContent=$('source').value==='own'?
      'Se utilizarán tus últimos datos guardados. Si has editado el formulario, guarda y actualiza tus datos antes de crear este formato.':
      'DATOS FICTICIOS. Este ejemplo sirve para probar el diseño; no corresponde a tu historial. '+(!available?'Para usar tus datos, inicia sesión y guarda primero tu perfil médico.':'');
  }
  function changed(){invalidate();describeSource();status($('consent').checked?'Pulsa Preparar para comprobar este formato.':'Acepta la lectura pública de los datos para preparar el formato.');}
  const readers={
    jsqr:image=>window.jsQR(image.data,image.width,image.height)?.data,
    zxing:image=>{
      const gray=new Uint8ClampedArray(image.width*image.height);
      for(let i=0;i<gray.length;i++)gray[i]=image.data[i*4];
      return new window.ZXing.QRCodeReader().decode(new window.ZXing.BinaryBitmap(new window.ZXing.HybridBinarizer(new window.ZXing.RGBLuminanceSource(gray,image.width,image.height)))).getText();
    }
  };
  function isCurrent(item){
    return item&&item.revision===revision&&$('consent').checked&&item.source===$('source').value&&item.support===$('support').value&&
      item.sensitive===$('sensitive').checked&&(item.source!=='own'||fingerprint(own())===item.fingerprint);
  }
  function blockReason(reason){
    if(reason==='critical_data_omitted')return 'Este formato no permite conservar los datos críticos y superar la lectura. Elige una superficie mayor.';
    if(reason==='empty_qr')return 'No hay información adicional para incluir en el QR. Revisa tus datos guardados.';
    return 'El contacto completo no supera las dos lecturas de comprobación a este tamaño. Este formato no se descargará. Elige una superficie mayor.';
  }
  async function generate(){
    invalidate();if(!$('consent').checked)return;
    const token=revision,source=$('source').value,support=$('support').value,sensitive=$('sensitive').checked;
    const original=source==='own'?own():samples[source];
    if(!original){describeSource();status('No hay datos guardados de tu sesión. Vuelve al formulario para guardarlos.',true);return;}
    const snapshot=fingerprint(original),profile={...original,offline_qr_consent:true,offline_qr_sensitive_consent:sensitive};
    $('generate').disabled=true;status('Ajustando el contenido y comprobando la lectura…');
    try{
      const result=await api.prepareOfflineEmergency(profile,support,async candidate=>{
        await new Promise(resolve=>setTimeout(resolve,0));
        if(token!==revision)throw Error('cancelled');
        if(source==='own'&&fingerprint(own())!==snapshot)throw Error('profile_changed');
        return api.assessOfflineReadability(candidate,$('scratch'),readers);
      });
      if(token!==revision)return;
      $('scratch').replaceChildren();$('output').hidden=false;
      $('printed').textContent=result.printed.join('\n');$('payload').textContent=result.qrText;
      $('omitted').textContent=result.omitted.join('\n')||'NINGUNO';$('omitted-label').textContent='Datos que no caben: '+result.omitted.length;
      if(result.details.readability.status!=='simulation_pass'){
        $('front').textContent='No hay una imagen aprobada para descargar con esta combinación.';
        status(blockReason(result.details.readability.reason),true);return;
      }
      const front=api.renderOfflineTemplate(result,$('front'),1080);
      ready={revision:token,source,support,sensitive,fingerprint:snapshot,result,svg:front.svg};
      if(!isCurrent(ready)){changed();return;}
      $('dimensions').textContent='Frente: '+front.widthMm+' × '+front.heightMm+' mm. QR: '+api.LAYOUTS[support].qr+' mm. Vista ampliada.';
      $('png').disabled=$('svg').disabled=false;
      status((source==='own'?'':'EJEMPLO FICTICIO. ')+'El QR supera ambas lecturas automáticas con '+result.qrText.length+' caracteres. Comprueba también su lectura después de imprimir o colocar la imagen.');
    }catch(error){
      if(token!==revision)return;
      const known={offline_qr_contact_exceeds_limit:'El contacto completo es demasiado largo para el formato.',offline_qr_must_not_contain_a_link:'Hay un enlace en los datos seleccionados. Revisa ese texto: el QR sin cobertura solo admite información escrita.',offline_qr_unsupported_character:'Hay un símbolo que no se puede conservar con seguridad en este formato. Revisa los datos antes de generarlo.',profile_changed:'Tus datos han cambiado. Prepara de nuevo el formato.'};
      status(known[error.message]||'No se ha podido verificar este formato. Revisa tus datos o prueba otra superficie.',true);
    }finally{if(token===revision){$('generate').disabled=!$('consent').checked;$('scratch').replaceChildren();}}
  }
  function save(blob,ext,item){
    if(!isCurrent(item)){changed();status('Los datos o el consentimiento han cambiado. Prepara de nuevo el formato.',true);return;}
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;
    link.download=(item.source==='own'?'ATABEYAPP-':'EJEMPLO-FICTICIO-')+item.support+'.'+ext;
    link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  async function png(){
    const item=ready;if(!isCurrent(item)){changed();return;}
    $('png').disabled=true;status('Preparando y comprobando la imagen…');
    try{
      const image=new Image();image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(item.svg);await image.decode();
      if(!isCurrent(item))return;
      const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=Math.round(1080*image.height/image.width);
      const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,canvas.width,canvas.height);
      const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
      if(readers.zxing(pixels)!==item.result.qrText||readers.jsqr(pixels)!==item.result.qrText)throw Error('png_unreadable');
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      if(!blob)throw Error('png_unavailable');save(blob,'png',item);
      if(isCurrent(item))status('Imagen preparada y comprobada. Conserva su tamaño y revisa la lectura al utilizarla.');
    }catch(_){if(isCurrent(item))status('No se ha podido comprobar la imagen PNG. Puedes probar la descarga para imprimir o elegir otra superficie.',true);}
    finally{if(isCurrent(item))$('png').disabled=false;}
  }
  $('generate').addEventListener('click',generate);$('png').addEventListener('click',png);
  $('svg').addEventListener('click',()=>{if(isCurrent(ready))save(new Blob([ready.svg],{type:'image/svg+xml'}),'svg',ready);else changed();});
  for(const id of ['source','support','consent','sensitive'])$(id).addEventListener('change',changed);
  window.addEventListener('doctorqr:account-invalidated',invalidate);
  window.addEventListener('storage',e=>{if($('source').value==='own'&&(e.key==='doctorqr_profile'||e.key===null))changed();});
  window.addEventListener('pageshow',()=>{if(ready&&!isCurrent(ready))changed();});
  describeSource();
  if('serviceWorker'in navigator)navigator.serviceWorker.getRegistration('/').then(reg=>{
    if(!reg&&navigator.onLine)return navigator.serviceWorker.register('/sw.js');
  }).catch(()=>{});
})();
