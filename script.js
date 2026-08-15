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
  const FADE_DURATION = 1800;

  /*
    Start completely silent.
  */

  if (music) {
    music.volume = 0;
  }


  /* =========================================================
     MUSIC BUTTON STATE
  ========================================================= */

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
     FADE MUSIC IN
  ========================================================= */

  function fadeMusicIn() {

    if (!music) return;

    clearInterval(fadeTimer);

    music.volume = 0;

    const steps = 36;
    const interval = FADE_DURATION / steps;
    const volumeStep = MUSIC_VOLUME / steps;

    let step = 0;

    fadeTimer = setInterval(() => {

      /*
        If birthday video is playing,
        immediately kill the music.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        stopMusic();

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
      NEVER play music over the birthday video.
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
        Browser may resolve play(), but the video
        could have started during that moment.
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

      /*
        Browser autoplay policy blocked it.
      */

      console.log(
        'Autoplay blocked. Waiting for user interaction.'
      );

      updateMusicButton(false);

      return false;
    }
  }


  /* =========================================================
     AUTOPLAY
  ========================================================= */

  /*
    Try immediately.
  */

  startMusic();


  /* =========================================================
     AUTOPLAY FALLBACK
  ========================================================= */

  /*
    Chrome/Safari may block autoplay with sound.

    If that happens, the FIRST interaction anywhere
    on the page starts the music.
  */

  let interactionUsed = false;

  async function firstInteraction() {

    if (interactionUsed) return;

    interactionUsed = true;

    /*
      Don't start music if video is already playing.
    */

    if (
      video &&
      !video.paused &&
      !video.ended
    ) {

      return;
    }

    /*
      Only start if music isn't already playing.
    */

    if (music && music.paused) {

      await startMusic();
    }

    document.removeEventListener(
      'click',
      firstInteraction
    );

    document.removeEventListener(
      'touchstart',
      firstInteraction
    );

    document.removeEventListener(
      'keydown',
      firstInteraction
    );
  }


  document.addEventListener(
    'click',
    firstInteraction
  );

  document.addEventListener(
    'touchstart',
    firstInteraction
  );

  document.addEventListener(
    'keydown',
    firstInteraction
  );


  /* =========================================================
     MUSIC BUTTON
  ========================================================= */

  soundToggle?.addEventListener(
    'click',
    async (event) => {

      /*
        Prevent the global click handler
        from interfering with the button.
      */

      event.stopPropagation();

      if (!music) return;


      /*
        Music is forbidden while video plays.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        return;
      }


      /*
        If music is currently paused,
        start it.
      */

      if (music.paused) {

        await startMusic();

      } else {

        stopMusic();
      }

    }
  );


  /* =========================================================
     VIDEO START
  ========================================================= */

  video?.addEventListener(
    'play',
    () => {

      /*
        Remember whether music was playing
        before video started.
      */

      musicWasPlayingBeforeVideo =
        music
          ? !music.paused
          : false;


      /*
        HARD STOP.

        No fade.
        No delay.
        No waiting.

        Video always wins.
      */

      stopMusic();


      /*
        Hide custom video overlay.
      */

      videoOverlay?.classList.add(
        'hidden'
      );

    }
  );


  /* =========================================================
     VIDEO PAUSE
  ========================================================= */

  video?.addEventListener(
    'pause',
    async () => {

      /*
        Don't resume music if video finished.
      */

      if (
        !video.ended &&
        musicWasPlayingBeforeVideo
      ) {

        await startMusic();
      }


      /*
        Show video overlay again.
      */

      if (!video.ended) {

        videoOverlay?.classList.remove(
          'hidden'
        );
      }

    }
  );


  /* =========================================================
     VIDEO ENDED
  ========================================================= */

  video?.addEventListener(
    'ended',
    async () => {

      videoOverlay?.classList.remove(
        'hidden'
      );


      /*
        Resume music if it was playing
        before the video.
      */

      if (musicWasPlayingBeforeVideo) {

        await startMusic();
      }


      musicWasPlayingBeforeVideo = false;

    }
  );


  /* =========================================================
     VIDEO PLAY BUTTON
  ========================================================= */

  videoPlay?.addEventListener(
    'click',
    async (event) => {

      event.stopPropagation();

      try {

        await video.play();

        videoOverlay?.classList.add(
          'hidden'
        );

      } catch (error) {

        console.error(
          'Video playback failed:',
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


  /* =========================================================
     VIDEO ERROR
  ========================================================= */

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
     INITIAL BUTTON STATE
  ========================================================= */

  /*
    Do NOT call updateMusicButton(false) here.

    startMusic() already handles the correct state.
  */

});
