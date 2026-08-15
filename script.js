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
let autoplayAttempted = false;

const MUSIC_VOLUME = 0.45;
const FADE_TIME = 1800;

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
   FADE IN
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
      Never fade music in while the video is playing.
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
    Never start music while birthday video
    is currently playing.
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

    fadeMusicIn();

    updateMusicButton(true);

    return true;

  } catch (error) {

    console.log(
      'Autoplay blocked by browser.'
    );

    updateMusicButton(false);

    return false;
  }
}


/* =========================================================
   AUTOPLAY
========================================================= */

async function attemptAutoplay() {

  if (autoplayAttempted) return;

  autoplayAttempted = true;

  await startMusic();
}


/*
  Try immediately when page loads.
*/

attemptAutoplay();


/* =========================================================
   FIRST USER INTERACTION FALLBACK
========================================================= */

/*
  If Chrome blocks autoplay, the first click
  anywhere on the page starts the music.
*/

const startMusicOnInteraction = async () => {

  if (
    music &&
    music.paused &&
    (!video || video.paused || video.ended)
  ) {

    await startMusic();
  }

  document.removeEventListener(
    'click',
    startMusicOnInteraction
  );

  document.removeEventListener(
    'touchstart',
    startMusicOnInteraction
  );

  document.removeEventListener(
    'keydown',
    startMusicOnInteraction
  );
};


document.addEventListener(
  'click',
  startMusicOnInteraction
);

document.addEventListener(
  'touchstart',
  startMusicOnInteraction
);

document.addEventListener(
  'keydown',
  startMusicOnInteraction
);


/* =========================================================
   MUSIC BUTTON
========================================================= */

soundToggle?.addEventListener(
  'click',
  async (event) => {

    /*
      Prevent the global first-interaction
      handler from doing anything else.
    */

    event.stopPropagation();

    if (!music) return;

    /*
      Don't allow music during video.
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

      clearInterval(fadeTimer);

      music.pause();

      music.volume = 0;

      updateMusicButton(false);
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
      Remember whether music was playing.
    */

    musicWasPlayingBeforeVideo =
      music
        ? !music.paused
        : false;


    /*
      HARD STOP MUSIC.
    */

    if (music) {

      clearInterval(fadeTimer);

      music.pause();

      music.volume = 0;

      updateMusicButton(false);
    }

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


/* =========================================================
   VIDEO END
========================================================= */

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
