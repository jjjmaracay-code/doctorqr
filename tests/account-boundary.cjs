'use strict';
// Regression fixtures are fictional. No patient account or external API is used.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const alice={nombre:'Alice',apellidos:'Fixture',email:'alice@example.invalid',doc_type:'dni',doc_number:'A123',fecha_nacimiento:'1980-01-01'};
const bob={...alice,nombre:'Bob',email:'bob@example.invalid',doc_number:'B456'};
function setup(){
 const dom=new JSDOM('<!doctype html><html><head></head><body><div id="qr-carousel"></div><div id="qr-dots"></div><section id="qr-section"></section><div id="profile-sync-panel"><p id="profile-sync-message"></p></div></body></html>',{url:'https://atabeyapp.app/index.html',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.setInterval=()=>0;w.alert=()=>{};
 for(const [key,value]of Object.entries({doctorqr_token:'alice-token',doctorqr_id:'ALICE',doctorqr_profile_owner:'ALICE',doctorqr_user:JSON.stringify(alice),doctorqr_profile:JSON.stringify(alice)}))w.localStorage.setItem(key,value);
 w.eval(fs.readFileSync('js/medical-owner.js','utf8'));w.eval(fs.readFileSync('js/qr-generator.js','utf8'));
 return {w,close:()=>w.close(),switch(){w.MedicalOwner.bindSession({token:'bob-token',doctorqr_id:'BOB',user:bob});w.localStorage.setItem('doctorqr_profile',JSON.stringify(bob));}};
}
test('A delayed QR callback cannot label an old patient image as the new account',()=>{
 const c=setup();c.switch();c.w.saveQRCacheEntry('qr-emergency','data:image/png;base64,QUxJQ0U=','https://atabeyapp.app/card.html?id=ALICE&t=emergency');
 assert.equal(c.w.localStorage.getItem('doctorqr_qr_cache'),null);c.close();
});
test('A cache envelope with the current owner never authorizes another QR target',()=>{
 const c=setup();c.w.localStorage.setItem('doctorqr_qr_cache',JSON.stringify({owner:'ALICE',images:{'qr-emergency':'data:image/png;base64,Qk9C'},urls:{'qr-emergency':'https://atabeyapp.app/card.html?id=BOB&t=emergency'}}));
 assert.equal(c.w.getQRCache().images?.['qr-emergency'],undefined);c.close();
});
test('QR cache rejects a foreign host, ambiguous ID and non-reader route',()=>{
 const c=setup();for(const url of ['https://foreign.invalid/card.html?id=ALICE','https://atabeyapp.app/card.html?id=ALICE&id=BOB','https://atabeyapp.app/login.html?id=ALICE']){
  c.w.saveQRCacheEntry('qr-emergency','data:image/png;base64,QUxJQ0U=',url);assert.equal(c.w.localStorage.getItem('doctorqr_qr_cache'),null,url);
 }c.close();
});
test('The unchanged account retains its valid QR image and exact target',()=>{
 const c=setup(),url=c.w.buildQRUrl({id:'qr-emergency'},alice);c.w.saveQRCacheEntry('qr-emergency','data:image/png;base64,QUxJQ0U=',url);
 assert.equal(c.w.getQRCache().urls['qr-emergency'],url);c.close();
});
test('Changing immutable user metadata invalidates an old tab even if token and QR ID are unchanged',()=>{
 const c=setup();c.w.localStorage.setItem('doctorqr_user',JSON.stringify(bob));assert.equal(c.w.MedicalOwner.current(),false);assert.throws(()=>c.w.MedicalOwner.write(bob));c.close();
});
test('Contradictory personal aliases or embedded owner tags cannot become a local profile',()=>{
 const c=setup();for(const extra of [{name:'Bob Fixture'},{dni:'B456'},{birthdate:'1990-01-01'},{_profile_owner:'BOB'},{doctorqr_id:'BOB'}])assert.equal(c.w.MedicalOwner.matches({...alice,...extra}),false,JSON.stringify(extra));c.close();
});
test('A delayed profile load returns no previous patient after a session switch',async()=>{
 const c=setup(),w=c.w;let release;w.fetch=()=>new Promise(resolve=>release=()=>resolve({ok:true,status:200,json:async()=>({doctorqr_id:'ALICE',profile:alice,profile_revision:'a'.repeat(64),snapshot_token:'b'.repeat(64)})}));
 w.eval(fs.readFileSync('js/profile-sync.js','utf8'));const pending=w.ProfileSync.load();c.switch();release();assert.equal(await pending,null);assert.equal(JSON.parse(w.localStorage.getItem('doctorqr_profile')).email,bob.email);c.close();
});
test('A rejected profile response cannot revive a cached patient as a confirmed QR source',async()=>{
 const c=setup(),w=c.w;w.fetch=async()=>({ok:false,status:401,json:async()=>({error:'Session rejected fixture'})});w.eval(fs.readFileSync('js/profile-sync.js','utf8'));
 assert.equal(await w.ProfileSync.load(),null);assert.equal(w.MedicalOwner.read(),null);assert.equal(w.localStorage.getItem('doctorqr_qr_cache'),null);c.close();
});

test('A delayed web-session check cannot unlock an old page or erase a newly linked account',async()=>{
 const c=setup(),w=c.w;const releases=[];
 for(const [key,value]of Object.entries({atabey_web_session:'1',doctorqr_token:'linked-alice-token',doctorqr_id:'ALICE',doctorqr_user:JSON.stringify(alice)}))w.sessionStorage.setItem(key,value);
 w.fetch=()=>new Promise(resolve=>releases.push(()=>resolve({ok:true,status:200,json:async()=>({linked:true})})));
 w.eval(fs.readFileSync('js/web-session.js','utf8'));
 w.sessionStorage.setItem('doctorqr_token','linked-bob-token');w.sessionStorage.setItem('doctorqr_id','BOB');w.sessionStorage.setItem('doctorqr_user',JSON.stringify(bob));
 releases.forEach(release=>release());assert.equal(await w.WebSession.ready,false);assert.equal(w.document.documentElement.style.visibility,'hidden');assert.equal(w.sessionStorage.getItem('doctorqr_id'),'BOB');assert.equal(w.sessionStorage.getItem('doctorqr_token'),'linked-bob-token');c.close();
});

test('A refresh with a foreign response clears the confirmed cache and never adopts the other patient',async()=>{
 const c=setup(),w=c.w;const meta={profile_revision:'a'.repeat(64),snapshot_token:'b'.repeat(64)};
 w.fetch=async()=>({ok:true,status:200,json:async()=>({doctorqr_id:'ALICE',profile:alice,...meta})});w.eval(fs.readFileSync('js/profile-sync.js','utf8'));await w.ProfileSync.load();
 w.fetch=async()=>({ok:true,status:200,json:async()=>({doctorqr_id:'BOB',profile:bob,...meta})});assert.equal(await w.ProfileSync.checkRemote(true),false);assert.equal(w.MedicalOwner.read(),null);assert.equal(w.localStorage.getItem('doctorqr_qr_cache'),null);c.close();
});
test('Revoked credentials on refresh remove the published snapshot without displaying a cached patient',async()=>{
 const c=setup(),w=c.w;w.fetch=async()=>({ok:true,status:200,json:async()=>({doctorqr_id:'ALICE',profile:alice,profile_revision:'a'.repeat(64),snapshot_token:'b'.repeat(64)})});w.eval(fs.readFileSync('js/profile-sync.js','utf8'));await w.ProfileSync.load();
 w.fetch=async()=>({ok:false,status:401,json:async()=>({error:'Revoked fixture session'})});assert.equal(await w.ProfileSync.checkRemote(true),false);assert.equal(w.MedicalOwner.read(),null);c.close();
});
test('A rejected session quarantines published data while preserving its private unsaved draft',async()=>{
 const c=setup(),w=c.w,draft={format:2,owner:'ALICE',profile:{...alice,med_doses:'Private Alice draft fixture'},changes:{med_doses:'Private Alice draft fixture'}};
 w.localStorage.setItem('doctorqr_medical_changes',JSON.stringify(draft));w.fetch=async()=>({ok:false,status:401,json:async()=>({error:'Revoked fixture session'})});w.eval(fs.readFileSync('js/profile-sync.js','utf8'));
 assert.equal(await w.ProfileSync.load(),null);w.ProfileSync.connectForm(()=>({...alice,med_doses:''}),()=>{});
 assert.deepEqual(JSON.parse(w.localStorage.getItem('doctorqr_medical_changes')),draft);assert.equal(w.ProfileSync.saveDraft({...alice,med_doses:'must not replace quarantined draft'}),false);assert.equal(w.MedicalOwner.read(),null);c.close();
});
