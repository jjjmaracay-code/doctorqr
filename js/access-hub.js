/* Presentation only: keep contextual help away from the account actions. */
(function(){
  function init(){
    const group=document.querySelector('.account-overview'),help=document.getElementById('access-help');
    if(!group||!help)return;
    help.addEventListener('click',()=>document.getElementById('help-btn')?.click());
    Promise.resolve(window.i18nReady).finally(()=>{help.disabled=!document.getElementById('help-btn');});
    if(window.IntersectionObserver){
      const observer=new IntersectionObserver(entries=>{
        document.body.classList.toggle('account-actions-in-view',entries.some(entry=>entry.isIntersecting));
      });
      observer.observe(group);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
