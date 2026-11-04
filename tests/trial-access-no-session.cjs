// Browser QA only. Requires Playwright in the test environment.
//
// El escenario 1 (pagina real /) se midio en este entorno headless y el redirect de
// index.html (ajeno a este archivo) aborta el documento antes de que pueda dispararse
// DOMContentLoaded, tanto con el js/trial-access.js antiguo como con el nuevo -- por eso
// esa parte sola no distingue el fallo antiguo del arreglo. La comprobacion determinista
// que si distingue "antiguo falla / nuevo pasa" (pedida en el punto 4) usa una pagina
// minima ("harness") que carga los mismos js/medical-owner.js y js/trial-access.js reales
// sin el script de redireccion de index.html, para poder observar render()/lock() sin que
// una navegacion aborte el documento antes de que corra.
const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict');
const {execFileSync}=require('node:child_process');
const root=process.cwd();
const NEW_TRIAL_ACCESS=fs.readFileSync(path.join(root,'js/trial-access.js'));
let OLD_TRIAL_ACCESS=null;
try{OLD_TRIAL_ACCESS=execFileSync('git',['show','origin/main:js/trial-access.js'],{cwd:root});}catch(_){OLD_TRIAL_ACCESS=NEW_TRIAL_ACCESS;}
const HAS_HISTORICAL_BASELINE=Buffer.compare(OLD_TRIAL_ACCESS,NEW_TRIAL_ACCESS)!==0;

const HARNESS_HTML=`<!doctype html><html lang="es"><head><meta charset="utf-8"/>
<link rel="stylesheet" href="/css/trial-access.css"/>
<script src="/js/medical-owner.js"></script>
<script src="/js/trial-access.js"></script>
</head><body data-medical-surface data-atabey-ui="editor"><div class="account-overview"></div></body></html>`;

function makeServer(variant,mode){
  return http.createServer((req,res)=>{
    try{
      const u=new URL(req.url,'http://localhost');
      if(u.pathname==='/js/trial-access.js'){
        const data=variant==='old'?OLD_TRIAL_ACCESS:NEW_TRIAL_ACCESS;
        res.setHeader('Content-Type','application/javascript');res.setHeader('Cache-Control','no-store');res.end(data);return;
      }
      if(u.pathname==='/'&&mode==='harness'){
        res.setHeader('Content-Type','text/html');res.setHeader('Cache-Control','no-store');res.end(HARNESS_HTML);return;
      }
      let f=path.join(root,u.pathname==='/'?'index.html':u.pathname);
      let data;
      try{data=fs.readFileSync(f);}
      catch(_){
        // Replica la regla catch-all de _redirects (/* -> /index.html 200): necesario
        // para que cache.addAll(CACHE_URLS) resuelva rutas sin archivo real como ./sos.
        f=path.join(root,'index.html');data=fs.readFileSync(f);
      }
      res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.json')?'application/json':'text/html');
      res.setHeader('Cache-Control','no-store');
      res.end(data);
    }catch{res.statusCode=404;res.end();}
  });
}

async function sampleNoSessionLoad(browser,port,{routeDelayMs=800,sampleEveryMs=16,maxWaitMs=8000}={}){
  const context=await browser.newContext();
  const page=await context.newPage();
  const samples=[];
  await page.route('**/login.html',route=>setTimeout(()=>route.continue(),routeDelayMs));
  const pollId=setInterval(async()=>{
    try{
      if(page.url().includes('login.html'))return;
      const visible=await page.evaluate(()=>{const g=document.getElementById('account-access-gate');return !!g&&!g.hidden;});
      samples.push(visible);
    }catch(_){/* contexto destruido por navegacion en curso, muestra omitida */}
  },sampleEveryMs);
  await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'commit'}).catch(()=>{});
  const start=Date.now();
  while(!page.url().includes('login.html')&&Date.now()-start<maxWaitMs){await page.waitForTimeout(20);}
  await page.waitForTimeout(150);
  clearInterval(pollId);
  await context.close();
  return samples;
}

