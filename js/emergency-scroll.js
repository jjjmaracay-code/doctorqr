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
  let autoDone = false;
  let autoTimer = 0;
  let autoScrolling = false;
  let autoStopTimer = 0;
  function finishAutoScroll() {
    autoScrolling = false;
    clearTimeout(autoStopTimer);
  }
  function cancelAutoReveal() {
    autoDone = true;
    clearTimeout(autoTimer);
    autoTimer = 0;
    if (autoScrolling) {
      finishAutoScroll();
      window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: 'instant' });
    }
  }
  function revealAutomatically() {
    autoTimer = 0;
    if (autoDone) return;
    autoDone = true;
    const active = document.activeElement;
    const interacting = active && active !== document.body && active !== document.documentElement;
    const hasInput = Array.from(screen.querySelectorAll('input')).some(input => input.value.trim());
    const viewport = window.visualViewport;
    const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
    const rect = target.getBoundingClientRect();
    if (document.hidden || interacting || hasInput || window.scrollY > 24 ||
        !screen.classList.contains('active') || !rect.width || !rect.height ||
        (keyboard && keyboard.classList.contains('visible')) ||
        (overlay && getComputedStyle(overlay).display !== 'none') || rect.bottom <= bottom - 16) return;
    cue.hidden = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    autoScrolling = !reducedMotion;
    if (autoScrolling) {
      window.addEventListener('scrollend', finishAutoScroll, { once: true });
      autoStopTimer = setTimeout(finishAutoScroll, 1500);
    }
    // Reveal the existing control without activating it or moving keyboard focus.
    target.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'instant' : 'smooth' });
    schedule();
  }
  function startAutoReveal() {
    if (!autoDone && !document.hidden) autoTimer = setTimeout(revealAutomatically, 1800);
  }
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
    cancelAutoReveal();
    cue.hidden = true;
    target.scrollIntoView({ block: 'center', behavior: 'instant' });
    target.focus({ preventScroll: true });
    schedule();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('scroll', function () {
    if (!autoDone && window.scrollY > 24) cancelAutoReveal();
  }, { passive: true });
  // User interaction wins, including while the browser is animating the reveal.
  for (const event of ['pointerdown', 'touchstart', 'wheel', 'keydown', 'focusin', 'input']) {
    document.addEventListener(event, cancelAutoReveal, { capture: true, passive: true });
  }
  window.addEventListener('pagehide', cancelAutoReveal);
  window.addEventListener('resize', cancelAutoReveal);
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  window.addEventListener('doctorqr:language-changed', schedule);
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAutoReveal();
    schedule();
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', schedule);
    window.visualViewport.addEventListener('scroll', schedule, { passive: true });
  }
  const observer = new MutationObserver(function () {
    if (!screen.classList.contains('active') ||
        (keyboard && keyboard.classList.contains('visible')) ||
        (overlay && getComputedStyle(overlay).display !== 'none')) cancelAutoReveal();
    schedule();
  });
  observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  if (overlay) observer.observe(overlay, { attributes: true, attributeFilter: ['style', 'class'] });
  if (keyboard) observer.observe(keyboard, { attributes: true, attributeFilter: ['class'] });
  if (window.i18nReady) window.i18nReady.finally(function () { schedule();startAutoReveal(); });
  else startAutoReveal();
  schedule();
})();
