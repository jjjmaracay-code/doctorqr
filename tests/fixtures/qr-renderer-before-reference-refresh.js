// Baseline renderer from doctorqr commit 390c882a03195cad0518153588235c7e4f36887b.
// Used only to detect regressions in dense QR geometry and decoder limitations.
function createOrganicQRCode(target, options) {
  const original = document.createElement('div');
  // Build the same matrix without painting the discarded square symbol first.
  const qr = new QRCode(original, { ...options, text: '' });
  const drawing = qr._oDrawing;
  const originalDraw = drawing && drawing.draw;
  if (typeof originalDraw === 'function') drawing.draw = () => {};
  try { qr.makeCode(options.text); }
  finally { if (typeof originalDraw === 'function') drawing.draw = originalDraw; }
  try {
    const matrix = qr._oQRCode;
    const count = matrix.getModuleCount();
    // Dense symbols keep square geometry to protect small-size reading.
    const softness = count > 57 ? 0 : 1;
    const cell = Math.max(8, Math.ceil(options.width / (count + 8)));
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = (count + 8) * cell;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas_unavailable');
    let rgb = /^#[0-9a-f]{6}$/i.test(options.colorDark || '')
      ? options.colorDark.slice(1).match(/../g).map(x => parseInt(x, 16)) : [17, 34, 51];
    const contrast = () => {
      const linear = rgb.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
      return 1.05 / (.2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2] + .05);
    };
    while (contrast() < 5) rgb = rgb.map(v => Math.floor(v * .9));
    const ink = 'rgb(' + rgb.join(',') + ')';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    function rounded(x, y, w, h, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
      ctx.fill();
    }
    const dark = (r, c) => r >= 0 && c >= 0 && r < count && c < count && matrix.isDark(r, c);
    const finder = (r, c) => (r < 7 && (c < 7 || c >= count - 7)) || (r >= count - 7 && c < 7);
    ctx.fillStyle = ink;
    for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) {
      if (!dark(r, c) || finder(r, c)) continue;
      const x = (c + 4) * cell, y = (r + 4) * cell;
      // Preserve timing patterns. Joined modules form soft continuous paths.
      const radius = (r === 6 || c === 6) ? 0 : cell * .36 * softness;
      rounded(x, y, cell, cell, radius);
      if (dark(r - 1, c)) ctx.fillRect(x, y, cell, cell / 2);
      if (dark(r + 1, c)) ctx.fillRect(x, y + cell / 2, cell, cell / 2);
      if (dark(r, c - 1)) ctx.fillRect(x, y, cell / 2, cell);
      if (dark(r, c + 1)) ctx.fillRect(x + cell / 2, y, cell / 2, cell);
    }
    for (const [r, c] of [[0, 0], [0, count - 7], [count - 7, 0]]) {
      const x = (c + 4) * cell, y = (r + 4) * cell;
      ctx.fillStyle = ink;
      rounded(x, y, 7 * cell, 7 * cell, cell * 1.1 * softness);
      ctx.fillStyle = '#ffffff';
      rounded(x + cell, y + cell, 5 * cell, 5 * cell, cell * .7 * softness);
      ctx.fillStyle = ink;
      rounded(x + 2 * cell, y + 2 * cell, 3 * cell, 3 * cell, cell * .65 * softness);
    }
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.alt = 'Código QR';
    img.width = options.width;
    img.height = options.height;
    img.style.cssText = 'display:block;max-width:100%;height:auto;image-rendering:pixelated;';
    target.appendChild(img);
  } catch (_) {
    // Restore the original square rendering only when the organic renderer fails.
    if (typeof originalDraw === 'function') { originalDraw.call(drawing, qr._oQRCode); qr.makeImage(); }
    while (original.firstChild) target.appendChild(original.firstChild);
  }
  return qr;
}

