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

/* Fix the vertical controller's transform priority. The existing controller in index.html
   remains responsible for navigation; this only makes its vertical transform actually win. */
setTimeout(()=>{
 const track=$('#track'),carousel=$('#carousel'),pages=$$('.slide');
 if(!track||!carousel||!pages.length)return;
 let syncing=false;
 const sync=()=>{
   if(syncing)return;
   const value=track.style.getPropertyValue('transform');
   if(!value)return;
   syncing=true;
   track.style.setProperty('transform',value,'important');
   requestAnimationFrame(()=>{syncing=false});
 };
 const observer=new MutationObserver(sync);
 observer.observe(track,{attributes:true,attributeFilter:['style']});
 track.style.setProperty('display','flex','important');
 track.style.setProperty('flex-direction','column','important');
 track.style.setProperty('width','100%','important');
 track.style.setProperty('height','600vh','important');
 pages.forEach(page=>{
   page.style.setProperty('flex','0 0 100vh','important');
   page.style.setProperty('width','100%','important');
   page.style.setProperty('height','100vh','important');
 });
 sync();
},120);
