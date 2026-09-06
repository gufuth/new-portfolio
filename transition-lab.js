/* Last Stop transition lab.
   Stable trial URLs: /?cut=a, /?cut=b, /?cut=c
   detailTest=1 accelerates the one-time electrical imperfection for QA. */
(function(){
  'use strict';

  function init(){
    var params=new URLSearchParams(location.search);
    var variant=(params.get('cut')||sessionStorage.getItem('lsd_lab_cut')||'a').toLowerCase();
    if(['a','b','c'].indexOf(variant)<0) variant='a';
    try{sessionStorage.setItem('lsd_lab_cut',variant);}catch(e){}
    document.documentElement.setAttribute('data-lab-cut',variant);

    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var surface=document.body.getAttribute('data-tour-surface');
    var activated=false;
    document.addEventListener('pointerdown',function(){activated=true;},{capture:true});
    document.addEventListener('keydown',function(){activated=true;},{capture:true});

    function soundOn(){try{return localStorage.getItem('lsd_sound')==='on';}catch(e){return false;}}
    function audioContext(){try{return new (window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}}
    function playElectrical(kind){
      if(!soundOn()) return;
      var ctx=audioContext(); if(!ctx) return;
      try{
        var now=ctx.currentTime;
        var master=ctx.createGain();
        master.gain.setValueAtTime(.0001,now);
        master.gain.exponentialRampToValueAtTime(kind==='relay'?.018:.010,now+.012);
        master.gain.exponentialRampToValueAtTime(.0001,now+(kind==='relay'?.12:.22));
        master.connect(ctx.destination);
        var osc=ctx.createOscillator(); osc.type='sine'; osc.frequency.value=kind==='relay'?78:116;
        osc.connect(master); osc.start(now); osc.stop(now+(kind==='relay'?.12:.22));
        var len=Math.floor(ctx.sampleRate*(kind==='relay'?.10:.18));
        var buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0);
        for(var i=0;i<len;i++) data[i]=Math.random()*2-1;
        var src=ctx.createBufferSource(); src.buffer=buf;
        var bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=kind==='relay'?1450:980; bp.Q.value=1.2;
        var ng=ctx.createGain(); ng.gain.value=kind==='relay'?.24:.13;
        src.connect(bp); bp.connect(ng); ng.connect(master); src.start(now); src.stop(now+buf.duration);
        setTimeout(function(){ctx.close().catch(function(){});},500);
      }catch(e){}
    }

    function setBox(el,rect){
      var bar=34;
      el.style.setProperty('--lab-top',Math.max(0,rect.top-bar)+'px');
      el.style.setProperty('--lab-right',Math.max(0,innerWidth-rect.right)+'px');
      el.style.setProperty('--lab-bottom',Math.max(0,(innerHeight-bar)-rect.bottom)+'px');
      el.style.setProperty('--lab-left',Math.max(0,rect.left)+'px');
    }

    function goWork(href){
      var u=new URL(href,location.href);
      u.searchParams.set('cut',variant);
      u.searchParams.set('labArrival','1');
      location.href=u.toString();
    }

    if(surface==='landing'){
      document.addEventListener('click',function(e){
        var a=e.target.closest&&e.target.closest('#hotWork');
        if(!a||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(reduced){goWork(a.href);return;}
        document.body.classList.add('lab-cutting');
        var cut=document.createElement('div');
        cut.className='lab-cut lab-cut--'+variant;
        cut.setAttribute('aria-hidden','true');
        setBox(cut,a.getBoundingClientRect());
        document.body.appendChild(cut);
        if(variant==='b') playElectrical('relay');
        requestAnimationFrame(function(){requestAnimationFrame(function(){cut.classList.add('is-active');});});
        var delay=variant==='a'?380:(variant==='b'?168:122);
        setTimeout(function(){goWork(a.href);},delay);
      },true);
    }

    if(surface==='work'&&params.get('labArrival')==='1'&&!reduced){
      document.body.classList.add('lab-cutting','lab-arrival-'+variant);
      if(variant==='a'){
        requestAnimationFrame(function(){requestAnimationFrame(function(){document.body.classList.add('lab-arrival-settle');});});
        setTimeout(function(){document.body.classList.remove('lab-cutting');},210);
        setTimeout(function(){document.body.classList.remove('lab-arrival-a','lab-arrival-settle');},520);
      }else if(variant==='b'){
        setTimeout(function(){document.body.classList.remove('lab-cutting');},135);
        setTimeout(function(){document.body.classList.remove('lab-arrival-b');},340);
      }else{
        var memory=document.createElement('div'); memory.className='lab-glass-memory'; memory.setAttribute('aria-hidden','true'); document.body.appendChild(memory);
        setTimeout(function(){document.body.classList.remove('lab-cutting');},105);
        setTimeout(function(){document.body.classList.remove('lab-arrival-c');memory.remove();},310);
      }
      try{
        var clean=new URL(location.href); clean.searchParams.delete('labArrival'); history.replaceState(null,'',clean.pathname+(clean.searchParams.toString()?'?'+clean.searchParams.toString():''));
      }catch(e){}
    }

    function scheduleElectricalLife(){
      if(reduced||!(surface==='work'||surface==='more')||window.matchMedia('(max-width:760px)').matches) return;
      var stage=document.querySelector('.scene-stage'); if(!stage) return;
      var life=document.createElement('span'); life.className='lab-electrical-life'; life.setAttribute('aria-hidden','true'); stage.appendChild(life);
      var test=params.get('detailTest')==='1';
      var delay=test?6000:(55000+Math.random()*65000);
      setTimeout(function(){
        if(document.hidden) return;
        life.classList.add('is-catching');
        if(activated) playElectrical('ballast');
        setTimeout(function(){life.remove();},700);
      },delay);
    }
    scheduleElectricalLife();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
