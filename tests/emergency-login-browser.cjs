// Real login/logout, local fictional API, QR decoding and account boundaries.
'use strict';
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const assert = require('node:assert/strict'), {chromium} = require('playwright');
const {PNG} = require('pngjs'), jsQR = require('jsqr');
const root = process.cwd(), key = 'doctorqr_emergency_access';
const users = {
  ALICE:{id:1,nombre:'Alice',apellidos:'Fixture',email:'alice@example.invalid',doc_type:'dni',doc_number:'A123',fecha_nacimiento:'1980-01-01',twofa_method:'totp',plan_type:'lifetime',language:'es'},
  BOB:{id:2,nombre:'Bob',apellidos:'Fixture',email:'bob@example.invalid',doc_type:'dni',doc_number:'B456',fecha_nacimiento:'1981-02-02',twofa_method:'totp',plan_type:'lifetime',language:'es'}
};
const profiles = Object.fromEntries(Object.entries(users).map(([id,u]) => [id,{...u,_account_id:u.id,sangre:id==='ALICE'?'A+':'B-',pacemaker:id==='ALICE'?'Sí':'No',med_doses:'PRIVATE fictional dose '+id,ec1_name:'PRIVATE emergency contact '+id,ec1_phone_num:'600000000'}]));
let calls = [], unavailable = false, browser;
const server = http.createServer(async(req,res) => {
  const url = new URL(req.url,'http://fixture');
  res.setHeader('Cache-Control','no-store');
  const send = (status,data) => {res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
  if (url.pathname.startsWith('/api/')) {
    calls.push({path:url.pathname,method:req.method});
    if (unavailable) return send(503,{error:'offline fixture'});
    const id = String(req.headers.authorization||'').includes('BOB')?'BOB':'ALICE';
    if (url.pathname==='/api/access/status') return send(200,{doctorqr_id:id,access:true,status:'paid',plan_type:'lifetime',server_now:Math.floor(Date.now()/1000)});
    if (url.pathname==='/api/profile/me') return send(200,{doctorqr_id:id,profile:profiles[id],profile_revision:'1'.repeat(64),snapshot_token:'a'.repeat(64),plan_type:'lifetime'});
    if (url.pathname==='/api/auth/account') return send(200,{success:true});
    if (url.pathname==='/api/auth/logout') return send(503,{error:'logout fixture unavailable'});
    return send(202,{success:true});
  }
  const file = path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
  if (!file.startsWith(root+path.sep)) return send(404,{});
  try {res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}
  catch (_) {res.statusCode=404;res.end('missing fixture');}
});
(async() => {
  try {
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const origin='http://127.0.0.1:'+server.address().port;
    browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||chromium.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
    const errors=[];
    async function context(seed=true) {
      const c=await browser.newContext({viewport:{width:390,height:844},locale:'es-ES',serviceWorkers:'block'});
      c.setDefaultTimeout(12000);
      await c.route('**/*',route=>{
        const url=new URL(route.request().url());
        if(url.hostname==='doctorqr-backend-production.up.railway.app') return route.fetch({url:origin+url.pathname+url.search}).then(response=>route.fulfill({response}));
        return url.origin===origin?route.continue():route.abort();
      });
      if(seed) await c.addInitScript(({u,p})=>{
        if(location.hostname!=='127.0.0.1'||localStorage.getItem('seeded'))return;
        const values={seeded:'1',doctorqr_user:JSON.stringify(u),doctorqr_token:'fixture-ALICE',doctorqr_id:'ALICE',doctorqr_profile_owner:'ALICE',doctorqr_profile:JSON.stringify(p)};
        for(const[k,v]of Object.entries(values))localStorage.setItem(k,v);
      },{u:users.ALICE,p:profiles.ALICE});
      c.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
      return c;
    }
    async function decoded(page,owner,count) {
      await page.waitForFunction(n=>[...document.querySelectorAll('#eqv-grid img')].filter(image=>image.complete&&image.naturalWidth>0).length===n,count);
      const data=await page.locator('#eqv-grid img').evaluateAll(images=>images.map(image=>image.src));
      for(const src of data){const png=PNG.sync.read(Buffer.from(src.split(',')[1],'base64'));const code=jsQR(new Uint8ClampedArray(png.data),png.width,png.height);assert.ok(code,'Actual emergency image must decode');const url=new URL(code.data);assert.equal(url.origin,'https://atabeyapp.app');assert.equal(url.pathname,'/card.html');assert.equal(url.searchParams.get('id'),owner);assert.deepEqual([...url.searchParams.keys()].sort(),['id','t']);}
      assert.equal(await page.locator('.eqv-name').first().textContent(),users[owner].nombre+' Fixture');
    }
    const c=await context(),p=await c.newPage();
    await p.goto(origin+'/index.html');
    await p.waitForFunction(()=>!!EmergencyAccess.read()&&!document.documentElement.dataset.accessGate);
    const kit=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
    assert.deepEqual(Object.keys(kit).sort(),['name','owner','savedAt','types','version']);
    assert.equal(kit.types.length,4);assert.ok(!JSON.stringify(kit).includes('PRIVATE'));
    await p.evaluate(()=>handleEmergencyQuickAccess());await decoded(p,'ALICE',4);
    await p.evaluate(()=>MedicalOwner.clearPublished());
    assert.equal(await p.locator('#emergency-quick-view').isVisible(),false,'Identity rejection also clears an already visible QR view');
    await p.reload();await p.waitForFunction(()=>!!EmergencyAccess.read()&&!document.documentElement.dataset.accessGate);
    await p.evaluate(()=>cerrarSesion());await p.waitForURL('**/login.html');
    const remaining=await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('doctorqr_')));
    for(const forbidden of ['doctorqr_token','doctorqr_user','doctorqr_id','doctorqr_profile','doctorqr_profile_owner','doctorqr_qr_cache','doctorqr_medical_changes','doctorqr_medical_draft'])assert.ok(!remaining.includes(forbidden),forbidden+' removed by actual logout');
    assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).owner,key),'ALICE');
    const before=calls.length;
    await c.setOffline(true);
    for(let i=0;i<4;i++){await p.locator('#btn-emergency-quick').click();await decoded(p,'ALICE',4);await p.locator('.eqv-close').click();}
    assert.equal(calls.length,before,'Opening signed-out QR does not call authentication or the server');
    await c.setOffline(false);await p.reload();await p.locator('#btn-emergency-quick').click();await decoded(p,'ALICE',4);await p.locator('.eqv-close').click();
    unavailable=true;await p.goto(origin+'/emergencia.html');await decoded(p,'ALICE',4);unavailable=false;
    console.log('PASS: actual logout removes private profile/drafts/credentials, retains only read-only references; QR images decode after repeated taps, reload, offline and direct shortcut, without API gating.');

    await p.goto(origin+'/login.html');
    await p.evaluate(data=>guardarSesionYRedirigir(data,beginLoginVerification()),{token:'fixture-BOB',doctorqr_id:'BOB',user:users.BOB});
    await p.waitForURL('**/index.html');await p.waitForFunction(()=>EmergencyAccess.read()?.owner==='BOB');
    assert.equal(await p.evaluate(()=>MedicalOwner.read().email),'bob@example.invalid');
    await p.evaluate(()=>cerrarSesion());await p.waitForURL('**/login.html');
    await p.locator('#btn-emergency-quick').click();await decoded(p,'BOB',2);
    assert.ok(!(await p.locator('#emergency-quick-view').textContent()).includes('Alice'));
    // A delayed renderer belonging to Alice cannot authorize a QR for Bob.
    assert.equal(await p.evaluate(old=>EmergencyAccess.current(old),kit),false);
    assert.equal(await p.evaluate(old=>EmergencyAccess.url(old,'qr-emergency'),kit),null);
    await p.evaluate(()=>window.dispatchEvent(new StorageEvent('storage',{key:'doctorqr_id',newValue:'OTHER'})));
    assert.equal(await p.locator('#emergency-quick-view').isVisible(),false);
    console.log('PASS: changing accounts replaces the emergency kit; old snapshots cannot draw another account; cross-tab identity events clear open QR views.');

    // The browser's restored login was concealed during successful binding.
    await p.evaluate(()=>{document.documentElement.style.visibility='hidden';window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});
    await p.waitForFunction(()=>document.documentElement.style.visibility!=='hidden');
    await p.locator('#btn-emergency-quick').click();await decoded(p,'BOB',2);await p.locator('.eqv-close').click();
    await p.evaluate(data=>guardarSesionYRedirigir(data,beginLoginVerification()),{token:'fixture-BOB',doctorqr_id:'BOB',user:users.BOB});
    await p.waitForURL('**/index.html');await p.waitForFunction(()=>MedicalOwner.read()?.email==='bob@example.invalid');
    await p.evaluate(()=>{document.getElementById('del-pwd').value='fictional password';return ejecutarEliminarCuenta();});await p.waitForURL('**/login.html');
    assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),null);
    await p.locator('#btn-emergency-quick').click();assert.equal(await p.locator('#emergency-quick-msg').isVisible(),true);
    console.log('PASS: restored login becomes usable again; deleting the account removes emergency references; empty state is explicit.');

    const fresh=await context(false),f=await fresh.newPage();
    await f.goto(origin+'/login.html');await f.locator('#btn-emergency-quick').click();assert.equal(await f.locator('#emergency-quick-msg').isVisible(),true);assert.equal(await f.locator('#eqv-grid img').count(),0);
    await f.evaluate(k=>localStorage.setItem(k,JSON.stringify({version:1,owner:'BOB',name:'Wrong',types:['qr-emergency','foreign-type'],savedAt:Date.now()})),key);
    await f.locator('#btn-emergency-quick').click();assert.equal(await f.evaluate(k=>localStorage.getItem(k),key),null);
    await fresh.close();await c.close();assert.deepEqual(errors,[]);
    console.log('PASS: fresh devices and malformed references never invent or substitute patient data; no browser exceptions.');

    for(const action of ['cerrarSesion','ejecutarEliminarCuenta']) {
      const race=await context(),r=await race.newPage();
      await r.goto(origin+'/index.html');await r.waitForFunction(()=>!!EmergencyAccess.read()&&!document.documentElement.dataset.accessGate);
      await r.evaluate(async({action,u,profile,key})=>{
        const original=window.fetch;
        window.fetch=(url,options)=>String(url).includes('/api/auth/')
          ? new Promise(resolve=>setTimeout(()=>resolve({ok:true,json:async()=>({success:true})}),100)) : original(url,options);
        document.getElementById('del-pwd').value='fictional password';
        const pending=window[action]();
        MedicalOwner.bindSession({token:'fixture-BOB',doctorqr_id:'BOB',user:u});
        // Simulate the other tab's verified Bob response arriving before Alice's delayed result.
        localStorage.setItem('doctorqr_profile',JSON.stringify(profile));
        localStorage.setItem(key,JSON.stringify({version:1,owner:'BOB',name:'Bob Fixture',types:['qr-emergency','qr-u1'],savedAt:Date.now()}));
        await pending;
      },{action,u:users.BOB,profile:profiles.BOB,key});
      await r.waitForURL('**/login.html');
      assert.equal(await r.evaluate(()=>localStorage.getItem('doctorqr_token')),'fixture-BOB');
      assert.equal(await r.evaluate(()=>MedicalOwner.read().email),'bob@example.invalid');
      await r.locator('#btn-emergency-quick').click();await decoded(r,'BOB',2);await race.close();
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: delayed logout/account-deletion results cannot erase a newer account or its emergency QR references.');
  } finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
