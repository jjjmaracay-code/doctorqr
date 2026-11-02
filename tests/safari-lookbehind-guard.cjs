// Run with node --test tests/safari-lookbehind-guard.cjs in the git checkout.
// Las marcas buscadas se construyen por concatenación a propósito: si se escribieran
// literales, este mismo archivo (una vez trackeado por git) se detectaría a sí mismo.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const lookbehindMarks=['(?<'+'=','(?<'+'!'];
const files=execFileSync('git',['ls-files','*.js','*.html','*.cjs','*.mjs'],{encoding:'utf8'}).split('\n').filter(Boolean);
for(const file of files)test(file+': no Safari<16.4-incompatible lookbehind regex',()=>{const source=fs.readFileSync(file,'utf8');assert.ok(!lookbehindMarks.some(mark=>source.includes(mark)),file+' contiene una aserción lookbehind no soportada por Safari anterior a 16.4');});