async function harnessGateState(browser,port,presetFn){
  const context=await browser.newContext();
  const page=await context.newPage();
  if(presetFn)await context.addInitScript(presetFn);
  await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'load'});
  await page.waitForTimeout(300);
  const state=await page.evaluate(()=>{
    const g=document.getElementById('account-access-gate');
    return {exists:!!g,visible:!!g&&!g.hidden,title:(g&&!g.hidden&&g.querySelector('h2'))?g.querySelector('h2').textContent:null};
  });
  await context.close();
  return state;
}

function scriptAssetRefs(html){
  return [...html.matchAll(/<script[^>]*\ssrc=["'](\/js\/[^"']+\.js\?v=\d+)["']/g)].map(m=>m[1]);
}
// Alcance deliberadamente acotado a trial-access.js: otros /js/*.js?v=NN de estas paginas
// (p.ej. emergency-scroll.js en login.html) ya tienen huecos propios en CACHE_URLS, previos
// y ajenos a este cambio -- no es tarea de esta guardia arreglarlos ni afirmar sobre ellos.
function trialAccessRefs(html){
  return scriptAssetRefs(html).filter(ref=>ref.includes('trial-access.js'));
}

async function offlineAfterVersionBump(browser,port,targetPage){
  // Caso borde real: un dispositivo que ya tenia una version anterior instalada (con los
  // recursos que la pagina objetivo referencia, cacheados bajo OTRO nombre de cache) se
  // actualiza al sw.js actual (install+activate reales, que purgan esa cache antigua) y
  // pierde conexion SIN volver a visitar la pagina objetivo online antes de quedarse
  // offline. Si algun recurso que esa pagina referencia no esta en el CACHE_URLS actual,
  // esto lo detecta sin depender de un numero de version concreto.
  const context=await browser.newContext({serviceWorkers:'allow'});
  const page=await context.newPage();
  const failedRequests=[];
  page.on('requestfailed',r=>failedRequests.push(r.url()));
  await page.goto('http://127.0.0.1:'+port+'/index.html',{waitUntil:'load'});
  const refs=trialAccessRefs(fs.readFileSync(path.join(root,targetPage),'utf8'));
  await page.evaluate(async(refs)=>{
    const c=await caches.open('doctorqr-synthetic-old-version');
    for(const ref of refs){const r=await fetch(ref,{cache:'no-store'});if(r.ok)await c.put(ref,r.clone());}
  },refs);
  await page.evaluate(async()=>{
    await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});
    await navigator.serviceWorker.ready;
    await new Promise(r=>setTimeout(r,1500));
  });
  const purged=await page.evaluate(async()=>!(await caches.keys()).includes('doctorqr-synthetic-old-version'));
  await context.setOffline(true);
  failedRequests.length=0;
  await page.goto('http://127.0.0.1:'+port+'/'+targetPage,{waitUntil:'load'}).catch(()=>{});
  await page.waitForTimeout(400);
  const refFetches={};
  for(const ref of refs)refFetches[ref]=await page.evaluate(async(ref)=>{try{const r=await fetch(ref,{cache:'no-store'});return r.ok;}catch(_){return false;}},ref);
  await context.close();
  return {purged,refs,refFetches,failedRequests};
}

async function emergencyPageSnapshot(browser,port){
  const context=await browser.newContext();
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:'+port+'/emergencia.html',{waitUntil:'load'});
  await page.waitForTimeout(1000);
  const snap=await page.evaluate(()=>({
    gateExists:!!document.getElementById('account-access-gate'),
    accessGateAttr:document.documentElement.dataset.accessGate||null,
    pathname:location.pathname,
    bodyVisibility:getComputedStyle(document.body).visibility
  }));
  await context.close();
  return snap;
}

