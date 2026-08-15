const CONFIG = {
  name: 'Clara',
  nickname: 'Boss'
};

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

  // Stars
  for (let i = 0; i < 110; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.opacity = `${0.2 + Math.random() * 0.7}`;
    stars.appendChild(star);
  }

  // Floating hearts
  function createHeart() {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = ['♡', '♥', '✦'][Math.floor(Math.random() * 3)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = '-30px';
    heart.style.animationDuration = `${5 + Math.random() * 4}s`;
    hearts.appendChild(heart);
    setTimeout(() => heart.remove(), 9000);
  }
  setInterval(createHeart, 1100);

  // Reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Enter experience
  enterBtn?.addEventListener('click', () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
    burstHearts(8);
  });

  // Envelope
  envelope?.addEventListener('click', () => {
    const isOpen = envelope.classList.toggle('open');
    letter.classList.toggle('open', isOpen);
    letter.setAttribute('aria-hidden', String(!isOpen));
    envelopeHint.textContent = isOpen ? '♡ From me to you.' : 'Tap the envelope.';
    if (isOpen) {
      burstHearts(14);
      setTimeout(() => letter.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
    }
  });

  // Video
  videoPlay?.addEventListener('click', () => {
    video.play().then(() => videoOverlay.classList.add('hidden')).catch(() => {
      videoOverlay.querySelector('small').textContent = 'Add birthday-video.mp4 to the repository first.';
    });
  });
  video?.addEventListener('play', () => videoOverlay.classList.add('hidden'));
  video?.addEventListener('pause', () => {
    if (!video.ended) videoOverlay.classList.remove('hidden');
  });
  video?.addEventListener('error', () => {
    videoOverlay.querySelector('small').textContent = 'Add birthday-video.mp4 to the repository.';
  });

  // Optional background music. Browsers require a user gesture.
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

  // Final answer interactions
  yesBtn?.addEventListener('click', () => {
    answerMessage.textContent = 'Okay… now you officially owe me another Sky adventure. ♡';
    burstHearts(28);
    yesBtn.textContent = 'Best answer ever ♡';
  });

  hugBtn?.addEventListener('click', () => {
    answerMessage.textContent = 'Come here then, Boss. 🫂♡';
    burstHearts(18);
  });

  function burstHearts(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(createHeart, i * 70);
    }
  }
});
