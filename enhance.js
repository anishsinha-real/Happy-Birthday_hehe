document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const glow = document.getElementById('cursorGlow');
  const progress = document.getElementById('progress');
  const sparkles = document.getElementById('sparkles');
  const hearts = document.getElementById('hearts');
  const stars = document.getElementById('stars');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = [...document.querySelectorAll('main > section[id]')];

  /* ---------- Scroll intelligence ---------- */
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${pct})`;
    body.style.setProperty('--scroll-y', `${window.scrollY}px`);

    let active = sections[0]?.id;
    const line = window.scrollY + window.innerHeight * 0.38;
    sections.forEach((section) => {
      if (section.offsetTop <= line) active = section.id;
    });
    document.querySelectorAll('.story-nav button').forEach((button) => {
      button.classList.toggle('active', button.dataset.target === active);
    });
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });

  /* ---------- Tiny cinematic navigation ---------- */
  if (sections.length > 1) {
    const nav = document.createElement('nav');
    nav.className = 'story-nav';
    nav.setAttribute('aria-label', 'Story navigation');
    sections.forEach((section, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.target = section.id;
      button.title = section.id;
      button.setAttribute('aria-label', `Go to chapter ${index + 1}`);
      button.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth' }));
      nav.appendChild(button);
    });
    body.appendChild(nav);
  }

  if (!reduceMotion) {
    /* ---------- Cursor light ---------- */
    window.addEventListener('pointermove', (event) => {
      if (!glow) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });

    /* ---------- 3D cards ---------- */
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(x * 100 + 50).toFixed(1)}%`);
        card.style.setProperty('--my', `${(y * 100 + 50).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });

    /* ---------- Magnetic controls ---------- */
    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.10}px, ${y * 0.10}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });

    /* ---------- Ambient sparkles ---------- */
    const sparkleSymbols = ['✦', '✧', '·', '⋆', '˚'];
    const makeSparkle = () => {
      if (!sparkles) return;
      const s = document.createElement('span');
      s.className = 'floating-sparkle';
      s.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
      s.style.left = `${Math.random() * 100}%`;
      s.style.bottom = '-20px';
      s.style.animationDuration = `${7 + Math.random() * 7}s`;
      s.style.fontSize = `${8 + Math.random() * 13}px`;
      sparkles.appendChild(s);
      setTimeout(() => s.remove(), 15000);
    };
    for (let i = 0; i < 22; i++) setTimeout(makeSparkle, i * 220);
    setInterval(makeSparkle, 850);

    window.addEventListener('scroll', () => {
      if (stars) stars.style.transform = `translate3d(0, ${window.scrollY * -0.035}px, 0)`;
    }, { passive: true });

    /* ---------- Click-to-sparkle anywhere ---------- */
    document.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button, a')) return;
      for (let i = 0; i < 7; i++) {
        const s = document.createElement('span');
        s.className = 'click-spark';
        s.textContent = ['✦', '✧', '♡'][Math.floor(Math.random() * 3)];
        s.style.left = `${event.clientX}px`;
        s.style.top = `${event.clientY}px`;
        s.style.setProperty('--x', `${(Math.random() - .5) * 110}px`);
        s.style.setProperty('--y', `${(Math.random() - .5) * 110}px`);
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 900);
      }
    });
  }

  /* ---------- Celebration burst ---------- */
  const burst = (count = 36) => {
    if (!hearts) return;
    const symbols = ['♡', '♥', '✦', '✧', '✨'];
    for (let i = 0; i < count; i++) {
      const item = document.createElement('span');
      item.className = 'burst-heart';
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.left = `${35 + Math.random() * 30}%`;
      item.style.top = `${48 + Math.random() * 12}%`;
      item.style.setProperty('--dx', `${(Math.random() - 0.5) * 520}px`);
      item.style.setProperty('--dy', `${-120 - Math.random() * 360}px`);
      item.style.setProperty('--rot', `${(Math.random() - 0.5) * 120}deg`);
      item.style.animationDelay = `${Math.random() * 180}ms`;
      hearts.appendChild(item);
      setTimeout(() => item.remove(), 1800);
    }
  };

  document.getElementById('yesBtn')?.addEventListener('click', () => burst(50));
  document.getElementById('hugBtn')?.addEventListener('click', () => burst(35));

  /* ---------- Hero depth ---------- */
  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--hero-x', `${x * 18}px`);
      hero.style.setProperty('--hero-y', `${y * 18}px`);
    });
  }
});
