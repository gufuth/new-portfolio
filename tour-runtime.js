/* Last Stop shared tour runtime.
   One job: make the existing rooms behave like one restrained physical tour.
   No camera flights, no looping ambience, no navigation delays longer than the edit earns. */
(function(){
  'use strict';

  var ARRIVAL_KEY='lsd_arrival_kind';
  var SOUND_KEY='lsd_sound';
  var RESTORE_SURFACE='lsd_restore_surface';
  var RESTORE_CASE='lsd_restore_case';
  var RESTORE_PENDING='lsd_restore_pending';
  var arrival='';
  try{arrival=sessionStorage.getItem(ARRIVAL_KEY)||'';}catch(e){}
  if(arrival){document.documentElement.classList.add('tour-prepaint-'+arrival);}

  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var audioCtx=null;
  var ambientTimer=0;

  function storageGet(store,key){try{return store.getItem(key);}catch(e){return null;}}
  function storageSet(store,key,val){try{store.setItem(key,val);}catch(e){}}
  function storageRemove(store,key){try{store.removeItem(key);}catch(e){}}

  function soundOn(){return storageGet(localStorage,SOUND_KEY)==='on';}
  function setSound(on){storageSet(localStorage,SOUND_KEY,on?'on':'off');syncSoundButtons();if(on){primeAudio();}}

  function primeAudio(){
    if(!soundOn()) return null;
    try{
      if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();}
      if(audioCtx.state==='suspended'){audioCtx.resume().catch(function(){});}
      return audioCtx;
    }catch(e){return null;}
  }

  function syncSoundButtons(){
    document.querySelectorAll('[data-tour-sound]').forEach(function(btn){
      var on=soundOn();
      btn.textContent=on?'SOUND ON':'SOUND OFF';
      btn.setAttribute('aria-pressed',on?'true':'false');
      btn.setAttribute('aria-label',on?'Turn sound off':'Turn sound on');
    });
  }

  function ensureGlobalRail(){
    document.querySelectorAll('.filmbar.bottom .rail').forEach(function(rail){
      if(!rail.querySelector('[data-tour-contact]')){
        var contact=document.createElement('a');
        contact.href='mailto:Ianr.luna@gmail.com';
        contact.textContent='CONTACT';
        contact.setAttribute('data-tour-contact','');
        rail.appendChild(contact);
      }
      var bar=rail.closest('.filmbar.bottom');
      if(bar&&!bar.querySelector('[data-tour-sound]')){
        var sound=document.createElement('button');
        sound.type='button';
        sound.className='tour-sound';
        sound.setAttribute('data-tour-sound','');
        sound.addEventListener('click',function(){setSound(!soundOn());});
        bar.appendChild(sound);
      }
    });
    syncSoundButtons();
  }

  function makeCut(kind,active){
    var cut=document.createElement('div');
    cut.className='tour-cut tour-cut--'+kind+(active?' is-active':'');
    cut.setAttribute('aria-hidden','true');
    document.body.appendChild(cut);
    return cut;
  }

  function cleanPrepaint(kind){document.documentElement.classList.remove('tour-prepaint-'+kind);}

  function revealArrival(){
    if(!arrival) return;
    storageRemove(sessionStorage,ARRIVAL_KEY);
    var kind=arrival;
    arrival='';
    var cut;
    if(kind==='landing-work'){
      cut=makeCut('black',true);
      cleanPrepaint(kind);
      var spill=document.createElement('div');
      spill.className='tour-arrival-spill';
      spill.setAttribute('aria-hidden','true');
      document.body.appendChild(spill);
      requestAnimationFrame(function(){requestAnimationFrame(function(){cut.classList.remove('is-active');});});
      setTimeout(function(){cut.remove();spill.remove();},560);
    }else if(kind==='mullion'){
      cut=makeCut('mullion',true);
      cleanPrepaint(kind);
      requestAnimationFrame(function(){requestAnimationFrame(function(){cut.classList.remove('is-active');});});
      setTimeout(function(){cut.remove();},230);
    }else if(kind==='case'||kind==='case-return'){
      cut=makeCut('black',true);
      cleanPrepaint(kind);
      requestAnimationFrame(function(){requestAnimationFrame(function(){cut.classList.remove('is-active');});});
      setTimeout(function(){cut.remove();},210);
    }else{
      cleanPrepaint(kind);
    }
  }

  function navigate(href,kind,delay){
    storageSet(sessionStorage,ARRIVAL_KEY,kind);
    setTimeout(function(){window.location.href=href;},reduced?0:delay);
  }

  function startLandingWork(href){
    if(reduced){navigate(href,'landing-work',0);return;}
    var cut=makeCut('landing',false);
    var hot=document.getElementById('hotWork');
    if(hot){
      var r=hot.getBoundingClientRect();
      var bar=34;
      cut.style.setProperty('--tour-cut-top',Math.max(0,r.top-bar)+'px');
      cut.style.setProperty('--tour-cut-right',Math.max(0,window.innerWidth-r.right)+'px');
      cut.style.setProperty('--tour-cut-bottom',Math.max(0,(window.innerHeight-bar)-r.bottom)+'px');
      cut.style.setProperty('--tour-cut-left',Math.max(0,r.left)+'px');
    }
    requestAnimationFrame(function(){cut.classList.add('is-active');});
    navigate(href,'landing-work',445);
  }

  function startMullion(href){
    if(reduced){navigate(href,'mullion',0);return;}
    var cut=makeCut('mullion',false);
    requestAnimationFrame(function(){cut.classList.add('is-active');});
    navigate(href,'mullion',180);
  }

  function caseIdFromHref(href){
    try{
      var u=new URL(href,location.href);
      var p=u.pathname.replace(/\/$/,'');
      if(/\/cases\//.test(p)){
        var f=p.split('/').pop().replace(/\.html$/,'');
        var map={nike:'nike-sb-panda-pigeon',virgin:'virgin-galactic-unity-22',porsche:'porsche-lucasfilm-designer-alliance',selsun:'selsun-blue-dan-driff',moneylion:'moneylion-beast-games',alita:'alita-te-connectivity',cuervo:'jose-cuervo','outdoor-voices':'outdoor-voices',atlantic:'the-atlantic'};
        return map[f]||f;
      }
      return p.split('/').pop();
    }catch(e){return '';}
  }

  function prepareCaseLinks(surface){
    document.querySelectorAll('.billboard,.mobile-card').forEach(function(link){
      if(!link.dataset.caseId){link.dataset.caseId=caseIdFromHref(link.href);}
      link.addEventListener('click',function(e){
        if(shouldIgnore(e,link)) return;
        e.preventDefault();
        var id=link.dataset.caseId||caseIdFromHref(link.href);
        storageSet(sessionStorage,RESTORE_SURFACE,surface);
        storageSet(sessionStorage,RESTORE_CASE,id);
        storageSet(sessionStorage,RESTORE_PENDING,'1');
        link.classList.add('is-tour-selected');
        document.body.classList.add('tour-case-selecting');
        if(reduced){navigate(link.href,'case',0);return;}
        setTimeout(function(){
          var cut=makeCut('black',false);
          requestAnimationFrame(function(){cut.classList.add('is-active');});
        },75);
        navigate(link.href,'case',215);
      });
    });
  }

  function restoreBillboardFocus(surface){
    if(storageGet(sessionStorage,RESTORE_PENDING)!=='1') return;
    if(storageGet(sessionStorage,RESTORE_SURFACE)!==surface) return;
    var id=storageGet(sessionStorage,RESTORE_CASE);
    if(!id) return;
    var candidates=document.querySelectorAll('[data-case-id="'+id+'"]');
    var target=null;
    candidates.forEach(function(node){if(!target&&node.getClientRects().length){target=node;}});
    if(!target&&candidates.length){target=candidates[0];}
    if(target){
      setTimeout(function(){try{target.focus({preventScroll:true});}catch(e){target.focus();}},80);
      storageRemove(sessionStorage,RESTORE_PENDING);
    }
  }

  function configureCaseReturn(){
    var source=storageGet(sessionStorage,RESTORE_SURFACE);
    var all=document.querySelector('.case-nav a[href="/work/"]');
    if(all&&source==='more'){all.href='/work/more/';}
  }

  function isWork(u){return /\/work\/?$/.test(u.pathname)||/\/work\.html$/.test(u.pathname);}
  function isMore(u){return /\/work\/more\/?$/.test(u.pathname)||/\/more-work\.html$/.test(u.pathname);}
  function isCase(u){return (/\/work\/[^/]+\/?$/.test(u.pathname)&&!isWork(u)&&!isMore(u))||/\/cases\/[^/]+\.html$/.test(u.pathname);}

  function shouldIgnore(e,a){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return true;
    if(a.target&&a.target!=='_self') return true;
    if(a.hasAttribute('download')) return true;
    var href=a.getAttribute('href')||'';
    return !href||href.charAt(0)==='#'||/^mailto:|^tel:/i.test(href);
  }

  function setupNavigation(surface){
    document.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a');
      if(!a||shouldIgnore(e,a)) return;
      var u;
      try{u=new URL(a.href,location.href);}catch(err){return;}
      if(u.origin!==location.origin) return;

      if(surface==='landing'&&isWork(u)){
        e.preventDefault();startLandingWork(a.href);return;
      }
      if((surface==='work'&&isMore(u))||(surface==='more'&&isWork(u))){
        e.preventDefault();startMullion(a.href);return;
      }
      if(surface==='case'&&(isWork(u)||isMore(u))){
        e.preventDefault();
        var cut=makeCut('black',false);requestAnimationFrame(function(){cut.classList.add('is-active');});
        navigate(a.href,'case-return',135);return;
      }
      if(surface==='case'&&isCase(u)){
        e.preventDefault();
        var cut2=makeCut('black',false);requestAnimationFrame(function(){cut2.classList.add('is-active');});
        navigate(a.href,'case',135);return;
      }
      if(surface==='landing'&&(u.pathname==='/about/'||u.pathname==='/hearsay/'||/about\.html$|hearsay\.html$/.test(u.pathname))){
        e.preventDefault();
        if(reduced){window.location.href=a.href;return;}
        var cut3=makeCut('black',false);requestAnimationFrame(function(){cut3.classList.add('is-active');});
        setTimeout(function(){window.location.href=a.href;},180);
      }
    });
  }

  function playCarPass(){
    if(!soundOn()) return;
    var ctx=primeAudio();
    if(!ctx||ctx.state!=='running') return;
    var now=ctx.currentTime,dur=3.5;
    try{
      var master=ctx.createGain();master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.055,now+.7);master.gain.setValueAtTime(.055,now+1.7);master.gain.exponentialRampToValueAtTime(.0001,now+dur);master.connect(ctx.destination);
      var pan=ctx.createStereoPanner?ctx.createStereoPanner():null;
      if(pan){pan.pan.setValueAtTime(-.72,now);pan.pan.linearRampToValueAtTime(.72,now+dur);pan.connect(master);}
      var dest=pan||master;

      var len=Math.floor(ctx.sampleRate*dur),buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0);
      for(var i=0;i<len;i++){data[i]=(Math.random()*2-1);}
      var noise=ctx.createBufferSource();noise.buffer=buf;
      var band=ctx.createBiquadFilter();band.type='bandpass';band.frequency.value=780;band.Q.value=.55;
      var ng=ctx.createGain();ng.gain.value=.38;
      noise.connect(band);band.connect(ng);ng.connect(dest);noise.start(now);noise.stop(now+dur);

      var rumble=ctx.createOscillator();rumble.type='sine';rumble.frequency.setValueAtTime(72,now);rumble.frequency.linearRampToValueAtTime(54,now+dur);
      var rg=ctx.createGain();rg.gain.value=.18;rumble.connect(rg);rg.connect(dest);rumble.start(now);rumble.stop(now+dur);
    }catch(e){}
  }

  function rand(min,max){return Math.floor(min+Math.random()*(max-min));}
  function scheduleRoadLife(surface,first){
    if(reduced||window.matchMedia('(max-width:760px)').matches||!(surface==='work'||surface==='more')) return;
    window.clearTimeout(ambientTimer);
    ambientTimer=window.setTimeout(function fire(){
      if(document.hidden){scheduleRoadLife(surface,false);return;}
      var life=document.querySelector('.tour-road-life');
      if(life){
        life.classList.remove('is-passing');void life.offsetWidth;life.classList.add('is-passing');
        playCarPass();
        setTimeout(function(){life.classList.remove('is-passing');},3700);
      }
      scheduleRoadLife(surface,false);
    },first?rand(38000,75000):rand(90000,210000));
  }

  function ensureRoadLife(surface){
    if(!(surface==='work'||surface==='more')) return;
    var stage=document.querySelector('.scene-stage');if(!stage) return;
    if(!stage.querySelector('.tour-road-life')){
      var life=document.createElement('div');life.className='tour-road-life';life.setAttribute('aria-hidden','true');
      life.innerHTML='<span class="tour-headlight"></span><span class="tour-glass-glint"></span>';
      stage.appendChild(life);
    }
    scheduleRoadLife(surface,true);
  }

  function init(){
    var surface=document.body.getAttribute('data-tour-surface')||(document.querySelector('.paper')?'case':'');
    if(!storageGet(localStorage,SOUND_KEY)){storageSet(localStorage,SOUND_KEY,'off');}
    ensureGlobalRail();
    setupNavigation(surface);
    if(surface==='work'||surface==='more'){
      prepareCaseLinks(surface);
      ensureRoadLife(surface);
      restoreBillboardFocus(surface);
      window.addEventListener('pageshow',function(){restoreBillboardFocus(surface);});
    }
    if(surface==='case'){configureCaseReturn();}
    revealArrival();
    if(soundOn()){primeAudio();}

    document.addEventListener('pointerdown',function(){if(soundOn()) primeAudio();},{once:true,capture:true});
    document.addEventListener('keydown',function(){if(soundOn()) primeAudio();},{once:true,capture:true});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&(surface==='work'||surface==='more')) scheduleRoadLife(surface,false);});
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
