'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const source=fs.readFileSync('js/country-metrics.js','utf8');
async function run({path='/',trace='ip=PRIVATE-IP\ncolo=MAD\nloc=ES\n',nav={},failTrace=false,failReport=false}={}){
 const calls=[],listeners=[];const context={location:{pathname:path},navigator:nav,document:{readyState:'loading'},window:{addEventListener:(name,fn,opts)=>listeners.push({name,fn,opts})},AbortSignal,fetch:async(url,options)=>{calls.push({url,options});if(url==='/cdn-cgi/trace'){if(failTrace)throw Error('offline');return{ok:true,text:async()=>trace};}if(failReport)throw Error('offline');return{ok:true};}};
 vm.runInNewContext(source,context);for(const l of listeners){assert.equal(l.name,'load');assert.equal(l.opts.once,true);await l.fn();}return calls;
}
test('Country uses visitor loc, not server colo, and transmits only the country',async()=>{
 const calls=await run();assert.equal(calls.length,2);assert.deepEqual(JSON.parse(calls[1].options.body),{country:'ES'});
 for(const c of calls){assert.equal(c.options.credentials,'omit');assert.equal(c.options.referrerPolicy,'no-referrer');assert.equal(c.options.cache,'no-store');assert.ok(!JSON.stringify(c).includes('PRIVATE-IP'));}
 assert.equal(calls[1].options.method,'POST');assert.equal(calls[1].options.headers.Authorization,undefined);
});
test('Privacy preferences and admin, medical QR and recovery pages produce no counter requests',async()=>{
 for(const path of ['/admin','/admin.html','/card','/card.html','/emergencia','/recovery','/vincular','/dispositivos'])assert.deepEqual(await run({path}),[]);
 for(const nav of [{doNotTrack:'1'},{globalPrivacyControl:true},{webdriver:true}])assert.deepEqual(await run({nav}),[]);
});
test('Unknown, Tor and unavailable country never become a fabricated real country',async()=>{
 for(const settings of [{trace:'loc=XX\n'},{trace:'loc=T1\n'},{trace:'colo=ES\n'},{failTrace:true}])assert.deepEqual(JSON.parse((await run(settings))[1].options.body),{country:'ZZ'});
 await run({failTrace:true,failReport:true});
});
test('Collector has no persistent identifiers or medical dependencies; service worker never caches trace',()=>{
 for(const name of ['localStorage','sessionStorage','document.cookie','doctorqr_token','profile_data','MedicalOwner'])assert.ok(!source.includes(name));
 const sw=fs.readFileSync('sw.js','utf8');assert.ok(sw.includes("url.pathname === '/cdn-cgi/trace' || url.pathname.startsWith('/api/')"));
 for(const page of ['index','login','register','web','install'])assert.ok(fs.readFileSync(page+'.html','utf8').includes('/js/country-metrics.js?v=1'));
 const geometry=JSON.parse(fs.readFileSync('assets/admin-countries.json'));assert.ok(geometry.features.some(f=>f.country==='ES'&&f.d.length>50));assert.ok(geometry.features.length<300);
});
