(function(){
  const stage=document.getElementById('stage');
  const mq=matchMedia('(max-width:760px)');
  function fit(){
    if(mq.matches){stage.style.removeProperty('--fit');return;}
    const wrap=document.getElementById('about');
    stage.style.setProperty('--fit',Math.max(wrap.clientWidth/1536,wrap.clientHeight/864));
  }
  addEventListener('resize',fit);
  mq.addEventListener?.('change',fit);
  fit();
  const button=document.getElementById('portraitHit');
  const bio=document.getElementById('bio');
  const incidentals=document.getElementById('incidentals');
  function setOpen(open){
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Hide incidentals':'Show incidentals');
    incidentals.classList.toggle('open',open);
    incidentals.setAttribute('aria-hidden',String(!open));
    bio.classList.toggle('is-hidden',open);
    bio.setAttribute('aria-hidden',String(open));
    if(open){bio.setAttribute('inert','');}else{bio.removeAttribute('inert');}
  }
  button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){
      setOpen(false);
      button.focus();
    }
  });
})();
