(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var A=window.anime||{};
function anim(t,p){ if(reduce||!A.animate){ $$(t).forEach?0:0; return; } return A.animate(t,p); }

/* ---------- pin over pin (GSAP) — matches Centronic sectionTransition01 exactly ---------- */
if(window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  (function sectionTransition01(){
    var pinEls=document.querySelectorAll('[data-st-01="pin"]');
    pinEls.forEach(function(section){
      var nextSection=section.nextElementSibling;
      if(!nextSection) return;
      ScrollTrigger.create({trigger:nextSection,start:'top bottom',end:'top top',pin:section,pinSpacing:false});
    });
  })();
  /* hero parallax */
  gsap.to('#hero-img',{yPercent:-18,ease:'none',scrollTrigger:{trigger:'.hero-image-section',start:'top bottom',end:'bottom top',scrub:0.8}});
}

/* ---------- reveals ---------- */
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting) return; io.unobserve(e.target); var el=e.target;
    if(el.classList.contains('burst')) el.classList.add('in');
    if(reduce||!A.animate){ el.style.opacity=1; el.style.transform='none'; return; }
    if(el.hasAttribute('data-stagger')){
      var kids=$$(':scope > *',el); kids.forEach(function(k){k.style.opacity=0});
      A.animate(kids,{opacity:[0,1],translateY:[16,0],duration:600,ease:'outExpo',delay:A.stagger(40)});
    } else if(el.hasAttribute('data-reveal')){
      A.animate(el,{opacity:[0,1],translateY:[20,0],duration:700,ease:'outExpo'});
    }
  });
},{rootMargin:'0px 0px -8% 0px'}):null;
$$('[data-reveal],[data-stagger],.burst').forEach(function(el){
  if(!io){el.classList.add('in');return}
  if(el.hasAttribute('data-reveal')) el.style.opacity=0;
  io.observe(el);
});

/* ---------- main tabs ---------- */
var tc=$('#t-case'),ts=$('#t-slides'),pc=$('#p-case'),ps=$('#p-slides');
function show(which,noScroll){
  var c=which==='case';
  tc.setAttribute('aria-selected',c);ts.setAttribute('aria-selected',!c);
  pc.hidden=!c;ps.hidden=c;
  if(!noScroll){var sw=$('#switch');window.scrollTo({top:sw.getBoundingClientRect().top+window.pageYOffset-8,behavior:reduce?'auto':'smooth'})}
  if(window.ScrollTrigger) setTimeout(function(){ScrollTrigger.refresh()},50);
}
tc.onclick=function(){show('case')};ts.onclick=function(){show('slides')};
$$('[data-goto-case]').forEach(function(a){a.addEventListener('click',function(e){
  e.preventDefault();show('case',true);
  setTimeout(function(){var t=$(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:reduce?'auto':'smooth'})},60)})});

/* ---------- design tabs ---------- */
$$('.tabs.inline').forEach(function(g){
  var tabs=$$('.tab',g);
  tabs.forEach(function(t,i){
    t.onclick=function(){tabs.forEach(function(x){
      var on=x===t;x.setAttribute('aria-selected',on);var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});};
    t.onkeydown=function(e){var n=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!n)return;
      var o=tabs[(i+n+tabs.length)%tabs.length];o.focus();o.click();e.preventDefault()};
  });
});

/* ---------- accordion ---------- */
$$('.acc-b').forEach(function(b){b.onclick=function(){
  var p=document.getElementById(b.getAttribute('aria-controls')),open=b.getAttribute('aria-expanded')==='true';
  b.setAttribute('aria-expanded',!open);p.style.maxHeight=open?'0px':p.scrollHeight+'px';}});
window.addEventListener('resize',function(){$$('.acc-b[aria-expanded="true"]').forEach(function(b){
  var p=document.getElementById(b.getAttribute('aria-controls'));p.style.maxHeight=p.scrollHeight+'px'})});

