// End-to-end preview checks with fictional identities and a local API. Never contacts live medical services.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const {chromium} = require('playwright');
const {PNG} = require('pngjs');
const jsQR = require('jsqr');
const root = process.cwd(), base = '90c449f0f159ffd2b1868ce3e26feb5fff1b2a83';
const languages = ['es','en','fr','de','pt','eu','hi','zh','ru','ja','ar'];
const user = {nombre:'Alice',apellidos:'Fixture',email:'alice@example.invalid',doc_type:'dni',doc_number:'A123',fecha_nacimiento:'1976-09-02',twofa_method:'totp',plan_type:'lifetime',created_at:1,language:'es'};
const healthy = {nombre:'Alice Fixture',apellidos:'',email:user.email,doc_type:user.doc_type,doc_number:user.doc_number,fecha_nacimiento:user.fecha_nacimiento,sangre:'0+',sexo_biologico:'Femenino',med_doses:'Pauta ficticia para pruebas',ec1_name:'Contacto ficticio',ec1_phone_prefix:'+34',ec1_phone_num:'600000001',_account_id:1};
let published = {...healthy}, revision = 1, currentStatus = 200, profileStatus = 200, responseId = 'ALICE', profileDelay = 0;
let browser, server;
const calls = [], errors = [];
const revisionHex = () => String(revision).padStart(64,'0');
const metadata = () => ({doctorqr_id:responseId,profile_revision:revisionHex(),snapshot_token:'a'.repeat(64),profile:published,updated_at:'2026-10-27T08:00:00Z',plan_type:'lifetime'});
function inline(html) { return [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim()); }
function decode(src) { const png = PNG.sync.read(Buffer.from(src.split(',')[1],'base64')); const code = jsQR(new Uint8ClampedArray(png.data),png.width,png.height); assert.ok(code,'The actual QR image must decode'); return code.data; }
async function visibleChoices(page,count) {
  try { await page.waitForFunction(n=>document.querySelectorAll('.web-qr-preview-choice').length===n,count,{timeout:12000}); }
  catch(error) { console.error('Preview diagnostic:',await page.evaluate(()=>({status:document.querySelector('.web-qr-preview-status')?.textContent,open:document.querySelector('#web-qr-preview')?.open,hidden:document.documentElement.style.visibility,sync:document.querySelector('#profile-sync-message')?.textContent})),errors,calls.slice(-10)); throw error; }
}
(async()=>{try {
  for(const file of ['js/qr-generator.js','js/profile-sync.js','js/medical-owner.js','js/web-session.js','js/web-link.js','js/form.js','_headers']) {
    assert.equal(fs.readFileSync(file,'utf8'),execFileSync('git',['show',base+':'+file],{encoding:'utf8'}),file+' changed');
  }
  assert.deepEqual(inline(fs.readFileSync('index.html','utf8')),inline(execFileSync('git',['show',base+':index.html'],{encoding:'utf8'})));
  for(const lang of languages) {
    const old=JSON.parse(execFileSync('git',['show',base+':i18n/'+lang+'.json'],{encoding:'utf8'})),current=JSON.parse(fs.readFileSync('i18n/'+lang+'.json'));
    for(const key of Object.keys(old)) assert.equal(current[key],old[key],lang+': previous text '+key);
    assert.equal(Object.keys(current).filter(k=>k.startsWith('qr_preview.')).length,12);
  }
  console.log('PASS: medical rendering, encoding, identity, sessions, sync, framing and existing translations remain unchanged');
  server = http.createServer(async(req,res)=>{
    const url = new URL(req.url,'http://fixture'); res.setHeader('Cache-Control','no-store');
    const send = (status,data)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data))};
    if(url.pathname.startsWith('/api/')) {
      calls.push({path:url.pathname,method:req.method});
      if(url.pathname==='/api/access/status')return send(200,{doctorqr_id:'ALICE',access:true,status:'paid',plan_type:'lifetime',server_now:Math.floor(Date.now()/1000)});if(url.pathname==='/api/profile/me') { const status=profileStatus,data=metadata();if(profileDelay)await new Promise(r=>setTimeout(r,profileDelay));return send(status,data); }
      if(url.pathname==='/api/profile/load') return send(published?200:404,{doctorqr_id:responseId,profile:published});
      if(url.pathname==='/api/devices/current') return send(currentStatus,{linked:true});
      if(url.pathname==='/api/devices/activity') return send(200,{success:true});
      if(url.pathname==='/api/devices/challenges') return send(200,{id:'11111111-1111-4111-8111-111111111111',qr_url:'https://atabeyapp.app/vincular.html#11111111-1111-4111-8111-111111111111.'+'b'.repeat(64),confirmation:'123456',expires:Date.now()+120000});
      if(url.pathname==='/api/devices/status') return send(200,{state:'pending'});
      if(url.pathname.startsWith('/api/metrics')) return send(202,{success:true});
      return send(404,{error:'Unimplemented fictional API'});
    }
    const file = path.join(root,url.pathname==='/'?'index.html':url.pathname);
    if(!file.startsWith(root+path.sep)) {res.statusCode=403;return res.end()}
    try {res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))}
    catch {res.statusCode=404;res.end('missing local fixture asset')}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r)); const origin='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||chromium.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  async function context(linked=true,authenticated=true) {
    const c=await browser.newContext({viewport:{width:1360,height:1000},locale:'es-ES',serviceWorkers:'block'});
    await c.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
    await c.addInitScript(({origin,user,healthy,linked,authenticated})=>{
      if(location.origin!==origin)return;
      const native=window.fetch.bind(window);window.fetch=(input,options)=>{const u=new URL(typeof input==='string'?input:input.url,location.href);return native(u.hostname==='doctorqr-backend-production.up.railway.app'?origin+u.pathname+u.search:input,options)};
      if(localStorage.getItem('fixture-seeded'))return;localStorage.setItem('fixture-seeded','1');
      if(linked)localStorage.setItem('doctorqr_profile',JSON.stringify({nombre:'Bob Other',email:'bob@example.invalid'}));
      if(authenticated){const store=linked?sessionStorage:localStorage;for(const[k,v]of Object.entries({doctorqr_user:JSON.stringify(user),doctorqr_id:'ALICE',doctorqr_token:'fictional-token',doctorqr_profile_owner:'ALICE',doctorqr_profile:JSON.stringify(healthy),doctorqr_ui_language:'es'}))store.setItem(k,v);if(linked)sessionStorage.setItem('atabey_web_session','1')}
    },{origin,user,healthy,linked,authenticated});
    return c;
  }
  const computer=await context(),p=await computer.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.goto(origin+'/index.html');await p.waitForFunction(()=>document.getElementById('f-med-doses')?.value==='Pauta ficticia para pruebas');
  assert.equal(await p.locator('#open-web-qr-preview').isVisible(),true);
  await p.locator('#open-web-qr-preview').click();await visibleChoices(p,2);
  assert.equal(await p.locator('.web-qr-preview-patient').textContent(),'Alice Fixture');
  assert.equal(await p.locator('.web-qr-preview-close').evaluate(el=>el===document.activeElement),true);
  let url=new URL(decode(await p.locator('.web-qr-preview-image').getAttribute('src')));
  assert.equal(url.searchParams.get('id'),'ALICE');assert.equal(url.searchParams.get('t'),'emergency');assert.equal(url.searchParams.get('e'),'+34600000001');
  assert.equal(await p.locator('.web-qr-preview-content').getAttribute('href'),url.href);
  assert.equal(await p.locator('.web-qr-preview-content').getAttribute('target'),'_blank');
  assert.ok((await p.locator('.web-qr-preview-content').getAttribute('rel')).includes('noopener'));
  assert.equal(await p.locator('#web-qr-preview iframe').count(),0);
  await p.keyboard.press('Escape');assert.equal(await p.locator('#web-qr-preview').evaluate(el=>el.open),false);
  assert.equal(await p.locator('#web-qr-preview img[src]').count(),0);assert.equal(await p.locator('.web-qr-preview-content').getAttribute('href'),null);
  console.log('PASS: linked preview shows two healthy-owner QR codes, decodes to that owner, enlarges them and clears all images/links on close');

  await p.evaluate(()=>{document.getElementById('f-med-doses').value='UNSAVED fictional draft';document.getElementById('f-ec1-phone-num').value='699999999'});
  await p.locator('#open-web-qr-preview').click();await visibleChoices(p,2);
  url=new URL(decode(await p.locator('.web-qr-preview-image').getAttribute('src')));
  assert.equal(url.searchParams.get('e'),'+34600000001','Preview must not publish an unsaved contact');
  assert.equal(await p.locator('#f-med-doses').inputValue(),'UNSAVED fictional draft');
  assert.equal(await p.evaluate(()=>ProfileSync.draft().profile.med_doses),'UNSAVED fictional draft');
  assert.ok(!calls.some(c=>c.path==='/api/profile/save'));
  console.log('PASS: checking the preview preserves private edits and generates only from the confirmed medical snapshot');

  published={...healthy,pacemaker:'Sí',anafilaxia_previa:'Sí',tratamiento_oncologico:'Sí',embarazo:'Sí',salud_emocional_dx:'Sí'};revision++;
  assert.equal(await p.evaluate(()=>ProfileSync.checkRemote(true)),true);await visibleChoices(p,8);
  for(let i=0;i<8;i++){
    await p.locator('.web-qr-preview-choice').nth(i).click();
    const actual=decode(await p.locator('.web-qr-preview-image').getAttribute('src'));
    const expected=await p.evaluate(i=>buildQRUrl(QR_TYPES.filter(t=>t.always||(t.condition&&t.condition(MedicalOwner.read())))[i],MedicalOwner.read()),i);
    assert.equal(actual,expected);assert.equal(new URL(actual).searchParams.get('id'),'ALICE');
  }
  assert.equal(await p.locator('#f-med-doses').inputValue(),'UNSAVED fictional draft');
  console.log('PASS: another device’s confirmed update refreshes the open preview; all eight actual symbols match the existing encoder');

  for(const width of [320,390,768,1360]){
    await p.setViewportSize({width,height:1000});
    for(const lang of languages){await p.evaluate(lang=>setLanguage(lang),lang);assert.equal(await p.locator('html').getAttribute('dir'),lang==='ar'?'rtl':'ltr');const geometry=await p.locator('#web-qr-preview').evaluate(el=>{const r=el.getBoundingClientRect();return{left:r.left,right:r.right,width:el.clientWidth,scroll:el.scrollWidth}});assert.ok(geometry.left>=0&&geometry.right<=width+1&&geometry.scroll<=geometry.width+1,'dialog overflow '+width+':'+lang);assert.ok(!(await p.locator('#web-qr-preview').textContent()).includes('undefined'))}
  }
  await p.evaluate(()=>setLanguage('es'));await p.setViewportSize({width:1360,height:1000});await p.screenshot({path:'/tmp/atabey-web-qr-preview-desktop.png'});
  await p.setViewportSize({width:390,height:844});await p.screenshot({path:'/tmp/atabey-web-qr-preview-mobile.png'});
  console.log('PASS: preview fits mobile, tablet and desktop widths 320–1360px in all eleven app languages, including RTL');

  currentStatus=503;assert.equal(await p.evaluate(()=>WebSession.check()),false);
  await p.waitForFunction(()=>!document.getElementById('web-qr-preview').open);
  assert.equal(await p.locator('#web-qr-preview img[src]').count(),0);
  currentStatus=200;await p.getByRole('button',{name:'Volver a comprobar',exact:true}).click();await p.waitForFunction(()=>document.documentElement.style.visibility==='');
  await p.locator('#open-web-qr-preview').click();await visibleChoices(p,8);await p.keyboard.press('Escape');
  console.log('PASS: loss of session verification removes the preview and leaves the original session-recovery button usable');

  responseId='BOB';await p.locator('#open-web-qr-preview').click();await p.locator('.web-qr-preview-retry').waitFor({state:'visible'});
  assert.equal(await p.locator('#web-qr-preview img[src]').count(),0);assert.equal(await p.locator('.web-qr-preview-content').getAttribute('href'),null);
  responseId='ALICE';await p.locator('.web-qr-preview-retry').click();await visibleChoices(p,8);await p.keyboard.press('Escape');
  profileStatus=503;await p.locator('#open-web-qr-preview').click();await p.locator('.web-qr-preview-retry').waitFor({state:'visible'});assert.equal(await p.locator('#web-qr-preview img[src]').count(),0);await p.keyboard.press('Escape');
  profileStatus=200;profileDelay=600;await p.locator('#open-web-qr-preview').click();await p.locator('.web-qr-preview-close').click();await p.waitForTimeout(900);assert.equal(await p.locator('#web-qr-preview img[src]').count(),0);profileDelay=0;
  console.log('PASS: foreign identity, unverified history and late responses cannot populate the preview');

  profileDelay=350;await p.evaluate(()=>{window.fixtureBackgroundRead=ProfileSync.checkRemote(true)});
  await p.locator('#open-web-qr-preview').click();await visibleChoices(p,8);await p.keyboard.press('Escape');
  const started=p.waitForRequest(request=>new URL(request.url()).pathname==='/api/profile/me');
  await p.locator('#open-web-qr-preview').click();await started;await p.locator('.web-qr-preview-close').click();
  await p.locator('#open-web-qr-preview').click();await visibleChoices(p,8);profileDelay=0;
  const readerURL=new URL(await p.locator('.web-qr-preview-content').getAttribute('href'));
  await p.keyboard.press('Escape');
  const readerContext=await context(false,false),reader=await readerContext.newPage();reader.on('pageerror',e=>errors.push(e.message));
  await reader.goto(origin+readerURL.pathname+readerURL.search);await reader.waitForFunction(()=>document.getElementById('app')?.textContent.includes('Alice Fixture'));
  assert.ok((await reader.locator('#app').textContent()).includes('Contacto ficticio'));assert.ok(!(await reader.locator('#app').textContent()).includes('UNSAVED'));
  console.log('PASS: an in-flight refresh and immediate close/reopen recover correctly; the existing public reader opens the saved owner’s information');

  published=null;profileStatus=404;revision++;await p.locator('#open-web-qr-preview').click();await p.waitForFunction(()=>document.querySelector('.web-qr-preview-status')?.textContent.includes('Todavía'));
  assert.equal(await p.locator('#web-qr-preview img[src]').count(),0);await p.keyboard.press('Escape');
  published={...healthy};profileStatus=200;revision++;
  const primary=await context(false),mobile=await primary.newPage();mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(origin+'/index.html');await mobile.waitForFunction(()=>!!window.ProfileSync);assert.equal(await mobile.locator('#open-web-qr-preview').isVisible(),false);assert.equal(await mobile.locator('#web-qr-preview').count(),0);
  const publicContext=await context(false,false),pairing=await publicContext.newPage();pairing.on('pageerror',e=>errors.push(e.message));await pairing.goto(origin+'/web.html');await pairing.waitForFunction(()=>document.querySelector('#link-qr img')?.src.startsWith('data:'));assert.equal(await pairing.locator('#web-qr-preview').count(),0);
  assert.ok(!calls.some(c=>c.path==='/api/profile/save'));assert.deepEqual(errors,[]);
  console.log('PASS: empty history has an explicit state; primary app and public pairing stay unchanged; no medical writes or browser errors');
} finally {await browser?.close();if(server)await new Promise(r=>server.close(r))}})().catch(error=>{console.error(error);process.exitCode=1});
