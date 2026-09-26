/* Detail pass v2 (review only) - the part that must run before first paint: cross-document
   view-transition hooks (pageswap / pagereveal), per-route types, cancel on input, and focus on
   the case title. Small and synchronous on purpose; everything else lives in details.js (deferred). */
(function(){
  'use strict';
  var D=document,H=D.documentElement,W=window;
  var VT_KEY='lsd_vt';
  var CASE_RE=/\/review\/cases-2-1\/[^\/]+\.html$/;
  var BOARD_RE=/\/review\/billboards\/(work|more-work)\.html$/;
  var INDEX_RE=/\/review\/index-2-1\/(index\.html)?$/;
  var reduced=!!(W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasVT=('CSSViewTransitionRule' in W);
  var path=location.pathname;
  var kind=CASE_RE.test(path)?'case':BOARD_RE.test(path)?'board':INDEX_RE.test(path)?'index':
           /\/review\/details\/(index\.html)?$/.test(path)?'landing':'';
  var probe=W.__lsd=W.__lsd||{kind:kind,hasVT:hasVT,reduced:reduced,swap:null,reveal:null,clicks:[]};

  function ss(k,v){try{
    if(v===undefined) return sessionStorage.getItem(k);
    if(v===null) sessionStorage.removeItem(k); else sessionStorage.setItem(k,v);
  }catch(e){return null;}}
  function pathOf(url){try{return new URL(url,location.href).pathname;}catch(e){return '';}}
  function plain(e){return !(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey);}
  /* ---------- A1: types per route; transitions only where they mean something ---------- */
  function kindOf(p){return CASE_RE.test(p)?'case':BOARD_RE.test(p)?'board':INDEX_RE.test(p)?'index':'';}
  function allowed(fromP,toKind){
    if(toKind==='case') return BOARD_RE.test(fromP)||INDEX_RE.test(fromP)||CASE_RE.test(fromP);
    if(toKind==='board'||toKind==='index') return CASE_RE.test(fromP);
    return false;
  }

  W.addEventListener('pageswap',function(e){
    var to=e.activation&&e.activation.entry?pathOf(e.activation.entry.url):'';
    probe.swap={vt:!!e.viewTransition,to:to};
    if(!e.viewTransition) return;
    if(reduced||!allowed(path,kindOf(to))){e.viewTransition.skipTransition();}
  });

  function heroEl(){
    var m=D.querySelector('.first .media');if(!m) return null;
    return m.querySelector('.film,.frame.hero,figure,img');
  }

  function armCancel(vt){
    var off=false;
    function skip(){if(off) return;off=true;probe.skipped=performance.now();try{vt.skipTransition();}catch(x){}}
    ['pointerdown','keydown','wheel','touchstart'].forEach(function(t){W.addEventListener(t,skip,{capture:true,once:true,passive:true});});
    /* while the transition paints, clicks land on the root; send them to what is under the pointer */
    function retarget(ev){
      if(ev.target!==H&&ev.target!==D.body) return;
      var el=D.elementFromPoint(ev.clientX,ev.clientY),a=el&&el.closest&&el.closest('a[href]');
      probe.clicks.push({t:performance.now(),retarget:!!a});
      if(a&&plain(ev)){ev.preventDefault();location.href=a.href;}
    }
    W.addEventListener('click',retarget,{capture:true});
    function end(){off=true;setTimeout(function(){W.removeEventListener('click',retarget,{capture:true});},300);}
    vt.finished.then(end,end);
  }

  function focusTitle(){
    if(kind!=='case'||location.hash) return;
    var t=D.getElementById('t')||D.querySelector('main h1');if(!t) return;
    if(!t.hasAttribute('tabindex')) t.setAttribute('tabindex','-1');
    try{t.focus({preventScroll:true});}catch(x){t.focus();}
  }

  W.addEventListener('pagereveal',function(e){
    var vt=e.viewTransition,info=null;
    try{info=JSON.parse(ss(VT_KEY)||'null');}catch(x){}
    ss(VT_KEY,null);
    if(info&&Date.now()-info.at>15000) info=null;
    var from='';try{from=navigation.activation&&navigation.activation.from?navigation.activation.from.url:'';}catch(x){}
    var fromP=pathOf(from);
    probe.reveal={vt:!!vt,from:fromP,info:info,t:performance.now(),types:[]};
    focusTitle();
    if(!vt) return;
    if(reduced||!allowed(fromP,kind)){vt.skipTransition();return;}
    var type='cut';
    if(kind==='case'&&BOARD_RE.test(fromP)&&info&&info.v==='push'){
      var h=heroEl();
      if(h&&info.face){type='push';h.style.viewTransitionName='case-hero';
        /* one rigid camera move: the whole window is pushed so the lit board lands exactly where the
           case's main image sits; the board face (its own layer) rides the same curve */
        var f=info.face,r=h.getBoundingClientRect(),k=Math.max(r.width/f.w,r.height/f.h);
        var tx=(r.left+r.width/2)-k*(f.x+f.w/2),ty=(r.top+r.height/2)-k*(f.y+f.h/2);
        H.style.setProperty('--lsd-dolly','translate('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px) scale('+k.toFixed(4)+')');
        /* our side of the glass is nearer the lens, so it grows faster and slides off first */
        if(f.near){var k2=k*1.3,cx=f.x+f.w/2,cy=f.y+f.h/2,t0=r.left+r.width/2,t1=r.top+r.height/2;
          var ax=t0+k2*(f.sx-cx)-f.sx,ay=t1+k2*(f.sy-cy)-f.sy;
          H.style.setProperty('--lsd-near','translate('+ax.toFixed(1)+'px,'+ay.toFixed(1)+'px) scale('+k2.toFixed(4)+')');}
        probe.reveal.dolly={k:k,tx:tx,ty:ty,near:!!f.near};
        var clear=function(){h.style.viewTransitionName='';};vt.finished.then(clear,clear);}
    }
    if((kind==='board'||kind==='index')&&CASE_RE.test(fromP)) type='back';
    try{vt.types.add(type);}catch(x){}
    probe.reveal.types=[type];
    vt.finished.then(function(){probe.reveal.done=performance.now();},function(){probe.reveal.done=performance.now();});
    armCancel(vt);
  });
  /* no pagereveal (older engines): still land the reader on the case name */
  if(!('onpagereveal' in W)){D.addEventListener('DOMContentLoaded',focusTitle);}
})();
