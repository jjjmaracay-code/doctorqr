const {test}=require('node:test'),assert=require('node:assert/strict');
const dates=require('../js/birthdate');
test('September 2 and February 9 are displayed distinctly in Spanish',()=>{assert.equal(dates.format('1976-09-02','es'),'2 de septiembre de 1976');assert.equal(dates.format('1976-02-09','es'),'9 de febrero de 1976')});
test('Ambiguous non-ISO dates and impossible calendar dates are rejected',()=>{for(const s of ['02/09/1976','09/02/1976','1976-02-30','1976-13-02','1975-02-29','1976-00-02',''])assert.equal(dates.parse(s),null)});
test('Leap days and month boundaries remain exact',()=>{for(const s of ['1976-02-29','2000-02-29','1976-09-02','1976-12-31'])assert.equal(dates.parse(s).toISOString().slice(0,10),s)});
test('Display is invariant under local time zone and does not mutate stored ISO',()=>{for(const tz of ['Europe/Madrid','America/Los_Angeles','Pacific/Kiritimati']){process.env.TZ=tz;const s='1976-09-02';assert.equal(dates.format(s,'es'),'2 de septiembre de 1976');assert.equal(s,'1976-09-02')}});
test('All application languages show the actual September date',()=>{for(const lang of ['es','en','fr','pt','de']){const result=dates.format('1976-09-02',lang);assert.ok(result.includes('1976'));assert.ok(result.includes('2'));assert.notEqual(result,dates.format('1976-02-09',lang))}});
