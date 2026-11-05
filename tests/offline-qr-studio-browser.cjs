const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=process.cwd();
const currentCache=fs.readFileSync('sw.js','utf8').match(/const CACHE_NAME = '([^']+)'/)[1];
const user={nombre:'Alice',apellidos:'Fixture',email:'alice@example.test',doc_type:'dni',doc_number:'A123',fecha_nacimiento:'1985-04-19'};
const profile={...user,nombre:'Alice Fixture',apellidos:'',sangre:'0+',ec1_name:'Maria Lopez Fernandez',ec1_rel:'Cónyuge/Pareja',ec1_phone_prefix:'+34',ec1_phone_num:'600123456',vih:'Sí',offline_qr_sensitive_consent:true};
test('studio assets have exact precache URLs, including both local readers',()=>{
 const html=fs.readFileSync('offline-qr.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
 const refs=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(s=>/\.(js|css)(\?|$)/.test(s));
 for(const ref of ['offline-qr.html',...refs])assert.ok(sw.includes("'./"+ref+"'"),'missing exact precache URL: '+ref);
 assert.ok(!fs.readFileSync('index.html','utf8').includes('id="open-offline-qr-studio"'));
 assert.ok(fs.readFileSync('js/emergency-accessories.js','utf8').includes('id="open-offline-qr-studio"'));
 assert.ok(!html.includes('qr-generator.js'));assert.ok(!html.includes('qr-wallpaper.js'));
 assert.ok(!/\(\?<([=!])/.test(fs.readFileSync('js/offline-qr-studio.js','utf8')));
});
test('production entry: consent, own data, export, invalidation and v61 -> current offline migration',async()=>{
 let legacy=true,available=true;
 const server=http.createServer((req,res)=>{
  if(!available){req.socket.destroy();return;}
  const u=new URL(req.url,'http://local');
  if(u.pathname==='/bootstrap.html')return res.end('<!doctype html><title>Bootstrap</title>');
  if(u.pathname==='/offline-qr.html'){res.writeHead(302,{Location:'/offline-qr'});return res.end();}
  if(u.pathname==='/login.html')return res.end('<!doctype html><title>Login fixture</title>');
  const file=u.pathname==='/sw.js'&&legacy?path.join(root,'tests/fixtures/offline-before-studio-sw.js'):
    path.join(root,u.pathname==='/'?'index.html':u.pathname==='/offline-qr'?'offline-qr.html':['/sos','/emergencias'].includes(u.pathname)?'emergencias.html':u.pathname);
  try{const data=fs.readFileSync(file);res.setHeader('Cache-Control','no-store');
   res.setHeader('Content-Type',({'.js':'application/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');
   if(['/offline-qr.html','/offline-qr'].includes(u.pathname))res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'");
   res.end(data);
  }catch{res.statusCode=404;res.end('not found');}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const c=await browser.newContext({viewport:{width:1200,height:950}});
  // Exercise browsers without CanvasRenderingContext2D.filter (including export).
  await c.addInitScript(() => { delete CanvasRenderingContext2D.prototype.filter; });
  const p=await c.newPage();
  async function until(predicate,arg){
    const deadline=Date.now()+20000;
    while(Date.now()<deadline){if(await p.evaluate(predicate,arg))return;await new Promise(r=>setTimeout(r,50));}
    throw Error('service worker did not finish its lifecycle');
  }
  await p.goto(origin+'/bootstrap.html');
  await p.evaluate(({user,profile})=>{
   localStorage.setItem('doctorqr_user',JSON.stringify(user));localStorage.setItem('doctorqr_id','ALICE');
   localStorage.setItem('doctorqr_token','fixture-token');localStorage.setItem('doctorqr_profile_owner','ALICE');
   localStorage.setItem('doctorqr_profile',JSON.stringify(profile));
  },{user,profile});
  await p.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;});
  await p.waitForFunction(()=>navigator.serviceWorker.controller);
  await until(async()=>(await navigator.serviceWorker.getRegistration()).active?.state==='activated');
  assert.equal(await p.evaluate(async()=>!!await caches.match('/offline-qr.html')),false,'v61 never visited/cached new studio');
  legacy=false;
  await p.evaluate(async()=>{const reg=await navigator.serviceWorker.getRegistration();await reg.update();});
  await until(async cache=>{const names=await caches.keys(),reg=await navigator.serviceWorker.getRegistration();return names.includes(cache)&&!names.includes('doctorqr-v61')&&reg.active?.state==='activated';},currentCache);
  assert.equal(await p.evaluate(async()=>!!await caches.match('/offline-qr.html')),true,'new page precached before going offline');
  assert.equal(await p.evaluate(async()=>!!await caches.match('/offline-qr')),false,'canonical URL was never visited');
  assert.equal(await p.evaluate(async()=>(await caches.match('/offline-qr.html')).redirected),true,'realistic Pages HTML redirect stored in precache');
  console.log('MIGRATION',await p.evaluate(async()=>({controller:navigator.serviceWorker.controller?.state,caches:await caches.keys(),html:(await(await caches.match('/offline-qr.html')).text()).slice(0,90)})));
  // Deliberately never visit the new page online: all of its assets must precache.
  available=false;await c.setOffline(true);
  const failed=[],errors=[],apiRequests=[];p.on('requestfailed',r=>failed.push(r.url()));p.on('pageerror',e=>errors.push(e.message));
  p.on('request',r=>{if(r.url().includes('/api/'))apiRequests.push(r.url());});
  await p.goto(origin+'/offline-qr');
  assert.equal(await p.locator('#offline-source').inputValue(),'own');
  assert.equal(await p.locator('#offline-consent').isChecked(),false);
  assert.equal(await p.locator('#offline-sensitive').isChecked(),false);
  assert.equal(await p.locator('#offline-generate').isDisabled(),true);
  await p.locator('#offline-support').selectOption('KEYCHAIN');
  await p.locator('#offline-consent').check();await p.locator('#offline-generate').click();
  await p.waitForFunction(()=>!document.getElementById('offline-png').disabled);
  assert.ok((await p.locator('#offline-printed').textContent()).includes('ALICE FIXTURE'));
  assert.ok((await p.locator('#offline-printed').textContent()).includes('BLOOD:O+'));
  assert.ok(!(await p.locator('#offline-printed').textContent()).includes('HIV+'),'stored sensitive consent is not auto-accepted');
  const payload=await p.locator('#offline-payload').textContent();assert.ok(payload.startsWith('EMERGENCY\n'));assert.ok(!/https?:|www\./i.test(payload));
  const download=p.waitForEvent('download');await p.locator('#offline-png').click();const d=await download;
  const image=require('pngjs').PNG.sync.read(fs.readFileSync(await d.path()));
  assert.equal(require('jsqr')(new Uint8ClampedArray(image.data),image.width,image.height).data,payload);
  assert.equal(await p.evaluate(()=>localStorage.getItem('doctorqr_profile')),JSON.stringify(profile),'never alter profile or persist checkbox choices');
  await p.locator('#offline-sensitive').check();assert.equal(await p.locator('#offline-front svg').count(),0);
  await p.locator('#offline-generate').click();await p.waitForFunction(()=>!document.getElementById('offline-svg').disabled);
  assert.ok((await p.locator('#offline-printed').textContent()).includes('HIV+'));
  await p.locator('#offline-consent').uncheck();assert.equal(await p.locator('#offline-front svg').count(),0);assert.equal(await p.locator('#offline-svg').isDisabled(),true);
  // Real regression: this 98-character QR is readable in the intended capture,
  // although ZXing's finder can reject the sharp, full 1080px artwork.
  await p.locator('#offline-source').selectOption('moderate');await p.locator('#offline-support').selectOption('WATCH34');
  assert.equal(await p.locator('#offline-consent').isChecked(),false);assert.equal(await p.locator('#offline-sensitive').isChecked(),false);
  await p.locator('#offline-consent').check();await p.locator('#offline-generate').click();await p.waitForFunction(()=>!document.getElementById('offline-png').disabled);
  const demoPayload=await p.locator('#offline-payload').textContent();assert.equal(demoPayload.length,98);
  const demoDownload=p.waitForEvent('download');await p.locator('#offline-png').click();const demo=await demoDownload;
  const demoImage=require('pngjs').PNG.sync.read(fs.readFileSync(await demo.path()));
  assert.equal(require('jsqr')(new Uint8ClampedArray(demoImage.data),demoImage.width,demoImage.height).data,demoPayload);
  await p.locator('#offline-support').selectOption('WATCH30');await p.locator('#offline-generate').click();await p.waitForFunction(()=>!document.getElementById('offline-png').disabled);
  const smallPayload=await p.locator('#offline-payload').textContent(),smallDownload=p.waitForEvent('download');
  await p.locator('#offline-png').click();const small=await smallDownload;
  const smallImage=require('pngjs').PNG.sync.read(fs.readFileSync(await small.path()));
  assert.equal(require('jsqr')(new Uint8ClampedArray(smallImage.data),smallImage.width,smallImage.height).data,smallPayload);
  await p.locator('#offline-source').selectOption('moderate');await p.locator('#offline-support').selectOption('BRACELET');
  await p.locator('#offline-consent').check();await p.locator('#offline-generate').click();
  await p.waitForFunction(()=>!document.getElementById('offline-output').hidden&&!document.getElementById('offline-generate').disabled);
  assert.equal(await p.locator('#offline-png').isDisabled(),true);assert.equal(await p.locator('#offline-front svg').count(),0);
  assert.ok((await p.locator('#offline-source-note').textContent()).includes('FICTICIOS'));
  assert.deepEqual(failed,[]);assert.deepEqual(errors,[]);assert.deepEqual(apiRequests,[]);
  await c.setOffline(false);available=true;
  await p.locator('#offline-source').selectOption('own');await p.locator('#offline-support').selectOption('KEYCHAIN');
  assert.equal(await p.locator('#offline-consent').isChecked(),false);await p.locator('#offline-consent').check();
  await p.locator('#offline-generate').click();await p.waitForFunction(()=>!document.getElementById('offline-png').disabled);
  const other=await c.newPage();await other.goto(origin+'/bootstrap.html');await other.evaluate(()=>localStorage.setItem('doctorqr_id','BOB'));
  await p.waitForURL('**/login.html');assert.equal(await p.locator('#offline-front svg').count(),0);
  await c.close();
  const foreign=await browser.newContext({viewport:{width:360,height:900}}),fp=await foreign.newPage();
  await fp.goto(origin+'/bootstrap.html');await fp.evaluate(({user,profile})=>{
   localStorage.setItem('doctorqr_user',JSON.stringify({...user,nombre:'Other'}));localStorage.setItem('doctorqr_id','BOB');localStorage.setItem('doctorqr_token','bob-token');localStorage.setItem('doctorqr_profile_owner','ALICE');localStorage.setItem('doctorqr_profile',JSON.stringify(profile));
  },{user,profile});
  await fp.goto(origin+'/offline-qr');await fp.waitForURL('**/login.html');
  assert.ok(!(await fp.locator('body').textContent()).includes('ALICE FIXTURE'));
  await foreign.close();
  const guest=await browser.newContext({viewport:{width:360,height:900}}),gp=await guest.newPage();
  const guestErrors=[];gp.on('pageerror',e=>guestErrors.push(e.message));
  await gp.goto(origin+'/offline-qr');
  assert.equal(await gp.locator('#offline-source option[value="own"]').evaluate(option=>option.disabled),true);
  assert.ok((await gp.locator('#offline-source-note').textContent()).includes('FICTICIOS'));
  assert.equal(await gp.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(guestErrors,[]);await guest.close();
 }finally{await browser.close();await new Promise(r=>server.close(r));}
});
