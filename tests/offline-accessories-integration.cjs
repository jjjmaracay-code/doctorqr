'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright'),{PNG}=require('pngjs'),jsQR=require('jsqr'),{execFileSync}=require('node:child_process');
const root=process.cwd();
const profile={nombre:'Ana',apellidos:'Perez Lopez',email:'offline@example.invalid',doc_type:'dni',doc_number:'FICTICIO',fecha_nacimiento:'1985-04-19',sangre:'0+',ec1_name:'Maria Lopez',ec1_rel:'Cónyuge/Pareja',ec1_phone_prefix:'+34',ec1_phone_num:'600123456',allergy_med:['Penicilina'],meds:['Ninguna'],diseases:['Migraña'],vih:'Sí'};
const mime={'.js':'application/javascript','.html':'text/html','.json':'application/json','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4'};
const errors=[],external=[];
const qa='/tmp/atabey-offline-integrated-qa';fs.mkdirSync(qa,{recursive:true});
(async()=>{
 const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://local');if(u.pathname==='/fixture.html'){res.setHeader('Content-Type','text/html');return res.end('<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="qr-section"><div id="qr-carousel"></div><div id="qr-dots"></div><button id="btn-print-emergency">Print</button></div></body></html>');}
  const file=path.join(root,u.pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.statusCode=404;return res.end();}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const c=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
 c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 await c.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin&&!['data:','blob:','about:'].includes(u.protocol)){external.push(route.request().url());return route.abort();}return route.continue();});
 try{
  const p=await c.newPage();await p.goto(origin+'/fixture.html');
  await p.evaluate(profile=>{
   localStorage.setItem('doctorqr_token','fictional');localStorage.setItem('doctorqr_id','OFFLINE-FIXTURE');localStorage.setItem('doctorqr_profile_owner','OFFLINE-FIXTURE');localStorage.setItem('doctorqr_user',JSON.stringify(profile));localStorage.setItem('doctorqr_profile',JSON.stringify(profile));
  },profile);
  for(const file of ['vendor/qrcodejs/qrcode.min.js','js/medical-owner.js','js/card-png.js','js/emergency-numbers.js','js/compact-emergency-qr.js','js/offline-accessory-adapter.js','js/emergency-accessories.js','js/emergency-card.js','js/qr-generator.js'])await p.addScriptTag({path:path.join(root,file)});
  const before=await p.evaluate(()=>JSON.stringify({...localStorage}));
  const event=p.waitForEvent('popup');await p.evaluate(()=>{const stamp=JSON.stringify(MedicalOwner.read());window.__card=AtabeyEmergencyCard.open({profile:MedicalOwner.read(),patientUrl:'https://atabeyapp.app/card.html?id=OFFLINE-FIXTURE&t=emergency',language:'es',date:new Date(2026,10,5),ready:ensureQRCodeLoaded,draw:createOrganicQRCode,current:()=>MedicalOwner.current()&&JSON.stringify(MedicalOwner.read())===stamp,autoPrint:false});});const q=await event;
  await q.waitForFunction(()=>document.documentElement.dataset.cardReady==='true');
  await q.evaluate(()=>delete CanvasRenderingContext2D.prototype.filter);
  assert.equal(await q.locator('.accessory-offline-controls').count(),1);assert.equal(await q.locator('#open-offline-qr-studio').count(),0);
  const main=await q.locator('#qcf').getAttribute('src');
  assert.equal(await q.locator('#accessory-download').isDisabled(),true);
  await q.locator('#accessory-offline-consent').check();
  async function prepare(format,size){
   await q.locator('#accessory-format').selectOption(format);
   if(size)await q.locator(format==='watch'?'#accessory-watch-qr':'#accessory-qr').selectOption(String(size));
   await q.locator('#accessory-prepare').click();
   await q.waitForFunction(()=>!document.getElementById('accessory-prepare').disabled);
   const status=await q.locator('#accessory-status').textContent();
   if(await q.locator('#accessory-download').isDisabled())throw Error(format+' '+size+': '+status+' '+await q.locator('#accessory-offline-summary').textContent());
   const payload=await q.locator('.accessory-svg').getAttribute('data-payload');assert.ok(payload.startsWith('EMERGENCY\n'));assert.ok(!/https?:|www\./i.test(payload));assert.ok(payload.includes('MARIA LOPEZ'));assert.ok(!payload.includes('HIV+'));assert.ok(!payload.includes('ANA PEREZ LOPEZ'));
   const visible=await q.locator('.accessory-front').first().textContent();assert.ok(visible.includes('ANA PEREZ'));assert.ok(visible.includes('O+'));assert.ok((visible+payload).includes('PENICILLIN'));
   for(const group of ['NAME UNKNOWN','BLOOD:UNKNOWN'])assert.ok(!visible.includes(group));
   assert.equal(await q.locator('#qcf').getAttribute('src'),main);
   // Both readers decode the exact actual raster; each physical QR is within its pattern.
   const download=q.waitForEvent('download');await q.locator('#accessory-download').click();const file=await download;assert.equal(await file.failure(),null);
   const printed=q.waitForEvent('popup');await q.locator('#accessory-print').click();const page=await printed;
   await page.waitForFunction(()=>document.documentElement.dataset.accessoryReady==='true');await page.emulateMedia({media:'print'});
   const boxes=await page.locator('.accessory-qr').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
   const pdf=path.join(qa,format+'-'+(size||26)+'.pdf');await page.pdf({path:pdf,preferCSSPageSize:true,printBackground:true});
   const prefix=pdf.slice(0,-4);execFileSync('pdftoppm',['-r','300','-png','-singlefile',pdf,prefix]);const print=PNG.sync.read(fs.readFileSync(prefix+'.png'));
   for(const b of boxes){const scale=300/96,margin=6*300/25.4,w=Math.round(b.w*scale),h=Math.round(b.h*scale),crop=new PNG({width:w,height:h});PNG.bitblt(print,crop,Math.round(b.x*scale+margin),Math.round(b.y*scale+margin),w,h,0,0);assert.equal(jsQR(new Uint8ClampedArray(crop.data),w,h)?.data,payload,'actual PDF QR '+format);}
   await page.close();
   await q.locator('.accessory-svg').screenshot({path:path.join(qa,format+'-'+(size||26)+'.png')});
   const overflow=await q.locator('.accessory-front').evaluateAll(faces=>faces.flatMap(face=>{const b=face.getBoundingClientRect();return [...face.querySelectorAll('text')].filter(t=>{const r=t.getBoundingClientRect();return r.left<b.left-.5||r.right>b.right+.5||r.top<b.top-.5||r.bottom>b.bottom+.5;}).map(t=>t.textContent);}));assert.deepEqual(overflow,[]);
   console.log('PASS offline',format,size||'',payload.length,'characters');
   return payload;
  }
  const watch=await prepare('watch',30);await prepare('watch',34);await prepare('band');await prepare('tag',40);await prepare('tag',49);
  assert.equal(await q.locator('.tag-face').count(),2);
  // A printable sheet is invalidated when consent is removed.
  const print=q.waitForEvent('popup');await q.locator('#accessory-print').click();const sheet=await print;await sheet.waitForFunction(()=>document.documentElement.dataset.accessoryReady==='true');
  await q.locator('#accessory-offline-consent').uncheck();assert.equal(await q.locator('#accessory-print').isDisabled(),true);assert.equal(await q.locator('.accessory-qr').count(),0);assert.equal(await sheet.locator('.accessory-svg').count(),0);
  await q.locator('#accessory-offline-consent').check();await q.locator('#accessory-offline-sensitive').check();await q.locator('#accessory-prepare').click();await q.waitForFunction(()=>!document.getElementById('accessory-prepare').disabled);
  assert.ok((await q.locator('#accessory-offline-summary').textContent()).includes('HIV+'));
  // Wallpaper uses the same saved profile, with no legacy QR type or URL builder.
  await p.addStyleTag({path:path.join(root,'css/qr-wallpaper.css')});
  await p.evaluate(()=>{window.getFormData=()=>MedicalOwner.read();});
  await p.addScriptTag({path:path.join(root,'js/qr-wallpaper.js')});
  await p.locator('#btn-qr-wallpaper').waitFor();await p.locator('#btn-qr-wallpaper').click();await p.locator('#qrw-offline-consent').waitFor();
  assert.equal(await p.locator('#qrw-type option').count(),1);
  await p.locator('#qrw-offline-consent').check();await p.locator('#qrw-offline-prepare').click();
  await p.waitForFunction(()=>document.querySelector('#qrw-offline-summary')?.textContent.includes('CONTACT:'));
  await p.waitForFunction(()=>document.querySelector('.qrw-status')?.textContent.includes('preparado'));
  const summary=await p.locator('#qrw-offline-summary').textContent();assert.ok(summary.includes('ANA PEREZ LOPEZ'));assert.ok(!summary.includes('https:'));assert.ok(!summary.includes('HIV+'));
  // Warm every required asset, then complete a fresh generation with network disconnected.
  await c.setOffline(true);await p.locator('.qrw-export-png').click();
  await p.waitForFunction(()=>document.querySelector('.qrw-result a')||document.querySelector('.qrw-status')?.dataset.kind==='error');
  assert.ok(await p.locator('.qrw-result a').count(),await p.locator('.qrw-status').textContent());
  const actual=await p.evaluate(async()=>{const blob=await(await fetch(document.querySelector('.qrw-result a').href)).blob(),image=await createImageBitmap(blob),c=document.createElement('canvas');c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);return {png:await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result.split(',')[1]);f.readAsDataURL(blob);}),lines:AtabeyQRWallpaper._opts().offlineLines,L:AtabeyQRWallpaper._layout(c.width,c.height,AtabeyQRWallpaper._opts()),h:c.height};});
  fs.writeFileSync(path.join(qa,'wallpaper.png'),Buffer.from(actual.png,'base64'));assert.ok(actual.lines.includes('BLOOD: O+'));assert.ok(actual.L.py+actual.L.ph<=actual.h*.88+.01);
  assert.equal(await p.evaluate(()=>JSON.stringify(Object.fromEntries(Object.entries({...localStorage}).filter(([k])=>k!=='doctorqr_qr_wallpaper')))),before);
  // Account/profile changes remove both the preview QR and pending download links.
  await p.evaluate(()=>{localStorage.setItem('doctorqr_profile',JSON.stringify({...MedicalOwner.read(),nombre:'Changed'}));});
  await p.waitForFunction(()=>!document.querySelector('.qrw-result a'));
  await c.setOffline(false);
  await q.waitForFunction(()=>!document.getElementById('qcf'));assert.equal(await q.locator('#qcf').count(),0,'old account/profile popup cleared');
  assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  console.log('PASS wallpaper PNG offline, consent, privacy, data invalidation and original card isolation');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
