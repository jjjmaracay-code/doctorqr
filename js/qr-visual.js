/* Public QR drawing only. Same standalone renderer as the medical QR symbols.
   This file does not load account data, forms, caches or medical selection rules. */
(function () {
  'use strict';
function createOrganicQRCode(target, options) {
  const original = document.createElement('div');
  const qr = new QRCode(original, { ...options, text: '' });
  const drawing = qr._oDrawing;
  const originalDraw = drawing && drawing.draw;
  if (typeof originalDraw === 'function') drawing.draw = () => {};
  try { qr.makeCode(options.text); }
  finally { if (typeof originalDraw === 'function') drawing.draw = originalDraw; }
  try {
    const matrix = qr._oQRCode, count = matrix.getModuleCount();
    const requested = ['flow','pulse','dots'].includes(options.visualStyle) ? options.visualStyle : 'flow';
    // At low displayed resolution, use the conservative geometry of the original renderer.
    const style = count > 57 || options.width / (count + 8) < 2.8 ? 'classic' : requested;
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
    ctx.fillStyle = '#ffffff';ctx.fillRect(0, 0, canvas.width, canvas.height);
    function rounded(x, y, w, h, radius) {
      ctx.beginPath();ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();ctx.fill();
    }
    const dark = (r,c) => r>=0 && c>=0 && r<count && c<count && matrix.isDark(r,c);
    const finder = (r,c) => (r<7 && (c<7 || c>=count-7)) || (r>=count-7 && c<7);
    // Function patterns (timing, format, version and every alignment target) retain square modules.
    const reserved = new Uint8Array(count * count);
    function protect(row,col,height,width) {
      for(let r=Math.max(0,row);r<Math.min(count,row+height);r++)
        for(let c=Math.max(0,col);c<Math.min(count,col+width);c++)reserved[r*count+c]=1;
    }
    protect(0,0,9,9);protect(0,count-8,9,8);protect(count-8,0,8,9);
    protect(6,0,1,count);protect(0,6,count,1);
    const version=(count-17)/4;
    if(version>=7){protect(0,count-11,6,3);protect(count-11,0,3,6);}
    if(version>=2){
      const n=Math.floor(version/7)+2;
      const step=version===32?26:Math.floor((version*4+n*2+1)/(n*2-2))*2;
      const positions=[6];for(let pos=count-7;positions.length<n;pos-=step)positions.splice(1,0,pos);
      for(let i=0;i<n;i++)for(let j=0;j<n;j++){
        if((i===0&&j===0)||(i===0&&j===n-1)||(i===n-1&&j===0))continue;
        protect(positions[i]-2,positions[j]-2,5,5);
      }
    }
    const structural=(r,c)=>r<0||c<0||r>=count||c>=count||!!reserved[r*count+c];
    ctx.fillStyle=ink;
    for(let r=0;r<count;r++)for(let c=0;c<count;c++){
      if(!dark(r,c)||finder(r,c))continue;
      const x=(c+4)*cell,y=(r+4)*cell;
      if(style==='classic'||structural(r,c)){ctx.fillRect(x,y,cell,cell);continue;}
      if(style==='dots'){
        ctx.beginPath();ctx.arc(x+cell/2,y+cell/2,cell*.49,0,Math.PI*2);ctx.fill();
      }else if(style==='pulse'){
        // Capsules follow only existing horizontal dark runs. Every original module centre is retained.
        let end=c;while(end+1<count&&dark(r,end+1)&&!finder(r,end+1)&&!structural(r,end+1))end++;
        const inset=cell*.025;
        rounded(x+inset,y+inset,(end-c+1)*cell-inset*2,cell-inset*2,cell*.475);c=end;
      }else{
        // Smooth connected paths. Joins never extend beyond the original dark cells.
        rounded(x,y,cell,cell,cell*.48);
        if(dark(r-1,c))ctx.fillRect(x,y,cell,cell/2);
        if(dark(r+1,c))ctx.fillRect(x,y+cell/2,cell,cell/2);
        if(dark(r,c-1))ctx.fillRect(x,y,cell/2,cell);
        if(dark(r,c+1))ctx.fillRect(x+cell/2,y,cell/2,cell);
      }
    }
    for(const [r,c] of [[0,0],[0,count-7],[count-7,0]]){
      const x=(c+4)*cell,y=(r+4)*cell;
      ctx.fillStyle=ink;rounded(x,y,7*cell,7*cell,style==='classic'?0:cell*1.5);
      ctx.fillStyle='#ffffff';rounded(x+cell,y+cell,5*cell,5*cell,style==='classic'?0:cell*1.15);
      ctx.fillStyle=ink;
      rounded(x+2*cell,y+2*cell,3*cell,3*cell,style==='classic'?0:cell*(style==='dots'?1.1:.9));
    }
    const img=document.createElement('img');img.src=canvas.toDataURL('image/png');
    img.alt='Código QR';img.width=options.width;img.height=options.height;
    img.dataset.qrStyle=style;
    img.style.cssText='display:block;max-width:100%;height:auto;image-rendering:pixelated;';
    target.appendChild(img);
  }catch(_){
    if(typeof originalDraw==='function'){originalDraw.call(drawing,qr._oQRCode);qr.makeImage();}
    while(original.firstChild)target.appendChild(original.firstChild);
  }
  return qr;
}

  window.AtabeyQR = Object.freeze({ draw: createOrganicQRCode });
})();
