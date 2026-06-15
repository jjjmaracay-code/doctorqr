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
