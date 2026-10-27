'use strict';
// Generates fictional monthly illustrations using the actual PNG download buttons.
// Playwright/pngjs/jsqr are QA dependencies only; no live API or customer account is used.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{PNG}=require('pngjs'),jsQR=require('jsqr');
const root=process.cwd(),out=path.resolve(process.argv[2]||'/tmp/atabey-monthly-preview');fs.mkdirSync(out,{recursive:true});
const names=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const person={nombre:'MUESTRA',apellidos:'SIN VALIDEZ MÉDICA',email:'muestra@example.invalid',doc_type:'dni',doc_number:'FICTICIO',fecha_nacimiento:'1980-01-01'};
const profile={...person,sangre:'O+',ec1_name:'CONTACTO FICTICIO',ec1_phone_num:'000 000 000'};
const id='MUESTRA-SIN-VALIDEZ-MEDICA',target='https://atabeyapp.app/card.html?id='+id+'&t=emergency';
(async()=>{let browser;try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||chromium.executablePath(),args:['--no-sandbox','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1180,height:950},locale:'es-ES',serviceWorkers:'block'});context.setDefaultTimeout(15000);const errors=[];context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.href==='https://atabeyapp.app/monthly-fixture.html')return r.fulfill({headers:{'Content-Security-Policy':"default-src 'self';script-src 'self' 'unsafe-inline';style-src 'self' 'unsafe-inline';img-src 'self' data:;connect-src 'none';object-src 'none'"},contentType:'text/html',body:'<!doctype html><html lang="es"><body>Muestrario ficticio</body></html>'});throw Error('Unexpected external request: '+u.href);});
 const p=await context.newPage();await p.goto('https://atabeyapp.app/monthly-fixture.html');await p.evaluate(({person,profile,id})=>{for(const[k,v]of Object.entries({doctorqr_token:'fictional-monthly-token',doctorqr_id:id,doctorqr_profile_owner:id,doctorqr_user:JSON.stringify(person),doctorqr_profile:JSON.stringify(profile)}))localStorage.setItem(k,v)},{person,profile,id});
 for(const file of ['vendor/qrcodejs/qrcode.min.js','js/medical-owner.js','js/card-png.js','js/emergency-card.js','js/qr-generator.js'])await p.addScriptTag({path:path.join(root,file)});
 const result=[];
 for(let month=0;month<12;month++){
  const popup=p.waitForEvent('popup');await p.evaluate(month=>{const snapshot=JSON.stringify(MedicalOwner.read());window.__previewPromise=AtabeyEmergencyCard.open({profile:MedicalOwner.read(),patientUrl:buildEmergencyQRUrl(),language:'es',risk:false,date:new Date(2026,month,15,12),ready:ensureQRCodeLoaded,draw:createOrganicQRCode,current:()=>MedicalOwner.current()&&JSON.stringify(MedicalOwner.read())===snapshot,autoPrint:false})},month);const q=await popup;await q.waitForFunction(()=>document.documentElement.dataset.cardReady==='true');
  const theme=await p.evaluate(month=>AtabeyEmergencyCard.theme(new Date(2026,month,15)),month),files={};
  for(const [side,label,expected]of [['front','anverso',target],['back','reverso','https://atabeyapp.app']]){
   const file=String(month+1).padStart(2,'0')+'_'+names[month]+'_'+label+'.png',event=q.waitForEvent('download');await q.locator('[data-card-side="'+side+'"]').click();const download=await event;await download.saveAs(path.join(out,file));const png=PNG.sync.read(fs.readFileSync(path.join(out,file)));assert.equal(png.width,1600);assert.equal(png.height,1121);assert.equal(jsQR(new Uint8ClampedArray(png.data),png.width,png.height,{inversionAttempts:'dontInvert'})?.data,expected);
   const pixel=(50*png.width+1450)*4;assert.deepEqual([...png.data.subarray(pixel,pixel+3)],theme.color.slice(1).match(/../g).map(x=>parseInt(x,16)),'Monthly header color');files[label]=file;
  }
  result.push({month:month+1,name:names[month],color:theme.color,cause:theme.cause,...files});await q.close();console.log('OK '+names[month]);
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({fictional:true,year:2026,width_mm:85.6,height_mm:60,body_height_mm:54,qr_mm:49,source_palette:'https://github.com/jjjmaracay-code/doctorqr/blob/3304a76b575a947308db1f1e2bb8a16835bbdbaf/js/emergency-card.js',months:result},null,2));
 console.log('PASS: 24 actual PNG downloads, all QR destinations and all monthly header colors verified under the application CSP');
 }catch(e){console.error(e);process.exitCode=1;}finally{await browser?.close();}})();
