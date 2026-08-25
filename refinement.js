/* Refinement layer — preserves the original site and sharpens the final emotional arc. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .final-slide::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 46%,rgba(255,112,183,.10),transparent 34%);opacity:0;transition:opacity 1.2s ease}
    .final-slide.active::after{opacity:1}
    .final-question{max-width:680px;margin-left:auto;margin-right:auto}
    .final-question strong{display:inline-block;position:relative}
    .final-question strong::after{content:'';position:absolute;left:4%;right:4%;bottom:-5px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .9s .45s ease}
    .final-slide.active .final-question strong::after{transform:scaleX(1)}
    .final-ask{display:block;margin-top:15px;font-size:.92em;opacity:.82}
    .answer-message{min-height:2.2em}
    .answer-buttons button{transition:transform .35s ease,opacity .35s ease,filter .35s ease,box-shadow .35s ease!important}
    .answer-buttons button:hover{transform:translateY(-4px) scale(1.025)!important}
    .answer-buttons button.chosen{box-shadow:0 12px 45px rgba(255,105,180,.22)!important;transform:translateY(-2px)!important}
    .wish-complete{animation:wishPulse 1.5s ease infinite alternate}
    @keyframes wishPulse{from{box-shadow:0 0 0 rgba(255,105,180,0)}to{box-shadow:0 8px 34px rgba(255,105,180,.14)}}
    @media(max-width:700px){.final-question{padding:0 8vw}.answer-buttons{gap:10px!important}.answer-buttons button{min-height:50px!important}}
  `;
  document.head.appendChild(style);

  // Keep the letter as the emotional discovery; make the last screen the actual, low-pressure ask.
  const finalText=document.querySelector('.final-text');
  if(finalText) finalText.innerHTML='I could have left it at “Happy Birthday.”<br>But there was one thing I didn’t want to leave unsaid.';

  const finalQuestion=document.querySelector('.final-question');
  if(finalQuestion) finalQuestion.innerHTML='Boss, somewhere between all those little moments,<br>I started <strong>falling for you.</strong> ♡<br><span class="final-ask">And if you’re okay with it… I’d really like to take you out sometime.</span>';

  const yes=document.querySelector('#yesBtn');
  const hug=document.querySelector('#hugBtn');
  if(yes) yes.textContent='I’d like that ♡';
  if(hug) hug.textContent='I need a minute 🫂';

  // Give the birthday wish a satisfying hand-off into the final scene.
  const hint=document.querySelector('.cake-slide .hint');
  if(hint) hint.textContent='Make your wish first. Then there’s one last thing from me.';

  const cake=document.querySelector('#cake');
  if(cake) cake.addEventListener('click',function(){
    const next=document.querySelector('.cake-slide [data-scene-next]');
    if(next){next.innerHTML='One last thing <span>→</span>';next.classList.add('wish-complete')}
  });

  if(yes) yes.addEventListener('click',function(){
    const answer=document.querySelector('#answerMessage');
    if(answer) answer.textContent='Okay… then this birthday just became my favourite one too. ♡';
    yes.classList.add('chosen');
    if(hug) hug.style.opacity='.45';
    if(window.burst) window.burst(45);
  });

  if(hug) hug.addEventListener('click',function(){
    const answer=document.querySelector('#answerMessage');
    if(answer) answer.textContent='Take all the time you need, Boss. 🫂♡';
    hug.classList.add('chosen');
    if(yes) yes.style.opacity='.45';
    if(window.burst) window.burst(24);
  });
})();
