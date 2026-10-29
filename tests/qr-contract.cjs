const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const baseline=execFileSync('git',['show','3ba253fa0e3983ea88651a09b06e1c6e7e5ece9d:js/qr-generator.js'],{encoding:'utf8'});
const current=fs.readFileSync('js/qr-generator.js','utf8');
function context(source){const storage=new Map();const ctx=vm.createContext({document:{getElementById:()=>null,createElement:()=>({style:{}}),head:{appendChild(){}}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{},console,setTimeout,clearTimeout});ctx.window.MedicalOwner=ctx.MedicalOwner={current:()=>true,read:()=>JSON.parse(storage.get('doctorqr_profile')||'null'),id:()=>storage.get('doctorqr_id')||''};vm.runInContext(source,ctx);return ctx;}
const before=context(baseline),after=context(current);
for(const name of ['buildQRData','buildQRUrl','buildEmergencyQRUrl','createOrganicQRCode','getQRVisualStyle'])test(name+': original medical and cache contract preserved',()=>assert.equal(vm.runInContext(name+'.toString()',after),vm.runInContext(name+'.toString()',before)));
test('QR types, colors and URL type codes are unchanged; selection logic is tested separately',()=>{const expr='JSON.stringify(QR_TYPES.map(({condition,...rest})=>rest))';assert.equal(vm.runInContext(expr,after),vm.runInContext(expr,before));});
test('All QR payloads identical, including accents and special URL characters',()=>{for(const ctx of [before,after]){vm.runInContext(`localStorage.setItem('doctorqr_id','fixture-123');localStorage.setItem('doctorqr_profile',JSON.stringify({nombre:'María & Ana',apellidos:'Prueba / Ficticia',sangre:'O+',allergy_med:['Penicilina & derivados'],ec1_phone_prefix:'+34',ec1_phone_num:'600000000'}))`,ctx)}const expr='JSON.stringify(QR_TYPES.map(t=>buildQRUrl(t,getFormData())))';assert.equal(vm.runInContext(expr,after),vm.runInContext(expr,before));assert.equal(vm.runInContext('buildEmergencyQRUrl()',after),vm.runInContext('buildEmergencyQRUrl()',before));});
test('Drawing failure preserves original QR renderer',()=>{function node(){return{children:[],get firstChild(){return this.children[0]||null},appendChild(child){if(child.parent){child.parent.children.splice(child.parent.children.indexOf(child),1)}child.parent=this;this.children.push(child)}}}const symbol={};const target=node();const ctx=vm.createContext({document:{createElement:node},QRCode:function(original){original.appendChild(symbol);this.makeCode=()=>{};this._oQRCode={getModuleCount(){throw Error('unsupported_style')}}}});vm.runInContext(vm.runInContext('createOrganicQRCode.toString()',after),ctx);ctx.target=target;vm.runInContext('createOrganicQRCode(target,{width:200,height:200})',ctx);assert.equal(target.children.length,1);assert.equal(target.children[0],symbol);});
test('QR encoding failures still propagate to existing retry handling',()=>{const error=Error('encoding_failed');const ctx=vm.createContext({document:{createElement:()=>({})},QRCode:function(){throw error}});vm.runInContext(vm.runInContext('createOrganicQRCode.toString()',after),ctx);assert.throws(()=>vm.runInContext('createOrganicQRCode({}, {})',ctx),e=>e===error);});

test('Actual structured positive answers select specialty views without requiring duplicate condition chips',()=>{
 for(const [id,field]of [['qr-u2','dai'],['qr-u2','acv_previo'],['qr-u2','stents'],['qr-u2','anticoagulado'],['qr-u3','latex_guantes'],['qr-u3','anafilaxia_previa'],['qr-e1','dificultad_intubacion'],['qr-e2','tratamiento_oncologico'],['qr-e4','lactancia'],['qr-e5','salud_emocional_dx']]){
  after.fixture={ [field]:'Sí' };assert.equal(vm.runInContext('QR_TYPES.find(t=>t.id==='+JSON.stringify(id)+').condition(fixture)',after),true,field);
 }
 after.fixture={nombre:'Marcapasos Cáncer activo',email:'epilepsia@example.invalid',profesion:['Psiquiatría'],pacemaker:'No',surgeries:['Ninguna'],meds_psiquiatria:['Ninguna']};assert.equal(vm.runInContext('QR_TYPES.filter(t=>t.always||(t.condition&&t.condition(fixture))).length',after),2);
});
test('Previously recorded condition phrases keep their allergy and lactation QR views',()=>{
 for(const [id,condition]of [['qr-u3','SÍ — anafilaxia confirmada'],['qr-e4','Sí — lactancia materna activa']]){
 after.fixture={conditions:[condition]};assert.equal(vm.runInContext('QR_TYPES.find(t=>t.id==='+JSON.stringify(id)+').condition(fixture)',after),true);
 }
});
test('QR captions and exported patient text use escaped HTML; invalid ages are not invented',()=>{
 after.fixture='<img src=x onerror=alert(1)> & "';const escaped=vm.runInContext('qrEscapeHtml(fixture)',after);assert.ok(escaped.includes('&lt;img'));assert.ok(!escaped.includes('<img'));
 for(const date of ['02/09/1976','1976-02-31','2100-01-01','']){after.fixture=date;assert.equal(vm.runInContext('calcAge(fixture)',after),null);}
});
