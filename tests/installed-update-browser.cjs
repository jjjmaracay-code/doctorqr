// Real-browser migration regression. Uses fictional patients and a local API only.
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=process.cwd();let modern=false,revision=1,published=null;
const user={nombre:'Alice',apellidos:'Fixture',email:'alice@gmail.com',doc_type:'dni',doc_number:'A123',fecha_nacimiento:'1976-09-02',twofa_method:'totp',plan_type:'trial',created_at:Math.floor(Date.now()/1000),language:'es'};
const review={...user,nombre:'Alice Fixture',apellidos:'',sangre:'0+',allergy_med:['Penicilina'],med_doses:'Fictional QA dose',ec1_name:'Fictional contact',ec1_phone_num:'600000000'};
const rev=()=>String(revision).padStart(64,'0');const calls=[];
const server=http.createServer(async(req,res)=>{const u=new URL(req.url,'http://local');res.setHeader('Cache-Control','no-store');if(u.pathname.startsWith('/api/profile/')){res.setHeader('Content-Type','application/json');const send=(status,data)=>{res.statusCode=status;res.end(JSON.stringify(data))};if(u.pathname.endsWith('/me'))return send(published?200:409,{doctorqr_id:'ALICE',profile_revision:rev(),plan_type:'trial',...(published?{profile:published}:{code:'profile_identity_mismatch',review_profile:review,review_reason:'birthdate_corrected'})});if(u.pathname.endsWith('/load'))return send(published?200:409,published?{doctorqr_id:'ALICE',profile:published}:{code:'profile_identity_mismatch'});if(u.pathname.endsWith('/save')){let body='';for await(const chunk of req)body+=chunk;const b=JSON.parse(body);calls.push(b);if(b.base_revision!==rev())return send(409,{code:'profile_conflict'});assert.equal(b.profile.email,user.email);assert.equal(b.profile.fecha_nacimiento,user.fecha_nacimiento);published=b.profile;revision++;return send(200,{success:true,doctorqr_id:'ALICE',profile_revision:rev(),profile:published,updated_at:'2026-10-25T20:00:00Z'})}}if(u.pathname==='/bootstrap.html')return res.end('<html><body>Legacy cache setup</body></html>');if(u.pathname==='/cache-probe.html')return res.end('<html><body><script src="/js/form.js"></script></body></html>');let file=path.join(root,u.pathname==='/'?'index.html':u.pathname);if(u.pathname==='/sw.js'&&!modern)file=path.join(root,'tests/fixtures/pre-sync-sw.js');try{const data=fs.readFileSync(file);const mime={'.js':'application/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)}catch{res.statusCode=404;res.end('missing fixture asset')}});
(async()=>{await new Promise(r=>server.listen(8811,'127.0.0.1',r));const origin='http://127.0.0.1:8811';const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||chromium.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--single-process']});try{
async function context(person=user,id='ALICE'){const c=await browser.newContext({viewport:{width:1360,height:1000},locale:'es-ES'});await c.addInitScript(({person,id,origin})=>{if(!location.href.startsWith(origin))return;const nativeFetch=window.fetch;window.fetch=(url,opts)=>{const u=new URL(typeof url==='string'?url:url.url,location.href);return nativeFetch(u.hostname==='doctorqr-backend-production.up.railway.app'?origin+u.pathname+u.search:url,opts)};if(!localStorage.getItem('qa-seeded')){localStorage.setItem('qa-seeded','1');localStorage.setItem('doctorqr_user',JSON.stringify(person));localStorage.setItem('doctorqr_id',id);localStorage.setItem('doctorqr_token','fictional-token-'+id);localStorage.setItem('doctorqr_profile_owner',id)}},{person,id,origin});return c;}
const c=await context(),p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(origin+'/bootstrap.html');await p.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready});await p.waitForFunction(()=>!!navigator.serviceWorker.controller);await p.evaluate(async()=>{const cache=await caches.open('doctorqr-v9');await cache.put('/i18n/es.json',new Response(JSON.stringify({'index.qr.generate_button':'OLD GENERATE'}),{headers:{'Content-Type':'application/json'}}));await cache.put('/js/form.js',new Response('window.__OLD_FORM_EXECUTED=true;', {headers:{'Content-Type':'application/javascript'}}));await cache.put('/js/medical-owner.js?v=1',new Response('window.__OLD_OWNER_EXECUTED=true;',{headers:{'Content-Type':'application/javascript'}}));});await p.goto(origin+'/cache-probe.html');assert.equal(await p.evaluate(()=>window.__OLD_FORM_EXECUTED),true);console.log('PASS: reproduced old worker serving stale unversioned form');
modern=true;await p.goto(origin+'/index.html');await p.waitForFunction(()=>!!window.ProfileSync?.draft());assert.equal(await p.locator('#plans-ov').isVisible(),false);assert.equal(await p.locator('#tour-ov').isVisible(),false);assert.equal(await p.evaluate(()=>window.__OLD_FORM_EXECUTED),undefined);assert.ok((await p.locator('.btn-generate').textContent()).includes('Guardar y actualizar'));assert.equal(await p.locator('html').getAttribute('data-app-release'),'14');await p.waitForFunction(()=>document.getElementById('f-blood').value==='0+');assert.equal(await p.locator('#f-blood').inputValue(),'0+');assert.equal(await p.locator('#f-med-doses').inputValue(),'Fictional QA dose');assert.ok((await p.locator('#profile-sync-message').textContent()).includes('recuperó'));assert.equal(await p.evaluate(()=>MedicalOwner.read()),null);console.log('PASS: old-cache migration loads current code and restores owner review without public release');
assert.equal(await p.locator('#f-name').inputValue(),'Alice Fixture');
assert.equal(await p.locator('#f-name').evaluate(e=>e.readOnly),true);
assert.equal(await p.locator('#f-birthdate-readable').evaluate(e=>e.readOnly),true);
assert.equal(await p.locator('#email-alias').evaluate(e=>e.readOnly),true);
assert.equal(await p.locator('#input-dni').evaluate(e=>e.readOnly),true);
assert.equal(await p.locator('#email-domain').isDisabled(),true);
assert.ok(await p.locator('[data-group="doc-type"]').first().evaluate(e=>e.hasAttribute('inert')));
assert.equal(await p.locator('#f-med-doses').evaluate(e=>e.readOnly),false);
assert.equal(await p.locator('#identity-locked-notice').count(),1);
console.log('PASS: registration identity is locked while medical history stays editable');
const originalClinical=await p.locator('#f-med-doses').inputValue();
for (const language of ['es','en','fr','de','pt','eu','hi','zh','ru','ja','ar']) {
  await p.evaluate(language=>setLanguage(language),language);
  assert.equal(await p.locator('html').getAttribute('lang'),language);
  assert.equal(await p.locator('html').getAttribute('dir'),language==='ar'?'rtl':'ltr');
  assert.equal(await p.locator('#f-med-doses').inputValue(),originalClinical);
  assert.equal(await p.locator('#f-name').inputValue(),'Alice Fixture');
  assert.equal(await p.locator('#f-birthdate').inputValue(),'1976-09-02');
}
await p.setViewportSize({width:390,height:844});await p.locator('#app-language-select').scrollIntoViewIfNeeded();await p.screenshot({path:'/tmp/atabey-arabic-mobile.png'});
assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
await p.setViewportSize({width:1360,height:1000});await p.evaluate(()=>setLanguage('es'));
console.log('PASS: all 11 application languages preserve patient data, Arabic RTL and mobile width');

await p.evaluate(()=>{document.getElementById('sec-2')?.classList.add('open');document.getElementById('sec-3')?.classList.add('open');});
await p.locator('[data-group="sexo-biologico"] [data-value="Masculino"]').click();
await p.waitForFunction(()=>document.getElementById('pregnancy-block').hasAttribute('inert'));
assert.equal(await p.locator('#field-semanas-gestacion').isVisible(),false);
await p.locator('#reproductive-note').scrollIntoViewIfNeeded();await p.screenshot({path:'/tmp/atabey-audit-desktop.png'});
await p.setViewportSize({width:390,height:844});await p.screenshot({path:'/tmp/atabey-audit-mobile.png'});
assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile must not overflow');
await p.setViewportSize({width:1360,height:1000});
console.log('PASS: real-browser male gating, pediatric exclusion and mobile width');
await p.evaluate(()=>{checkSeccionesVacias=()=>[]});await p.locator('.btn-generate').click();await p.waitForFunction(()=>document.getElementById('profile-sync-message').textContent.includes('Guardado en el servidor'));await p.waitForFunction(()=>!!document.querySelector('#qr-carousel img'));assert.equal(published.med_doses,'Fictional QA dose');assert.ok(published.allergy_med.includes('Penicilina'));assert.ok(calls[0].base_revision.endsWith('1'));const imageSrc=await p.locator('#qr-carousel img').first().getAttribute('src');const png=require('pngjs').PNG.sync.read(Buffer.from(imageSrc.split(',')[1],'base64'));const decoded=require('jsqr')(new Uint8ClampedArray(png.data),png.width,png.height);assert.ok(decoded,'Actual generated QR image must decode');const url=decoded.data;assert.ok(url.includes('id=ALICE'));assert.equal(errors.length,0,errors.join('\n'));console.log('PASS: real form serializes clinical fields, publishes and draws QR after confirmation');
const scan=await context({...user,nombre:'Bob',apellidos:'Other',email:'bob@example.invalid'},'BOB');const reader=await scan.newPage();await reader.goto(url.replace('https://atabeyapp.app',origin));await reader.waitForFunction(()=>document.querySelector('#app').textContent.includes('Alice Fixture'));assert.ok(!(await reader.locator('#app').textContent()).includes('Bob Other'));console.log('PASS: QR opens the published patient on a different patient device');
const scannerPreference=await reader.evaluate(()=>localStorage.getItem('doctorqr_ui_language'));
for (const language of ['es','en','fr','de','pt','eu','hi','zh','ru','ja','ar']) {
 await reader.evaluate(language=>setLang(language),language);
 assert.equal(await reader.locator('html').getAttribute('lang'),language);
 assert.ok((await reader.locator('#app').textContent()).includes('Alice Fixture'));
 assert.equal(await reader.evaluate(()=>localStorage.getItem('doctorqr_ui_language')),scannerPreference);
}
await reader.setViewportSize({width:390,height:844});await reader.screenshot({path:'/tmp/atabey-qr-arabic-mobile.png'});
assert.ok(await reader.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
console.log('PASS: all 11 QR languages are independent and preserve clinical text');

await p.waitForFunction(async()=> (await caches.keys()).includes('doctorqr-v14'));await c.setOffline(true);await p.goto(origin+'/index.html');await p.waitForFunction(()=>typeof window.ProfileSync==='object'&&document.getElementById('f-med-doses').value==='Fictional QA dose');const before=revision;const result=await p.evaluate(async()=>{const profile=buildProfileFromForm();profile.med_doses='Offline fictional edit';return ProfileSync.save(profile)});assert.equal(result.success,false);assert.equal(revision,before);assert.equal(await p.evaluate(()=>ProfileSync.draft().profile.med_doses),'Offline fictional edit');console.log('PASS: new offline installation preserves drafts and does not pretend to publish');await c.setOffline(false);
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