(async()=>{
  const serverNewFull=makeServer('new','full'),serverOldFull=makeServer('old','full');
  const serverNewHarness=makeServer('new','harness'),serverOldHarness=makeServer('old','harness');
  const PORT_NEW=8790,PORT_OLD=8791,PORT_HARNESS_NEW=8792,PORT_HARNESS_OLD=8793;
  await Promise.all([
    new Promise(r=>serverNewFull.listen(PORT_NEW,'127.0.0.1',r)),
    new Promise(r=>serverOldFull.listen(PORT_OLD,'127.0.0.1',r)),
    new Promise(r=>serverNewHarness.listen(PORT_HARNESS_NEW,'127.0.0.1',r)),
    new Promise(r=>serverOldHarness.listen(PORT_HARNESS_OLD,'127.0.0.1',r)),
  ]);
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader']});
  try{

    for(let i=0;i<10;i++){
      const samples=await sampleNoSessionLoad(browser,PORT_NEW);
      assert.ok(samples.length>0,'iteracion '+i+': no se registro ninguna muestra');
      assert.ok(samples.every(v=>v===false),'iteracion '+i+': el aviso de acceso no debe hacerse visible en ningun muestreo sin sesion');
    }
    console.log('PASS: sin sesion, 10 cargas repetidas de / (pagina real) nunca muestran el aviso de acceso (muestreo cada 16 ms, login.html retrasado 800 ms)');

    if(HAS_HISTORICAL_BASELINE){
      const sameScenarioOld=await sampleNoSessionLoad(browser,PORT_OLD);
      console.log('NOTA: en este entorno headless, el mismo escenario con el js/trial-access.js antiguo tampoco llega a mostrar el aviso ('+sameScenarioOld.filter(Boolean).length+'/'+sameScenarioOld.length+' muestras visibles) porque el redirect propio de index.html aborta el documento antes de DOMContentLoaded tanto con el codigo antiguo como con el nuevo. La pagina real por si sola no distingue el fallo del arreglo en este entorno; el mecanismo exacto se verifica a continuacion sin esa interferencia.');
    }

    {
      const stateNew=await harnessGateState(browser,PORT_HARNESS_NEW,null);
      assert.equal(stateNew.visible,false,'con el codigo nuevo, sin token, el aviso no debe llegar a mostrarse (mecanismo aislado, sin el redirect de index.html)');
      console.log('PASS: mecanismo aislado (sin redirect de index.html) -- con el js/trial-access.js nuevo y sin sesion, lock(\'unverified\') nunca se llama');

      if(HAS_HISTORICAL_BASELINE){
        const stateOld=await harnessGateState(browser,PORT_HARNESS_OLD,null);
        assert.equal(stateOld.visible,true,'con el codigo antiguo (origin/main), sin token, el aviso "unverified" debia mostrarse -- es la regresion que motivo este arreglo');
        assert.equal(stateOld.title,'Conecta para comprobar tu acceso');
        console.log('PASS: mecanismo aislado -- con el js/trial-access.js de origin/main (antiguo) y sin sesion, el aviso "unverified" SI se muestra, confirmando la regresion. Con el codigo nuevo (prueba anterior) ya no se muestra: el test 1 falla con el antiguo y pasa con el nuevo.');
      }else{
        console.log('NOTA: origin/main ya contiene el mismo js/trial-access.js que esta rama (probablemente ya fusionada); se omite la demostracion historica del fallo, que ya no aplica.');
      }
    }

    {
      // Solo el token, sin doctorqr_id: asi MedicalOwner.id() (y por tanto own()) es falso,
      // sin disparar el redirect propio de js/medical-owner.js en 'pageshow' (que exige
      // initialId truthy) -- ese redirect es ajeno a este cambio y no debe interferir aqui.
      const preset=()=>{try{localStorage.setItem('doctorqr_token','tok-invalid-identity');}catch(_){}};
      const stateNew=await harnessGateState(browser,PORT_HARNESS_NEW,preset);
      assert.equal(stateNew.visible,true,'con doctorqr_token presente pero identidad invalida, el aviso "unverified" debe seguir mostrandose con el codigo nuevo');
      assert.equal(stateNew.title,'Conecta para comprobar tu acceso');
      if(HAS_HISTORICAL_BASELINE){
        const stateOld=await harnessGateState(browser,PORT_HARNESS_OLD,preset);
        assert.equal(stateOld.visible,true,'con doctorqr_token presente pero identidad invalida, el aviso ya se mostraba con el codigo antiguo');
        assert.equal(stateNew.title,stateOld.title,'el texto del aviso no debe cambiar respecto al codigo antiguo en este escenario');
      }
    }
    console.log('PASS: con doctorqr_token presente pero identidad que no valida, el aviso "unverified" se sigue mostrando exactamente igual que antes del cambio');

    {
      const snapOld=await emergencyPageSnapshot(browser,PORT_OLD);
      const snapNew=await emergencyPageSnapshot(browser,PORT_NEW);
      assert.deepEqual(snapNew,snapOld,'emergencia.html debe comportarse exactamente igual con el trial-access.js antiguo y con el nuevo');
      assert.equal(snapNew.gateExists,false,'emergencia.html nunca debe tener el gate de acceso (trial-access.js no actua en emergencyPage)');
      console.log('PASS: emergencia.html se comporta exactamente igual antes y despues del cambio (comparado contra origin/main)');
    }

    {
      // Guardia estatica y permanente: cualquier /js/*.js?v=NN que referencien index.html,
      // login.html o emergencia.html debe estar precacheado en sw.js, sin importar el
      // numero de version -- evita que una subida de version deje huerfano un recurso que
      // una pagina sigue pidiendo con su propio numero de version (como paso con
      // trial-access.js?v=51 en login.html/emergencia.html frente a ?v=52 en index.html).
      const swSource=fs.readFileSync(path.join(root,'sw.js'),'utf8');
      const allRefs=new Set();
      for(const page of ['index.html','login.html','emergencia.html'])for(const ref of trialAccessRefs(fs.readFileSync(path.join(root,page),'utf8')))allRefs.add(ref);
      assert.ok(allRefs.size>=2,'index.html, login.html y emergencia.html deben seguir referenciando js/trial-access.js con /js/ absoluto');
      for(const ref of allRefs){
        const relative='.'+ref;
        assert.ok(swSource.includes("'"+relative+"'")||swSource.includes('"'+relative+'"'),'sw.js CACHE_URLS debe precachear '+relative+' (referenciado por index.html, login.html o emergencia.html)');
      }
      console.log('PASS: todos los js/trial-access.js?v=NN referenciados por index.html, login.html y emergencia.html estan en CACHE_URLS de sw.js');
    }

    {
      for(const targetPage of ['emergencia.html','login.html']){
        const result=await offlineAfterVersionBump(browser,PORT_NEW,targetPage);
        assert.equal(result.purged,true,'la cache sintetica de la version anterior debia purgarse al activar el sw.js actual');
        for(const ref of result.refs)assert.equal(result.refFetches[ref],true,targetPage+': '+ref+' debe servirse offline desde cache tras actualizar de version sin revisitar la pagina antes');
        const trialAccessFailed=result.failedRequests.some(u=>u.includes('trial-access.js'));
        assert.equal(trialAccessFailed,false,targetPage+': js/trial-access.js no debe fallar offline tras la actualizacion de version');
      }
      console.log('PASS: tras actualizar de version sin revisitar emergencia.html/login.html online, sus recursos /js/ (incluido trial-access.js) siguen sirviendose offline desde cache');
    }

  }finally{await browser.close();serverNewFull.close();serverOldFull.close();serverNewHarness.close();serverOldHarness.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
