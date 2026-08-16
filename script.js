const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

function heart(symbol){const h=document.createElement('span');h.className='heart';h.textContent=symbol||['♡','♥','✦','✧'][Math.floor(Math.random()*4)];h.style.left=Math.random()*100+'%';h.style.bottom='-30px';h.style.fontSize=12+Math.random()*14+'px';h.style.animationDuration=5+Math.random()*4+'s';$('#hearts').appendChild(h);setTimeout(()=>h.remove(),9000)}
function burst(n=16,symbol='♡'){for(let i=0;i<n;i++)setTimeout(()=>heart(symbol),i*35)}
function petal(){const p=document.createElement('span');p.className='petal';p.style.left=Math.random()*100+'%';p.style.animationDuration=6+Math.random()*5+'s';$('#petals').appendChild(p);setTimeout(()=>p.remove(),11000)}
for(let i=0;i<150;i++){const s=document.createElement('span');s.className='star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.animationDelay=Math.random()*4+'s';s.style.opacity=.15+Math.random()*.8;$('#stars').appendChild(s)}
setInterval(()=>heart(),1200);setInterval(petal,2200);
const music=$('#bgMusic'),musicBtn=$('#soundToggle');let musicPaused=false;music.volume=.42;
async function playMusic(){try{await music.play();musicBtn.classList.add('active');musicBtn.textContent='♫';musicPaused=false}catch(e){}}
function unlockMusic(){if(!musicPaused&&music.paused)playMusic()}
musicBtn.onclick=async()=>{if(music.paused){musicPaused=false;await playMusic()}else{music.pause();musicPaused=true;musicBtn.classList.remove('active');musicBtn.textContent='×'}};
document.addEventListener('pointerdown',unlockMusic,{once:true});
const envelope=$('#envelope'),letter=$('#letterContent');envelope.onclick=()=>{const open=envelope.classList.toggle('open');letter.classList.toggle('open',open);letter.setAttribute('aria-hidden',String(!open));$('#envelopeHint').textContent=open?'♡ From me to you.':'Tap the envelope.';if(open)burst(18)};
let cakeBlown=false;function blowCake(){if(cakeBlown)return;cakeBlown=true;$('#cake').classList.add('blown');$('#wish').textContent='Wish made. ♡';$('#wish').classList.add('show');burst(30,'✦');for(let i=0;i<15;i++)setTimeout(petal,i*50)}$('#cake').onclick=blowCake;
$('#yesBtn').onclick=()=>{$('#answerMessage').textContent='Okay… then I guess I officially have permission to keep falling for you. ♡';$('#yesBtn').textContent='Best. Answer. Ever. ♡';$('#yesBtn').disabled=true;burst(45);for(let i=0;i<10;i++)setTimeout(petal,i*60)};
$('#hugBtn').onclick=()=>{$('#answerMessage').textContent='Come here then, Boss. 🫂♡';burst(30)};
const glow=$('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
window.addEventListener('keydown',e=>{if(e.target.matches('button,input'))return;if(e.key==='ArrowRight'||e.key==='PageDown')document.querySelector('[data-scene-next]')?.click();});
