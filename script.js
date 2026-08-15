const CONFIG = { name: 'Clara', nickname: 'Boss' };

document.addEventListener('DOMContentLoaded', () => {
  const stars = document.getElementById('stars');
  const hearts = document.getElementById('hearts');
  const enterBtn = document.getElementById('enterBtn');
  const envelope = document.getElementById('envelope');
  const letter = document.getElementById('letterContent');
  const envelopeHint = document.getElementById('envelopeHint');
  const video = document.getElementById('birthdayVideo');
  const videoOverlay = document.getElementById('videoOverlay');
  const videoPlay = document.getElementById('videoPlay');
  const soundToggle = document.getElementById('soundToggle');
  const music = document.getElementById('bgMusic');
  const yesBtn = document.getElementById('yesBtn');
  const hugBtn = document.getElementById('hugBtn');
  const answerMessage = document.getElementById('answerMessage');
  const footer = document.getElementById('footer');

  // Cinematic star field
  for (let i = 0; i < 130; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.opacity = `${0.15 + Math.random() * 0.8}`;
    stars?.appendChild(star);
  }

  // Floating hearts / sparkles
  function createHeart(symbol) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = symbol || ['♡', '♥', '✦', '✧'][Math.floor(Math.random() * 4)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = '-30px';
    heart.style.animationDuration = `${5 + Math.random() * 4}s`;
    hearts?.appendChild(heart);
    setTimeout(() => heart.remove(), 9000);
  }
  setInterval(() => createHeart(), 1100);

  // Scroll reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  enterBtn?.addEventListener('click', () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
    burstHearts(10);
  });

  // Envelope reveal
  envelope?.addEventListener('click', () => {
    const isOpen = envelope.classList.toggle('open');
    letter?.classList.toggle('open', isOpen);
    letter?.setAttribute('aria-hidden', String(!isOpen));
    if (envelopeHint) envelopeHint.textContent = isOpen ? '♡ From me to you.' : 'Tap the envelope.';
    if (isOpen) {
      burstHearts(16);
      setTimeout(() => letter?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
    }
  });

  // Video controls
  videoPlay?.addEventListener('click', () => {
    video?.play().then(() => videoOverlay?.classList.add('hidden')).catch(() => {
      const note = videoOverlay?.querySelector('small');
      if (note) note.textContent = 'Add birthday-video.mp4 to the repository first.';
    });
  });
  video?.addEventListener('play', () => videoOverlay?.classList.add('hidden'));
  video?.addEventListener('pause', () => { if (!video.ended) videoOverlay?.classList.remove('hidden'); });
  video?.addEventListener('error', () => {
    const note = videoOverlay?.querySelector('small');
    if (note) note.textContent = 'Add birthday-video.mp4 to the repository.';
  });

  // Music toggle
  soundToggle?.addEventListener('click', async () => {
    try {
      if (music.paused) {
        await music.play();
        soundToggle.classList.add('active');
        soundToggle.textContent = '♫';
      } else {
        music.pause();
        soundToggle.classList.remove('active');
        soundToggle.textContent = '×';
      }
    } catch {
      soundToggle.textContent = '♪';
    }
  });

  // Final answer — make the ending feel like a payoff.
  yesBtn?.addEventListener('click', () => {
    answerMessage.textContent = 'Okay… then I guess I officially have permission to keep falling for you. ♡';
    burstHearts(34);
    yesBtn.textContent = 'Best. Answer. Ever. ♡';
    yesBtn.disabled = true;
  });

  hugBtn?.addEventListener('click', () => {
    answerMessage.textContent = 'Come here then, Boss. 🫂♡ And no, I am NOT letting go first.';
    burstHearts(22);
  });

  // Tiny hidden Easter egg: click the footer 7 times.
  let clicks = 0;
  footer?.addEventListener('click', () => {
    clicks++;
    if (clicks === 7) {
      answerMessage.textContent = 'SECRET UNLOCKED: Boss has officially been declared my favourite person. ☁️♡';
      burstHearts(50);
      clicks = 0;
    }
  });

  function burstHearts(count) {
    for (let i = 0; i < count; i++) setTimeout(() => createHeart(), i * 55);
  }
});
