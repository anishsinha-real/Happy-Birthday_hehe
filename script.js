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

  let musicWasPlayingBeforeVideo = false;
  let fadeTimer = null;

  const MUSIC_VOLUME = 0.45;
  const FADE_TIME = 1500;

  if (music) {
    music.volume = 0;
  }


  function updateMusicButton(playing) {

    if (!soundToggle) return;

    if (playing) {

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


  /* =========================================================
     FADE MUSIC IN
  ========================================================= */

  function fadeMusicIn() {

    if (!music) return;

    clearInterval(fadeTimer);

    music.volume = 0;

    const steps = 30;
    const interval = FADE_TIME / steps;
    const volumeStep = MUSIC_VOLUME / steps;

    let step = 0;

    fadeTimer = setInterval(() => {

      /*
        NEVER increase music while video is playing.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        clearInterval(fadeTimer);
        music.pause();
        music.volume = 0;

        updateMusicButton(false);

        return;
      }

      step++;

      music.volume = Math.min(
        MUSIC_VOLUME,
        step * volumeStep
      );

      if (step >= steps) {

        clearInterval(fadeTimer);

        music.volume = MUSIC_VOLUME;
      }

    }, interval);
  }


  /* =========================================================
     START MUSIC
  ========================================================= */

  async function startMusic() {

    if (!music) return false;

    /*
      NEVER start music while video is playing.
    */

    if (
      video &&
      !video.paused &&
      !video.ended
    ) {

      return false;
    }

    try {

      clearInterval(fadeTimer);

      music.volume = 0;

      await music.play();

      /*
        Check again after play().
        This protects against race conditions.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        music.pause();
        music.volume = 0;

        updateMusicButton(false);

        return false;
      }

      fadeMusicIn();

      updateMusicButton(true);

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


  /* =========================================================
     STOP MUSIC
  ========================================================= */

  function stopMusic() {

    if (!music) return;

    clearInterval(fadeTimer);

    music.pause();

    music.volume = 0;

    updateMusicButton(false);
  }


  /* =========================================================
     MUSIC BUTTON
  ========================================================= */

  soundToggle?.addEventListener(
    'click',
    async () => {

      if (!music) return;

      /*
        Don't allow music while video is playing.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        return;
      }

      if (music.paused) {

        await startMusic();

      } else {

        stopMusic();
      }

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
        User interaction allows the browser
        to start the music.
      */

      await startMusic();

    }
  );


  /* =========================================================
     VIDEO SYSTEM
  ========================================================= */


  /*
    VIDEO STARTS
    -----------------------------
    HARD STOP MUSIC IMMEDIATELY
  */

  video?.addEventListener(
    'play',
    () => {

      /*
        Remember whether music was playing
        BEFORE the video started.
      */

      musicWasPlayingBeforeVideo =
        music
          ? !music.paused
          : false;


      /*
        STOP MUSIC IMMEDIATELY.
      */

      if (music) {

        clearInterval(fadeTimer);

        music.pause();

        music.volume = 0;

        updateMusicButton(false);
      }


      /*
        Hide video overlay.
      */

      videoOverlay?.classList.add(
        'hidden'
      );

    }
  );


  /*
    VIDEO PAUSES
    -----------------------------
    Resume music only if it was
    playing before the video.
  */

  video?.addEventListener(
    'pause',
    async () => {

      /*
        Don't resume here if the video
        has actually finished.
      */

      if (
        !video.ended &&
        musicWasPlayingBeforeVideo
      ) {

        await startMusic();
      }


      if (!video.ended) {

        videoOverlay?.classList.remove(
          'hidden'
        );
      }

    }
  );


  /*
    VIDEO ENDS
    -----------------------------
    Resume music.
  */

  video?.addEventListener(
    'ended',
    async () => {

      videoOverlay?.classList.remove(
        'hidden'
      );


      if (musicWasPlayingBeforeVideo) {

        await startMusic();
      }


      musicWasPlayingBeforeVideo = false;

    }
  );


  /*
    VIDEO PLAY BUTTON
  */

  videoPlay?.addEventListener(
    'click',
    async () => {

      try {

        await video.play();

        videoOverlay?.classList.add(
          'hidden'
        );

      } catch (error) {

        console.warn(
          'Video could not start:',
          error
        );

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
    VIDEO ERROR
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
     CINEMATIC STAR FIELD
  ========================================================= */

  for (let i = 0; i < 130; i++) {

    const star =
      document.createElement('span');

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
     INITIAL STATE
  ========================================================= */

  updateMusicButton(false);

});
