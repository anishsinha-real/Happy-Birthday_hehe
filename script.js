const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function heart(symbol){const layer=$('#hearts');if(!layer)return;const h=document.createElement('span');h.className='heart';h.textContent=symbol||['♡','♥','✦','✧'][Math.floor(Math.random()*4)];h.style.left=Math.random()*100+'%';h.style.bottom='-30px';h.style.fontSize=12+Math.random()*14+'px';h.style.animationDuration=5+Math.random()*4+'s';layer.appendChild(h);setTimeout(()=>h.remove(),9000)}
function burst(n=16,symbol='♡'){for(let i=0;i<n;i++)setTimeout(()=>heart(symbol),i*35)}
function petal(){const layer=$('#petals');if(!layer)return;const p=document.createElement('span');p.className='petal';p.style.left=Math.random()*100+'%';p.style.animationDuration=6+Math.random()*5+'s';layer.appendChild(p);setTimeout(()=>p.remove(),11000)}
for(let i=0;i<150;i++){const s=document.createElement('span');s.className='star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.animationDelay=Math.random()*4+'s';s.style.opacity=.15+Math.random()*.8;$('#stars')?.appendChild(s)}
setInterval(()=>heart(),1200);setInterval(petal,2200);
const music=$('#bgMusic'),musicBtn=$('#soundToggle');let musicPaused=false;if(music)music.volume=.42;
async function playMusic(){if(!music)return;try{await music.play();musicBtn?.classList.add('active');if(musicBtn)musicBtn.textContent='♫';musicPaused=false}catch(e){}}
function unlockMusic(){if(!musicPaused&&music?.paused)playMusic()}
if(musicBtn)musicBtn.onclick=async()=>{if(music?.paused){musicPaused=false;await playMusic()}else{music.pause();musicPaused=true;musicBtn.classList.remove('active');musicBtn.textContent='×'}};
document.addEventListener('pointerdown',unlockMusic,{once:true});
const envelope=$('#envelope'),letter=$('#letterContent');
if(envelope)envelope.onclick=()=>{const open=envelope.classList.toggle('open');letter?.classList.toggle('open',open);letter?.setAttribute('aria-hidden',String(!open));const hint=$('#envelopeHint');if(hint)hint.textContent=open?'♡ From me to you.':'Tap the envelope.';if(open)burst(18)};
let cakeBlown=false;function blowCake(){if(cakeBlown)return;cakeBlown=true;$('#cake')?.classList.add('blown');const wish=$('#wish');if(wish){wish.textContent='Wish made. ♡';wish.classList.add('show')}burst(30,'✦');for(let i=0;i<15;i++)setTimeout(petal,i*50)}
if($('#cake'))$('#cake').onclick=blowCake;
const yes=$('#yesBtn'),hug=$('#hugBtn'),answer=$('#answerMessage');
if(yes)yes.onclick=()=>{if(answer)answer.textContent='Okay… then I guess I officially have permission to keep falling for you. ♡';yes.textContent='Best. Answer. Ever. ♡';yes.disabled=true;burst(45);for(let i=0;i<10;i++)setTimeout(petal,i*60)};
if(hug)hug.onclick=()=>{if(answer)answer.textContent='Come here then, Boss. 🫂♡';burst(30)};
const glow=$('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
window.burst=burst;window.heart=heart;window.petal=petal;window.unlockMusic=unlockMusic;window.blowCake=blowCake;

/* Vertical page-by-page navigation. */
setTimeout(()=>{
 const track=$('#track'),carousel=$('#carousel'),pages=$$('.slide'),progress=$('#progressBar'),label=$('#progressLabel');
 if(!track||!carousel||!pages.length)return;
 const style=document.createElement('style');style.textContent=`
 .carousel{overflow:hidden!important;touch-action:pan-y!important}
 .track{display:flex!important;flex-direction:column!important;width:100%!important;height:100%!important;position:relative!important;transform:translate3d(0,0,0)!important;transition:transform .9s cubic-bezier(.76,0,.18,1)!important}
 .slide{position:relative!important;inset:auto!important;flex:0 0 100%!important;width:100%!important;height:100%!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important;filter:none!important}
 .slide .reveal{opacity:0;transform:translateY(22px);transition:opacity .65s ease,transform .75s cubic-bezier(.2,.8,.2,1)!important}
 .slide.active .reveal{opacity:1!important;transform:none!important}
 .scene-back{display:none!important}
 @media(max-width:700px){.carousel{height:calc(100vh - 34px)!important}.track{transition-duration:.72s!important}}
 `;document.head.appendChild(style);
 /* Remove the old inline cinematic click handlers. */
 $$('.enter-btn,[data-scene-next],#restart').forEach(button=>{const copy=button.cloneNode(true);button.replaceWith(copy)});
 document.querySelector('.scene-back')?.remove();
 let current=0,busy=false,startY=0,startX=0;
 function update(n){current=Math.max(0,Math.min(pages.length-1,n));track.style.transform=`translate3d(0,${-current*100}%,0)`;pages.forEach((p,i)=>p.classList.toggle('active',i===current));if(progress)progress.style.width=((current+1)/pages.length*100)+'%';if(label)label.textContent=String(current+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0')}
 function go(n){if(busy||n===current||n<0||n>=pages.length)return;busy=true;unlockMusic();update(n);setTimeout(()=>busy=false,760)}
 function next(){go(current+1)}function prev(){go(current-1)}
 $$('.enter-btn,[data-scene-next]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();next()}));
 const restart=$('#restart');if(restart)restart.addEventListener('click',()=>{if(busy)return;update(0);burst(18)});
 let wheelLock=false;carousel.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<18||wheelLock)return;e.preventDefault();wheelLock=true;e.deltaY>0?next():prev();setTimeout(()=>wheelLock=false,820)},{passive:false});
 carousel.addEventListener('touchstart',e=>{const t=e.changedTouches[0];startY=t.clientY;startX=t.clientX},{passive:true});
 carousel.addEventListener('touchend',e=>{const t=e.changedTouches[0],dy=t.clientY-startY,dx=t.clientX-startX;if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>45){dy<0?next():prev()}},{passive:true});
 window.addEventListener('keydown',e=>{if(e.target.matches('button,input,a'))return;if(e.key==='ArrowDown'||e.key==='PageDown')next();if(e.key==='ArrowUp'||e.key==='PageUp')prev()});
 update(0);
},0);
