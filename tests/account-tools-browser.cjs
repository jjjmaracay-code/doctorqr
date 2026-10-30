'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');const backend=path.resolve(process.env.BACKEND_REPO||path.join(__dirname,'../../doctorqr-backend'));
const {createFixture}=require(backend+'/tests/account-tools-fixture.cjs');const root=path.resolve(__dirname,'..'),origin='https://atabeyapp.app';
(async()=>{const f=await createFixture();let browser;
try{
 const user={nombre:'Alice',apellidos:'Fixture',email:'alice@example.invalid',doc_type:'dni',doc_number:'DOC1',fecha_nacimiento:'1980-01-02',twofa_method:'totp',plan_type:'pro',created_at:1,language:'es'};
 const row=(await f.db.query('SELECT * FROM users WHERE id=1')).rows[0],profile={nombre:'Alice Fixture',email:user.email,doc_type:user.doc_type,doc_number:user.doc_number,fecha_nacimiento:user.fecha_nacimiento,ec1_name:'Original contact',ec1_phone_num:'600000001',sangre:'O+',allergy_med:['Fictional allergy']};
 const cipher=require(backend+'/services/profileCipher');await f.db.query('UPDATE users SET profile_data=$1,updated_at=NOW() WHERE id=1',[cipher.encrypt(profile,row)]);
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'});c.setDefaultTimeout(12000);const errors=[],writes=[];
 await c.addInitScript(({origin,user,token})=>{if(location.origin!==origin||localStorage.getItem('qa-seeded'))return;localStorage.setItem('qa-seeded','1');localStorage.setItem('doctorqr_user',JSON.stringify(user));localStorage.setItem('doctorqr_token',token);localStorage.setItem('doctorqr_id','ALICE-QR');localStorage.setItem('doctorqr_profile_owner','ALICE-QR');localStorage.setItem('atabey_tour_done','1');localStorage.setItem('dqr_tour','1');},{origin,user,token:f.tokens[0]});
 await c.route('**/*',async route=>{
  const req=route.request(),u=new URL(req.url());
  if(u.hostname==='doctorqr-backend-production.up.railway.app'){
   const headers={'access-control-allow-origin':origin,'access-control-allow-credentials':'true','access-control-allow-headers':'Content-Type,Authorization','access-control-allow-methods':'GET,POST,OPTIONS'};
   if(req.method()==='OPTIONS')return route.fulfill({status:204,headers});
   if(u.pathname.startsWith('/api/wallet/'))return route.fulfill({headers,contentType:'application/json',body:JSON.stringify({apple:false,google:false})});
   if(u.pathname==='/api/auth/logout'){await f.db.query('DELETE FROM sessions WHERE token=$1',[req.headers().authorization?.split(' ')[1]]);return route.fulfill({headers,contentType:'application/json',body:JSON.stringify({success:true})});}
   writes.push({path:u.pathname,method:req.method(),body:req.postData()});const response=await route.fetch({url:f.base+u.pathname+u.search});return route.fulfill({response,headers:{...response.headers(),...headers}});
  }
  if(u.origin!==origin)return route.abort();if(u.pathname==='/sw.js')return route.abort();
  const file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'Missing local fixture asset'});
  return route.fulfill({contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
 });
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin+'/index.html');await p.waitForFunction(()=>document.getElementById('f-ec1-name')?.value==='Original contact'&&!document.documentElement.dataset.accessGate).catch(async e=>{console.log({errors,writes,state:await p.evaluate(()=>({url:location.href,gate:document.documentElement.dataset.accessGate,own:window.MedicalOwner?.current(),contact:document.getElementById('f-ec1-name')?.value,message:document.getElementById('profile-sync-message')?.textContent,access:document.getElementById('account-access-gate')?.textContent}))});throw e;});
 const cdp=await c.newCDPSession(p);await cdp.send('WebAuthn.enable');await cdp.send('WebAuthn.addVirtualAuthenticator',{options:{protocol:'ctap2',transport:'internal',hasResidentKey:true,hasUserVerification:true,isUserVerified:true,automaticPresenceSimulation:true}});
 await p.locator('#form-edit-tab-medical').click();await p.locator('.fel-dialog[open] .fel-enable').click();await p.locator('#account-access-tools summary').click();await p.locator('#passkey-enable').click();
 await p.waitForFunction(()=>document.querySelector('#account-access-tools [role="status"]').textContent.includes('Activado'),{},{timeout:20000});
 assert.equal((await f.db.query("SELECT * FROM app_passkeys WHERE app='atabey'")).rows.length,1);
 // Saving and restoring go through the actual encrypted profile routes.
 await p.locator('#sec-10 .section-header').click();await p.locator('#f-ec1-name').fill('Updated contact');await p.evaluate(()=>ProfileSync.save(buildProfileFromForm()));
 await p.waitForFunction(()=>document.getElementById('f-ec1-name').value==='Updated contact');
 if(await p.evaluate(()=>FormEditLock.isLocked('medical'))){await p.locator('#form-edit-tab-medical').click();await p.locator('.fel-dialog[open] .fel-enable').click();}
 await p.locator('#profile-sync-undo').click();await p.locator('#account-tools-confirm').click();await p.waitForFunction(()=>document.getElementById('f-ec1-name').value==='Original contact');
 assert.equal(await p.evaluate(()=>FormEditLock.isLocked('medical')),true);assert.equal((await f.db.query('SELECT * FROM users WHERE id=2')).rows[0].profile_data,null);
 await p.evaluate(()=>document.getElementById('account-access-tools').open=true);await p.locator('#account-access-tools').screenshot({path:'/tmp/atabey-account-tools-mobile.png'});
 await p.locator('#btn-logout').click();await p.waitForURL('**/login.html');assert.equal(await p.evaluate(()=>localStorage.getItem('doctorqr_token')),null);
 await p.locator('#passkey-login').click();await p.waitForURL('**/index.html');await p.waitForFunction(()=>document.getElementById('f-ec1-name')?.value==='Original contact');
 assert.equal(await p.evaluate(()=>localStorage.getItem('doctorqr_id')),'ALICE-QR');assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('doctorqr_user')).email),'alice@example.invalid');
 for(const size of [{width:320,height:568},{width:390,height:844},{width:844,height:390}]){await p.setViewportSize(size);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
 assert.deepEqual(errors,[]);console.log('PASS: actual medical UI activates a verified passkey, saves/restores only its account, keeps the edit lock, logs out and signs in without password entry; mobile/landscape fit.');
}finally{await browser?.close();await f.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
