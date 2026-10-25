/* Calendar dates remain ISO YYYY-MM-DD; display never parses an ambiguous string. */
(function (root) {
  'use strict';
  function parse(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) return null;
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
  }
  function format(value, locale = 'es') {
    const date = parse(value);
    if (!date) return '';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', calendar: 'gregory', timeZone: 'UTC' }).format(date);
  }
  function renderDisplay() {
    if (!root.document) return;
    const source = root.document.getElementById('f-birthdate');
    const output = root.document.getElementById('f-birthdate-readable');
    if (source && output) output.value = format(source.value, root.currentLanguage || 'es');
    const input = root.document.getElementById('r-fnac');
    const hint = root.document.getElementById('r-fnac-readable');
    if (input && hint) hint.textContent = format(input.value, root.currentLanguage || 'es');
  }
  function confirmBirthdate() {
    const input = root.document.getElementById('r-fnac');
    const value = input.value;
    const date = parse(value);
    const today = new Date();
    const last = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    if (!date || date.getTime() > last) {
      root.alert(root.t && root.t('birthdate.invalid') !== 'birthdate.invalid' ? root.t('birthdate.invalid') : 'Selecciona una fecha de nacimiento válida.'); return false;
    }
    renderDisplay();
    const messages = {
      es: 'Confirma tu fecha de nacimiento: {date}. ¿Es correcta? Se guardará en tu identidad.',
      en: 'Confirm your birth date: {date}. Is it correct? It will be saved in your identity.',
      fr: 'Confirmez votre date de naissance : {date}. Est-elle correcte ? Elle sera enregistrée dans votre identité.',
      pt: 'Confirme sua data de nascimento: {date}. Está correta? Será guardada na sua identidade.',
      de: 'Geburtsdatum bestätigen: {date}. Ist es richtig? Es wird in Ihrer Identität gespeichert.'
    };
    const lang = root.currentLanguage || 'es';
    const template = root.t && root.t('birthdate.confirm') !== 'birthdate.confirm' ? root.t('birthdate.confirm') : (messages[lang] || messages.es);
    return root.confirm(template.replace('{date}', format(value, lang)));
  }
  const api = { parse, format, renderDisplay, confirmBirthdate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AtabeyDates = api;
  if (root.document) root.document.addEventListener('DOMContentLoaded', () => {
    renderDisplay();
    const input = root.document.getElementById('r-fnac');
    if (input) {
      const today = new Date();
      input.max = [today.getFullYear(), String(today.getMonth()+1).padStart(2,'0'), String(today.getDate()).padStart(2,'0')].join('-');
      input.addEventListener('input', renderDisplay);
      input.addEventListener('change', renderDisplay);
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
