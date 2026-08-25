/* Final response fix: keeps the confession buttons visible and makes their reply appear above them. */
(function(){
  const answer=document.querySelector('#answerMessage');
  const yes=document.querySelector('#yesBtn');
  const hug=document.querySelector('#hugBtn');
  if(!answer||!yes||!hug)return;

  const style=document.createElement('style');
  style.textContent=`
    #answerMessage.final-response-visible{
      position:fixed!important;
      left:50%!important;
      bottom:145px!important;
      z-index:99999!important;
      width:min(620px,88vw)!important;
      min-height:0!important;
      padding:12px 20px!important;
      border:1px solid rgba(255,134,199,.28)!important;
      border-radius:999px!important;
      background:rgba(15,7,24,.86)!important;
      backdrop-filter:blur(14px)!important;
      box-shadow:0 15px 45px rgba(0,0,0,.35),0 0 30px rgba(255,105,180,.10)!important;
      color:#ffd8eb!important;
      text-align:center!important;
      font:1.35rem Caveat,cursive!important;
      opacity:1!important;
      visibility:visible!important;
      transform:translate(-50%,0)!important;
      animation:finalResponseIn .5s cubic-bezier(.2,.8,.2,1) both!important;
      pointer-events:none!important;
    }
    @keyframes finalResponseIn{from{opacity:0;transform:translate(-50%,12px) scale(.96)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
    @media(max-width:700px){#answerMessage.final-response-visible{bottom:128px!important;width:88vw!important;padding:10px 14px!important;font-size:1.2rem!important;border-radius:18px!important}}
  `;
  document.head.appendChild(style);

  function respond(button,other,message){
    answer.textContent=message;
    answer.classList.remove('final-response-visible');
    void answer.offsetWidth;
    answer.classList.add('final-response-visible');
    button.classList.add('chosen');
    other.style.opacity='.45';
    if(button===yes){yes.textContent='Let’s find out ♡';yes.disabled=true}
    else hug.textContent='🫂 Take your time';
    if(window.burst)window.burst(button===yes?35:24,'♡');
  }

  document.addEventListener('click',function(e){
    const target=e.target.closest('#yesBtn,#hugBtn');
    if(!target)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(target===yes)respond(yes,hug,'Then maybe this is the beginning of something really special. ♡');
    else respond(hug,yes,'Of course. Take all the time you need. I’m just glad you know now. 🫂♡');
  },true);
})();
