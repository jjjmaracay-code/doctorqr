// Independent module contract. No application, card, backend or existing renderer loads.
// Optional QR_MODULE_PATH permits a temporary mutation outside the repository.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const modulePath=process.env.QR_MODULE_PATH||path.resolve('js/offline-emergency-qr.js');
const API=require(modulePath);
const contact={ec1_name:'Maria Lopez Fernandez',ec1_rel:'Cónyuge/Pareja',ec1_phone_prefix:'+34',ec1_phone_num:'600 12 34 56'};
const FULL={offline_qr_consent:true,nombre:'Juan Antonio Perez Garcia',sangre:'O+',...contact,
 allergy_med:['Penicilina','AINE'],allergy_food:['Cacahuetes'],allergy_env:['Polen'],allergy_insect:['Picadura avispa'],
 allergy_severity:{Penicilina:'Anafiláctica',Polen:'Leve'},anticoagulado:'SÍ — ANTICOAGULADO',
 dificultad_intubacion:'SÍ — intubación difícil documentada',pacemaker:'SÍ',dai:'SÍ — llevo DAI',stents:'Sí',
 diseases:['Diabetes T1','Asma','Dermatitis atópica','Hipotiroidismo'],conditions:['Bomba insulina','DIU'],
 meds:['Insulina','Warfarina','Levotiroxina'],epipen:'Sí — llevo EpiPen encima',glucagon:'Sí — lo tengo en casa',
 ayudas_tecnicas:['Gafas','Audífono'],comm_difficulty:['Sordera'],lang_spoken:['Español'],surgeries:['Apendicectomía'],
 tabaco:'No fumador',alcohol:'No consumo',fecha_nacimiento:'1985-04-19',weight:'70-90kg',
 vih:'Sí',hepatitis:'Sí',tuberculosis:'Sí — activa'};
const MODERATE={offline_qr_consent:true,nombre:'Ana Perez Lopez',sangre:'A+',...contact,
 allergy_med:['Ninguna conocida'],meds:['Ninguna'],anticoagulado:'No',dificultad_intubacion:'No',
 diseases:['Dermatitis atópica','Migraña'],ayudas_tecnicas:['Gafas'],tabaco:'No fumador'};
const SCARCE={offline_qr_consent:true,nombre:'Ana Perez Lopez',sangre:'B-',...contact};
const clone=value=>JSON.parse(JSON.stringify(value));
function deepFreeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;}
function valueOf(line){if(line===API.INFO_LINE)return '';const at=line.indexOf(':');return (at<0?line:line.slice(at+1)).trim();}
function hasValue(haystack,needle){
 for(let at=haystack.indexOf(needle);at>=0;at=haystack.indexOf(needle,at+1)){
  const before=at===0||!/[A-Z0-9]/.test(haystack[at-1]);
  const end=at+needle.length,after=end===haystack.length||!/[A-Z0-9]/.test(haystack[end]);
  if(before&&after)return true;
 }return false;
}
function assertNoOverlap(result,context){
 const values=result.qrText.split('\n').filter(line=>line&&line!==API.HEADER).map(valueOf);
 const printedValues=result.printed.map(valueOf).concat((result.details?.printedItems||[]).map(item=>item.text));
 for(const value of printedValues){if(value)for(const other of values)
  assert.ok(!hasValue(other,value),context+': printed value "'+value+'" duplicated in QR');}
}
function allText(result){return result.printed.join('\n')+'\n'+result.qrText;}
function contract(result,support){
 assertNoOverlap(result,support);
 assert.equal(result.printed.at(-1),API.INFO_LINE);
 assert.ok(result.printed.some(line=>line.startsWith('BLOOD:')));
 assert.ok(result.qrText.length<=API.LIMITS[support].qr);
 assert.ok(!/http|www|atabeyapp\.app/i.test(allText(result)));
 assert.ok(!/[a-z]|[^\x20-\x7e\n]/.test(allText(result)));
 const lines=result.qrText.split('\n');
 if(result.qrText){
  assert.equal(lines.shift(),'EMERGENCY');assert.ok(lines.every(line=>/^[A-Z]+:.+/.test(line)));
  const labels=lines.map(line=>line.slice(0,line.indexOf(':')));assert.equal(new Set(labels).size,labels.length);
 }
 assert.ok(!/\d{6,}/.test(result.printed.join(' ')));
 assert.ok(!/\d{6,}/.test(lines.filter(line=>!line.startsWith('CONTACT:')).join(' ')));
 assert.equal(result.details.qrCharacters,result.qrText.length);
 assert.equal(result.details.calibrationRequired,true);
}

