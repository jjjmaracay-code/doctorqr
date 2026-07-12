    function normalizeText(text) {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[áàäâã]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöôõ]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/ç/g, 's')
        .replace(/[^\w\s]/g, '')
        .trim();
    }

    function phoneticSpanish(text) {
      let s = normalizeText(text);
      s = s.replace(/^h/, '').replace(/([aeiou])h/g, '$1');
      s = s.replace(/[bvp]/g, 'b');
      s = s.replace(/z/g, 's')
           .replace(/c([ei])/g, 's$1')
           .replace(/qu/g, 'k')
           .replace(/x/g, 'ks');
      s = s.replace(/g([ei])/g, 'j$1')
           .replace(/gu([ei])/g, 'g$1');
      s = s.replace(/ll/g, 'y');
      s = s.replace(/rr/g, 'r');
      s = s.replace(/n[bv]/g, 'mb')
           .replace(/m[bv]/g, 'mb');
      s = s.replace(/k/g, 'k')
           .replace(/c([^ei])/g, 'k$1');
      s = s.replace(/([aeiou])\1+/g, '$1');
      s = s.replace(/w/g, 'b');
      s = s.replace(/[dt]$/, '');
      return s;
    }

    function buildSearchVariants(text) {
      const norm = normalizeText(text);
      const phonetic = phoneticSpanish(text);
      const variants = new Set([norm, phonetic]);
      variants.add(norm.replace(/b/g, 'p').replace(/p/g, 'b'));
      variants.add(norm.replace(/[scz]/g, 's'));
      variants.add(norm.replace(/[scz]/g, 'c'));
      variants.add(norm.replace(/[scz]/g, 'z'));
      variants.add(norm.replace(/j/g, 'g').replace(/g/g, 'j'));
      variants.add(norm.replace(/h/g, ''));
      variants.add('h' + norm);
      variants.add(norm.replace(/ll/g, 'y').replace(/y/g, 'll'));
      variants.add(norm.replace(/b/g, 'v').replace(/v/g, 'b'));
      variants.add(norm.replace(/n([bpm])/g, 'm$1'));
      return [...variants];
    }

    function filterChips(input) {
      const raw = input.value.trim();
      const field = input.closest('.field');

      if (raw.length < 3) {
        field.querySelectorAll('.chip').forEach(chip => { chip.style.display = ''; });
        return;
      }

      const queryNorm = normalizeText(raw);
      const queryPhonetic = phoneticSpanish(raw);
      const queryVariants = buildSearchVariants(raw);

      field.querySelectorAll('.chip').forEach(chip => {
        const chipText = chip.textContent.trim();
        const chipNorm = normalizeText(chipText);
        const chipPhonetic = phoneticSpanish(chipText);
        const chipVariants = buildSearchVariants(chipText);
        const match =
          chipNorm.includes(queryNorm) ||
          chipPhonetic.includes(queryPhonetic) ||
          queryVariants.some(qv => chipVariants.some(cv => cv.includes(qv) || qv.includes(cv)));
        chip.style.display = match ? '' : 'none';
      });
    }

    function clearChipsSearch(chipEl) {
      const field = chipEl.closest('.field');
      if (!field) return;
      const search = field.querySelector('.chips-search');
      if (!search) return;
      search.value = '';
      field.querySelectorAll('.chip').forEach(c => { c.style.display = ''; });
    }

// ============================================
// BUSCADOR UNIVERSAL DEL FORMULARIO (con tolerancia a errores tipográficos)
// ============================================
let formSearchMatches = [];
let formSearchCurrent = -1;

function formGetTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; let n;
  while ((n = walker.nextNode())) {
    if (n.nodeValue.trim() && !n.parentElement.closest('.form-search-bar, .form-tabs-bar, script, style'))
      nodes.push(n);
  }
  return nodes;
}

function formClearMarks() {
  document.querySelectorAll('#form mark.form-search-mark').forEach(m => {
    const parent = m.parentNode;
    parent.replaceChild(document.createTextNode(m.textContent), m);
    parent.normalize();
  });
}

function formUpdateCounter() {
  const el  = document.getElementById('form-sctr');
  const inp = document.getElementById('form-sinput');
  if (!el) return;
  if (!formSearchMatches.length) {
    el.textContent = inp && inp.value.trim().length >= 2 ? 'Sin resultados' : '';
    return;
  }
  el.textContent = (formSearchCurrent + 1) + ' de ' + formSearchMatches.length;
}

function formHighlight() {
  formSearchMatches.forEach((m, i) => m.classList.toggle('current', i === formSearchCurrent));
  const cur = formSearchMatches[formSearchCurrent];
  if (!cur) return;
  const section = cur.closest('.form-section');
  if (section && !section.classList.contains('open')) section.classList.add('open');
  cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function formRunSearch(q) {
  formClearMarks();
  formSearchMatches = [];
  formSearchCurrent = -1;
  formUpdateCounter();
  const prev = document.getElementById('form-sprev');
  const next = document.getElementById('form-snext');

  const raw = (q || '').trim();
  if (raw.length < 2) {
    if (prev) prev.disabled = true;
    if (next) next.disabled = true;
    return;
  }

  const queryVariants = buildSearchVariants(raw);
  const container = document.getElementById('form');
  if (!container) return;

  formGetTextNodes(container).forEach(node => {
    const txt = node.nodeValue;
    const txtVariants = buildSearchVariants(txt);
    const isMatch = queryVariants.some(qv => txtVariants.some(tv => tv.includes(qv)));
    if (!isMatch) return;

    // Resalta la primera ocurrencia normalizada dentro del nodo (aprox. visual)
    const low = normalizeText(txt);
    const qNorm = normalizeText(raw);
    let idx = low.indexOf(qNorm);
    if (idx === -1) idx = 0;
    const len = qNorm.length || raw.length;

    const frag = document.createDocumentFragment();
    if (idx > 0) frag.appendChild(document.createTextNode(txt.slice(0, idx)));
    const mk = document.createElement('mark');
    mk.className = 'form-search-mark';
    mk.textContent = txt.slice(idx, idx + len) || txt;
    frag.appendChild(mk);
    formSearchMatches.push(mk);
    if (idx + len < txt.length) frag.appendChild(document.createTextNode(txt.slice(idx + len)));
    node.parentNode.replaceChild(frag, node);
  });

  if (formSearchMatches.length) {
    formSearchCurrent = 0;
    formHighlight();
    if (prev) prev.disabled = false;
    if (next) next.disabled = false;
  } else {
    if (prev) prev.disabled = true;
    if (next) next.disabled = true;
  }
  formUpdateCounter();
}

function formNavigate(dir) {
  if (!formSearchMatches.length) return;
  formSearchCurrent = (formSearchCurrent + dir + formSearchMatches.length) % formSearchMatches.length;
  formHighlight();
  formUpdateCounter();
}

function initFormSearch() {
  const inp  = document.getElementById('form-sinput');
  const prev = document.getElementById('form-sprev');
  const next = document.getElementById('form-snext');
  if (!inp) return;

  inp.addEventListener('input', () => formRunSearch(inp.value));
  prev.addEventListener('click', () => formNavigate(-1));
  next.addEventListener('click', () => formNavigate(1));
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); formNavigate(1); }
    if (e.key === 'ArrowUp')  { e.preventDefault(); formNavigate(-1); }
    if (e.key === 'Escape')   { inp.value = ''; formRunSearch(''); inp.blur(); }
  });
}

document.addEventListener('DOMContentLoaded', initFormSearch);
