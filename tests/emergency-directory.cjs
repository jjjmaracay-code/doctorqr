const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const source=fs.readFileSync('js/emergency-numbers.js','utf8');
function model(){const c={window:{},Intl};vm.runInNewContext(source,c);return c.window.AtabeyEmergencyNumbers;}
test('Published emergency entries retain official sources, valid telephone URIs and all EU member states',()=>{
 const m=model();assert.ok(m.countries.length>=226);assert.equal(new Set(m.countries.map(c=>c.id)).size,m.countries.length);
 for(const c of m.countries){assert.equal(new URL(c.source).hostname,'www.gov.uk');assert.equal(c.checked,'2026-10-27');for(const n of c.services){assert.ok(m.tel(n.number));assert.ok(['general','ambulance','fire','police','ambulance_fire','police_ambulance'].includes(n.kind));}}
 for(const iso of 'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE'.split(' '))assert.equal(m.reference(iso).number,'112');
 assert.equal(m.reference('US').number,'911');assert.equal(m.reference('JP').number,'119');assert.equal(m.reference('JP').kind,'ambulance');assert.equal(m.reference('AU').number,'000');
 assert.equal(m.reference('CD'),null,'Kinshasa police/fire numbers are not relabelled as a national medical line');assert.equal(m.reference('SS'),null);assert.equal(m.reference('GM'),null);
});
test('The personal country resolves shared calling codes, while a contact phone never identifies the owner country',()=>{
 const m=model();assert.equal(m.profileCountry({personal_phone:{country:'CA',prefix:'+1'}}),'CA');assert.equal(m.profileCountry({personal_phone:{prefix:'+1'}}),'');assert.equal(m.profileCountry({ec1_phone_prefix:'+34'}),'');assert.equal(m.profileCountry({personal_phone:{prefix:'+34'}}),'ES');assert.equal(m.profileCountry({personal_phone:{country:'US',prefix:'+34'}}),'');
 assert.ok(m.phoneOptions().length>=240);assert.ok(m.suggest('+7').includes('KZ'));assert.ok(m.suggest('+7').includes('RU'));assert.equal(m.tel('javascript:alert(1)'),null);assert.equal(m.tel('112;ext=123'),null);assert.equal(m.tel('000'),'tel:000');
});
test('The public directory searches, changes language and exposes calls only as user-operated links, without account access',()=>{
 const d=new JSDOM(fs.readFileSync('emergencias.html','utf8'),{url:'https://fixture.invalid/sos',runScripts:'outside-only',pretendToBeVisual:true}),w=d.window;
 Object.defineProperty(w,'localStorage',{get(){throw Error('Public directory must not access account storage')}});Object.defineProperty(w,'sessionStorage',{get(){throw Error('Public directory must not access session storage')}});w.fetch=()=>{throw Error('No medical or third-party API request permitted')};
 w.eval(source);w.eval(fs.readFileSync('js/emergency-directory.js','utf8'));const search=w.document.getElementById('country-search');search.value='España';search.dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('.country-button').length,1);w.document.querySelector('.country-button').click();assert.equal(w.document.querySelector('.number-link').getAttribute('href'),'tel:112');
 search.value='United States';search.dispatchEvent(new w.Event('input'));w.document.querySelector('.country-button').click();assert.equal(w.document.querySelector('.number-link').getAttribute('href'),'tel:911');
 search.value='日本';search.dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelector('.country-button').dataset.country,'JP');
 const lang=w.document.getElementById('directory-language');lang.value='ar';lang.dispatchEvent(new w.Event('change'));assert.equal(w.document.documentElement.dir,'rtl');assert.equal(w.document.querySelector('.number-link').getAttribute('href'),'tel:911');
 search.value='<img onerror=bad()>';search.dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('.country-button').length,0);assert.equal(w.document.querySelectorAll('img').length,0);w.close();
});
test('Personal telephone values restore, clear and validate independently from the identity fields',()=>{
 const d=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://fixture.invalid',runScripts:'outside-only'}),w=d.window;w.eval(source);w.eval(fs.readFileSync('js/personal-phone.js','utf8'));
 const m=w.AtabeyPersonalPhone;m.restore({personal_phone:{country:'ES',prefix:'+34',number:'600 000 000'}});assert.equal(m.validate(),true);assert.deepEqual(JSON.parse(JSON.stringify(m.read())),{personal_phone:{country:'ES',prefix:'+34',number:'600 000 000'}});
 m.restore({personal_phone:{country:'CA',prefix:'+1',number:'416 555 0100'}});assert.equal(m.read().personal_phone.country,'CA');assert.equal(m.read().personal_phone.prefix,'+1');w.document.documentElement.lang='ar';w.dispatchEvent(new w.CustomEvent('doctorqr:language-changed'));assert.equal(m.read().personal_phone.country,'CA');assert.equal(m.read().personal_phone.number,'416 555 0100');m.restore(null);assert.equal(m.read().personal_phone,null);assert.equal(w.document.getElementById('f-personal-phone-country').value,'');
 w.document.getElementById('f-personal-phone-num').value='123abc';assert.equal(m.validate(),false);assert.equal(w.document.getElementById('f-name').readOnly,true);assert.equal(w.document.getElementById('f-birthdate-readable').readOnly,true);w.close();
});
