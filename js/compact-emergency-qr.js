/* Owner-bound compact references and isolated square/liquid accessory renderers.
   Does not change existing card URLs, medical payloads or the decorative application QR. */
(function(){
  'use strict';
  const API='https://doctorqr-backend-production.up.railway.app/api/profile/emergency-link';
  const CACHE='doctorqr_emergency_link',BASE='https://atabeyapp.app/e/';
  const tokenOK=t=>typeof t==='string'&&/^[A-Za-z0-9_-]{16}$/.test(t);
  function render(url,maxVersion=40,style='square'){
    if(!['square','liquid'].includes(style))throw Error('accessory_qr_style');
    if(typeof url!=='string'||url.length>1024||typeof QRCode!=='function')throw Error('accessory_qr_unavailable');
    const host=document.createElement('div'),qr=new QRCode(host,{text:'',width:444,height:444,correctLevel:QRCode.CorrectLevel.M});
    const drawing=qr._oDrawing,draw=drawing?.draw;if(typeof draw==='function')drawing.draw=()=>{};
    try{qr.makeCode(url);}finally{if(typeof draw==='function')drawing.draw=draw;}
    const matrix=qr._oQRCode;
    // This bundled legacy encoder overestimates ASCII by three UTF-8 bytes.
    // Rebuild this isolated matrix at the actual 42-byte version-3/M capacity;
    // never alter the shared encoder, discard data or shrink non-ASCII payloads.
    if(maxVersion===3&&/^[\x20-\x7e]{1,42}$/.test(url)&&matrix.typeNumber>3){matrix.typeNumber=3;matrix.dataCache=null;matrix.make();}
    const count=matrix.getModuleCount(),version=(count-17)/4;
    if(!Number.isInteger(version)||version<1||version>maxVersion)throw Error('accessory_qr_too_dense');
    const cell=12,canvas=document.createElement('canvas');canvas.width=canvas.height=(count+8)*cell;
    const ctx=canvas.getContext('2d');if(!ctx)throw Error('accessory_qr_unavailable');
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#000000';
    const dark=(r,c)=>r>=0&&c>=0&&r<count&&c<count&&matrix.isDark(r,c);
    // Liquid styling is limited to compact version 1–3 references. Preserve every
    // function pattern and every data-cell centre; never paint in a light cell.
    const functional=(r,c)=>(r<9&&c<9)||(r<9&&c>=count-8)||(r>=count-8&&c<9)||r===6||c===6||
      (version>=2&&r>=count-9&&r<=count-5&&c>=count-9&&c<=count-5);
    if(style==='liquid'&&version>3)throw Error('accessory_qr_too_dense');
    for(let r=0;r<count;r++)for(let c=0;c<count;c++)if(dark(r,c)){
      const x=(c+4)*cell,y=(r+4)*cell;
      if(style==='square'||functional(r,c)){ctx.fillRect(x,y,cell,cell);continue;}
      const radius=cell*.45;
      ctx.beginPath();ctx.moveTo(x+radius,y);
      ctx.arcTo(x+cell,y,x+cell,y+cell,radius);ctx.arcTo(x+cell,y+cell,x,y+cell,radius);
      ctx.arcTo(x,y+cell,x,y,radius);ctx.arcTo(x,y,x+cell,y,radius);ctx.closePath();ctx.fill();
      if(dark(r-1,c))ctx.fillRect(x,y,cell,cell/2);
      if(dark(r+1,c))ctx.fillRect(x,y+cell/2,cell,cell/2);
      if(dark(r,c-1))ctx.fillRect(x,y,cell/2,cell);
      if(dark(r,c+1))ctx.fillRect(x+cell/2,y,cell/2,cell);
    }
    return Object.freeze({image:canvas.toDataURL('image/png'),url,version,modules:count,quietZone:4,correction:'M',style});
  }
  function reference(value,id,revision){return value?.owner===id&&value.revision===revision&&tokenOK(value.token)&&value.url===BASE+value.token;}
  async function prepare({id,revision,current}){
    if(typeof current!=='function'||!current()||typeof id!=='string'||!id||!/^[a-f0-9]{64}$/.test(revision||''))throw Error('accessory_context_changed');
    let saved;try{saved=JSON.parse(localStorage.getItem(CACHE)||'null');}catch(_){}
    if(reference(saved,id,revision)){if(!current())throw Error('accessory_context_changed');return render(saved.url,3);}
    const session=localStorage.getItem('doctorqr_token');if(!session)throw Error('accessory_context_changed');
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
    try{
      const r=await fetch(API,{method:'POST',credentials:'include',cache:'no-store',signal:controller.signal,
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+session},body:JSON.stringify({doctorqr_id:id,profile_revision:revision})});
      if(!r.ok)throw Error('accessory_reference_unavailable');
      const data=await r.json();
      if(!current()||session!==localStorage.getItem('doctorqr_token')||data.doctorqr_id!==id||data.profile_revision!==revision||!tokenOK(data.token)||data.url!==BASE+data.token)throw Error('accessory_context_changed');
      const result=render(data.url,3);
      if(!current())throw Error('accessory_context_changed');
      try{localStorage.setItem(CACHE,JSON.stringify({owner:id,revision,token:data.token,url:data.url}));}catch(_){}
      return result;
    }finally{clearTimeout(timeout);}
  }
  window.AtabeyCompactEmergencyQR=Object.freeze({render,prepare});
})();
