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

const envelope=$('#envelope'),letter=$('#letterContent');let letterParent=null,letterNext=null,letterBackdrop=null,letterClose=null,typingRun=0;
function resetTypedLetter(){if(!letter)return;letter.querySelectorAll('.type-word').forEach(c=>c.classList.remove('word-visible','word-current'))}
function closeLetter(){if(!letter||!letterParent)return;typingRun++;letter.classList.remove('open','letter-floating','typing');letter.setAttribute('aria-hidden','true');letter.style.cssText='';resetTypedLetter();if(letterNext&&letterNext.parentNode===letterParent)letterParent.insertBefore(letter,letterNext);else letterParent.appendChild(letter);letterParent=null;letterNext=null;if(letterBackdrop){letterBackdrop.remove();letterBackdrop=null}if(letterClose){letterClose.remove();letterClose=null}const hint=$('#envelopeHint');if(hint)hint.textContent='Tap the envelope.';envelope?.classList.remove('open')}
function prepareWordReveal(){if(!letter)return;resetTypedLetter();const targets=letter.querySelectorAll('p,b');targets.forEach(el=>{if(el.closest('.signature')===el)return;const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{const text=node.nodeValue;if(!text.trim())return;const frag=document.createDocumentFragment();const parts=text.split(/(\s+)/);parts.forEach(part=>{if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return}if(!part)return;const span=document.createElement('span');span.className='type-word';span.textContent=part;span.setAttribute('aria-hidden','true');frag.appendChild(span)});node.parentNode.replaceChild(frag,node)})})}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
async function revealLetter(run){if(!letter)return;const words=[...letter.querySelectorAll('.type-word')];for(let i=0;i<words.length;i++){if(run!==typingRun)return;words.forEach(w=>w.classList.remove('word-current'));const word=words[i];word.classList.add('word-visible','word-current');const text=word.textContent;const punctuation=/[.!?,;:…]$/.test(text);const strongPause=/[.!?…]$/.test(text);await wait(strongPause?520:punctuation?300:105+Math.random()*55)}if(run===typingRun)words.forEach(w=>w.classList.remove('word-current'))}
function openLetter(){if(!letter||letterParent)return;letterParent=letter.parentNode;letterNext=letter.nextSibling;letterBackdrop=document.createElement('button');letterBackdrop.type='button';letterBackdrop.className='letter-backdrop';document.body.appendChild(letterBackdrop);letterBackdrop.setAttribute('aria-label','Close letter');letterBackdrop.onclick=closeLetter;letterClose=document.createElement('button');letterClose.type='button';letterClose.className='letter-close';letterClose.innerHTML='×';letterClose.setAttribute('aria-label','Close letter');document.body.appendChild(letterClose);letterClose.onclick=closeLetter;document.body.appendChild(letter);letter.classList.add('open','letter-floating','typing');letter.setAttribute('aria-hidden','false');const hint=$('#envelopeHint');if(hint)hint.textContent='♡ From me to you.';burst(18);prepareWordReveal();const run=++typingRun;requestAnimationFrame(()=>revealLetter(run))}
if(envelope)envelope.onclick=()=>letterParent?closeLetter():openLetter();document.addEventListener('keydown',e=>{if(e.key==='Escape'&&letterParent)closeLetter()});
const letterStyle=document.createElement('style');letterStyle.textContent=`.letter-backdrop{position:fixed!important;inset:0!important;z-index:9998!important;border:0!important;background:rgba(5,2,12,.68)!important;backdrop-filter:blur(8px)!important;cursor:pointer!important}.letter.letter-floating{position:fixed!important;left:50%!important;top:50%!important;z-index:9999!important;width:min(620px,90vw)!important;max-height:min(650px,82vh)!important;overflow:auto!important;margin:0!important;opacity:1!important;transform:translate(-50%,-50%) scale(1)!important;filter:none!important}.letter-close{position:fixed!important;right:18px!important;top:18px!important;z-index:10000!important;width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.25)!important;background:rgba(255,255,255,.1)!important;color:#fff!important;font-size:25px!important;line-height:1!important;cursor:pointer!important;backdrop-filter:blur(10px)!important}.letter.typing{font-family:Caveat,cursive!important}.letter.typing p,.letter.typing b,.letter.typing .confession,.letter.typing .signature{font-family:Caveat,cursive!important;font-weight:500!important}.letter.typing p{font-size:1.62rem!important;line-height:1.55!important;letter-spacing:.012em!important;color:#4a3540!important}.letter.typing .type-word{opacity:0;display:inline-block;transform:translateY(7px);filter:blur(5px);transition:opacity .58s ease,transform .7s cubic-bezier(.2,.75,.25,1),filter .7s ease}.letter.typing .type-word.word-visible{opacity:1;transform:translateY(0);filter:blur(0)}.letter.typing .type-word.word-current{transform:translateY(0) scale(1.01)}.letter.typing .hand{font:2.8rem/1.1 Caveat,cursive!important;color:#30252d!important}.letter.typing .confession{font-family:Caveat,cursive!important;font-size:1.85rem!important;line-height:1.5!important;color:#a72f69!important;letter-spacing:.015em!important}.letter.typing .signature{font-family:Caveat,cursive!important;font-size:1.75rem!important}@media(max-width:800px){.letter.letter-floating{width:88vw!important;max-height:78vh!important;padding:26px 22px!important;border-radius:12px!important}.letter-close{right:12px!important;top:12px!important;width:38px!important;height:38px!important}.letter.typing p{font-size:1.48rem!important;line-height:1.5!important}.letter.typing .hand{font-size:2.45rem!important}.letter.typing .confession{font-size:1.68rem!important}}@media(prefers-reduced-motion:reduce){.letter.typing .type-word{opacity:1!important;transform:none!important;filter:none!important}}`;document.head.appendChild(letterStyle);
let cakeBlown=false;function blowCake(){if(cakeBlown)return;cakeBlown=true;$('#cake')?.classList.add('blown');const wish=$('#wish');if(wish){wish.textContent='Wish made. ♡';wish.classList.add('show')}burst(30,'✦');for(let i=0;i<15;i++)setTimeout(petal,i*50);const cakeContinue=document.querySelector('.cake-slide [data-scene-next]');if(cakeContinue){cakeContinue.innerHTML='One last thing <span>→</span>';cakeContinue.classList.add('wish-complete')}}if($('#cake'))$('#cake').onclick=blowCake;
const yes=$('#yesBtn'),hug=$('#hugBtn'),answer=$('#answerMessage');if(yes)yes.onclick=()=>{if(answer)answer.textContent='Then maybe this is the beginning of something really special. ♡';yes.textContent='Let’s find out ♡';yes.disabled=true;yes.classList.add('chosen');if(hug)hug.style.opacity='.45';burst(45);for(let i=0;i<10;i++)setTimeout(petal,i*60)};if(hug)hug.onclick=()=>{if(answer)answer.textContent='Of course. Take all the time you need. I’m just glad you know now. 🫂♡';hug.textContent='🫂 Take your time';hug.classList.add('chosen');if(yes)yes.style.opacity='.45';burst(30)};
const glow=$('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});window.burst=burst;window.heart=heart;window.petal=petal;window.unlockMusic=unlockMusic;window.blowCake=blowCake;
setTimeout(()=>{const track=$('#track'),carousel=$('#carousel'),pages=$$('.slide');if(!track||!carousel||!pages.length)return;let syncing=false;const sync=()=>{if(syncing)return;const value=track.style.getPropertyValue('transform');if(!value)return;syncing=true;track.style.setProperty('transform',value,'important');requestAnimationFrame(()=>{syncing=false})};const observer=new MutationObserver(sync);observer.observe(track,{attributes:true,attributeFilter:['style']});track.style.setProperty('display','flex','important');track.style.setProperty('flex-direction','column','important');track.style.setProperty('width','100%','important');track.style.setProperty('height','600vh','important');pages.forEach(page=>{page.style.setProperty('flex','0 0 100vh','important');page.style.setProperty('width','100%','important');page.style.setProperty('height','100vh','important')});sync()},120);

/* --- Birthday confession refinement: long-distance ending. --- */
(function refineExperience(){
  const style=document.createElement('style');
  style.textContent=`
    .final-slide::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 46%,rgba(255,112,183,.10),transparent 34%);opacity:0;transition:opacity 1.2s ease}
    .final-slide.active::after{opacity:1}
    .final-question{max-width:720px;margin-left:auto;margin-right:auto;line-height:1.55}
    .final-question strong{display:inline-block;position:relative}
    .final-question strong::after{content:'';position:absolute;left:4%;right:4%;bottom:-5px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .9s .45s ease}
    .final-slide.active .final-question strong::after{transform:scaleX(1)}
    .answer-buttons button{transition:transform .35s ease,opacity .35s ease,filter .35s ease,box-shadow .35s ease!important}
    .answer-buttons button:hover{transform:translateY(-4px) scale(1.025)!important}
    .answer-buttons button.chosen{box-shadow:0 12px 45px rgba(255,105,180,.22)!important;transform:translateY(-2px)!important}
    .wish-complete{animation:wishPulse 1.5s ease infinite alternate}
    @keyframes wishPulse{from{box-shadow:0 0 0 rgba(255,105,180,0)}to{box-shadow:0 8px 34px rgba(255,105,180,.14)}}
    .final-question{opacity:.94}
    .final-distance{display:block;margin-top:12px;font-size:.88em;opacity:.72}
    .answer-message{min-height:2.2em}
    @media(max-width:700px){.final-question{padding:0 7vw}.answer-buttons{gap:10px!important}.answer-buttons button{min-height:50px!important}}
  `;
  document.head.appendChild(style);

  const finalText=document.querySelector('.final-text');
  if(finalText) finalText.innerHTML='I could have left it at “Happy Birthday.”<br>But there was one thing I didn’t want to leave unsaid.';

  const finalQuestion=document.querySelector('.final-question');
  if(finalQuestion) finalQuestion.innerHTML='Boss… somewhere between all those little moments,<br>I started <strong>falling for you.</strong> ♡<span class="final-distance">I know we’re miles apart. I don’t know what the future looks like.<br>But I know what I feel right now.</span><br><span class="final-ask">I like you. More than a friend.<br>And if you feel even a little of the same…<br><strong>I’d like to see where this takes us.</strong></span>';

  const finalEyebrow=document.querySelector('.final-slide .eyebrow');
  if(finalEyebrow) finalEyebrow.textContent='05 · ONE LAST THING';
  const yesButton=document.querySelector('#yesBtn');
  const hugButton=document.querySelector('#hugBtn');
  if(yesButton) yesButton.textContent='Let’s find out ♡';
  if(hugButton) hugButton.textContent='I need a little time 🫂';
  const answerBox=document.querySelector('#answerMessage');
  if(answerBox) answerBox.setAttribute('aria-live','polite');

  const cakeHint=document.querySelector('.cake-slide .hint');
  if(cakeHint) cakeHint.textContent='Make your wish first. Then there’s one last thing from me.';
})();
