(function(){
  var stage=document.getElementById('stage'),wrap=document.getElementById('about');
  if(!stage||!wrap)return;
  var mq=matchMedia('(max-width:760px)');
  function fit(){
    if(mq.matches){stage.style.removeProperty('--fit');return;}
    stage.style.setProperty('--fit',Math.max(wrap.clientWidth/1536,wrap.clientHeight/864));
  }
  addEventListener('resize',fit);mq.addEventListener&&mq.addEventListener('change',fit);fit();
})();
