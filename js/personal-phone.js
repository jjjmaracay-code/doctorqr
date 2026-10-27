/* Optional owner-bound profile fields. Does not read/write accounts or persist independently. */
(function(){
 'use strict';
 const country=document.getElementById('f-personal-phone-country'),number=document.getElementById('f-personal-phone-num');
 const model=window.AtabeyEmergencyNumbers;if(!country||!number||!model)return;
 function options(){
  const selected=country.value,placeholder=country.firstElementChild.cloneNode(true);country.replaceChildren(placeholder);
  for(const item of model.phoneOptions(document.documentElement.lang||'es'))country.append(new Option(item.name+' ('+item.prefix+')',item.id));country.value=selected;
 }
 function read(){
  const num=number.value.trim(),id=country.value;
  return {personal_phone:num?{country:id,prefix:model.prefix(id),number:num}:null};
 }
 function validate(){
  const num=number.value.trim().replace(/[ ().-]/g,''),code=model.prefix(country.value);
  const valid=!num||!!code&&/^\d{3,14}$/.test(num)&&num.length+code.length-1<=15;
  number.setCustomValidity(valid?'':(document.getElementById('personal-phone-warning')?.textContent||'Select a country code and enter the national telephone number.'));
  document.getElementById('personal-phone-warning').hidden=valid;number.setAttribute('aria-invalid',String(!valid));return valid;
 }
 function restore(profile){
  const phone=profile?.personal_phone;country.value=phone?model.profileCountry(profile)||'':'';number.value=phone?.number||'';validate();
 }
 country.addEventListener('change',validate);number.addEventListener('input',validate);options();
 window.addEventListener('doctorqr:language-changed',()=>{options();validate();});
 window.AtabeyPersonalPhone=Object.freeze({read,restore,validate});
})();
