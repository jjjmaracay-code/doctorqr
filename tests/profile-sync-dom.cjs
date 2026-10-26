// Behavioral tests for automatic, field-based synchronization. Fictional patients only.
const {test}=require('node:test'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom'),fs=require('node:fs');
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const user={nombre:'Alice',apellidos:'Fixture',email:'alice@example.invalid',doc_type:'dni',doc_number:'A123',fecha_nacimiento:'1980-01-01'};
const patient={...user,nombre:'Alice Fixture',apellidos:'',sangre:'A+',med_doses:'initial QA',ec1_name:'initial contact QA'};
function server(){return{profile:clone(patient),version:1,writes:0,fail:false,code:null,review:null,requests:[],rev(){return String(this.version).padStart(64,'0');}};}
function client(s,seed={}){
 const dom=new JSDOM('<section id="profile-sync-panel"><p id="profile-sync-message"></p><div id="profile-sync-choices"><button id="profile-sync-use-server"></button><button id="profile-sync-use-draft"></button></div></section><input id="editing-field">',{url:'https://fixture.invalid',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.setInterval=()=>1;w.confirm=()=>{throw Error('Version selection must not be requested');};
 for(const [key,value]of Object.entries({doctorqr_user:JSON.stringify(user),doctorqr_id:'ALICE',doctorqr_token:'alice-token',doctorqr_profile_owner:'ALICE',...seed}))w.localStorage.setItem(key,value);
 let view=clone(patient),holdSave=false,releaseSave=null,holdRead=false,releaseRead=null,published=0,synchronized=0;
 const response=(status,data)=>({status,ok:status>=200&&status<300,json:async()=>clone(data)});
 const meta=()=>({doctorqr_id:'ALICE',profile_revision:s.rev(),snapshot_token:'f'.repeat(64),updated_at:'2026-10-26T00:00:'+String(s.version).padStart(2,'0')+'Z'});
 w.fetch=async(url,options)=>{
  s.requests.push({url,method:options.method,body:options.body?JSON.parse(options.body):null});if(s.fail)throw Error('offline QA');
  if(url.endsWith('/save')){
   const body=JSON.parse(options.body);if(holdSave)await new Promise(r=>releaseSave=r);
   if(s.saveError)return response(s.saveError.status,s.saveError.body);
   const previous=JSON.stringify(s.profile),next={...(s.profile||{}),...body.profile,...body.changes};
   const changed=JSON.stringify(next)!==previous;if(changed){s.profile=next;s.version++;s.writes++;s.code=null;}
   return response(200,{success:true,changed,profile:s.profile,...meta()});
  }
  const result=response(s.code==='missing'?404:s.code?409:200,{...meta(),...(s.code?{code:s.code,...(s.review?{review_profile:s.review,review_reason:'birthdate_corrected'}:{})}:{profile:s.profile})});
  if(holdRead)await new Promise(r=>releaseRead=r);return result;
 };
 w.eval(fs.readFileSync('js/medical-owner.js','utf8'));w.eval(fs.readFileSync('js/profile-sync.js','utf8'));
 w.addEventListener('doctorqr:profile-published',()=>published++);w.addEventListener('doctorqr:profile-synchronized',()=>synchronized++);
 return{w,api:w.ProfileSync,async load(){const data=await this.api.load();view=clone(data||patient);this.api.connectForm(()=>clone(view),p=>view=clone(p||patient));await new Promise(r=>setImmediate(r));return clone(view);},edit(changes){view={...view,...clone(changes)};return this.api.saveDraft(view);},save(){return this.api.save(clone(view));},view:()=>clone(view),published:()=>published,synchronized:()=>synchronized,holdSave(){holdSave=true;},releaseSave(){holdSave=false;releaseSave?.();},holdRead(){holdRead=true;},releaseRead(){holdRead=false;releaseRead?.();},close:()=>w.close()};
}
const tick=()=>new Promise(r=>setImmediate(r));
test('A newer server snapshot replaces an older cached confirmed snapshot without creating a conflict or draft',async()=>{
 const s=server(),old={...patient,med_doses:'stale cached QA'},c=client(s,{doctorqr_profile:JSON.stringify(old)});
 assert.equal((await c.load()).med_doses,'initial QA');assert.equal(c.api.draft(),null);assert.equal(c.w.document.getElementById('profile-sync-choices').children.length,0);c.close();
});
test('A legacy unpublished draft is retained privately and never replaces a newer published record',async()=>{
 const s=server(),legacy={owner:'ALICE',profile:{...patient,med_doses:'legacy unsaved QA'},base_revision:'0'.repeat(64)},c=client(s,{doctorqr_medical_draft:JSON.stringify(legacy)});
 assert.equal((await c.load()).med_doses,'initial QA');assert.deepEqual(JSON.parse(c.w.localStorage.getItem('doctorqr_medical_draft')),legacy);assert.equal(s.writes,0);c.close();
});
test('Two devices edit different fields and both updates survive automatically',async()=>{
 const s=server(),a=client(s),b=client(s);await a.load();await b.load();a.edit({med_doses:'device A QA'});b.edit({ec1_name:'device B QA'});
 assert.equal((await a.save()).success,true);assert.equal((await b.save()).success,true);assert.equal(s.profile.med_doses,'device A QA');assert.equal(s.profile.ec1_name,'device B QA');assert.equal(b.view().med_doses,'device A QA');
 assert.deepEqual(s.requests.filter(r=>r.method==='POST').map(r=>Object.keys(r.body.changes)),[['med_doses'],['ec1_name']]);a.close();b.close();
});
test('The last save of the same field wins without a compare-or-choose dialog',async()=>{
 const s=server(),a=client(s),b=client(s);await a.load();await b.load();a.edit({med_doses:'first QA'});b.edit({med_doses:'last QA'});await a.save();assert.equal((await b.save()).success,true);assert.equal(s.profile.med_doses,'last QA');a.close();b.close();
});
test('Saving an unchanged stale form adopts the latest data without sending stale fields',async()=>{
 const s=server(),a=client(s),b=client(s);await a.load();await b.load();a.edit({med_doses:'newest QA'});await a.save();const version=s.version;
 const result=await b.save();assert.equal(result.changed,false);assert.equal(s.version,version);assert.deepEqual(s.requests.at(-1).body.changes,{});assert.equal(b.view().med_doses,'newest QA');a.close();b.close();
});
test('A refresh applies newer remote data and keeps unrelated local edits unpublished',async()=>{
 const s=server(),c=client(s);await c.load();c.edit({ec1_name:'local pending QA'});s.profile.med_doses='remote published QA';s.version++;
 assert.equal(await c.api.checkRemote(true),true);assert.equal(c.view().med_doses,'remote published QA');assert.equal(c.view().ec1_name,'local pending QA');assert.equal(c.api.draft().changes.ec1_name,'local pending QA');assert.equal(c.w.MedicalOwner.read().ec1_name,'initial contact QA');assert.equal(c.synchronized(),1);assert.equal(s.writes,0);c.close();
});
test('Editing and then reverting a field creates no server change',async()=>{
 const s=server(),c=client(s);await c.load();c.edit({med_doses:'temporary QA'});c.edit({med_doses:'initial QA'});assert.equal(c.api.draft(),null);assert.equal((await c.save()).changed,false);assert.equal(s.writes,0);c.close();
});
test('A field cleared intentionally is an explicit change, rather than a truncated full profile',async()=>{
 const s=server(),c=client(s);await c.load();c.edit({ec1_name:''});assert.equal((await c.save()).success,true);assert.equal(s.profile.ec1_name,'');assert.deepEqual(s.requests.at(-1).body.changes,{ec1_name:''});c.close();
});
test('Changes made while saving remain pending and do not appear in the published QR snapshot',async()=>{
 const s=server(),c=client(s);await c.load();c.edit({med_doses:'sent QA'});c.holdSave();const saving=c.save();await tick();c.edit({med_doses:'typed later QA'});c.releaseSave();assert.equal((await saving).success,true);assert.equal(s.profile.med_doses,'sent QA');assert.equal(c.view().med_doses,'typed later QA');assert.equal(c.api.draft().changes.med_doses,'typed later QA');assert.equal(c.w.MedicalOwner.read().med_doses,'sent QA');c.close();
});
test('Reverting to the old value while its replacement saves is kept as a later unsaved edit',async()=>{
 const s=server(),c=client(s);await c.load();c.edit({med_doses:'sent QA'});c.holdSave();const saving=c.save();await tick();c.edit({med_doses:'initial QA'});c.releaseSave();await saving;assert.equal(s.profile.med_doses,'sent QA');assert.equal(c.api.draft().changes.med_doses,'initial QA');c.close();
});
test('Offline failure preserves the owner-bound change list and never announces publication',async()=>{
 const s=server(),c=client(s);await c.load();c.edit({med_doses:'offline pending QA'});s.fail=true;assert.equal((await c.save()).success,false);assert.equal(c.api.draft().changes.med_doses,'offline pending QA');assert.equal(s.profile.med_doses,'initial QA');assert.equal(c.published(),0);assert.ok(c.w.localStorage.getItem('doctorqr_medical_changes'));c.close();
});
test('A persisted new-format draft rebases onto the latest server snapshot',async()=>{
 const s=server(),seed={format:2,owner:'ALICE',profile:{...patient,ec1_name:'persisted local QA'},changes:{ec1_name:'persisted local QA'},base_revision:'0'.repeat(64)};s.profile.med_doses='new server QA';s.version++;
 const c=client(s,{doctorqr_medical_changes:JSON.stringify(seed)});await c.load();assert.equal(c.view().med_doses,'new server QA');assert.equal(c.view().ec1_name,'persisted local QA');assert.equal((await c.save()).success,true);assert.equal(s.profile.med_doses,'new server QA');c.close();
});
test('A delayed read cannot replace a newer successful save',async()=>{
 const s=server(),c=client(s);await c.load();c.holdRead();const read=c.api.checkRemote(true);await tick();c.edit({med_doses:'new saved QA'});await c.save();c.releaseRead();assert.equal(await read,false);assert.equal(c.view().med_doses,'new saved QA');assert.equal(c.api.revision,s.rev());c.close();
});
test('Account switching while a save is in flight never writes its response into another account',async()=>{
 const s=server(),c=client(s);await c.load();c.edit({med_doses:'Alice pending QA'});c.holdSave();const saving=c.save();await tick();c.w.MedicalOwner.bindSession({token:'bob-token',doctorqr_id:'BOB',user:{...user,nombre:'Bob',email:'bob@example.invalid'}});c.releaseSave();assert.equal((await saving).success,false);assert.equal(c.w.localStorage.getItem('doctorqr_profile'),null);assert.equal(c.w.localStorage.getItem('doctorqr_medical_changes'),null);c.close();
});
test('Foreign-account drafts are not adopted or published',async()=>{
 const s=server(),c=client(s,{doctorqr_medical_changes:JSON.stringify({format:2,owner:'BOB',profile:patient,changes:{med_doses:'foreign QA'}})});await c.load();assert.equal(c.api.draft(),null);assert.equal(c.view().med_doses,'initial QA');assert.equal(c.api.saveDraft({...patient,email:'bob@example.invalid'}),false);c.close();
});
test('Birthdate-only recovery remains private until the owner explicitly saves',async()=>{
 const s=server();s.code='profile_identity_mismatch';s.profile=null;s.review={...patient,med_doses:'reviewed recovery QA'};const c=client(s);await c.load();assert.equal(c.view().med_doses,'reviewed recovery QA');assert.equal(c.w.MedicalOwner.read(),null);assert.equal(s.writes,0);assert.equal((await c.save()).success,true);assert.equal(s.profile.med_doses,'reviewed recovery QA');c.close();
});
test('Automatic refresh waits while a user edits a field',async()=>{
 const s=server(),c=client(s);await c.load();c.w.document.getElementById('editing-field').focus();const count=s.requests.length;s.profile.med_doses='new remote QA';s.version++;assert.equal(await c.api.checkRemote(),false);assert.equal(s.requests.length,count);c.w.document.getElementById('editing-field').blur();await new Promise(r=>setTimeout(r,20));assert.equal(c.view().med_doses,'new remote QA');c.close();
});

test('Repeated automatic focus checks are coalesced to one read per minute and never publish',async()=>{
 const s=server(),c=client(s);await c.load();const before=s.requests.length;
 for(let i=0;i<12;i++)await c.api.checkRemote();
 assert.equal(s.requests.length,before+1);assert.equal(s.writes,0);
 assert.equal(await c.api.checkRemote(true),true);assert.equal(s.requests.length,before+2);c.close();
});