test('module loading never reads DOM/storage/network and remains isolated',()=>{
 const blocked=()=>{throw Error('unexpected side effect');};
 const window={fetch:blocked};Object.defineProperties(window,{document:{get:blocked},localStorage:{get:blocked},indexedDB:{get:blocked}});
 vm.runInNewContext(fs.readFileSync(modulePath,'utf8'),{window});
 assert.equal(typeof window.AtabeyOfflineEmergencyQR.buildOfflineEmergency,'function');
 assert.ok(API.SOURCE_FIELDS.length>100);
 assert.ok(Object.isFrozen(API.CATALOG));
 assert.ok(!/\(\?<([=!])/.test(fs.readFileSync(modulePath,'utf8')));
});
test('explicit offline consent is mandatory, independent of sensitive consent',()=>{
 for(const consent of [undefined,false,'true',1])assert.throws(()=>API.buildOfflineEmergency({...SCARCE,offline_qr_consent:consent},'KEYCHAIN'),/offline_qr_consent_required/);
 assert.throws(()=>API.buildOfflineEmergency(null,'KEYCHAIN'),/invalid_profile/);
 assert.throws(()=>API.buildOfflineEmergency(SCARCE,'DESKTOP'),/unknown_support/);
});
test('all supports retain full patient name, blood, one complete priority contact and real newlines',()=>{
 const profile=deepFreeze(clone(FULL));const before=JSON.stringify(profile);
 for(const support of API.SUPPORTS){
  const result=API.buildOfflineEmergency(profile,support);contract(result,support);
  assert.equal(result.printed[0],'JUAN ANTONIO PEREZ GARCIA');assert.ok(result.printed.includes('BLOOD:O+'));
  assert.ok(!result.qrText.includes('JUAN ANTONIO PEREZ GARCIA'));
  assert.ok(result.qrText.includes('CONTACT:MARIA LOPEZ FERNANDEZ SPOUSE +34600123456'));
  assert.equal((result.qrText.match(/CONTACT:/g)||[]).length,1);
  assert.ok(!result.printed.join(' ').includes('MARIA LOPEZ'));
  assert.ok(!result.omitted.some(line=>/^(NAME|BLOOD|CONTACT):/.test(line)));
  assert.ok(!result.qrText.includes('\\n'));
 }
 assert.equal(JSON.stringify(profile),before);
});
test('important declared negatives and moderate actual data both fill available capacity',()=>{
 for(const support of API.SUPPORTS){const result=API.buildOfflineEmergency(MODERATE,support);contract(result,support);
  const text=allText(result);
  assert.ok(text.includes('NKDA'));assert.ok(text.includes('RX:NONE'));
  assert.ok(/MIGRAINE|ATOPIC DERMATITIS|GLASSES/.test(text),support+' must use available moderate data');
  assert.ok(!text.includes('NO ANTICOAG'),'no medication already represents the broader absence');
 }
 const keychain=API.buildOfflineEmergency(MODERATE,'KEYCHAIN');
 assert.ok(allText(keychain).includes('GLASSES'));assert.ok(allText(keychain).includes('NON-SMOKER'));
});
test('missing answers never become negative medical assertions',()=>{
 for(const support of API.SUPPORTS){const result=API.buildOfflineEmergency(SCARCE,support);contract(result,support);
  assert.ok(!/NKDA|NONE|NO HX|NO ANTICOAG|NO SURGERY/.test(allText(result)));
 }
 const empty=API.buildOfflineEmergency({offline_qr_consent:true},'KEYCHAIN');
 assert.deepEqual(empty.printed,['NAME UNKNOWN','BLOOD:UNKNOWN',API.INFO_LINE]);assert.equal(empty.qrText,'');
});
test('contact name and relationship without valid phone disappear from both layers on every support',()=>{
 const invalid=[{}, {ec1_phone_prefix:'+34'}, {ec1_phone_num:'600123456'}, {ec1_phone_prefix:'+34',ec1_phone_num:''},
  {ec1_phone_prefix:'abc',ec1_phone_num:'600123456'},{ec1_phone_prefix:'+34',ec1_phone_num:'abc600123456'},
  {ec1_phone_prefix:'+34',ec1_phone_num:'123'}, {ec1_phone_prefix:'+34',ec1_phone_num:'000000000'}];
 for(const support of API.SUPPORTS)for(const fields of invalid){
  const result=API.buildOfflineEmergency({offline_qr_consent:true,nombre:'Ana Perez',sangre:'O+',ec1_name:'Pedro Sanchez',ec1_rel:'Amigo/Amiga',...fields},support);
  assert.ok(!/CONTACT:|PEDRO SANCHEZ|FRIEND/.test(allText(result)),support+' '+JSON.stringify(fields));
 }
});
test('one valid fallback contact is used and patient phone is excluded',()=>{
 const p={...SCARCE,personal_phone:{prefix:'+34',number:'600123456'},ec2_name:'Luis Garcia',ec2_rel:'Hermano/Hermana',ec2_phone_prefix:'+34',ec2_phone_num:'611123456'};
 const result=API.buildOfflineEmergency(p,'WATCH30');
 assert.ok(result.qrText.includes('CONTACT:LUIS GARCIA SIBLING +34611123456'));
 assert.ok(!allText(result).includes('MARIA LOPEZ'));assert.equal((result.qrText.match(/CONTACT:/g)||[]).length,1);
});
test('oversized priority contact is rejected rather than cut, lost or overflowed',()=>{
 assert.throws(()=>API.buildOfflineEmergency({...SCARCE,ec1_name:Array(20).fill('FERNANDEZ').join(' ')},'WATCH30'),/contact_exceeds_limit/);
});
test('complex real catalogue states preserve medical distinctions',()=>{
 const base={...SCARCE,anafilaxia_previa:'Sí — reacción grave sin anafilaxia',epipen:'Sí — lo tengo en casa',
  glucagon:'Sí — llevo glucagón encima',dai:'SÍ — llevo DAI',dificultad_intubacion:'SÍ — intubación difícil documentada'};
 const r=API.buildOfflineEmergency(base,'WALLPAPER'),text=allText(r);
 for(const value of ['SEVERE ALLERGIC REACTION','EPIPEN AT HOME','GLUCAGON CARRIED','ICD','DIFF INTUB'])assert.ok(text.includes(value),value);
 assert.ok(!text.includes('EPIPEN CARRIED'));
 const pregnancy=API.buildOfflineEmergency({...SCARCE,conditions:['Embarazo'],embarazo:'No'},'WALLPAPER');
 assert.ok(allText(pregnancy).includes('DX:PREGNANT'));assert.ok(!allText(pregnancy).includes('PREGNANCY REPORTED NO'));assert.ok(!allText(pregnancy).includes('DEVICE:PREGNANT'));
 const support=allText(API.buildOfflineEmergency({...SCARCE,can_decide:'No — tutor legal',ultima_toma_medicacion:'No recuerdo'},'WALLPAPER'));
 assert.ok(support.includes('LEGAL GUARDIAN NEEDED'));assert.ok(!support.includes('NO LEGAL GUARDIAN'));assert.ok(!support.includes("I DON'T REMEMBER"));
});
test('contradictory none-known and positive statements do not publish false negatives',()=>{
 const p={...SCARCE,allergy_med:['Ninguna conocida','Penicilina'],meds:['Ninguna'],meds_psiquiatria:['Litio']};
 const r=API.buildOfflineEmergency(p,'WALLPAPER'),text=allText(r);
 assert.ok(text.includes('PENICILLIN'));assert.ok(!text.includes('NKDA'));assert.ok(text.includes('LITHIUM'));assert.ok(!text.includes('RX:NONE'));
 const a=API.buildOfflineEmergency({...SCARCE,allergy_med:['Ninguna conocida'],allergy_anesthesia:['Propofol']},'WALLPAPER');
 assert.ok(!allText(a).includes('NKDA'));assert.ok(allText(a).includes('PROPOFOL'));
 const b=API.buildOfflineEmergency({...SCARCE,anticoagulado:'No',meds:['Warfarina']},'WALLPAPER');
 assert.ok(!allText(b).includes('NO ANTICOAG'));assert.ok(b.details.warnings.some(x=>x.reason==='medication_conflicts_with_negative'));
});
test('sensitive fields and sensitive medical free text require literal separate consent',()=>{
 for(const support of API.SUPPORTS){const r=API.buildOfflineEmergency(FULL,support);
  assert.ok(!/HIV\+|HEPATITIS|ACTIVE TB/.test(JSON.stringify(r)));
 }
 for(const value of [false,'true',1])assert.ok(!allText(API.buildOfflineEmergency({...SCARCE,vih:'Sí',offline_qr_sensitive_consent:value},'WALLPAPER')).includes('HIV+'));
 const accepted=API.buildOfflineEmergency({...SCARCE,vih:'Sí',hepatitis:'Sí',tuberculosis:'Sí — activa',offline_qr_sensitive_consent:true},'WALLPAPER');
 for(const value of ['HIV+','HEPATITIS','ACTIVE TB'])assert.ok(allText(accepted).includes(value));
 const free=API.buildOfflineEmergency({...SCARCE,med_doses:'VIH TRATAMIENTO'},'WALLPAPER');assert.ok(!JSON.stringify(free).includes('VIH TRATAMIENTO'));
});
test('catalogue coverage, free text preservation and family-history semantics',()=>{
 assert.ok(Object.keys(API.CATALOG.diseases).length>50);
 assert.equal(API.CATALOG['allergy-med'].IECAs,'ACE INHIBITORS');assert.equal(API.CATALOG['allergy-env'].Polen,'POLLEN');
 assert.equal(API.CATALOG.alcohol['No consumo'],'NO ALCOHOL');
 const p={...SCARCE,meds:['Insulina'],med_doses:'Insulina 10U noche',enfermedades_familiares:['Anemia células falciformes']};
 const r=API.buildOfflineEmergency(p,'WALLPAPER'),text=allText(r);
 assert.ok(text.includes('INSULINA 10U NOCHE'));assert.ok(!text.includes('RX:INSULIN\n'));
 assert.ok(r.printed.some(x=>x.startsWith('FH:'))||r.qrText.includes('\nFH:'));
 assertNoOverlap(r,'free detail');
 assert.ok(API.buildOfflineEmergency({...SCARCE,sangre:'0+'},'BRACELET').printed.includes('BLOOD:O+'),'real form uses numeric zero for group O');
 assert.ok(API.buildOfflineEmergency({...SCARCE,sangre:'0-'},'BRACELET').printed.includes('BLOOD:O-'));
});
test('omitted values remain whole and lower-priority additions do not evict critical facts',()=>{
 const phrase='DISPOSITIVO PERSONAL CON DESCRIPCION COMPLETA '.repeat(8).trim();
 const r=API.buildOfflineEmergency({...SCARCE,implant_detail:phrase},'WATCH30');
 assert.ok(r.omitted.includes('DEVICE:'+phrase));assert.ok(!allText(r).includes('DISPOSITIVO'));
 const a=API.buildOfflineEmergency({...SCARCE,anticoagulado:'SÍ — ANTICOAGULADO'},'WATCH30');
 const b=API.buildOfflineEmergency({...SCARCE,anticoagulado:'SÍ — ANTICOAGULADO',diseases:['Migraña','Dermatitis atópica'],surgeries:['Apendicectomía'],ayudas_tecnicas:['Gafas']},'WATCH30');
 assert.ok(allText(a).includes('ANTICOAG'));assert.ok(allText(b).includes('ANTICOAG'));
});
test('link payloads are rejected before normalizing them into apparently harmless text',()=>{
 for(const link of ['https://example.com','HTTP://EXAMPLE.COM','www.example.com','example.com','mailto:person@example.com','atabeyapp.app']){
  assert.throws(()=>API.buildOfflineEmergency({...SCARCE,med_doses:link},'WALLPAPER'),/must_not_contain_a_link/);
 }
 assert.equal(API.toAlphanumericSafe("O'Connor López"),"O'CONNOR LOPEZ");
});
test('overlap assertion detects actual values and avoids single-letter matches in labels/names',()=>{
 assert.throws(()=>assertNoOverlap({printed:['BLOOD:O+',API.INFO_LINE],qrText:'EMERGENCY\nDX:O+'},'mutant'),/printed value "O\+" duplicated/);
 assert.doesNotThrow(()=>assertNoOverlap({printed:['BLOOD:O',API.INFO_LINE],qrText:'EMERGENCY\nCONTACT:LOPEZ +34600123456'},'boundary'));
});
test('adaptive policy retries whole lower-priority facts; mock assessor is not a physical measurement',async()=>{
 const seen=[];
 const prepared=await API.prepareOfflineEmergency(MODERATE,'WATCH34',async result=>{
  seen.push(result.details.qrItems.length);
  return {pxPerMm:8,blurMm:.30,qrMm:API.LAYOUTS.WATCH34.qr,quietZone:4,correction:'M',
   zxingText:result.qrText,jsqrText:result.details.qrItems.length<=1?result.qrText:null};
 });
 assert.equal(prepared.details.readability.status,'simulation_pass');assert.ok(seen.length>1);
 assert.equal(prepared.details.qrItems.length,1);assert.ok(prepared.omitted.length>0);contract(prepared,'WATCH34');
 assert.ok(seen.every((n,i)=>!i||n===seen[i-1]-1));
});
test('critical loss, one-reader success and wrong physical conditions cannot approve an export',async()=>{
 let called=0;
 const critical=await API.prepareOfflineEmergency({...FULL,med_doses:'MEDICATION DOSE DETAIL '.repeat(60).trim()},'WATCH30',()=>{called++;return {};});
 assert.equal(called,0);assert.equal(critical.details.readability.reason,'critical_data_omitted');
 for(const wrong of ['reader','conditions']){
  const r=await API.prepareOfflineEmergency(SCARCE,'WATCH30',async value=>({pxPerMm:wrong==='conditions'?16:8,blurMm:.30,qrMm:30,quietZone:4,correction:'M',zxingText:value.qrText,jsqrText:wrong==='reader'?null:value.qrText}));
  assert.equal(r.details.readability.status,'blocked');
 }
 assert.throws(()=>API.renderOfflineTemplate(API.buildOfflineEmergency(SCARCE,'KEYCHAIN'),{ownerDocument:{}},600),/template_not_verified/);
});
test('square M QR decodes with both offline readers and SVG prototype text fits its bounds',async()=>{
 const {chromium}=require('playwright');
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const context=await browser.newContext({offline:true});const page=await context.newPage();let requests=0;page.on('request',()=>requests++);
  await page.setContent('<div id="target"></div><div id="template"></div>');
  await page.addScriptTag({path:path.resolve('vendor/qrcodejs/qrcode.min.js')});await page.addScriptTag({path:modulePath});
  await page.addScriptTag({path:require.resolve('@zxing/library/umd/index.min.js')});await page.addScriptTag({path:require.resolve('jsqr/dist/jsQR.js')});
  const measured=await page.evaluate(profiles=>{
   const api=AtabeyOfflineEmergencyQR,measurements=[];
   function decode(qr){
    const image=qr.canvas.getContext('2d').getImageData(0,0,qr.canvas.width,qr.canvas.height),side=qr.canvas.width;
    const gray=new Uint8ClampedArray(side*side);for(let i=0;i<gray.length;i++)gray[i]=image.data[i*4];
    const a=jsQR(image.data,side,side)?.data;
    let b=null,error=null;
    try{b=new ZXing.QRCodeReader().decode(new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.RGBLuminanceSource(gray,side,side)))).getText();}catch(e){error=String(e);}
    const cell=side/(qr.modules+8),quiet=cell*4;
    for(let y=0;y<side;y++)for(let x=0;x<side;x++){
     const at=(y*side+x)*4;if(![0,255].includes(image.data[at]))throw Error('non-square/interpolated module');
     if((x<quiet||x>=side-quiet||y<quiet||y>=side-quiet)&&image.data[at]!==255)throw Error('quiet zone occupied');
    }
    return {jsqr:a,zxing:b,error};
   }
   for(const [profileName,profile] of Object.entries(profiles))for(const support of api.SUPPORTS){
    const result=api.buildOfflineEmergency(profile,support),target=document.getElementById('target');
    const qr=api.renderOfflineQR(result.qrText,target,720),decoded=decode(qr);
    const template=api.renderOfflineTemplate(result,document.getElementById('template'),720,{prototype:true});
    const outer=document.getElementById('template').firstElementChild,qrElement=outer.querySelector('svg');
    const qb=qrElement.getBoundingClientRect(),ob=outer.getBoundingClientRect();
    for(const text of outer.querySelectorAll('text')){
     const box=text.getBoundingClientRect();
     if(box.left<ob.left-.5||box.right>ob.right+.5||box.top<ob.top-.5||box.bottom>ob.bottom+.5)throw Error('printed text outside physical prototype: '+text.textContent);
     if(box.left<qb.right&&box.right>qb.left&&box.top<qb.bottom&&box.bottom>qb.top)throw Error('printed text over QR: '+text.textContent);
    }
    measurements.push({profileName,support,expected:result.qrText,...decoded,version:qr.version,modules:qr.modules,size:qr.sizePx,widthMm:template.widthMm,heightMm:template.heightMm});
   }
   const boundary='EMERGENCY\nDX:'+'A'.repeat(29),optimized=api.renderOfflineQR(boundary,document.getElementById('target'),600);
   const boundaryDecoded=decode(optimized);
   const host=document.createElement('div'),legacy=new QRCode(host,{text:boundary,width:600,height:600,correctLevel:QRCode.CorrectLevel.M});
   return {measurements,boundary:{text:boundary,version:optimized.version,legacyVersion:legacy._oQRCode.typeNumber,...boundaryDecoded}};
  },{full:FULL,moderate:MODERATE,scarce:SCARCE,longName:{...SCARCE,nombre:'Ana Constantinopoulos'}});
  if(process.env.QR_MEASUREMENTS)fs.writeFileSync(process.env.QR_MEASUREMENTS,JSON.stringify(measured,null,2));
  for(const entry of measured.measurements){assert.equal(entry.jsqr,entry.expected,JSON.stringify(entry));assert.equal(entry.zxing,entry.expected,JSON.stringify(entry));}
  assert.equal(measured.boundary.text.length,42);assert.ok(measured.boundary.version<=3);
  assert.ok(measured.boundary.legacyVersion>measured.boundary.version);
  assert.equal(measured.boundary.jsqr,measured.boundary.text);assert.equal(measured.boundary.zxing,measured.boundary.text);
  assert.equal(requests,0);
  console.log('DECODE:',measured.measurements.length,'profile/support cases by ZXing and jsQR, offline; minimal ASCII boundary',measured.boundary.legacyVersion,'->',measured.boundary.version);
  if(process.env.QR_MEASUREMENTS)fs.writeFileSync(process.env.QR_MEASUREMENTS,JSON.stringify(measured,null,2));
 }finally{await browser.close();}
});
test('real degraded captures drive the adaptive result at every physical support',async()=>{
 const {chromium}=require('playwright');
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({offline:true});await page.setContent('<div id="q"></div><div id="front"></div>');
  for(const p of [path.resolve('vendor/qrcodejs/qrcode.min.js'),modulePath,require.resolve('@zxing/library/umd/index.min.js'),require.resolve('jsqr/dist/jsQR.js')])await page.addScriptTag({path:p});
  const rows=await page.evaluate(async profiles=>{
   const api=AtabeyOfflineEmergencyQR,host=document.getElementById('q'),rows=[];
   const readers={jsqr:image=>jsQR(image.data,image.width,image.height)?.data,
    zxing:image=>{const gray=new Uint8ClampedArray(image.width*image.height);for(let i=0;i<gray.length;i++)gray[i]=image.data[i*4];return new ZXing.QRCodeReader().decode(new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.RGBLuminanceSource(gray,image.width,image.height)))).getText();}};
   for(const [profileName,profile] of Object.entries(profiles))for(const support of api.SUPPORTS){
    const result=await api.prepareOfflineEmergency(profile,support,r=>api.assessOfflineReadability(r,host,readers));
    let exportBlocked=false;try{api.renderOfflineTemplate(result,document.getElementById('front'),960);}catch(e){if(!e.message.includes('template_not_verified'))throw e;exportBlocked=true;}
    rows.push({profileName,support,status:result.details.readability.status,reason:result.details.readability.reason,exportBlocked,
     qrMm:api.LAYOUTS[support].qr,clinicalFacts:result.details.printedItems.length+result.details.qrItems.length,characters:result.qrText.length,printed:result.printed,qrText:result.qrText,omitted:result.omitted,trials:result.details.readability.trials});
   }
   // The same pixels and decoder result must be produced without native filters.
   const sample=api.buildOfflineEmergency(profiles.scarce,'KEYCHAIN');
   const before=await api.assessOfflineReadability(sample,host,readers);
   const proto=CanvasRenderingContext2D.prototype,descriptor=Object.getOwnPropertyDescriptor(proto,'filter');
   delete proto.filter;
   let after;
   try{after=await api.assessOfflineReadability(sample,host,readers);}
   finally{if(descriptor)Object.defineProperty(proto,'filter',descriptor);}
   if(JSON.stringify(before)!==JSON.stringify(after))throw Error('portable blur depends on native Canvas filter');
   return rows;
  },{full:FULL,moderate:MODERATE,scarce:SCARCE});
  for(const r of rows){
   assert.equal(r.exportBlocked,r.status!=='simulation_pass');
   if(r.status==='simulation_pass')assert.ok(r.trials.at(-1).zxing&&r.trials.at(-1).jsqr);
  }
  assert.ok(rows.some(r=>r.status==='simulation_pass'));assert.ok(rows.some(r=>r.status==='blocked'));
  assert.ok(rows.find(r=>r.profileName==='full'&&r.support==='WATCH30').trials[0].characters>API.LIMITS.WATCH30.qr,'legacy character ceilings must not preempt actual measurement');
  assert.ok(rows.some(r=>r.trials.length>1&&r.status==='simulation_pass'),'at least one actual QR must be reduced until it decodes');
  for(const profile of ['full','moderate','scarce']){
   const sizes=['BRACELET','WATCH30','WATCH34','KEYCHAIN','WALLPAPER'];
   const ready=sizes.map(s=>rows.find(r=>r.profileName===profile&&r.support===s)).filter(r=>r.status==='simulation_pass');
   assert.ok(ready.every((r,i)=>!i||r.clinicalFacts>=ready[i-1].clinicalFacts),profile+': larger ready surfaces retain at least as many clinical facts');
  }
  if(process.env.QR_ADAPTIVE_MEASUREMENTS)fs.writeFileSync(process.env.QR_ADAPTIVE_MEASUREMENTS,JSON.stringify(rows,null,2));
  console.log('ADAPTIVE:',JSON.stringify(rows.map(({profileName,support,status,reason,characters,trials})=>({profileName,support,status,reason,characters,attempts:trials.length}))));
 }finally{await browser.close();}
});

test('portable Gaussian capture preserves white and blurs a dark impulse symmetrically',()=>{
 const width=25,height=25,data=new Uint8ClampedArray(width*height*4).fill(255);
 assert.deepEqual(API.blurOfflineCapture({width,height,data}).data,data);
 const at=(12*width+12)*4;data[at]=data[at+1]=data[at+2]=0;
 const out=API.blurOfflineCapture({width,height,data}).data;
 assert.ok(out[at]>0&&out[at]<255);assert.ok(out[at-4]<255);
 assert.equal(out[at-4],out[at+4]);assert.equal(out[at-width*4],out[at+width*4]);
 assert.equal(out[at+3],255);assert.equal(data[at],0);
});
