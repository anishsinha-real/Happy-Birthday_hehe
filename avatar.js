(() => {
  const hero = document.querySelector('.hero-inner');
  if (!hero || document.querySelector('.code-avatar')) return;
  const avatar = document.createElement('img');
  avatar.className = 'code-avatar';
  avatar.src = 'images/my-avatar.svg';
  avatar.alt = 'A cute chibi avatar representing me';
  avatar.setAttribute('aria-hidden', 'true');
  hero.insertBefore(avatar, hero.firstChild);
  const style = document.createElement('style');
  style.textContent = `
    .code-avatar{position:relative;z-index:3;display:block;width:min(170px,34vw);height:auto;margin:0 auto 8px;filter:drop-shadow(0 18px 35px #0008);animation:avatarFloat 4s ease-in-out infinite;transform-origin:50% 90%;pointer-events:none}
    @keyframes avatarFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}}
    .hero-inner .hero-title{position:relative;z-index:4}
    @media(max-width:700px){.code-avatar{width:min(125px,30vw);margin-bottom:4px}.hero-inner{padding-top:10vh!important}}
  `;
  document.head.appendChild(style);
})();