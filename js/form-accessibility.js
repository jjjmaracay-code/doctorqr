/* Native-equivalent keyboard behavior; never changes clinical values. */
(() => {
  const chips = document.querySelectorAll('.chip');
  function sync() {
    chips.forEach(chip => {chip.setAttribute('aria-pressed',String(chip.classList.contains('active')));chip.setAttribute('aria-disabled',String(!!chip.closest('[inert],.chips-disabled')));});
    document.querySelectorAll('.section-header').forEach(header => header.setAttribute('aria-expanded',String(header.closest('.form-section').classList.contains('open'))));
  }
  chips.forEach(chip => {chip.setAttribute('role','button');chip.tabIndex=0;});
  document.addEventListener('keydown', event => {
    const target=event.target.closest('.chip,.section-header');
    if (!target || !['Enter',' '].includes(event.key) || event.repeat || target.closest('[inert],.chips-disabled')) return;
    event.preventDefault();target.click();
  });
  document.addEventListener('click',()=>queueMicrotask(sync));
  const observer=new MutationObserver(sync);
  chips.forEach(chip=>observer.observe(chip,{attributes:true,attributeFilter:['class']}));
  sync();
})();
