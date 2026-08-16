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

/* Letter: temporarily move it outside the transformed vertical track while open. */
const envelope=$('#envelope'),letter=$('#letterContent');
let letterParent=null,letterNext=null,letterBackdrop=null,letterClose=null;
function closeLetter(){
 if(!letter||!letterParent)return;
 letter.classList.remove('open','letter-floating','writing');letter.setAttribute('aria-hidden','true');letter.style.cssText='';
 if(letterNext&&letterNext.parentNode===letterParent)letterParent.insertBefore(letter,letterNext);else letterParent.appendChild(letter);
 letterParent=null;letterNext=null;if(letterBackdrop){letterBackdrop.remove();letterBackdrop=null}if(letterClose){letterClose.remove();letterClose=null}
 const hint=$('#envelopeHint');if(hint)hint.textContent='Tap the envelope.';envelope?.classList.remove('open');
}
function openLetter(){
 if(!letter||letterParent)return;letterParent=letter.parentNode;letterNext=letter.nextSibling;
 letterBackdrop=document.createElement('button');letterBackdrop.type='button';letterBackdrop.className='letter-backdrop';letterBackdrop.setAttribute('aria-label','Close letter');document.body.appendChild(letterBackdrop);letterBackdrop.onclick=closeLetter;
 letterClose=document.createElement('button');letterClose.type='button';letterClose.className='letter-close';letterClose.innerHTML='×';letterClose.setAttribute('aria-label','Close letter');document.body.appendChild(letterClose);letterClose.onclick=closeLetter;
 document.body.appendChild(letter);letter.classList.add('open','letter-floating');letter.setAttribute('aria-hidden','false');const hint=$('#envelopeHint');if(hint)hint.textContent='♡ From me to you.';burst(18);
 /* Handwritten reveal: the letter is uncovered line-by-line like fresh ink on paper. */
 requestAnimationFrame(()=>requestAnimationFrame(()=>letter.classList.add('writing')));
}
if(envelope)envelope.onclick=()=>letterParent?closeLetter():openLetter();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&letterParent)closeLetter()});

/* Handwriting reveal styling. Caveat gives the letter its handwritten texture while the ink mask reveals each line progressively. */
const letterStyle=document.createElement('style');letterStyle.textContent=`
.letter-backdrop{position:fixed!important;inset:0!important;z-index:9998!important;border:0!important;background:rgba(5,2,12,.68)!important;backdrop-filter:blur(8px)!important;cursor:pointer!important}
.letter.letter-floating{position:fixed!important;left:50%!important;top:50%!important;z-index:9999!important;width:min(620px,90vw)!important;max-height:min(650px,82vh)!important;overflow:auto!important;margin:0!important;opacity:1!important;transform:translate(-50%,-50%) scale(1)!important;filter:none!important}
.letter-close{position:fixed!important;right:18px!important;top:18px!important;z-index:10000!important;width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.25)!important;background:rgba(255,255,255,.1)!important;color:#fff!important;font-size:25px!important;line-height:1!important;cursor:pointer!important;backdrop-filter:blur(10px)!important}
.letter.writing p{opacity:0;clip-path:inset(0 100% 0 0);animation:inkWrite 1.65s cubic-bezier(.16,.75,.2,1) forwards}
.letter.writing .hand{font-size:2.55rem;text-shadow:.35px .35px 0 #3c2a38}
.letter.writing p:nth-of-type(1){animation-delay:.25s}.letter.writing p:nth-of-type(2){animation-delay:1.15s}.letter.writing p:nth-of-type(3){animation-delay:2.15s}.letter.writing p:nth-of-type(4){animation-delay:3.2s}.letter.writing p:nth-of-type(5){animation-delay:4.25s}.letter.writing p:nth-of-type(6){animation-delay:5.3s}
.letter.writing .confession{font-family:Caveat,cursive;font-size:1.7rem;line-height:1.35;color:#b73576;letter-spacing:.01em}
.letter.writing .signature{font-family:Caveat,cursive;font-size:1.55rem}
.letter.writing:after{content:'✒';position:absolute;right:34px;top:34px;color:#c43b83;font-size:17px;opacity:0;animation:penPulse .5s ease 1.8s forwards}
@keyframes inkWrite{0%{opacity:0;clip-path:inset(0 100% 0 0);filter:blur(1.5px)}12%{opacity:1}100%{opacity:1;clip-path:inset(0 0 0 0);filter:none}}
@keyframes penPulse{0%{opacity:0;transform:translateX(-8px) rotate(-15deg)}100%{opacity:.75;transform:translateX(0) rotate(0)}}
@media(max-width:800px){.letter.letter-floating{width:88vw!important;max-height:78vh!important;padding:26px 22px!important;border-radius:12px!important}.letter-close{right:12px!important;top:12px!important;width:38px!important;height:38px!important}.letter.writing p:nth-of-type(n){animation-duration:1.15s}.letter.writing p:nth-of-type(1){animation-delay:.2s}.letter.writing p:nth-of-type(2){animation-delay:.85s}.letter.writing p:nth-of-type(3){animation-delay:1.55s}.letter.writing p:nth-of-type(4){animation-delay:2.3s}.letter.writing p:nth-of-type(5){animation-delay:3.05s}.letter.writing p:nth-of-type(6){animation-delay:3.8s}}
@media(prefers-reduced-motion:reduce){.letter.writing p{animation:none!important;opacity:1!important;clip-path:none!important}.letter.writing:after{display:none!important}}
`;document.head.appendChild(letterStyle);

let cakeBlown=false;function blowCake(){if(cakeBlown)return;cakeBlown=true;$('#cake')?.classList.add('blown');const wish=$('#wish');if(wish){wish.textContent='Wish made. ♡';wish.classList.add('show')}burst(30,'✦');for(let i=0;i<15;i++)setTimeout(petal,i*50)}
if($('#cake'))$('#cake').onclick=blowCake;
const yes=$('#yesBtn'),hug=$('#hugBtn'),answer=$('#answerMessage');
if(yes)yes.onclick=()=>{if(answer)answer.textContent='Okay… then I guess I officially have permission to keep falling for you. ♡';yes.textContent='Best. Answer. Ever. ♡';yes.disabled=true;burst(45);for(let i=0;i<10;i++)setTimeout(petal,i*60)};
if(hug)hug.onclick=()=>{if(answer)answer.textContent='Come here then, Boss. 🫂♡';burst(30)};
const glow=$('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
window.burst=burst;window.heart=heart;window.petal=petal;window.unlockMusic=unlockMusic;window.blowCake=blowCake;

/* Keep the existing vertical controller, but make the track/pages truly vertical. */
setTimeout(()=>{const track=$('#track'),carousel=$('#carousel'),pages=$$('.slide');if(!track||!carousel||!pages.length)return;let syncing=false;const sync=()=>{if(syncing)return;const value=track.style.getPropertyValue('transform');if(!value)return;syncing=true;track.style.setProperty('transform',value,'important');requestAnimationFrame(()=>{syncing=false})};const observer=new MutationObserver(sync);observer.observe(track,{attributes:true,attributeFilter:['style']});track.style.setProperty('display','flex','important');track.style.setProperty('flex-direction','column','important');track.style.setProperty('width','100%','important');track.style.setProperty('height','600vh','important');pages.forEach(page=>{page.style.setProperty('flex','0 0 100vh','important');page.style.setProperty('width','100%','important');page.style.setProperty('height','100vh','important')});sync()},120);
