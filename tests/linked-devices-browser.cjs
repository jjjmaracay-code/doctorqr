'use strict';
// Actual device-list UI, fictional accounts and intercepted API only.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.cwd(),origin='https://atabeyapp.app',api='doctorqr-backend-production.up.railway.app';
const user={nombre:'Alice',apellidos:'Fixture',email:'alice@example.invalid',twofa_method:'totp'};
const device=(id,label)=>({id,browser_label:label,created_at:Date.now()-60000,last_seen:Date.now(),expires:Date.now()+3600000});
const records={'token-A':[], 'token-B':[device('device-B','Firefox · Windows — B ficticio')]};
let offline=false,hold=false,release,held=false,browser;
const requests=[],errors=[];
(async()=>{try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||chromium.executablePath(),args:['--no-sandbox','--disable-dev-shm-usage']});
 const c=await browser.newContext({viewport:{width:1360,height:1000},locale:'es-ES',serviceWorkers:'block'});
 c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 await c.route('**/*',async route=>{
  const req=route.request(),u=new URL(req.url());
  if(u.hostname===api){
   const token=(req.headers().authorization||'').replace('Bearer ','');requests.push({path:u.pathname,token,body:req.postData()});
   if(offline)return route.abort();
   if(u.pathname==='/api/devices/'){
    const snapshot=JSON.stringify({devices:records[token]||[]});
    if(hold){hold=false;held=true;await new Promise(r=>release=r);}
    return route.fulfill({contentType:'application/json',body:snapshot});
   }
   if(u.pathname==='/api/devices/revoke'){
    const {id}=JSON.parse(req.postData());records[token]=(records[token]||[]).filter(d=>d.id!==id);
    return route.fulfill({contentType:'application/json',body:'{"success":true}'});
   }
   throw Error('Unexpected API '+u.pathname);
  }
  assert.equal(u.origin,origin,'No external services');
  if(u.pathname==='/fixture.html')return route.fulfill({contentType:'text/html',body:'<!doctype html><title>Fictional second tab</title>'});
  const file=path.resolve(root,'.'+u.pathname);assert.ok(file.startsWith(root+path.sep));
  return route.fulfill({contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css'})[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});
 });
 await c.addInitScript(user=>{
  if(location.origin!=='https://atabeyapp.app')return;
  if(localStorage.getItem('fixture-list-seeded'))return;
  localStorage.setItem('fixture-list-seeded','yes');localStorage.setItem('doctorqr_user',JSON.stringify(user));
  localStorage.setItem('doctorqr_token','token-A');localStorage.setItem('doctorqr_id','OWNER-A');
 },user);
 const p=await c.newPage();await p.clock.install();await p.goto(origin+'/dispositivos.html');
 await p.waitForFunction(()=>document.getElementById('device-count').textContent==='0 accesos vigentes');
 records['token-A']=[device('device-A','Chrome · Mac — A ficticio')];
 await p.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));
 await p.waitForFunction(()=>document.querySelectorAll('.device').length===1);
 assert.ok((await p.locator('.device').textContent()).includes('Chrome · Mac'));
 assert.ok((await p.locator('.device-expiry').textContent()).includes('Válido hasta:'));
 records['token-A'].push(device('device-A2','Safari · Mac — segundo ficticio'));
 await p.clock.fastForward(20050);
 await p.waitForFunction(()=>document.querySelectorAll('.device').length===2);
 console.log('PASS: returning to a preserved screen and the visible timer discover newly linked computers without a manual refresh');
 for(const [width,height]of [[1360,1000],[390,844],[320,568],[844,390]]){
  await p.setViewportSize({width,height});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(width===1360||width===390)await p.screenshot({path:'/tmp/atabey-linked-devices-'+width+'.png',fullPage:true});
 }
 await p.setViewportSize({width:1360,height:1000});
 await p.locator('#refresh-devices').scrollIntoViewIfNeeded();
 const b=await p.locator('#refresh-devices').boundingBox();await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();
 // Advance only presentation transitions, retaining the real held press state.
 await p.clock.runFor(150);
 const pressed=await p.locator('#refresh-devices').evaluate(e=>({transform:getComputedStyle(e).transform,shadow:getComputedStyle(e).boxShadow}));
 assert.notEqual(pressed.transform,'none');assert.ok(pressed.shadow.includes('inset'));await p.mouse.up();
 await p.waitForFunction(()=>!document.getElementById('refresh-devices').disabled);
 console.log('PASS: all four widths fit; buttons have an actual depressed press state');
 offline=true;await p.locator('#refresh-devices').click();
 await p.waitForFunction(()=>document.getElementById('device-count').textContent==='Sin comprobar');
 assert.equal(await p.locator('.device').count(),0);
 assert.ok((await p.locator('#device-list').textContent()).includes('No se pudo consultar'));
 offline=false;await p.evaluate(()=>window.dispatchEvent(new Event('online')));
 await p.waitForFunction(()=>document.querySelectorAll('.device').length===2);
 p.once('dialog',dialog=>dialog.accept());await p.locator('.device button').first().click();
 await p.waitForFunction(()=>document.querySelectorAll('.device').length===1);
 assert.ok((await p.locator('.device').textContent()).includes('Safari'));
 assert.equal(JSON.parse(requests.find(r=>r.path.endsWith('/revoke')).body).id,'device-A');
 console.log('PASS: connection failure is distinct from an empty list; reconnect restores it; revocation removes only the selected access');
 const other=await c.newPage();await other.goto(origin+'/fixture.html');
 hold=true;await p.evaluate(()=>window.dispatchEvent(new Event('focus')));
 await new Promise((resolve,reject)=>{const start=Date.now();const tick=()=>held?resolve():Date.now()-start>3000?reject(Error('No held list request')):setTimeout(tick,10);tick();});
 await other.evaluate(()=>{
  localStorage.setItem('doctorqr_token','token-B');localStorage.setItem('doctorqr_id','OWNER-B');
  localStorage.setItem('doctorqr_user',JSON.stringify({nombre:'Bob',email:'bob@example.invalid',twofa_method:'totp'}));
 });
 await p.waitForFunction(()=>document.getElementById('device-count').textContent==='');
 assert.equal(await p.locator('.device').count(),0);assert.equal(await p.locator('#link-account').textContent(),'');
 release();await p.waitForFunction(()=>document.getElementById('device-list').getAttribute('aria-busy')==='false');
 await p.clock.runFor(100);assert.equal(await p.locator('.device').count(),0);assert.equal(await p.locator('#scan-start').isDisabled(),true);
 await p.reload();await p.waitForFunction(()=>document.querySelectorAll('.device').length===1);
 assert.ok((await p.locator('.device').textContent()).includes('B ficticio'));
 assert.ok(!(await p.locator('main').textContent()).includes('A ficticio'));
 assert.deepEqual(errors,[]);
 console.log('PASS: switching accounts immediately clears account A; a delayed A response cannot render; reopening shows only B');
}finally{await browser?.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