/* ---------- modal: lightbox + wide prototype ---------- */
var modal=$('#modal'),mbody=$('#mbody'),lastFocus=null,gallery=[],gi=0;
function openModal(html,wide){lastFocus=document.activeElement;mbody.innerHTML=html;modal.classList.toggle('wide',!!wide);modal.classList.add('open');document.body.style.overflow='hidden';$('#mclose').focus()}
function closeModal(){modal.classList.remove('open','wide');mbody.innerHTML='';document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus()}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function showImg(i){
  var b=gallery[i];gi=i;
  openModal('<figure data-flip-id="'+esc(b.getAttribute('data-flip-id')||'')+'"><img src="'+esc(b.getAttribute('data-src'))+'" alt="'+esc(b.getAttribute('data-cap')||'')+'"><figcaption class="caption" style="margin-top:12px">'+esc(b.getAttribute('data-cap')||'')+'</figcaption></figure>'+
   (gallery.length>1?'<div style="display:flex;justify-content:space-between;margin-top:16px"><button class="iconbtn" data-lb="-1" aria-label="Previous image"><svg viewBox="0 0 14 14"><path d="M9 2L4 7l5 5"/></svg></button><span class="caption">'+(i+1)+' / '+gallery.length+'</span><button class="iconbtn" data-lb="1" aria-label="Next image"><svg viewBox="0 0 14 14"><path d="M5 2l5 5-5 5"/></svg></button></div>':''));
  if(lastFocus===null||!modal.classList.contains('open')) {}
}
$$('[data-lightbox]').forEach(function(b){b.addEventListener('click',function(){
  gallery=$$('[data-lightbox]',b.closest('.gal')||document);showImg(gallery.indexOf(b));});});
mbody.addEventListener('click',function(e){var x=e.target.closest('[data-lb]');if(!x)return;
  var keep=lastFocus;showImg((gi+ +x.getAttribute('data-lb')+gallery.length)%gallery.length);lastFocus=keep});
$('#mclose').onclick=closeModal;
modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
document.addEventListener('keydown',function(e){
  if(modal.classList.contains('open')){
    if(e.key==='Escape')closeModal();
    else if(!modal.classList.contains('wide')&&gallery.length>1&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){var keep=lastFocus;showImg((gi+(e.key==='ArrowRight'?1:-1)+gallery.length)%gallery.length);lastFocus=keep}
    return}
  if(!ps.hidden&&(e.key==='ArrowRight'||e.key==='ArrowLeft')&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)) go(cur+(e.key==='ArrowRight'?1:-1));
});

/* ---------- prototype ---------- */
var frame=$('#pframe'),poster=$('#poster'),pview=$('#pview');
function startProto(){
  if(!frame.getAttribute('src')) frame.setAttribute('src',frame.getAttribute('data-src'));
  poster.hidden=true;
}
$('#start').onclick=startProto;
$$('.pill[data-size]').forEach(function(p){p.onclick=function(){
  $$('.pill[data-size]').forEach(function(x){x.setAttribute('aria-pressed',x===p);x.classList.toggle('on',x===p)});
  pview.setAttribute('data-size',p.getAttribute('data-size'));startProto();}});
$('#expand').onclick=function(){
  openModal('<iframe title="Interactive recreation of the thumbwheel interface (full screen)" src="'+frame.getAttribute('data-src')+'" allow="vibrate"></iframe>',true);
  if(frame.getAttribute('src')){frame.removeAttribute('src');poster.hidden=false}
};

/* ---------- slides ---------- */
var slides=$$('.slide'),cur=0,fill=$('#fill'),count=$('#count'),dots=$('#dots');
slides.forEach(function(s,i){var d=document.createElement('button');d.setAttribute('aria-label','Go to slide '+(i+1));d.onclick=function(){go(i)};dots.appendChild(d)});
function go(i){
  if(i<0||i>=slides.length)return;cur=i;
  slides.forEach(function(s,k){s.classList.toggle('on',k===i);s.setAttribute('aria-hidden',k!==i)});
  fill.style.width=((i+1)/slides.length*100)+'%';
  count.textContent=('0'+(i+1)).slice(-2)+' / '+slides.length;
  $$('button',dots).forEach(function(d,k){d.className=k<i?'done':k===i?'cur':''});
  $('#prev').disabled=i===0;$('#next').disabled=i===slides.length-1;
  var s=slides[i];if(!reduce&&A.animate)A.animate(s,{opacity:[0,1],translateX:[16,0],duration:420,ease:'outExpo'});
}
$('#prev').onclick=function(){go(cur-1)};$('#next').onclick=function(){go(cur+1)};
var sx=null,stage=$('#stage');
stage.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
stage.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)go(cur+(dx<0?1:-1))});
go(0);

