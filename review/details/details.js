/* Detail pass v2 (review only). One file, loaded by the review pages that opt in.
   A1 cross-document view transitions: see vt-head.js (loaded synchronously, before first paint)
   A2 billboard -> case: CUT (default) or PUSH-IN (?t=push), compared side by side
   A4 focus lands on the case title on arrival
   A5 gesture-only WebAudio: TV thunk + static, jukebox click, door bell (sound switch must be ON)
   A6 one line for whoever opens the console
   A7 plates resolve from a blurred placeholder, only when not already cached
   A8 the door starts navigation inside 250 ms; the rest of the edit plays on the arriving page
   Nothing here blocks a click. Reduced motion and browsers without cross-document
   view transitions get plain, instant navigation. */
(function(){
  'use strict';
  var D=document,H=D.documentElement,W=window;
  var DEFAULT_T='auto';                     /* no parameter: first billboard of the session pushes in, later ones cut */
  var VT_KEY='lsd_vt',T_KEY='lsd_t',DOOR_KEY='lsd_door_tail',ARRIVAL_KEY='lsd_arrival_kind';
  var CASE_RE=/\/review\/cases-2-1\/[^\/]+\.html$/;
  var BOARD_RE=/\/review\/billboards\/(work|more-work)\.html$/;
  var INDEX_RE=/\/review\/index-2-1\/(index\.html)?$/;
  var WORK_RE=/\/review\/billboards\/work\.html$/;
  var reduced=!!(W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasVT=('CSSViewTransitionRule' in W);
  var path=location.pathname;
  var kind=CASE_RE.test(path)?'case':BOARD_RE.test(path)?'board':INDEX_RE.test(path)?'index':
           /\/review\/details\/(index\.html)?$/.test(path)?'landing':'';
  var PH={work:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAWACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzhY9zKi4yfWlSGR94VCdoO72p0O7IKgZ6ZJIpybl3hVQcHuaVxWGGJ33OqkqOp9KTyX2bth2+tSR7/LYgAr35Ip++X7PjCbeme9FwsQPC6KCyEA9zRT5mdlG7GD05NFNMTRFDG0zhN2ATTljDEruOR3ooqG9TRIUxuq5D8YqHzXxjPFFFNCZLIcQxnvRRRTQj/9k=',more:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAMACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzyGNXc5K/dGNzYp0VtGzyDdHheAC4Gfoc1X8zaR8inHqKVXwfuIc+oqdSidYItjZZeCeS4zxTTCnlKcKD3O8En8KfaokjurKMAZFNkRY5VRe46nrSuFhPMa2bfbmMEjacYfj8elFRTDy22jke9FOyFsf/2Q==',landing:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAbACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDz5rSdIfOeGRY8Z3FeMVZ0ltKEkv8AaiyMu0eXtyOc85x7VUgTzCFlkZEyATycD1xWzbeG0uLYXEd4pQ8Zx/tbf57fzrKdRJWkyZuENSZ5PCfkrsjn8zHOS+3OT/8AWrG1JrE3X/EvDCHaOGyee/WtYeGoisjfaXAUoBlMH5vUZ61RvtKitJpojcAvG4VVxy/H3h2x/OohUjfRsUZxqOyMzK0VK1uq23mbgW3Yx7UV0XNJU5R3ATIVAZTx6HFItzOqlFkYL6BuP88CoB1rQhRSjEqDg8Vm7Izk+VXIWvrssWM8hY9TvOTUTzSu4d3ZmAwCTmrzRphztHBFQTooRyByDSTXYVKSk9CsXOzBNFKwHkg980Vobzuj/9k='};
  var probe=W.__lsd=W.__lsd||{kind:kind,hasVT:hasVT,reduced:reduced,swap:null,reveal:null,clicks:[]};

  function ss(k,v){try{
    if(v===undefined) return sessionStorage.getItem(k);
    if(v===null) sessionStorage.removeItem(k); else sessionStorage.setItem(k,v);
  }catch(e){return null;}}
  function variant(){
    var q=null;try{q=new URLSearchParams(location.search).get('t');}catch(e){}
    if(q==='cut'||q==='push'||q==='auto'){ss(T_KEY,q);return q;}
    var s=ss(T_KEY);return (s==='cut'||s==='push'||s==='auto')?s:DEFAULT_T;
  }
  function pathOf(url){try{return new URL(url,location.href).pathname;}catch(e){return '';}}
  function plain(e){return !(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey);}

  /* ---------- A2: the lit board, lifted out of the plate ---------- */
  var FACE={work:{l:.038,t:.056,w:.924,h:.684},more:{l:.022,t:.055,w:.915,h:.615}};
  /* depth planes (build_depth.py): the far plate has our side of the glass painted out; the near
     mask is our side of the glass. Loaded quietly after the room is up, only if a push can still happen. */
  var DEPTH={}, PUSHED_KEY='lsd_pushed';
  function depthFor(stage){return stage.classList.contains('more-scene')?'more':'work';}
  function preloadDepth(){
    var stage=D.querySelector('.scene-stage');if(!stage) return;
    var v=variant();if(v==='cut'||(v==='auto'&&ss(PUSHED_KEY))) return;
    var n=depthFor(stage),base='/review/details/depth/'+n;
    var far=new Image(),mask=new Image(),d=DEPTH[n]={ok:false};
    var left=2;function one(){if(--left===0) d.ok=far.naturalWidth>0&&mask.naturalWidth>0;}
    far.onload=far.onerror=mask.onload=mask.onerror=one;
    far.src=d.far=base+'-far.webp';mask.src=d.mask=base+'-near-mask.png';
  }
  function nearLayer(stage,sr){
    var d=DEPTH[depthFor(stage)];if(!d||!d.ok) return false;
    var plate=getComputedStyle(stage).backgroundImage;
    var el=D.createElement('div');el.className='lsd-near';el.setAttribute('aria-hidden','true');
    el.style.cssText='position:fixed;left:'+sr.left+'px;top:'+sr.top+'px;width:'+sr.width+'px;height:'+sr.height+'px;'+
      'background-image:'+plate+';background-size:100% 100%;background-repeat:no-repeat;'+
      '-webkit-mask:url('+d.mask+') 0 0/100% 100% no-repeat;mask:url('+d.mask+') 0 0/100% 100% no-repeat;'+
      'pointer-events:none;z-index:61;view-transition-name:lsd-near';
    D.body.appendChild(el);
    var prev=stage.style.backgroundImage;stage.style.backgroundImage='url('+d.far+')';
    setTimeout(function(){if(el.isConnected) el.remove();stage.style.backgroundImage=prev;},4000);
    return true;
  }
  function heroClone(a){
    var stage=a.closest('.scene-stage');if(!stage) return null;
    var sr=stage.getBoundingClientRect(),br=a.getBoundingClientRect();
    if(!br.width||!sr.width) return null;
    var f=stage.classList.contains('more-scene')?FACE.more:FACE.work;
    var x=br.left+br.width*f.l,y=br.top+br.height*f.t,w=br.width*f.w,h=br.height*f.h;
    var old=D.querySelector('.lsd-hero-clone');if(old) old.remove();
    var el=D.createElement('div');el.className='lsd-hero-clone';el.setAttribute('aria-hidden','true');
    el.style.cssText='position:fixed;left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;'+
      'background-image:'+getComputedStyle(stage).backgroundImage+';background-repeat:no-repeat;'+
      'background-size:'+sr.width+'px '+sr.height+'px;background-position:'+(sr.left-x)+'px '+(sr.top-y)+'px;'+
      'pointer-events:none;z-index:60;view-transition-name:case-hero';
    D.body.appendChild(el);
    setTimeout(function(){if(el.isConnected) el.remove();},4000);
    var near=nearLayer(stage,sr);
    return {x:x,y:y,w:w,h:h,near:near,sx:sr.left,sy:sr.top};
  }

  function onCaseLinkClick(e){
    var a=e.target.closest&&e.target.closest('a');
    if(!a||!plain(e)) return;
    var p=pathOf(a.href);
    if(!CASE_RE.test(p)||new URL(a.href,location.href).origin!==location.origin) return;
    /* navigation starts now, natively; the older 215 ms JS cut is retired on this surface */
    e.stopPropagation();
    var v=variant(),info={v:'cut',from:kind,at:Date.now()};
    if(kind==='board'){
      ss('lsd_restore_surface',/more-work/.test(path)?'more':'work');
      ss('lsd_restore_case',a.getAttribute('data-case-id')||'');
      ss('lsd_restore_pending','1');
    }
    var wantPush=v==='push'||(v==='auto'&&!ss(PUSHED_KEY));
    if(!reduced&&hasVT&&wantPush&&a.classList.contains('billboard')){
      var o=heroClone(a);if(o){info.v='push';info.face=o;ss(PUSHED_KEY,'1');}
    }
    info.mode=v;
    probe.clickVariant=info.v;
    ss(VT_KEY,JSON.stringify(info));
  }

  /* ---------- A5: sound. Gesture only, switch must be ON, master -18..-24 dB ---------- */
  var ctx=null;
  function soundOn(){try{return localStorage.getItem('lsd_sound')==='on';}catch(x){return false;}}
  function audio(){
    if(!soundOn()) return null;
    try{if(!ctx) ctx=new (W.AudioContext||W.webkitAudioContext)();if(ctx.state==='suspended') ctx.resume();return ctx;}catch(x){return null;}
  }
  function bus(c,db){var g=c.createGain();g.gain.value=Math.pow(10,db/20);g.connect(c.destination);return g;}
  function noise(c,sec){var n=Math.max(1,Math.floor(c.sampleRate*sec)),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
    for(var i=0;i<n;i++) d[i]=Math.random()*2-1;var s=c.createBufferSource();s.buffer=b;return s;}
  function env(g,t,a,peak,dec){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec);}
  function crt(){
    var c=audio();if(!c) return;var t=c.currentTime+.01,out=bus(c,-20);
    var o=c.createOscillator(),og=c.createGain();o.type='sine';o.frequency.setValueAtTime(92,t);o.frequency.exponentialRampToValueAtTime(41,t+.14);
    env(og,t,.003,.9,.2);o.connect(og);og.connect(out);o.start(t);o.stop(t+.26);
    var k=noise(c,.02),kf=c.createBiquadFilter(),kg=c.createGain();kf.type='highpass';kf.frequency.value=2800;
    env(kg,t,.001,.35,.018);k.connect(kf);kf.connect(kg);kg.connect(out);k.start(t);
    var s=noise(c,.62),sf=c.createBiquadFilter(),sg=c.createGain();sf.type='bandpass';sf.frequency.value=3600;sf.Q.value=.6;
    sg.gain.setValueAtTime(0.0001,t+.04);sg.gain.exponentialRampToValueAtTime(.3,t+.22);sg.gain.exponentialRampToValueAtTime(0.0001,t+.6);
    s.connect(sf);sf.connect(sg);sg.connect(out);s.start(t+.04);
    probe.sound='crt';
  }
  function jukebox(){
    var c=audio();if(!c) return;var t=c.currentTime+.005,out=bus(c,-21);
    [[0,2300,5,.7,.03],[.024,1350,3,.35,.045]].forEach(function(p){
      var n=noise(c,.06),f=c.createBiquadFilter(),g=c.createGain();f.type='bandpass';f.frequency.value=p[1];f.Q.value=p[2];
      env(g,t+p[0],.001,p[3],p[4]);n.connect(f);f.connect(g);g.connect(out);n.start(t+p[0]);
    });
    var o=c.createOscillator(),g2=c.createGain();o.type='triangle';o.frequency.value=170;env(g2,t,.002,.25,.03);o.connect(g2);g2.connect(out);o.start(t);o.stop(t+.06);
    probe.sound='jukebox';
  }
  function bell(){
    var c=audio();if(!c) return;var t=c.currentTime+.005,out=bus(c,-22),f0=1480;
    [0,.075].forEach(function(dt,i){
      [[1,.5,1.1],[2.76,.22,.6],[5.4,.1,.32],[8.93,.05,.18]].forEach(function(p){
        var o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f0*p[0]*(i?1.006:1);
        env(g,t+dt,.002,p[1]*(i?.6:1),p[2]);o.connect(g);g.connect(out);o.start(t+dt);o.stop(t+dt+p[2]+.05);
      });
    });
    probe.sound='bell';
  }
  function wireSounds(){
    var tv=D.getElementById('crt');
    if(tv) tv.addEventListener('click',function(){if(tv.getAttribute('aria-expanded')==='true') crt();});
    D.querySelectorAll('.strip').forEach(function(s){s.addEventListener('click',jukebox);});
  }

  /* ---------- A8: the door (landing copy). Navigation starts at 200 ms ---------- */
  function door(e){
    var a=e.target.closest&&e.target.closest('a');
    if(!a||!plain(e)||!WORK_RE.test(pathOf(a.href))) return;
    e.preventDefault();e.stopPropagation();
    ss(ARRIVAL_KEY,'landing-work');
    probe.doorClick=performance.now();
    if(reduced){location.href=a.href;return;}
    bell();                                   /* J-cut: the bell leads the picture */
    D.body.classList.add('tour-cutting');
    var cut=D.createElement('div');cut.className='tour-cut tour-cut--landing lsd-door';cut.setAttribute('aria-hidden','true');
    var hot=D.getElementById('hotWork');
    if(hot){var r=hot.getBoundingClientRect(),bar=34;
      cut.style.setProperty('--tour-cut-top',Math.max(0,r.top-bar)+'px');
      cut.style.setProperty('--tour-cut-right',Math.max(0,innerWidth-r.right)+'px');
      cut.style.setProperty('--tour-cut-bottom',Math.max(0,(innerHeight-bar)-r.bottom)+'px');
      cut.style.setProperty('--tour-cut-left',Math.max(0,r.left)+'px');}
    D.body.appendChild(cut);
    requestAnimationFrame(function(){cut.classList.add('is-active');});
    ss(DOOR_KEY,String(Date.now()));
    setTimeout(function(){probe.doorNav=performance.now();location.href=a.href;},200);
  }
  function doorTail(){
    var at=+ss(DOOR_KEY)||0;ss(DOOR_KEY,null);
    if(!at||Date.now()-at>4000||reduced) return;
    var t=D.createElement('div');t.className='lsd-door-tail';t.setAttribute('aria-hidden','true');
    D.body.appendChild(t);setTimeout(function(){t.remove();},400);
  }

  /* ---------- A7: plates arrive like exposure, not like loading ---------- */
  function blurUp(stage,ph){
    if(!stage) return;
    var m=/url\(["']?([^"')]+)/.exec(getComputedStyle(stage).backgroundImage||'');
    var src=m?m[1]:'';
    if(!src){var p=D.getElementById('plate');m=p&&/url\(["']?([^"')]+)/.exec(getComputedStyle(p).backgroundImage||'');src=m?m[1]:'';}
    if(!src) return;
    var img=new Image();img.src=src;if(img.complete){probe.plate='cached';return;}
    var node=null,timer=setTimeout(function(){
      node=D.createElement('div');node.className='lsd-plate-ph';node.setAttribute('aria-hidden','true');
      node.style.backgroundImage='url('+ph+')';
      var ref=D.getElementById('plate');
      if(ref&&ref.parentNode===stage) stage.insertBefore(node,ref.nextSibling);else stage.insertBefore(node,stage.firstChild);
      probe.plate='placeholder';
    },60);
    function done(){clearTimeout(timer);if(!node) return;
      var n=node;requestAnimationFrame(function(){n.classList.add('is-settled');});setTimeout(function(){n.remove();},440);}
    img.onload=img.onerror=done;
  }

  /* ---------- A6: for whoever opens the console ---------- */
  function consoleLine(){
    if(ss('lsd_console')) return;ss('lsd_console','1');
    try{console.log('%cYou found the kitchen. Coffee’s on the house.%c\nIan Luna · ianr.luna@gmail.com',
      'font:italic 15px Georgia,serif;color:#e2cfa3;background:#0b0a08;padding:6px 10px','font:11px Consolas,monospace;color:#918877');}catch(x){}
  }

  function init(){
    if(kind==='board'||kind==='index') D.addEventListener('click',onCaseLinkClick,true);
    if(kind==='landing') D.addEventListener('click',door,true);
    if(kind==='board') doorTail();
    wireSounds();
    if(kind==='board'){var st=D.querySelector('.scene-stage');blurUp(st,st&&st.classList.contains('more-scene')?PH.more:PH.work);}
    if(kind==='landing') blurUp(D.getElementById('stage'),PH.landing);
    consoleLine();
    W.addEventListener('pageshow',function(ev){if(ev.persisted){
      D.querySelectorAll('.lsd-hero-clone,.lsd-near').forEach(function(c){c.remove();});
      var st=D.querySelector('.scene-stage');if(st) st.style.backgroundImage='';}});
    if(kind==='board'){if(W.requestIdleCallback) requestIdleCallback(preloadDepth,{timeout:2500});else setTimeout(preloadDepth,1200);}
  }
  if(D.readyState==='loading') D.addEventListener('DOMContentLoaded',init);else init();
})();
