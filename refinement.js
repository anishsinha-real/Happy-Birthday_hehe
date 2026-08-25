/* Refinement layer — preserves the original site and sharpens the final emotional arc. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .final-slide::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 46%,rgba(255,112,183,.10),transparent 34%);opacity:0;transition:opacity 1.2s ease}
    .final-slide.active::after{opacity:1}
    .final-question{max-width:820px;margin-left:auto;margin-right:auto;line-height:1.28;font-size:clamp(1.45rem,2.45vw,2rem);padding:0 12px}
    .final-question strong{display:inline-block;position:relative}
    .final-question strong::after{content:'';position:absolute;left:4%;right:4%;bottom:-4px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .9s .45s ease}
    .final-slide.active .final-question strong::after{transform:scaleX(1)}
    .final-distance{display:block;margin-top:10px;font-size:.82em;opacity:.72}
    .final-ask{display:block;margin-top:12px;font-size:.9em;opacity:.88}
    .answer-message{min-height:2.2em}
    .answer-buttons button{transition:transform .35s ease,opacity .35s ease,filter .35s ease,box-shadow .35s ease!important}
    .answer-buttons button:hover{transform:translateY(-4px) scale(1.025)!important}
    .answer-buttons button.chosen{box-shadow:0 12px 45px rgba(255,105,180,.22)!important;transform:translateY(-2px)!important}
    .wish-complete{animation:wishPulse 1.5s ease infinite alternate}
    @keyframes wishPulse{from{box-shadow:0 0 0 rgba(255,105,180,0)}to{box-shadow:0 8px 34px rgba(255,105,180,.14)}}
    @media(max-width:700px){.final-question{padding:0 5vw;font-size:1.32rem;line-height:1.3}.final-distance{font-size:.82em}.final-ask{font-size:.9em;margin-top:9px}.answer-buttons{gap:10px!important}.answer-buttons button{min-height:50px!important}}
  `;
  document.head.appendChild(style);

  // Keep the letter as the emotional discovery; make the last screen the actual, low-pressure ask.
  const finalText=document.querySelector('.final-text');
  if(finalText) finalText.innerHTML='I could have left it at “Happy Birthday.”<br>But there was one thing I didn’t want to leave unsaid.';

  const finalQuestion=document.querySelector('.final-question');
  if(finalQuestion) finalQuestion.innerHTML='Boss… somewhere along the way,<br>I started <strong>falling for you.</strong> ♡<span class="final-distance">Yes, we’re miles apart. I don’t know what the future looks like.<br>But I know I don’t want to hide how I feel.</span><span class="final-ask"><strong>I like you. More than a friend.</strong><br>If you feel even a little of the same…<br>I’d like to see where this takes us.</span>';

  const yes=document.querySelector('#yesBtn');
  const hug=document.querySelector('#hugBtn');
  if(yes) yes.textContent='Let’s find out ♡';
  if(hug) hug.textContent='I need a little time 🫂';

  const hint=document.querySelector('.cake-slide .hint');
  if(hint) hint.textContent='Make your wish first. Then there’s one last thing from me.';

  const cake=document.querySelector('#cake');
  if(cake) cake.addEventListener('click',function(){
    const next=document.querySelector('.cake-slide [data-scene-next]');
    if(next){next.innerHTML='One last thing <span>→</span>';next.classList.add('wish-complete')}
  });

  if(yes) yes.addEventListener('click',function(){
    const answer=document.querySelector('#answerMessage');
    if(answer) answer.textContent='Then maybe this is the beginning of something really special. ♡';
    yes.classList.add('chosen');
    if(hug) hug.style.opacity='.45';
    if(window.burst) window.burst(45);
  });

  if(hug) hug.addEventListener('click',function(){
    const answer=document.querySelector('#answerMessage');
    if(answer) answer.textContent='Of course. Take all the time you need. I’m just glad you know now. 🫂♡';
    hug.classList.add('chosen');
    if(yes) yes.style.opacity='.45';
    if(window.burst) window.burst(24);
  });

  /* --- Navigation lock fix ---
     The original page has two navigation layers. This capture-phase controller owns
     scene navigation so the final slide can always move back/up, including on mobile.
  */
  const track=document.querySelector('#track');
  const carousel=document.querySelector('#carousel');
  const pages=[...document.querySelectorAll('.slide')];
  const label=document.querySelector('#progressLabel');
  const progress=document.querySelector('#progressBar');
  if(track&&carousel&&pages.length){
    let current=Math.max(0,Math.min(pages.length-1,(parseInt((label?.textContent||'01').split('/')[0],10)||1)-1));
    let busy=false;
    let touchStartY=0,touchStartX=0,touching=false;

    const render=(n,animate=true)=>{
      current=Math.max(0,Math.min(pages.length-1,n));
      track.style.setProperty('transition',animate?'transform .78s cubic-bezier(.76,0,.18,1)':'none','important');
      track.style.setProperty('transform',`translate3d(0,${-current*100}vh,0)`,'important');
      pages.forEach((p,i)=>p.classList.toggle('active',i===current));
      if(progress)progress.style.width=((current+1)/pages.length*100)+'%';
      if(label)label.textContent=String(current+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');
      document.querySelector('.scene-back')?.classList.toggle('visible',current>0);
      if(current===pages.length-1&&window.burst) window.burst(6,'✦');
    };
    const move=delta=>{
      if(busy)return;
      const next=current+delta;
      if(next<0||next>=pages.length)return;
      busy=true;render(next,true);setTimeout(()=>busy=false,620);
    };

    document.addEventListener('click',e=>{
      const control=e.target.closest('[data-next],[data-scene-next]');
      if(!control)return;
      e.preventDefault();e.stopImmediatePropagation();
      if(window.unlockMusic)window.unlockMusic();
      move(1);
    },true);

    document.addEventListener('click',e=>{
      if(!e.target.closest('#restart'))return;
      e.preventDefault();e.stopImmediatePropagation();
      busy=false;render(0,false);
      if(window.burst)window.burst(18);
    },true);

    let back=document.querySelector('.navigation-fix-back');
    if(!back){
      back=document.createElement('button');
      back.type='button';back.className='navigation-fix-back';back.textContent='↑ Back';
      back.setAttribute('aria-label','Go to previous scene');
      document.body.appendChild(back);
      back.addEventListener('click',e=>{e.preventDefault();move(-1)});
    }
    const backStyle=document.createElement('style');
    backStyle.textContent=`.navigation-fix-back{position:fixed;left:18px;bottom:18px;z-index:99999;display:block!important;padding:9px 14px;border:1px solid #ffffff20;border-radius:999px;background:#090512aa;color:#b6a9bd;font:600 .65rem 'DM Sans',sans-serif;letter-spacing:.12em;text-transform:uppercase;backdrop-filter:blur(12px);cursor:pointer;opacity:.9;transition:.25s}.navigation-fix-back:hover{color:#fff;border-color:#ff86c766;transform:translateY(-2px)}.navigation-fix-back[hidden]{display:none!important}@media(max-width:700px){.navigation-fix-back{left:12px;bottom:12px;padding:10px 14px;font-size:.6rem}}`;
    document.head.appendChild(backStyle);
    const updateBack=()=>{back.style.visibility=current>0?'visible':'hidden';back.style.pointerEvents=current>0?'auto':'none'};
    const originalRender=render;
    render=(n,animate=true)=>{originalRender(n,animate);updateBack()};
    updateBack();

    carousel.addEventListener('wheel',e=>{
      if(Math.abs(e.deltaY)<20)return;
      e.preventDefault();e.stopImmediatePropagation();
      move(e.deltaY>0?1:-1);
    },{passive:false,capture:true});

    carousel.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      touching=true;touchStartY=e.clientY;touchStartX=e.clientX;
    },true);
    carousel.addEventListener('pointerup',e=>{
      if(!touching)return;
      touching=false;
      const dy=e.clientY-touchStartY,dx=e.clientX-touchStartX;
      if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>35){e.preventDefault();e.stopImmediatePropagation();move(dy<0?1:-1)}
    },true);
    carousel.addEventListener('pointercancel',()=>{touching=false},true);

    window.addEventListener('keydown',e=>{
      if(e.target.matches('button,input,textarea'))return;
      if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();move(1)}
      if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();move(-1)}
    },true);

    render(current,false);
  }
})();