/* ---------- chapter rail ---------- */
(function(){
  var chapters=[
    {id:'thumbwheel',label:'The hardware'},
    {id:'what-i-did',label:'What I did'},
    {id:'research',label:'Research'},
    {id:'workshops',label:'Workshops'},
    {id:'hardware',label:'Hardware to UI'},
    {id:'styling',label:'Styling and thumbwheel'},
    {id:'screens',label:'The screens'},
    {id:'figma',label:'Prototype in Figma'},
    {id:'handoff',label:'Developer handoff'},
    {id:'recreation',label:'How the 2026 recreation works'},
    {id:'impact',label:'Impact'},
    {id:'limits',label:'Limits and next steps'}
  ];
  var rail=document.getElementById('cs-rail');
  var pill=document.getElementById('cs-pill');
  var drawer=document.getElementById('cs-drawer');
  var drawerList=document.getElementById('drawer-list-el');
  var drawerOverlay=document.getElementById('drawer-overlay');
  if(!rail||!pill||!drawer) return;
  /* build rail dots */
  chapters.forEach(function(ch,i){
    var dot=document.createElement('button');
    dot.className='rail-dot';
    dot.setAttribute('data-label',ch.label);
    dot.setAttribute('aria-label',ch.label);
    dot.onclick=function(){var t=document.getElementById(ch.id);if(t)t.scrollIntoView({behavior:'smooth'})};
    rail.appendChild(dot);
    /* build drawer list item */
    var li=document.createElement('li');
    var num=document.createElement('span');num.className='dl-num';num.textContent=('0'+(i+1)).slice(-2);
    var title=document.createElement('span');title.className='dl-title';title.textContent=ch.label;
    li.appendChild(num);li.appendChild(title);
    li.onclick=function(){closeDrawer();setTimeout(function(){var t=document.getElementById(ch.id);if(t)t.scrollIntoView({behavior:'smooth'})},300)};
    drawerList.appendChild(li);
  });
  var rdots=Array.prototype.slice.call(rail.querySelectorAll('.rail-dot'));
  var ritems=Array.prototype.slice.call(drawerList.querySelectorAll('li'));
  var activeIdx=0;
  function setActive(i){
    activeIdx=i;
    rdots.forEach(function(d,k){d.classList.toggle('rail-active',k===i)});
    ritems.forEach(function(li,k){li.classList.toggle('drawer-active',k===i)});
    pill.textContent=('0'+(i+1)).slice(-2)+' / '+chapters.length;
  }
  /* IntersectionObserver */
  var sectionEls=chapters.map(function(ch){return document.getElementById(ch.id)});
  var io2=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var idx=sectionEls.indexOf(e.target);
      if(idx>-1) setActive(idx);
    });
  },{rootMargin:'-20% 0px -60% 0px',threshold:0});
  sectionEls.forEach(function(t){if(t)io2.observe(t)});
  /* last section fix — activate final dot when near bottom of page */
  window.addEventListener('scroll',function(){
    var scrollBottom=window.scrollY+window.innerHeight;
    var pageHeight=document.documentElement.scrollHeight;
    if(pageHeight-scrollBottom<80) setActive(chapters.length-1);
  },{passive:true});
  /* rail visibility — show after hero image scrolls away */
  var heroImg=document.querySelector('.hero-image-section');
  var railObserver=new IntersectionObserver(function(entries){
    rail.classList.toggle('rail-visible',!entries[0].isIntersecting);
    pill.classList.toggle('pill-visible',!entries[0].isIntersecting);
  },{threshold:0});
  if(heroImg) railObserver.observe(heroImg);
  /* pill / drawer */
  function openDrawer(){drawer.classList.add('drawer-open');document.body.style.overflow='hidden'}
  function closeDrawer(){drawer.classList.remove('drawer-open');document.body.style.overflow=''}
  pill.onclick=openDrawer;
  drawerOverlay.onclick=closeDrawer;
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&drawer.classList.contains('drawer-open'))closeDrawer()});
  setActive(0);
})();
})();
