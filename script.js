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
     MUSIC CONFIG
  ========================================================= */

  const MUSIC_VOLUME = 0.45;
  const FADE_DURATION = 1800;

  let fadeTimer = null;

  /*
    True only when the music was actually playing
    immediately before the birthday video started.
  */
  let musicWasPlayingBeforeVideo = false;

  /*
    If the visitor manually pauses the music,
    we don't automatically restart it.
  */
  let musicManuallyPaused = false;


  /* =========================================================
     INITIAL MUSIC SETUP
  ========================================================= */

  if (music) {

    music.volume = 0;

    /*
      Make sure the browser knows this is
      background music rather than media that
      needs to be displayed.
    */
    music.loop = true;

    /*
      Start loading the MP3 immediately.
    */
    music.load();
  }


  /* =========================================================
     MUSIC BUTTON
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
    const stepTime = FADE_DURATION / steps;
    const volumeStep = MUSIC_VOLUME / steps;

    let step = 0;

    fadeTimer = setInterval(() => {

      /*
        Birthday video always has priority.
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

  async function startMusic(options = {}) {

    if (!music) return false;

    /*
      Don't play music over the birthday video.
    */

    if (
      video &&
      !video.paused &&
      !video.ended
    ) {

      return false;
    }

    /*
      If this is an automatic attempt and the user
      manually paused the music, don't restart it.
    */
    if (
      options.automatic &&
      musicManuallyPaused
    ) {

      return false;
    }

    try {

      clearInterval(fadeTimer);

      /*
        Start silent so the music fades in.
      */
      music.volume = 0;

      await music.play();

      /*
        Check again immediately after play().
        The video could have started during the
        play request.
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
        Browser blocked autoplay.
        This is normal on many browsers when
        there has been no user interaction.
      */

      console.warn(
        'Background music autoplay was blocked:',
        error
      );

      updateMusicButton(false);

      return false;
    }
  }


  /* =========================================================
     AUTOPLAY ATTEMPT
  ========================================================= */

  /*
    FIRST ATTEMPT:
    Try to start music immediately when the page loads.

    If the browser allows autoplay with sound,
    music starts automatically.
  */

  startMusic({
    automatic: true
  });


  /* =========================================================
     AUTOPLAY FALLBACK
  ========================================================= */

  /*
    IMPORTANT:

    Modern browsers can block audio autoplay.

    The Enter button is already part of your website's
    normal flow, so we use that click to unlock audio.

    The visitor does NOT need to click the music button.
  */

  let userHasInteracted = false;

  async function unlockMusic() {

    if (userHasInteracted) return;

    userHasInteracted = true;

    /*
      If the user hasn't manually paused music,
      start it.
    */

    if (
      music &&
      music.paused &&
      !musicManuallyPaused
    ) {

      await startMusic({
        automatic: false
      });
    }
  }


  /* =========================================================
     ENTER BUTTON
  ========================================================= */

  enterBtn?.addEventListener(
    'click',
    async () => {

      /*
        THIS is the important part.

        The Enter button click counts as a legitimate
        user gesture, allowing the browser to start
        music with sound.
      */

      await unlockMusic();

      document
        .getElementById('story')
        ?.scrollIntoView({
          behavior: 'smooth'
        });

      burstHearts(10);
    }
  );


  /* =========================================================
     GENERAL USER INTERACTION FALLBACK
  ========================================================= */

  /*
    If the visitor interacts somewhere else before
    pressing Enter, this can also unlock the music.

    We do NOT attach this to the music button.
  */

  async function handleFirstInteraction(event) {

    /*
      Don't interfere with the music button.
      Its own handler controls music.
    */

    if (
      event.target === soundToggle ||
      soundToggle?.contains(event.target)
    ) {

      return;
    }

    if (userHasInteracted) return;

    userHasInteracted = true;

    if (
      music &&
      music.paused &&
      !musicManuallyPaused
    ) {

      await startMusic({
        automatic: false
      });
    }

    document.removeEventListener(
      'pointerdown',
      handleFirstInteraction
    );
  }


  document.addEventListener(
    'pointerdown',
    handleFirstInteraction,
    {
      passive: true
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
        NEVER allow music while the birthday
        video is playing.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        return;
      }


      /*
        MUSIC IS CURRENTLY PLAYING
        -------------------------
        Pause it.
      */

      if (!music.paused) {

        musicManuallyPaused = true;

        stopMusic();

        return;
      }


      /*
        MUSIC IS CURRENTLY PAUSED
        ------------------------
        Play it.
      */

      musicManuallyPaused = false;

      await startMusic({
        automatic: false
      });

    }
  );


  /* =========================================================
     VIDEO START
  ========================================================= */

  video?.addEventListener(
    'play',
    () => {

      /*
        IMPORTANT:

        Check the music state BEFORE stopping it.
      */

      musicWasPlayingBeforeVideo =
        music
          ? !music.paused
          : false;


      /*
        HARD STOP.

        No fading.
        No delay.
        No music underneath the video.
      */

      stopMusic();


      /*
        Hide custom overlay.
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
        If the video was manually paused and
        music was playing before the video started,
        resume the music.
      */

      if (
        !video.ended &&
        musicWasPlayingBeforeVideo &&
        !musicManuallyPaused
      ) {

        await startMusic({
          automatic: false
        });
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
        Resume music after the birthday video,
        but only if it was playing before the video.
      */

      if (
        musicWasPlayingBeforeVideo &&
        !musicManuallyPaused
      ) {

        await startMusic({
          automatic: false
        });
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
          videoOverlay?.querySelector('small');

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
        videoOverlay?.querySelector('small');

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
     YES BUTTON
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
     INITIAL MUSIC STATE
  ========================================================= */

  /*
    If autoplay was permitted, the music button
    will already show ♫.

    If the browser blocked autoplay, the button
    remains × until a normal page interaction
    unlocks audio.

    The visitor never needs to click the music
    button specifically.
  */

  updateMusicButton(
    music
      ? !music.paused
      : false
  );

});
