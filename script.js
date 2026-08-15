const CONFIG = {
  name: 'Clara',
  nickname: 'Boss'
};

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     ELEMENTS
  ========================================================= */

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


  /* =========================================================
     MUSIC SYSTEM
  ========================================================= */

  let musicFadeTimer = null;
  let musicWasPlayingBeforeVideo = false;

  const MUSIC_VOLUME = 0.45;
  const FADE_DURATION = 1800;

  if (music) {
    music.volume = 0;
  }

  /*
    Update the ♫ button appearance.
  */

  function updateMusicButton(isPlaying) {

    if (!soundToggle) return;

    if (isPlaying) {

      soundToggle.classList.add('active');

      soundToggle.textContent = '♫';

      soundToggle.setAttribute(
        'aria-label',
        'Pause background music'
      );

      soundToggle.setAttribute(
        'title',
        'Pause music'
      );

    } else {

      soundToggle.classList.remove('active');

      soundToggle.textContent = '×';

      soundToggle.setAttribute(
        'aria-label',
        'Play background music'
      );

      soundToggle.setAttribute(
        'title',
        'Play music'
      );
    }
  }


  /*
    Smoothly fade music in.
  */

  function fadeMusicIn() {

    if (!music) return;

    clearInterval(musicFadeTimer);

    music.volume = 0;

    const steps = 30;
    const stepTime = FADE_DURATION / steps;
    const volumeStep = MUSIC_VOLUME / steps;

    let currentStep = 0;

    musicFadeTimer = setInterval(() => {

      currentStep++;

      music.volume = Math.min(
        MUSIC_VOLUME,
        volumeStep * currentStep
      );

      if (currentStep >= steps) {

        clearInterval(musicFadeTimer);

        music.volume = MUSIC_VOLUME;
      }

    }, stepTime);
  }


  /*
    Smoothly fade music out.
  */

  function fadeMusicOut(callback) {

    if (!music || music.paused) {

      if (callback) callback();

      return;
    }

    clearInterval(musicFadeTimer);

    const startVolume = music.volume;
    const steps = 20;
    const fadeDuration = 700;
    const stepTime = fadeDuration / steps;
    const volumeStep = startVolume / steps;

    let currentStep = 0;

    musicFadeTimer = setInterval(() => {

      currentStep++;

      music.volume = Math.max(
        0,
        startVolume - volumeStep * currentStep
      );

      if (currentStep >= steps) {

        clearInterval(musicFadeTimer);

        music.pause();

        music.volume = 0;

        if (callback) callback();
      }

    }, stepTime);
  }


  /*
    Start music.
  */

  async function startMusic() {

    if (!music) return false;

    try {

      clearInterval(musicFadeTimer);

      music.volume = 0;

      await music.play();

      fadeMusicIn();

      updateMusicButton(true);

      localStorage.setItem(
        'birthdayMusicEnabled',
        'true'
      );

      return true;

    } catch (error) {

      console.warn(
        'Music could not start:',
        error
      );

      updateMusicButton(false);

      return false;
    }
  }


  /*
    Stop music.
  */

  function stopMusic() {

    if (!music) return;

    fadeMusicOut(() => {

      updateMusicButton(false);

    });

    localStorage.setItem(
      'birthdayMusicEnabled',
      'false'
    );
  }


  /*
    Toggle music from the ♫ button.
  */

  soundToggle?.addEventListener(
    'click',
    async () => {

      if (!music) return;

      if (music.paused) {

        await startMusic();

      } else {

        stopMusic();
      }

    }
  );


  /*
    Update UI if audio is manually paused/played.
  */

  music?.addEventListener(
    'play',
    () => {

      updateMusicButton(true);

    }
  );

  music?.addEventListener(
    'pause',
    () => {

      updateMusicButton(false);

    }
  );

  music?.addEventListener(
    'ended',
    () => {

      updateMusicButton(false);

    }
  );


  /* =========================================================
     ENTER BUTTON
  ========================================================= */

  enterBtn?.addEventListener(
    'click',
    async () => {

      document
        .getElementById('story')
        ?.scrollIntoView({
          behavior: 'smooth'
        });

      burstHearts(10);

      /*
        This click counts as a user interaction,
        so browsers allow music to start here.
      */

      await startMusic();

    }
  );


  /* =========================================================
     CINEMATIC STAR FIELD
  ========================================================= */

  for (let i = 0; i < 130; i++) {

    const star = document.createElement('span');

    star.className = 'star';

    star.style.left =
      `${Math.random() * 100}%`;

    star.style.top =
      `${Math.random() * 100}%`;

    star.style.animationDelay =
      `${Math.random() * 4}s`;

    star.style.opacity =
      `${0.15 + Math.random() * 0.8}`;

    stars?.appendChild(star);
  }


  /* =========================================================
     FLOATING HEARTS / SPARKLES
  ========================================================= */

  function createHeart(symbol) {

    const heart =
      document.createElement('span');

    heart.className = 'heart';

    heart.textContent =
      symbol ||
      ['♡', '♥', '✦', '✧'][
        Math.floor(Math.random() * 4)
      ];

    heart.style.left =
      `${Math.random() * 100}%`;

    heart.style.bottom =
      '-30px';

    heart.style.animationDuration =
      `${5 + Math.random() * 4}s`;

    hearts?.appendChild(heart);

    setTimeout(
      () => heart.remove(),
      9000
    );
  }


  setInterval(
    () => createHeart(),
    1100
  );


  /* =========================================================
     SCROLL REVEALS
  ========================================================= */

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'visible'
              );

              observer.unobserve(
                entry.target
              );
            }

          }
        );

      },
      {
        threshold: 0.12
      }
    );


  document
    .querySelectorAll('.reveal')
    .forEach(
      el => observer.observe(el)
    );


  /* =========================================================
     ENVELOPE REVEAL
  ========================================================= */

  envelope?.addEventListener(
    'click',
    () => {

      const isOpen =
        envelope.classList.toggle(
          'open'
        );

      letter?.classList.toggle(
        'open',
        isOpen
      );

      letter?.setAttribute(
        'aria-hidden',
        String(!isOpen)
      );

      if (envelopeHint) {

        envelopeHint.textContent =
          isOpen
            ? '♡ From me to you.'
            : 'Tap the envelope.';
      }

      if (isOpen) {

        burstHearts(16);

        setTimeout(
          () => {

            letter?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });

          },
          450
        );
      }

    }
  );


  /* =========================================================
     VIDEO CONTROLS
  ========================================================= */

  videoPlay?.addEventListener(
    'click',
    async () => {

      try {

        await video?.play();

        videoOverlay?.classList.add(
          'hidden'
        );

      } catch {

        const note =
          videoOverlay?.querySelector(
            'small'
          );

        if (note) {

          note.textContent =
            'Add birthday-video.mp4 to the repository first.';
        }
      }

    }
  );


  /*
    When video STARTS:
    pause background music.
  */

  video?.addEventListener(
    'play',
    () => {

      /*
        Remember whether music was playing.
      */

      musicWasPlayingBeforeVideo =
        music
          ? !music.paused
          : false;

      /*
        Immediately fade music out.
      */

      if (
        music &&
        !music.paused
      ) {

        fadeMusicOut(
          () => {
            updateMusicButton(false);
          }
        );
      }

      videoOverlay?.classList.add(
        'hidden'
      );

    }
  );


  /*
    When video is PAUSED:
    resume music if it was playing before.
  */

  video?.addEventListener(
    'pause',
    async () => {

      if (
        !video.ended &&
        musicWasPlayingBeforeVideo
      ) {

        await startMusic();

      }

      if (
        !video.ended
      ) {

        videoOverlay?.classList.remove(
          'hidden'
        );
      }

    }
  );


  /*
    When video ENDS:
    resume music.
  */

  video?.addEventListener(
    'ended',
    async () => {

      videoOverlay?.classList.remove(
        'hidden'
      );

      if (
        musicWasPlayingBeforeVideo
      ) {

        await startMusic();

      }

      musicWasPlayingBeforeVideo =
        false;

    }
  );


  /*
    Video loading error.
  */

  video?.addEventListener(
    'error',
    () => {

      const note =
        videoOverlay?.querySelector(
          'small'
        );

      if (note) {

        note.textContent =
          'Add birthday-video.mp4 to the repository.';
      }

    }
  );


  /* =========================================================
     FINAL ANSWER BUTTONS
  ========================================================= */

  yesBtn?.addEventListener(
    'click',
    () => {

      answerMessage.textContent =
        'Okay… then I guess I officially have permission to keep falling for you. ♡';

      burstHearts(34);

      yesBtn.textContent =
        'Best. Answer. Ever. ♡';

      yesBtn.disabled = true;

    }
  );


  hugBtn?.addEventListener(
    'click',
    () => {

      answerMessage.textContent =
        'Come here then, Boss. 🫂♡ And no, I am NOT letting go first.';

      burstHearts(22);

    }
  );


  /* =========================================================
     FOOTER EASTER EGG
  ========================================================= */

  let clicks = 0;

  footer?.addEventListener(
    'click',
    () => {

      clicks++;

      if (clicks === 7) {

        answerMessage.textContent =
          'SECRET UNLOCKED: Boss has officially been declared my favourite person. ☁️♡';

        burstHearts(50);

        clicks = 0;
      }

    }
  );


  /* =========================================================
     HEART BURST
  ========================================================= */

  function burstHearts(count) {

    for (
      let i = 0;
      i < count;
      i++
    ) {

      setTimeout(
        () => createHeart(),
        i * 55
      );

    }

  }


  /* =========================================================
     INITIAL MUSIC STATE
  ========================================================= */

  updateMusicButton(false);

});
