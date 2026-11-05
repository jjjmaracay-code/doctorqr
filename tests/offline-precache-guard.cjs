// Guardia estatica y permanente (sin Playwright, sin red): todo recurso /js/*.js?v=NN,
// /css/*.css?v=NN, /i18n/*.json?v=NN (via i18n/loader.js) e /icons/*.png que referencien
// card.html, emergencia.html o login.html debe estar precacheado en sw.js con su URL
// exacta, SIN fijar numeros de version -- asi una futura subida de version que deje
// huerfano cualquiera de estos recursos (como paso con trial-access.js?v=51,
// emergency-accessories.js?v=48, emergency-scroll.js?v=2 e icons/icon-180.png) se
// detecta sola, en vez de depender de reproducir el caso borde con Playwright cada vez.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=process.cwd();
const PAGES=['card.html','emergencia.html','login.html'];

function assetRefs(html){
  return [...new Set([...html.matchAll(/(?:src|href)="(\/?(?:js|css|icons)\/[^"]+\.(?:js|css|png)(?:\?v=[\w.]+)?)"/g)]
    .map(m=>m[1].startsWith('/')?m[1]:'/'+m[1]))];
}

function i18nLangRefs(swSourceUnused,loaderSource){
  const m=loaderSource.match(/\/i18n\/'\s*\+\s*lang\s*\+\s*'\.json\?v=(\d+)/);
  assert.ok(m,'i18n/loader.js debe seguir pidiendo /i18n/<lang>.json?v=NN');
  const version=m[1];
  const langs=fs.readdirSync(path.join(root,'i18n')).filter(f=>f.endsWith('.json')&&f!=='languages.json').map(f=>f.replace(/\.json$/,''));
  assert.ok(langs.length>=10,'deberian existir al menos 10 diccionarios i18n reales en i18n/');
  return langs.map(lang=>'/i18n/'+lang+'.json?v='+version);
}

function missingRefs(swSource,loaderSource){
  const missing=[];
  for(const page of PAGES){
    const html=fs.readFileSync(path.join(root,page),'utf8');
    const refs=assetRefs(html);
    if(html.includes('/i18n/loader.js'))for(const ref of i18nLangRefs(null,loaderSource))if(!refs.includes(ref))refs.push(ref);
    for(const ref of refs){
      const relative='.'+ref;
      const present=swSource.includes("'"+relative+"'")||swSource.includes('"'+relative+'"');
      if(!present)missing.push(page+': '+relative);
    }
  }
  return missing;
}

const NEW_SW=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const LOADER=fs.readFileSync(path.join(root,'i18n/loader.js'),'utf8');
let OLD_SW=null;
try{OLD_SW=execFileSync('git',['show','origin/main:sw.js'],{cwd:root,encoding:'utf8'});}catch(_){OLD_SW=NEW_SW;}
const HAS_HISTORICAL_BASELINE=OLD_SW!==NEW_SW;

for(const page of PAGES){
  test(page+': todos sus recursos /js/, /css/, /icons/ (y /i18n/ via loader.js) estan en CACHE_URLS de sw.js',()=>{
    const missing=missingRefs(NEW_SW,LOADER).filter(m=>m.startsWith(page+':'));
    assert.deepEqual(missing,[],missing.join('\n'));
  });
}

test('sw.js actual: cero recursos de card.html, emergencia.html o login.html sin precachear',()=>{
  const missing=missingRefs(NEW_SW,LOADER);
  assert.deepEqual(missing,[],missing.join('\n'));
});

test('demostracion historica: el mismo chequeo con el sw.js de origin/main tenia huecos reales',(t)=>{
  if(!HAS_HISTORICAL_BASELINE){t.skip('origin/main ya contiene el mismo sw.js que esta rama; la demostracion historica ya no aplica');return;}
  const missingOld=missingRefs(OLD_SW,LOADER);
  assert.ok(missingOld.length>0,'el sw.js de origin/main deberia tener huecos de precache conocidos');
  assert.ok(missingOld.some(m=>m.includes('emergency-accessories.js?v=48')),'origin/main deberia carecer de emergency-accessories.js?v=48');
  assert.ok(missingOld.some(m=>m.includes('emergency-scroll.js?v=2')),'origin/main deberia carecer de emergency-scroll.js?v=2');
  assert.ok(missingOld.some(m=>m.includes('icon-180.png')),'origin/main deberia carecer de icons/icon-180.png');
  console.log('Huecos detectados con el sw.js antiguo (origin/main):\n'+missingOld.join('\n'));
});
