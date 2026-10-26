/* Login presentation only: point to the existing emergency button below the fold. */
(function () {
  'use strict';
  const cue = document.getElementById('emergency-scroll-cue');
  const target = document.getElementById('btn-emergency-quick');
  const screen = document.getElementById('screen-l1');
  const instruction = document.getElementById('emergency-scroll-instruction');
  const overlay = document.getElementById('emergency-quick-view');
  const keyboard = document.getElementById('pwd-keyboard');
  if (!cue || !target || !screen || !instruction) return;

  const messages = {
    es: 'Desliza hacia abajo',
    en: 'Scroll down',
    fr: 'Faites défiler vers le bas',
    de: 'Nach unten scrollen',
    pt: 'Deslize para baixo',
    eu: 'Joan behera',
    hi: 'नीचे स्क्रॉल करें',
    zh: '向下滚动',
    ru: 'Прокрутите вниз',
    ja: '下にスクロール',
    ar: 'مرّر لأسفل'
  };
  let frame = 0;
  function update() {
    frame = 0;
    const message = messages[document.documentElement.lang] || messages.es;
    if (instruction.textContent !== message) instruction.textContent = message;
    const active = document.activeElement;
    const editing = active && (active.matches('input,select,textarea') || active.isContentEditable);
    const viewport = window.visualViewport;
    const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
    const rect = target.getBoundingClientRect();
    const overlayOpen = overlay && getComputedStyle(overlay).display !== 'none';
    const keyboardOpen = keyboard && keyboard.classList.contains('visible');
    cue.hidden = document.hidden || editing || keyboardOpen || overlayOpen || window.scrollY > 24 ||
      !screen.classList.contains('active') || !rect.width || !rect.height || rect.top < bottom - 12;
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  cue.addEventListener('click', function () {
    cue.hidden = true;
    target.scrollIntoView({ block: 'center', behavior: 'instant' });
    target.focus({ preventScroll: true });
    schedule();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  window.addEventListener('doctorqr:language-changed', schedule);
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  document.addEventListener('visibilitychange', schedule);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', schedule);
    window.visualViewport.addEventListener('scroll', schedule, { passive: true });
  }
  const observer = new MutationObserver(schedule);
  observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  if (overlay) observer.observe(overlay, { attributes: true, attributeFilter: ['style', 'class'] });
  if (keyboard) observer.observe(keyboard, { attributes: true, attributeFilter: ['class'] });
  if (window.i18nReady) window.i18nReady.finally(schedule);
  schedule();
})();
