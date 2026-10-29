/* Horizontal section navigation: mouse, native touch, keyboard and explicit arrows.
   Never reads or changes medical values, account storage or the edit lock. */
(function () {
  'use strict';
  const shell=document.getElementById('form-tabs-shell'),bar=document.getElementById('form-tabs-bar');
  if(!shell||!bar||shell.dataset.navigationReady)return;
  const previous=shell.querySelector('[data-section-step="-1"]'),next=shell.querySelector('[data-section-step="1"]');
  const tabs=Array.from(bar.querySelectorAll('.form-tab-btn')),timers=new WeakMap();
  let drag=null,blockedUntil=0,frame=0;
  const rtl=()=>getComputedStyle(bar).direction==='rtl';
  const behavior=()=>matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth';
  function sync(){
    const max=Math.max(0,bar.scrollWidth-bar.clientWidth),position=Math.max(0,Math.min(max,(rtl()?-1:1)*bar.scrollLeft));
    const overflow=String(max>2),atStart=max<=2||position<2,atEnd=max<=2||position>=max-2;
    if(shell.dataset.overflow!==overflow)shell.dataset.overflow=overflow;
    if(previous.disabled!==atStart)previous.disabled=atStart;if(next.disabled!==atEnd)next.disabled=atEnd;
    const offset=Math.ceil((parseFloat(getComputedStyle(shell).top)||0)+shell.getBoundingClientRect().height+12)+'px';
    if(document.documentElement.style.getPropertyValue('--section-jump-offset')!==offset)document.documentElement.style.setProperty('--section-jump-offset',offset);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;sync();});}
  function step(amount){bar.scrollBy({left:(rtl()?-1:1)*amount*Math.max(140,bar.clientWidth*.7),behavior:behavior()});}
  function reveal(target){const item=target.getBoundingClientRect(),view=bar.getBoundingClientRect();let delta=0;if(item.left<view.left+3)delta=item.left-view.left-3;else if(item.right>view.right-3)delta=item.right-view.right+3;if(delta)bar.scrollBy({left:delta,behavior:behavior()});}
  previous.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
  bar.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('doctorqr:language-changed',schedule);
  const resize=new ResizeObserver(schedule);resize.observe(bar);resize.observe(shell);
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['dir','lang']});
  bar.addEventListener('focusin',event=>{const tab=event.target.closest('.form-tab-btn');if(tab)reveal(tab);});
  bar.addEventListener('keydown',event=>{
    const tab=event.target.closest('.form-tab-btn');if(!tab||event.altKey||event.ctrlKey||event.metaKey)return;
    let index=tabs.indexOf(tab);
    if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;
    else if(event.key==='ArrowLeft'||event.key==='ArrowRight')index+=(event.key==='ArrowRight'?1:-1)*(rtl()?-1:1);else return;
    event.preventDefault();blockedUntil=0;const target=tabs[Math.max(0,Math.min(tabs.length-1,index))];
    if(document.activeElement===target)reveal(target);else target.focus({preventScroll:true});
  });
  function illuminate(button){if(!button||button.disabled)return;clearTimeout(timers.get(button));button.classList.add('is-pressed');}
  function release(button){if(!button)return;clearTimeout(timers.get(button));timers.set(button,setTimeout(()=>button.classList.remove('is-pressed'),180));}
  shell.addEventListener('pointerdown',event=>illuminate(event.target.closest('.form-tab-btn,.form-tabs-step')));
  window.addEventListener('pointerup',()=>shell.querySelectorAll('.is-pressed').forEach(release),{passive:true});
  window.addEventListener('pointercancel',()=>shell.querySelectorAll('.is-pressed').forEach(release),{passive:true});
  shell.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key))illuminate(event.target.closest('.form-tab-btn,.form-tabs-step'));});
  shell.addEventListener('keyup',event=>{if(['Enter',' '].includes(event.key))release(event.target.closest('.form-tab-btn,.form-tabs-step'));});
  bar.addEventListener('pointerdown',event=>{
    blockedUntil=0;if(event.pointerType!=='mouse'||event.button!==0||!event.isPrimary)return;
    drag={id:event.pointerId,x:event.clientX,left:bar.scrollLeft,moved:false};
  });
  bar.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId)return;const delta=event.clientX-drag.x;
    if(!drag.moved&&Math.abs(delta)<8)return;
    if(!drag.moved){drag.moved=true;bar.classList.add('is-dragging');bar.setPointerCapture(event.pointerId);shell.querySelectorAll('.is-pressed').forEach(button=>button.classList.remove('is-pressed'));}
    event.preventDefault();bar.scrollLeft=drag.left-delta;
  });
  function finish(event){if(!drag||drag.id!==event.pointerId)return;if(drag.moved)blockedUntil=performance.now()+300;drag=null;bar.classList.remove('is-dragging');if(bar.hasPointerCapture(event.pointerId))bar.releasePointerCapture(event.pointerId);}
  window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',finish);
  bar.addEventListener('lostpointercapture',event=>{if(drag?.id===event.pointerId)finish(event);});
  bar.addEventListener('click',event=>{
    if(performance.now()<blockedUntil){event.preventDefault();event.stopImmediatePropagation();blockedUntil=0;return;}
    const button=event.target.closest('.form-tab-btn');if(!button)return;
    const section=button.dataset.target?document.getElementById(button.dataset.target):null;
    if(!section&&button.id!=='btn-tab-inicio')return;
    event.preventDefault();event.stopImmediatePropagation();sync();
    const offset=parseFloat(document.documentElement.style.getPropertyValue('--section-jump-offset'))||150;
    window.scrollTo({top:section?Math.max(0,window.scrollY+section.getBoundingClientRect().top-offset):0,behavior:'auto'});
  },true);
  shell.dataset.navigationReady='true';sync();
})();
