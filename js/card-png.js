/* Local, dependency-free rendering of an already verified card. No storage or API access.
   SVG/text geometry comes from the visible document; QR PNG pixels are embedded unchanged. */
(function () {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = n => Number(n.toFixed(4));
  async function render(card, current) {
    if (!card || typeof current !== 'function' || !current()) throw Error('card_context_changed');
    const doc = card.ownerDocument, view = doc.defaultView, bounds = card.getBoundingClientRect();
    const width = 85.6 * 96 / 25.4, height = 60 * 96 / 25.4, scale = bounds.width / width;
    if (!scale || !view || bounds.height <= 0) throw Error('card_not_visible');
    const canvas = doc.createElement('canvas');canvas.width = 1600;canvas.height = Math.round(1600 * 60 / 85.6);
    const ctx = canvas.getContext('2d');if (!ctx) throw Error('canvas_unavailable');
    const parts = [];
    function rect(el) {
      const r = el.getBoundingClientRect();return {x:(r.x-bounds.x)/scale,y:(r.y-bounds.y)/scale,w:r.width/scale,h:r.height/scale};
    }
    function transparent(color) { return !color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)'; }
    function radius(value) { return parseFloat(value) || 0; }
    function outline(r, radii, inset=0) {
      const x=r.x+inset,y=r.y+inset,w=r.w-inset*2,h=r.h-inset*2;
      const [a,b,c,d]=radii.map(v=>Math.max(0,Math.min(v-inset,w/2,h/2)));
      const n=number;
      return `M${n(x+a)} ${n(y)}H${n(x+w-b)}Q${n(x+w)} ${n(y)} ${n(x+w)} ${n(y+b)}V${n(y+h-c)}Q${n(x+w)} ${n(y+h)} ${n(x+w-c)} ${n(y+h)}H${n(x+d)}Q${n(x)} ${n(y+h)} ${n(x)} ${n(y+h-d)}V${n(y+a)}Q${n(x)} ${n(y)} ${n(x+a)} ${n(y)}Z`;
    }
    function box(el, style) {
      const r=rect(el),radii=[style.borderTopLeftRadius,style.borderTopRightRadius,style.borderBottomRightRadius,style.borderBottomLeftRadius].map(radius);
      if (!transparent(style.backgroundColor)) parts.push(`<path d="${outline(r,radii)}" fill="${escape(style.backgroundColor)}"/>`);
      const edges=['Top','Right','Bottom','Left'].map(side=>({side,w:parseFloat(style['border'+side+'Width'])||0,color:style['border'+side+'Color'],type:style['border'+side+'Style']}));
      const active=edges.filter(e=>e.w&&e.type!=='none'&&!transparent(e.color));if (!active.length) return;
      if(active.length===4&&active.every(e=>e.w===active[0].w&&e.color===active[0].color)) {
        const edge=active[0];parts.push(`<path d="${outline(r,radii,edge.w/2)}" fill="none" stroke="${escape(edge.color)}" stroke-width="${number(edge.w)}"/>`);
      } else for (const edge of active) {
        const half=edge.w/2,n=number;
        const path={Top:`M${n(r.x)} ${n(r.y+half)}H${n(r.x+r.w)}`,Right:`M${n(r.x+r.w-half)} ${n(r.y)}V${n(r.y+r.h)}`,Bottom:`M${n(r.x)} ${n(r.y+r.h-half)}H${n(r.x+r.w)}`,Left:`M${n(r.x+half)} ${n(r.y)}V${n(r.y+r.h)}`}[edge.side];
        parts.push(`<path d="${path}" fill="none" stroke="${escape(edge.color)}" stroke-width="${n(edge.w)}"/>`);
      }
    }
    function paintLine(text, r, style, anchorRect) {
      if (!text.trim()) return;
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const metrics=ctx.measureText(text),size=parseFloat(style.fontSize),ascent=metrics.fontBoundingBoxAscent||metrics.actualBoundingBoxAscent||size*.8,descent=metrics.fontBoundingBoxDescent||metrics.actualBoundingBoxDescent||size*.2;
      const rtl=style.direction==='rtl',left=(r.left-bounds.left)/scale,right=(r.right-bounds.left)/scale;
      const x=anchorRect?(rtl?anchorRect.x+anchorRect.w:anchorRect.x):(rtl?right:left);
      const y=(r.top-bounds.top)/scale+(r.height/scale-ascent-descent)/2+ascent;
      const spacing=style.letterSpacing==='normal'?'0':style.letterSpacing;
      parts.push(`<text x="${number(x)}" y="${number(y)}" fill="${escape(style.color)}" font-family="${escape(style.fontFamily)}" font-size="${escape(style.fontSize)}" font-weight="${escape(style.fontWeight)}" font-style="${escape(style.fontStyle)}" letter-spacing="${escape(spacing)}" direction="${rtl?'rtl':'ltr'}" text-anchor="start" unicode-bidi="plaintext" xml:space="preserve">${escape(text)}</text>`);
    }
    function textNode(node) {
      const el=node.parentElement,style=view.getComputedStyle(el),text=node.nodeValue||'';
      if (!text.trim()) return;
      if (text.length>10000) throw Error('card_text_too_long');
      const range=doc.createRange();
      if (style.textOverflow==='ellipsis' && el.scrollWidth>el.clientWidth) {
        ctx.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        let value='';for(const char of text){if(ctx.measureText(value+char+'…').width>el.clientWidth)break;value+=char;}
        range.selectNodeContents(node);paintLine(value.trimEnd()+'…',range.getBoundingClientRect(),style,rect(el));return;
      }
      const lines=[];let offset=0;
      for(const char of text){
        range.setStart(node,offset);offset+=char.length;range.setEnd(node,offset);const r=range.getBoundingClientRect();
        if(!r.height)continue;
        let line=lines.find(line=>Math.abs(line.top-r.top)<.6*scale);
        if(!line){line={text:'',left:r.left,right:r.right,top:r.top,height:r.height};lines.push(line);}
        line.text+=char;line.left=Math.min(line.left,r.left);line.right=Math.max(line.right,r.right);line.height=Math.max(line.height,r.height);
      }
      for(const line of lines)paintLine(line.text,line,style);
    }
    function walk(el) {
      if (el.nodeType===3) { textNode(el);return; }
      if (el.nodeType!==1 || el.classList.contains('cut-marks')) return;
      const style=view.getComputedStyle(el);if(style.display==='none'||style.visibility==='hidden')return;
      const r=rect(el);
      if(el.namespaceURI==='http://www.w3.org/2000/svg') {
        const svg=el.cloneNode(true);svg.setAttribute('x',number(r.x));svg.setAttribute('y',number(r.y));svg.setAttribute('width',number(r.w));svg.setAttribute('height',number(r.h));svg.removeAttribute('class');parts.push(new XMLSerializer().serializeToString(svg));return;
      }
      if(el.tagName==='IMG') {
        if(!el.src.startsWith('data:image/png;base64,'))throw Error('untrusted_card_image');
        parts.push(`<image x="${number(r.x)}" y="${number(r.y)}" width="${number(r.w)}" height="${number(r.h)}" href="${el.src}"/>`);return;
      }
      box(el,style);for(const child of el.childNodes)walk(child);
    }
    walk(card);if (!current()) throw Error('card_context_changed');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join('')}</svg>`;
    const image=new view.Image();image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await image.decode();
    if(!current())throw Error('card_context_changed');
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('png_unavailable')),'image/png'));
    if(!current())throw Error('card_context_changed');return blob;
  }
  window.AtabeyCardPNG=Object.freeze({render});
})();
