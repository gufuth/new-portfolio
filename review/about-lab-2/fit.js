(function(){
  var stage=document.getElementById('stage'),wrap=document.getElementById('about');
  if(!stage||!wrap)return;
  var mq=matchMedia('(max-width:760px)');
  function fit(){
    if(mq.matches){stage.style.removeProperty('--fit');return;}
    var W=+stage.dataset.w||1536,H=+stage.dataset.h||864;stage.style.setProperty('--fit',Math.max(wrap.clientWidth/W,wrap.clientHeight/H));
  }
  addEventListener('resize',fit);mq.addEventListener&&mq.addEventListener('change',fit);fit();
})();
