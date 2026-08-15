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
    This remembers whether the music was playing immediately
    before the birthday video started.
  */

  let musicWasPlayingBeforeVideo = false;

  /*
    Prevents the autoplay fallback from running repeatedly.
  */

  let interactionHandled = false;


  /* =========================================================
     INITIAL MUSIC SETUP
  ========================================================= */

  if (music) {

    music.volume = 0;

    music.loop = true;

    /*
      Make sure the browser loads the file quickly.
    */

    music.preload = 'auto';

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
      isPlaying
        ? '♫'
        : '×';

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

    const stepTime =
      FADE_DURATION / steps;

    const volumeStep =
      MUSIC_VOLUME / steps;

    let step = 0;


    fadeTimer = setInterval(() => {

      /*
        VERY IMPORTANT:

        If the birthday video starts while
        music is fading in, immediately stop it.
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


      music.volume =
        Math.min(
          MUSIC_VOLUME,
          step * volumeStep
        );


      if (step >= steps) {

        clearInterval(fadeTimer);

        music.volume =
          MUSIC_VOLUME;

      }

    }, stepTime);

  }


  /* =========================================================
     START MUSIC
  ========================================================= */

  async function startMusic() {

    if (!music) {
      return false;
    }


    /*
      NEVER play background music while
      birthday video is playing.
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


      /*
        Always begin the fade from zero.
      */

      music.volume = 0;


      /*
        Ask browser to start music.
      */

      await music.play();


      /*
        Check again immediately.

        This protects against a race condition where
        the video starts at the same moment.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        stopMusic();

        return false;

      }


      /*
        Music successfully started.
      */

      updateMusicButton(true);


      /*
        Smooth fade in.
      */

      fadeMusicIn();


      return true;

    } catch (error) {

      /*
        Browser blocked audible autoplay.

        This is normal on Chrome/Safari/Edge when
        the visitor has not interacted with the page yet.
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
     AUTOPLAY ON PAGE LOAD
  ========================================================= */

  /*
    Try immediately.

    If the browser allows audible autoplay,
    music starts automatically.
  */

  startMusic();


  /* =========================================================
     AUTOPLAY FALLBACK
  ========================================================= */

  /*
    Modern browsers may block autoplay with sound.

    When that happens, the first real interaction
    with the website starts the music.

    This means:

      Click anywhere
          ↓
      Music starts

    OR

      Tap anywhere
          ↓
      Music starts

    OR

      Press a key
          ↓
      Music starts
  */

  async function unlockMusic() {

    if (interactionHandled) {
      return;
    }

    interactionHandled = true;


    /*
      Never start music over the birthday video.
    */

    if (
      video &&
      !video.paused &&
      !video.ended
    ) {

      return;

    }


    /*
      Only start music if it is currently paused.
    */

    if (
      music &&
      music.paused
    ) {

      await startMusic();

    }


    /*
      Remove listeners after first interaction.
    */

    document.removeEventListener(
      'pointerdown',
      unlockMusic
    );

    document.removeEventListener(
      'keydown',
      unlockMusic
    );

    document.removeEventListener(
      'touchstart',
      unlockMusic
    );

  }


  /*
    pointerdown works for mouse and touch.
  */

  document.addEventListener(
    'pointerdown',
    unlockMusic,
    {
      passive: true
    }
  );


  document.addEventListener(
    'touchstart',
    unlockMusic,
    {
      passive: true
    }
  );


  document.addEventListener(
    'keydown',
    unlockMusic
  );


  /* =========================================================
     ENTER BUTTON
  ========================================================= */

  enterBtn?.addEventListener(
    'click',
    async () => {

      /*
        The Enter button is a guaranteed user gesture.

        Therefore this is the most reliable place
        to start music if autoplay was blocked.
      */

      if (
        music &&
        music.paused &&
        (
          !video ||
          video.paused ||
          video.ended
        )
      ) {

        await startMusic();

      }


      /*
        Scroll to story section.
      */

      document
        .getElementById('story')
        ?.scrollIntoView({
          behavior: 'smooth'
        });


      /*
        Birthday animation.
      */

      burstHearts(10);

    }
  );


  /* =========================================================
     MUSIC TOGGLE BUTTON
  ========================================================= */

  soundToggle?.addEventListener(
    'click',
    async (event) => {

      /*
        Prevent the global interaction listener
        from interfering with this button.
      */

      event.preventDefault();

      event.stopPropagation();


      if (!music) {
        return;
      }


      /*
        Music is completely disabled while
        birthday video is playing.
      */

      if (
        video &&
        !video.paused &&
        !video.ended
      ) {

        return;

      }


      /*
        MUSIC PAUSED
        ↓
        PLAY
      */

      if (music.paused) {

        await startMusic();

      }


      /*
        MUSIC PLAYING
        ↓
        PAUSE
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
        Remember whether background music was
        playing BEFORE the video started.

        Example:

        Music playing
              ↓
        Video starts
              ↓
        remember = true
              ↓
        music stops
      */

      musicWasPlayingBeforeVideo =
        music
          ? !music.paused
          : false;


      /*
        HARD STOP.

        No fade.

        No delay.

        Music becomes completely silent
        immediately.
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
        If the video was manually paused
        and music was playing before it,
        resume the background music.
      */

      if (
        !video.ended &&
        musicWasPlayingBeforeVideo
      ) {

        await startMusic();

      }


      /*
        Show custom overlay again.
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

      /*
        Show overlay again.
      */

      videoOverlay?.classList.remove(
        'hidden'
      );


      /*
        Resume background music only if it
        was playing before the video.
      */

      if (
        musicWasPlayingBeforeVideo
      ) {

        await startMusic();

      }


      /*
        Reset state.
      */

      musicWasPlayingBeforeVideo =
        false;

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


      if (!video) {
        return;
      }


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

  for (
    let i = 0;
    i < 130;
    i++
  ) {

    const star =
      document.createElement(
        'span'
      );


    star.className =
      'star';


    star.style.left =
      `${Math.random() * 100}%`;


    star.style.top =
      `${Math.random() * 100}%`;


    star.style.animationDelay =
      `${Math.random() * 4}s`;


    star.style.opacity =
      `${0.15 + Math.random() * 0.8}`;


    stars?.appendChild(
      star
    );

  }


  /* =========================================================
     FLOATING HEARTS / SPARKLES
  ========================================================= */

  function createHeart(symbol) {

    const heart =
      document.createElement(
        'span'
      );


    heart.className =
      'heart';


    heart.textContent =
      symbol ||
      [
        '♡',
        '♥',
        '✦',
        '✧'
      ][
        Math.floor(
          Math.random() * 4
        )
      ];


    heart.style.left =
      `${Math.random() * 100}%`;


    heart.style.bottom =
      '-30px';


    heart.style.animationDuration =
      `${5 + Math.random() * 4}s`;


    hearts?.appendChild(
      heart
    );


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

            if (
              entry.isIntersecting
            ) {

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
      el =>
        observer.observe(el)
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

      if (!answerMessage) {
        return;
      }


      answerMessage.textContent =
        'Okay… then I guess I officially have permission to keep falling for you. ♡';


      burstHearts(34);


      yesBtn.textContent =
        'Best. Answer. Ever. ♡';


      yesBtn.disabled =
        true;

    }
  );


  /* =========================================================
     HUG BUTTON
  ========================================================= */

  hugBtn?.addEventListener(
    'click',
    () => {

      if (!answerMessage) {
        return;
      }


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
    Only show paused state if music really is paused.

    If autoplay succeeds, startMusic() has already
    changed the button to ♫.
  */

  if (
    music &&
    music.paused
  ) {

    updateMusicButton(false);

  }

});
