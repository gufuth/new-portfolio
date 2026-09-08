(function(){
  'use strict';
  var elite=document.createElement('link');
  elite.rel='stylesheet';
  elite.href='/hearsay-elite.css?v=20260908-pixel-correction';
  document.head.appendChild(elite);
  var gate=document.createElement('link');
  gate.rel='stylesheet';
  gate.href='/hearsay-final-gate.css?v=20260908-static-gate';
  document.head.appendChild(gate);
  var auteur=document.createElement('link');
  auteur.rel='stylesheet';
  auteur.href='/hearsay-auteur.css?v=20260908-apparition-pass';
  document.head.appendChild(auteur);

  var body=document.body;
  var params=new URLSearchParams(location.search);
  var diagnostic=params.get('diagnostic');
  if(diagnostic==='lift'||params.get('lift')==='1') body.classList.add('diagnostic-lift');
  if(diagnostic==='grayscale') body.classList.add('diagnostic-grayscale');
  if(diagnostic==='blur') body.classList.add('diagnostic-blur');

  var nodes=Array.prototype.slice.call(document.querySelectorAll('[data-presence]'));
  var byId={};nodes.forEach(function(node){byId[node.dataset.presence]=node;});
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile=matchMedia('(max-width: 700px)').matches;
  var ambient=body.dataset.hearsayMotion==='ambient'&&!reduce&&!mobile;
  var timers=[];var manual=false;var hidden=false;var visit=0;
  var seed=parseInt(params.get('seed')||sessionStorage.getItem('hearsay_seed')||String(Date.now()%2147483647),10)||117;
  try{sessionStorage.setItem('hearsay_seed',String(seed));}catch(e){}
  function random(){seed=(seed*48271)%2147483647;return seed/2147483647;}
  function later(fn,ms){var id=setTimeout(fn,ms);timers.push(id);return id;}
  function clearScore(){timers.forEach(clearTimeout);timers=[];}
  function state(id,value,duration){var node=byId[id];if(!node)return;node.style.setProperty('--fade',(duration||5200)+'ms');node.dataset.state=value;}
  function unresolved(duration){nodes.forEach(function(n){state(n.dataset.presence,n.dataset.presence==='ex'?'deep':'trace',duration||4300);});}
  function resetOpening(){
    nodes.forEach(function(n){state(n.dataset.presence,n.dataset.presence==='ex'?'near':'trace',10);});
    state('neighbor','deep',10);
  }
  function choose(exclude){
    var pool=['neighbor','sweets','vidal','mother'].filter(function(id){return id!==exclude;});
    if(visit%3===0) pool=pool.filter(function(id){return id!=='mother';});
    return pool[Math.floor(random()*pool.length)];
  }
  function score(){
    if(!ambient||manual||hidden)return;
    clearScore();resetOpening();
    var first=body.dataset.hearsayRoute==='c'?'neighbor':(random()>.31?'neighbor':'sweets');
    var t1=6900;
    later(function(){state(first,'middle',6100);state('ex','middle',6800);},t1);
    later(function(){state(first,'near',3700);state('ex','deep',4600);},t1+6100);
    later(function(){unresolved(4600);},t1+9800);
    var second=choose(first);
    later(function(){state(second,'middle',4400);},t1+14400);
    later(function(){state(second,'near',2900);},t1+18800);
    later(function(){unresolved(5100);},t1+21700);
    later(function(){
      visit+=1;
      var third=choose(second);state(third,'middle',5100+Math.round(random()*2400));
    },t1+26800);
    later(function(){visit+=1;score();},t1+34400+Math.round(random()*3800));
  }
  function makeManual(node){
    manual=true;clearScore();nodes.forEach(function(n){n.classList.remove('is-manual');state(n.dataset.presence,n===node?'near':'trace',node===n?900:1350);});node.classList.add('is-manual');
  }
  function releaseManual(){
    if(!manual)return;manual=false;nodes.forEach(function(n){n.classList.remove('is-manual');});unresolved(1300);later(score,2400);
  }
  nodes.forEach(function(node){
    node.addEventListener('mouseenter',function(){if(!mobile)makeManual(node);});
    node.addEventListener('mouseleave',function(){if(!node.matches(':focus-visible'))later(releaseManual,1800);});
    node.addEventListener('focus',function(){makeManual(node);});
    node.addEventListener('blur',function(){later(releaseManual,2200);});
    node.addEventListener('click',function(){makeManual(node);});
    node.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();makeManual(node);}});
  });
  document.addEventListener('keydown',function(event){if(event.key==='Escape'){releaseManual();nodes[0]&&nodes[0].focus();}});
  document.addEventListener('visibilitychange',function(){hidden=document.hidden;clearScore();if(!hidden&&!manual)later(score,800);});

  if(ambient){resetOpening();later(score,80);}
  body.classList.add('hearsay-ready');
})();
