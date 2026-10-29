'use strict';
// Actual login UI; held fictional HTTP replies distinguish verification from navigation.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.cwd(),origin='https://atabeyapp.app',api='doctorqr-backend-production.up.railway.app';
const user={nombre:'Alice',apellidos:'Fixture',email:'alice@example.invalid',doc_type:'dni',doc_number:'A123',fecha_nacimiento:'1980-01-01',twofa_method:'totp',plan_type:'lifetime'};
const success={success:true,token:'FICTIONAL-TOKEN-A',doctorqr_id:'ALICE',user};
const until=async check=>{for(let i=0;i<400;i++){if(check())return;await new Promise(r=>setTimeout(r,10));}throw Error('Fictional phase did not arrive');};
let browser;
(async()=>{try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||chromium.executablePath(),args:['--no-sandbox','--disable-dev-shm-usage']});
 async function open({gate=false,arabic=false,clock=false}={}){
  const c=await browser.newContext({viewport:{width:390,height:844},locale:arabic?'ar-EG':'es-ES',serviceWorkers:'block'});
  const state={verify:[],phases:[],nav:0,errors:[]};let release;
  c.on('page',p=>p.on('pageerror',e=>state.errors.push(e.message)));
  await c.exposeFunction('__loginPhase',value=>state.phases.push(value));
  await c.route('**/*',async route=>{
   const req=route.request(),u=new URL(req.url()),send=(status,data)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
   if(u.hostname===api){
    if(u.pathname.endsWith('/login'))return send(200,{success:true,requires_2fa:true,twofa_method:gate?'none':'totp'});
    if(u.pathname.endsWith('/setup-2fa'))return send(200,{success:true,secret:'JBSWY3DPEHPK3PXP',qr_url:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4ZkAAAAASUVORK5CYII='});
    if(u.pathname.endsWith('/verify-2fa')){
     state.verify.push(req.postDataJSON());const outcome=await new Promise(r=>state.reply=r);
     if(outcome.abort)return route.abort();
     return outcome.text?route.fulfill({status:429,contentType:'text/plain',body:'Too many requests'}):send(outcome.status||200,outcome.data);
    }
    return send(404,{});
   }
   if(u.origin!==origin)return route.abort(); // Existing remote font stays outside this local fixture.
   if(u.pathname==='/index.html'){
    state.nav++;await new Promise(r=>release=r);
    return route.fulfill({contentType:'text/html',body:'<!doctype html><title>Fictional authenticated destination</title><p id="destination">Verified handoff</p>'});
   }
   if(u.pathname==='/fixture.html')return route.fulfill({contentType:'text/html',body:'<!doctype html><title>Other fictional account tab</title>'});
   const file=path.resolve(root,'.'+u.pathname);assert.ok(file.startsWith(root+path.sep));
   if(!fs.existsSync(file))return route.fulfill({status:404,body:''});
   return route.fulfill({contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
  });
  const p=await c.newPage();if(clock)await p.clock.install();await p.goto(origin+'/login.html');await p.evaluate(()=>i18nReady);
  await p.evaluate(()=>{
   const dialog=document.getElementById('login-progress');
   new MutationObserver(()=>window.__loginPhase({phase:dialog.dataset.phase,open:dialog.open,visibility:getComputedStyle(dialog).visibility,rootVisibility:getComputedStyle(document.documentElement).visibility,rootStyle:document.documentElement.style.visibility,code:[...document.querySelectorAll('#screen-l2 .code-char,#screen-gate .code-char')].map(e=>e.textContent).join(''),passwordIntact:document.getElementById('login-password').value==='Fictional-password-123!'})).observe(dialog,{attributes:true,subtree:true,childList:true});
  });
  await p.fill('#login-email',user.email);await p.fill('#login-password','Fictional-password-123!');await p.locator('#btn-login').click();
  await p.locator(gate?'#screen-gate.active':'#screen-l2.active').waitFor();
  if(gate)await p.waitForFunction(()=>document.getElementById('gate-secret-text').textContent==='JBSWY3DPEHPK3PXP');
  for(const n of '123456')await p.locator('['+(gate?'data-gate':'data-l2')+'="'+n+'"]').click();
  const submit=gate?'#btn-gate-confirmar':'#btn-verify-l2';await p.locator(submit).click();await until(()=>state.verify.length===1);
  return {c,p,state,submit,release:()=>release?.()};
 }
 for(const options of [{},{gate:true,arabic:true}]){
  const {c,p,state,submit,release}=await open(options);
  assert.equal(await p.locator('#login-progress').isVisible(),true);assert.equal(await p.locator('#login-progress').getAttribute('data-phase'),'verifying');
  assert.equal(await p.evaluate(()=>localStorage.getItem('doctorqr_token')),null);
  await p.evaluate(selector=>document.querySelector(selector).dispatchEvent(new Event('click')),submit);
  assert.equal(state.verify.length,1,'Repeated submission cannot start a parallel verification');
  for(const size of [{width:390,height:844},{width:844,height:390}]){
   await p.setViewportSize(size);const bounds=await p.locator('.login-progress-card').boundingBox();
   assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=size.width&&bounds.y+bounds.height<=size.height);
  }
  await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.login-progress-ring').evaluate(e=>getComputedStyle(e).animationName),'none');
  await p.screenshot({path:options.gate?'/tmp/atabey-login-pending-ar.png':'/tmp/atabey-login-pending.png'});
  state.reply({data:success});await until(()=>state.nav===1&&state.phases.some(s=>s.phase==='loading'));
  const accepted=state.phases.find(s=>s.phase==='loading');assert.equal(accepted.open,true);assert.equal(accepted.visibility,'visible');
  assert.equal(accepted.rootStyle,'hidden');assert.ok(accepted.passwordIntact);assert.ok(!accepted.code.includes('●'));
  release();await p.waitForURL('**/index.html');assert.equal(await p.evaluate(()=>localStorage.getItem('doctorqr_id')),'ALICE');assert.deepEqual(state.errors,[]);await c.close();
 }
 console.log('PASS: normal login and mandatory setup show verification then loading; one request, no early session, no residual digits, native credential field preserved; portrait/landscape, RTL and reduced motion');
 for(const outcome of [{status:400,data:{success:false,error:'Código inválido'}},{abort:true},{text:true},{status:503,data:{success:true,...success}},{data:{success:true,user}}]){
  const {c,p,state}=await open();state.reply(outcome);await p.waitForFunction(()=>!document.getElementById('login-progress').open);
  assert.equal(await p.locator('#screen-l2').isVisible(),true);assert.equal(state.nav,0);assert.equal(await p.evaluate(()=>localStorage.getItem('doctorqr_token')),null);
  assert.deepEqual(state.errors,[]);await c.close();
 }
 console.log('PASS: incorrect code, network error, plain-text rate limit, HTTP failure and incomplete session never open the destination and restore the code screen');
 {
  const {c,p,state}=await open({clock:true});await p.clock.fastForward(15001);await p.waitForFunction(()=>!document.getElementById('login-progress').open);
  assert.equal(state.nav,0);assert.equal(await p.locator('#btn-verify-l2').isEnabled(),true);state.reply({abort:true});await c.close();
 }
 console.log('PASS: an unanswered verification times out and permits retry without issuing another automatic request');
 {
  const {c,p,state}=await open(),other=await c.newPage();await other.goto(origin+'/fixture.html');
  await other.evaluate(()=>{localStorage.setItem('doctorqr_id','BOB');localStorage.setItem('doctorqr_token','FICTIONAL-TOKEN-B');localStorage.setItem('doctorqr_user',JSON.stringify({email:'bob@example.invalid',twofa_method:'totp'}));});
  state.reply({data:success});await p.waitForFunction(()=>!document.getElementById('login-progress').open);
  assert.equal(state.nav,0);assert.equal(await p.locator('#screen-l1').isVisible(),true);assert.equal(await p.evaluate(()=>localStorage.getItem('doctorqr_token')),'FICTIONAL-TOKEN-B');
  assert.deepEqual(state.errors,[]);await c.close();
 }
 console.log('PASS: a late Alice verification cannot replace a session changed to Bob in another tab');
 {
  const {c,p,state}=await open();await p.goto(origin+'/fixture.html');state.reply({data:success});
  await p.goBack();await p.waitForFunction(()=>!document.getElementById('login-progress').open);
  assert.equal(state.nav,0);assert.equal(await p.evaluate(()=>localStorage.getItem('doctorqr_token')),null);
  assert.deepEqual(state.errors,[]);await c.close();
 }
 console.log('PASS: leaving and returning during verification cannot bind an abandoned reply or revive a busy dialog');
}finally{await browser?.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
