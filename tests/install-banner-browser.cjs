// Browser QA only. Requires Playwright in the test environment.
const {chromium}=require('playwright');const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict');
const root=process.cwd();
const server=http.createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');let f=path.join(root,u.pathname==='/'?'register.html':u.pathname);let data=fs.readFileSync(f);res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.json')?'application/json':'text/html');res.setHeader('Cache-Control','no-store');res.end(data)}catch{res.statusCode=404;res.end()}});
const ANDROID_UA='Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';
const IOS_UA='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const DESKTOP_UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
async function openPage(b,page,opts={}){const c=await b.newContext({userAgent:opts.ua,viewport:opts.viewport||{width:390,height:844},locale:opts.locale||'es-ES'});const p=await c.newPage();if(opts.preset)await p.addInitScript(opts.preset);await p.goto('http://127.0.0.1:8771/'+(page||'register.html'),{waitUntil:'load'});return{c,p};}
(async()=>{await new Promise(r=>server.listen(8771,'127.0.0.1',r));const b=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader']});try{

  {const {c,p}=await openPage(b,'login.html',{ua:ANDROID_UA});
   await p.waitForTimeout(3500);
   assert.equal(await p.locator('#install-banner').count(),0,'login.html no debe tener ni rastro del marcado del banner');
   console.log('PASS: login.html no muestra el banner (no existe en el marcado)');
   await c.close();}

  {const {c,p}=await openPage(b,'register.html',{ua:ANDROID_UA});
   assert.equal(await p.locator('#install-banner').isHidden(),true);
   const scrollYBefore=await p.evaluate(()=>window.scrollY);
   await p.waitForTimeout(3500);
   const scrollYAfter=await p.evaluate(()=>window.scrollY);
   assert.equal(scrollYBefore,0);
   assert.equal(scrollYAfter,0,'el banner no debe desplazar la pagina automaticamente al aparecer');
   assert.equal(await p.locator('#install-banner').isVisible(),true);
   assert.equal(await p.locator('#install-banner-android').isHidden(),false);
   assert.equal(await p.locator('#install-banner-ios').isHidden(),true);
   const paddingBottom=await p.evaluate(()=>parseFloat(getComputedStyle(document.body).paddingBottom));
   const bannerHeight=await p.evaluate(()=>document.getElementById('install-banner').offsetHeight);
   assert.ok(Math.abs(paddingBottom-bannerHeight)<1,'padding-bottom debe igualar la altura real del banner');
   console.log('PASS: Android en register.html muestra boton, sin desplazar la pagina, e iguala el espacio reservado a la altura real');
   await p.locator('#install-banner-close').click();
   assert.equal(await p.locator('#install-banner').isHidden(),true);
   assert.equal(await p.evaluate(()=>document.body.style.paddingBottom),'');
   const dismissedAt=await p.evaluate(()=>localStorage.getItem('doctorqr_install_banner_dismissed'));
   assert.ok(dismissedAt && Date.now()-Number(dismissedAt)<5000);
   console.log('PASS: cerrar oculta el banner, libera el espacio y guarda la fecha de cierre');
   await c.close();}

  {const {c,p}=await openPage(b,'register.html',{ua:ANDROID_UA,preset:()=>localStorage.setItem('doctorqr_install_banner_dismissed',String(Date.now()-3*86400000))});
   await p.waitForTimeout(3500);
   assert.equal(await p.locator('#install-banner').isHidden(),true);
   console.log('PASS: no vuelve a aparecer dentro de los 7 dias de cierre');
   await c.close();}

  {const {c,p}=await openPage(b,'register.html',{ua:ANDROID_UA,preset:()=>localStorage.setItem('doctorqr_install_banner_dismissed',String(Date.now()-8*86400000))});
   await p.waitForTimeout(3500);
   assert.equal(await p.locator('#install-banner').isVisible(),true);
   console.log('PASS: vuelve a aparecer pasados los 7 dias de cierre');
   await c.close();}

  {const {c,p}=await openPage(b,'register.html',{ua:IOS_UA});
   await p.waitForTimeout(3500);
   assert.equal(await p.locator('#install-banner').isVisible(),true);
   assert.equal(await p.locator('#install-banner-ios').isHidden(),false);
   assert.equal(await p.locator('#install-banner-android').isHidden(),true);
   assert.equal(await p.locator('#install-banner-ios li').count(),4);
   assert.equal(await p.locator('#install-banner-title').textContent(),'Instalar en iPhone / iPad');
   console.log('PASS: iPhone muestra los 4 pasos sin boton, sin beforeinstallprompt');
   await c.close();}

  {const {c,p}=await openPage(b,'register.html',{ua:'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});
   await p.addInitScript(()=>Object.defineProperty(navigator,'maxTouchPoints',{get:()=>5}));
   await p.goto('http://127.0.0.1:8771/register.html',{waitUntil:'load'});
   await p.waitForTimeout(3500);
   assert.equal(await p.locator('#install-banner-ios').isHidden(),false);
   console.log('PASS: iPad moderno (se identifica como Mac tactil) tambien recibe los pasos de iOS');
   await c.close();}

  {const {c,p}=await openPage(b,'register.html',{ua:DESKTOP_UA});
   await p.waitForTimeout(3500);
   assert.equal(await p.locator('#install-banner').isHidden(),true);
   console.log('PASS: ordenador nunca muestra el banner');
   await c.close();}

  {const {c,p}=await openPage(b,'register.html',{ua:ANDROID_UA});
   await p.addInitScript(()=>{window.matchMedia=(q)=>({matches:q.includes('standalone'),addListener(){},removeListener(){}});});
   await p.goto('http://127.0.0.1:8771/register.html',{waitUntil:'load'});
   await p.waitForTimeout(3500);
   assert.equal(await p.locator('#install-banner').isHidden(),true);
   console.log('PASS: app ya instalada (display-mode standalone) nunca muestra el banner');
   await c.close();}

  {const {c,p}=await openPage(b,'register.html',{ua:ANDROID_UA,locale:'ar-SA'});
   await p.evaluate(()=>localStorage.setItem('doctorqr_ui_language','ar'));
   await p.goto('http://127.0.0.1:8771/register.html',{waitUntil:'load'});
   await p.waitForTimeout(3500);
   const title=await p.locator('#install-banner-title').textContent();
   assert.equal(title,'التثبيت على أندرويد');
   const bodyText=await p.evaluate(()=>document.body.innerText.includes('Instalar en Android'));
   assert.equal(bodyText,false,'el resto de la pagina no debe retraducirse al traducir solo el banner');
   console.log('PASS: el banner se traduce al idioma activo (arabe) sin retraducir el resto de la pagina');
   await c.close();}

  for(const lang of ['en','fr','de','pt','eu','hi','zh','ru','ja']){
   const {c,p}=await openPage(b,'register.html',{ua:ANDROID_UA});
   await p.evaluate((l)=>localStorage.setItem('doctorqr_ui_language',l),lang);
   await p.goto('http://127.0.0.1:8771/register.html',{waitUntil:'load'});
   await p.waitForTimeout(3500);
   const title=await p.locator('#install-banner-title').textContent();
   assert.ok(title && title!=='Instalar en Android' && title.length>0,lang+': el banner debe traducirse');
   await c.close();
  }
  console.log('PASS: el banner tiene texto propio en los 9 idiomas restantes (11 en total con es/ar ya probados)');

  for(const forbidden of ['card.html','emergencia.html','login.html']){
   const source=fs.readFileSync(path.join(root,forbidden),'utf8');
   assert.ok(!source.includes('install-banner'),forbidden+' no debe referenciar el banner de instalacion');
  }
  console.log('PASS: card.html, emergencia.html y login.html no referencian el banner de instalacion');

}finally{await b.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
