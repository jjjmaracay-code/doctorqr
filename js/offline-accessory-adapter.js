/* Shared local preparation for existing accessory and wallpaper editors.
 * No URLs in generated payloads, profile writes, backend calls or QR-cache writes. */
(function () {
  'use strict';
  let loading;
  const labels={
    es:{consent:'Acepto que cualquiera pueda leer estos datos médicos impresos o al escanear el QR, sin conexión ni identificación.',sensitive:'Incluir VIH, hepatitis y tuberculosis si figuran en mis datos.',prepare:'Preparar QR sin conexión',waiting:'Acepta la lectura pública para preparar el accesorio.',working:'Adaptando los datos y comprobando el QR…',ready:'QR sin conexión preparado. Comprueba su lectura después de imprimir o colocarlo.',blocked:'No se puede conservar la información esencial y comprobar la lectura en este tamaño. Elige un formato mayor.',changed:'Los datos o el consentimiento han cambiado. Prepara el accesorio otra vez.',outside:'Información visible sin escanear',inside:'Información dentro del QR',omitted:'Datos que no caben',error:'No se ha podido preparar el QR sin conexión. Revisa tus datos y el contacto de emergencia.',title:'Información médica sin conexión'},
    en:{consent:'I accept that anyone can read these printed medical details or scan the QR offline without identification.',sensitive:'Include HIV, hepatitis and tuberculosis if present in my data.',prepare:'Prepare offline QR',waiting:'Accept public reading to prepare this accessory.',working:'Adapting data and checking the QR…',ready:'Offline QR prepared. Check it again after printing or setting it as wallpaper.',blocked:'Essential information cannot be retained and decoded at this size. Choose a larger format.',changed:'Data or consent changed. Prepare the accessory again.',outside:'Visible without scanning',inside:'Inside the QR',omitted:'Data that does not fit',error:'The offline QR could not be prepared. Check your saved data and emergency contact.',title:'Offline medical information'}
  };
  function words(language){return labels[language]||labels.en;}
  function script(src){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=src;el.onload=resolve;el.onerror=()=>{el.remove();reject(Error('offline_asset_unavailable'));};document.head.append(el);});}
  function ensure(){
    if(!loading)loading=(async()=>{
      if(!window.QRCode)await script('/vendor/qrcodejs/qrcode.min.js');
      if(!window.AtabeyOfflineEmergencyQR)await script('/js/offline-emergency-qr.js?v=5');
      await Promise.all([window.jsQR?null:script('/vendor/jsqr/jsQR.js'),window.ZXing?null:script('/vendor/zxing/index.min.js')]);
    })().catch(error=>{loading=null;throw error;});
    return loading;
  }
  const readers={
    jsqr:image=>window.jsQR(image.data,image.width,image.height)?.data,
    zxing:image=>{const gray=new Uint8ClampedArray(image.width*image.height);for(let i=0;i<gray.length;i++)gray[i]=image.data[i*4];return new window.ZXing.QRCodeReader().decode(new window.ZXing.BinaryBitmap(new window.ZXing.HybridBinarizer(new window.ZXing.RGBLuminanceSource(gray,image.width,image.height)))).getText();}
  };
  async function prepare(profile,support,layout,current=()=>true){
    await ensure();if(!current())throw Error('offline_cancelled');
    const api=window.AtabeyOfflineEmergencyQR,host=document.createElement('div');
    const result=await api.prepareOfflineEmergency(profile,support,async candidate=>{
      await new Promise(resolve=>setTimeout(resolve,0));if(!current())throw Error('offline_cancelled');
      return api.assessOfflineReadability(candidate,host,readers);
    },{layout});
    if(!current())throw Error('offline_cancelled');
    if(result.details.readability.status!=='simulation_pass')return {result,blocked:true};
    const template=api.renderOfflineTemplate(result,host,1600),image=api.renderOfflineQR(result.qrText,document.createElement('div'),1600);
    return {result,template,image:image.canvas,blocked:false};
  }
  function profile(source,consent,sensitive,contactKey){
    const p=JSON.parse(JSON.stringify(source));p.offline_qr_consent=consent===true;p.offline_qr_sensitive_consent=sensitive===true;
    // The selected complete contact has priority, but invalid entries never replace a valid one.
    if(contactKey&&/^ec[123]$/.test(contactKey)){
      const old=JSON.parse(JSON.stringify(p)),order=[contactKey,...['ec1','ec2','ec3'].filter(x=>x!==contactKey)];
      order.forEach((key,i)=>{for(const suffix of ['name','rel','phone_prefix','phone_num'])p['ec'+(i+1)+'_'+suffix]=old[key+'_'+suffix];});
    }
    return p;
  }
  function summary(result,language){const w=words(language);return [[w.outside,result.printed.join('\n')],[w.inside,result.qrText],[w.omitted,result.omitted.join('\n')||'—']];}
  function face(prepared,color){
    // Keep exact clinical text, square modules and quiet zone; recolour the surrounding surface only.
    const rgb=(color||'#111827').replace('#','').match(/../g)?.map(v=>parseInt(v,16)/255)||[0,0,0];
    const luminance=rgb.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0),ink=1.05/(luminance+.05)>=4.5?'#fff':'#000';
    return prepared.template.svg.replace('fill="#111827"','fill="'+(color||'#111827')+'"').replaceAll('fill="#f5f7fb"','fill="'+ink+'"').replaceAll('fill="#ff7b8b"','fill="'+ink+'"').replaceAll('fill="#ffd166"','fill="'+ink+'"');
  }
  function verifyRaster(canvas,bounds,text){
    for(const side of [Math.round(bounds.width),360,480]){
      const crop=document.createElement('canvas');crop.width=crop.height=side;
      const c=crop.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,side,side);c.drawImage(canvas,bounds.x,bounds.y,bounds.width,bounds.height,0,0,side,side);
      try{const image=c.getImageData(0,0,side,side);if(readers.jsqr(image)===text&&readers.zxing(image)===text)return true;}catch(_){}
    }return false;
  }
  function verified(result){return result&&!result.details.hasOmittedCritical&&result.details.readability.status==='simulation_pass';}
  window.AtabeyOfflineAccessories=Object.freeze({ensure,prepare,profile,summary,words,face,readers,verified,verifyRaster});
})();
