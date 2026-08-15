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

  if (music) {
    music.volume = 0;
  }


  /* =========================================================
     MUSIC BUTTON STATE
  ========================================================= */

  function updateMusicButton(isPlaying) {

    if (!soundToggle) return;

    soundToggle.classList.toggle(
      'active',
      isPlaying
    );

    soundToggle.textContent =
      isPlaying ? '♫' : '×';

    soundToggle.setAttribute(
      'aria-label',
      isPlaying
        ? 'Pause background music'
        : 'Play background music'
    );

    soundToggle.setAttribute(
      'title',
      isPlaying
        ? 'Pause music'
        : 'Play music'
    );
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
    const stepTime = FADE_DURATION / steps;
    const volumeStep = MUSIC_VOLUME / steps;

    let step = 0;

    fadeTimer = setInterval(() => {

      /*
        NEVER allow background music to play
        while the birthday video is playing.
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

    }, stepTime);
  }


  /* =========================================================
     START MUSIC
  ========================================================= */

  async function startMusic() {

    if (!music) return false;

    /*
      Video always has priority.
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
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        stopMusic();

        return false;
      }

      updateMusicButton(true);

      fadeMusicIn();

      return true;

    } catch (error) {

      /*
        Chrome/Safari may block autoplay with sound.
      */

      console.warn(
        'Autoplay blocked by browser:',
        error
      );

      updateMusicButton(false);

      return false;
    }
  }


  /* =========================================================
     TRY AUTOPLAY ON PAGE LOAD
  ========================================================= */

  startMusic();


  /* =========================================================
     ENTER BUTTON
  ========================================================= */

  /*
    The Enter button is a real user interaction,
    so it is the most reliable autoplay fallback.
  */

  enterBtn?.addEventListener(
    'click',
    async () => {

      if (
        music &&
        music.paused &&
        (!video || video.paused || video.ended)
      ) {

        await startMusic();
      }

      document
        .getElementById('story')
        ?.scrollIntoView({
          behavior: 'smooth'
        });

      burstHearts(10);
    }
  );


  /* =========================================================
     MUSIC TOGGLE BUTTON
  ========================================================= */

  soundToggle?.addEventListener(
    'click',
    async (event) => {

      event.preventDefault();

      event.stopPropagation();

      if (!music) return;

      /*
        Do not allow music while video is playing.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        return;
      }

      /*
        Currently paused → play.
      */

      if (music.paused) {

        await startMusic();

      }

      /*
        Currently playing → pause.
      */

      else {

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
        Remember whether music was playing BEFORE
        the video started.
      */

      musicWasPlayingBeforeVideo =
        music
          ? !music.paused
          : false;


      /*
        HARD STOP.

        The music is completely paused before
        the video continues playing.
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
        If the video was manually paused,
        restore music only if it was playing
        before the video began.
      */

      if (
        !video.ended &&
        musicWasPlayingBeforeVideo
      ) {

        await startMusic();
      }


      /*
        Show overlay again.
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

      event.preventDefault();

      event.stopPropagation();

      if (!video) return;

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
     FINAL YES BUTTON
  ========================================================= */

  yesBtn?.addEventListener(
    'click',
    () => {

      if (!answerMessage) return;

      answerMessage.textContent =
        'Okay… then I guess I officially have permission to keep falling for you. ♡';

      burstHearts(34);

      yesBtn.textContent =
        'Best. Answer. Ever. ♡';

      yesBtn.disabled = true;
    }
  );


  /* =========================================================
     HUG BUTTON
  ========================================================= */

  hugBtn?.addEventListener(
    'click',
    () => {

      if (!answerMessage) return;

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

        if (answerMessage) {

          answerMessage.textContent =
            'SECRET UNLOCKED: Boss has officially been declared my favourite person. ☁️♡';
        }

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
     INITIAL MUSIC BUTTON STATE
  ========================================================= */

  /*
    Don't force the button to "paused" here.
    startMusic() controls the actual state.
  */

  if (music && music.paused) {
    updateMusicButton(false);
  }

});
