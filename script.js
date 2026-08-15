// ===== PERSONALIZATION =====
// Change this to the person's name!
const PERSON_NAME = "Clara";
// ============================

// Wait for DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  // Set the person's name
  const personNameElement = document.getElementById("personName");
  if (personNameElement) {
    personNameElement.textContent = PERSON_NAME;
  }
});

// ===== FLOATING EMOJIS =====
const emojis = ['💕', '🌟', '✨', '💜', '🎉', '💝', '🌸', '💖'];

function createFloatingEmoji() {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const floatingEmoji = document.createElement('div');
  floatingEmoji.className = 'floating-emoji';
  floatingEmoji.textContent = emoji;
  floatingEmoji.style.left = Math.random() * window.innerWidth + 'px';
  floatingEmoji.style.top = window.innerHeight + 'px';
  
  document.getElementById('floatingEmojis').appendChild(floatingEmoji);
  
  setTimeout(() => floatingEmoji.remove(), 4000);
}

// Create floating emojis occasionally
setInterval(createFloatingEmoji, 800);

// ===== ENVELOPE INTERACTION =====
function setupEnvelope() {
  const envelope = document.getElementById('envelope');
  const envelopeBtn = document.getElementById('envelopeBtn');
  let envelopeOpened = false;

  if (envelopeBtn && envelope) {
    envelopeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (!envelopeOpened) {
        envelope.classList.add('opened');
        envelopeOpened = true;
        envelopeBtn.textContent = '💌 Opened! 💌';
        envelopeBtn.style.opacity = '0.6';
        envelopeBtn.style.pointerEvents = 'none';
        
        // Confetti on envelope open
        createConfetti();
        
        // Start typing animation for letter lines
        const letterLines = document.querySelectorAll('.letter-line');
        letterLines.forEach((line, index) => {
          setTimeout(() => {
            typeWriter(line, null, 30);
          }, index * 800);
        });
        
        // Scroll down after delay
        setTimeout(() => {
          const memoriesSection = document.querySelector('.memories-section');
          if (memoriesSection) {
            memoriesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 2500);
      }
    });
  }
}

// Call setup when DOM is ready
document.addEventListener('DOMContentLoaded', setupEnvelope);

// ===== TYPING ANIMATION WITH CURSOR =====
function typeWriter(element, text = null, speed = 50) {
  const textToType = text || element.textContent;
  element.textContent = '';
  element.style.visibility = 'visible';
  let index = 0;
  
  function type() {
    if (index < textToType.length) {
      element.textContent += textToType.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Add typing animation to proposal section
function typeProposalText() {
  const proposalText = document.querySelector('.proposal-text');
  if (proposalText) {
    typeWriter(proposalText, null, 40);
  }
}

// ===== CONFETTI EFFECT =====
function createConfetti() {
  const confettiContainer = document.querySelector('.confetti-burst');
  const colors = ['#ff1493', '#00bfff', '#ffd700', '#ff69b4', '#00ff7f'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.background = color;
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '50%';
    confetti.style.left = (50 + Math.random() * 100 - 50) + '%';
    
    const delay = Math.random() * 0.1;
    confetti.style.animationDelay = delay + 's';
    
    const duration = 2 + Math.random() * 1;
    confetti.style.animationDuration = duration + 's';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), (duration + delay) * 1000);
  }
}

// ===== VIDEO FUNCTIONALITY =====
function setupVideo() {
  const videoElement = document.getElementById('userVideo');
  const videoPlaceholder = document.getElementById('videoPlaceholder');
  const videoWrapper = document.getElementById('videoWrapper');

  if (videoElement && videoPlaceholder) {
    videoElement.addEventListener('loadstart', () => {
      videoPlaceholder.style.display = 'none';
    });
    
    videoElement.addEventListener('error', () => {
      videoPlaceholder.innerHTML = '<p style="color: white; padding: 20px;">Video failed to load. Make sure the video file is in the same folder as your HTML file.</p>';
    });
    
    // Click to play on placeholder
    videoPlaceholder.addEventListener('click', () => {
      videoElement.play();
    });
    
    // Hide placeholder when playing
    videoElement.addEventListener('play', () => {
      videoPlaceholder.style.display = 'none';
    });
    
    // Scroll to quiz when video ends
    videoElement.addEventListener('ended', () => {
      setTimeout(() => {
        const quizSection = document.querySelector('.quiz-section');
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    });
  }
}

// Call setup when DOM is ready
document.addEventListener('DOMContentLoaded', setupVideo);

// ===== QUIZ FUNCTIONALITY =====
function setupQuiz() {
  const quizQuestions = document.querySelectorAll('.quiz-question');
  let currentQuestion = 0;
  let correctAnswers = 0;

  function updateProgress() {
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressText) progressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  }

  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
      // Disable all options in this question
      this.parentElement.querySelectorAll('.quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.5';
      });
      
      // Highlight the selected answer
      this.style.opacity = '1';
      this.style.borderColor = '#ff1493';
      this.style.background = '#fff0f5';
      
      // Move to next question or show button
      setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          quizQuestions[currentQuestion].style.display = 'none';
          currentQuestion++;
          quizQuestions[currentQuestion].style.display = 'block';
          updateProgress();
        } else {
          // Quiz complete - show button
          const nextBtn = document.getElementById('nextBtn');
          if (nextBtn) {
            nextBtn.style.display = 'block';
            nextBtn.textContent = 'Ready? Let\'s continue! →';
          }
        }
      }, 500);
    });
  });

  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const quizSection = document.querySelector('.quiz-section');
      const proposalSection = document.querySelector('.proposal-section');
      if (quizSection) quizSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (proposalSection) proposalSection.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    });
  }

  updateProgress();
}

// Call setup when DOM is ready
document.addEventListener('DOMContentLoaded', setupQuiz);

// ===== PROPOSAL BUTTONS =====
function setupProposal() {
  const yesBtn = document.getElementById('yesBtn');
  const thinkBtn = document.getElementById('thinkBtn');

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      // Hide all sections
      document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
      });
      
      // Show success section
      const successSection = document.getElementById('successSection');
      if (successSection) {
        successSection.style.display = 'block';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Create confetti explosion
      for (let i = 0; i < 3; i++) {
        setTimeout(createConfetti, i * 200);
      }
    });
  }

  if (thinkBtn) {
    thinkBtn.addEventListener('click', () => {
      // Hide all sections
      document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
      });
      
      // Show thinking section
      const thinkingSection = document.getElementById('thinkingSection');
      if (thinkingSection) {
        thinkingSection.style.display = 'block';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Create gentle floating emojis instead
      for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingEmoji, i * 200);
      }
    });
  }
}

// Call setup when DOM is ready
document.addEventListener('DOMContentLoaded', setupProposal);

// ===== SMOOTH SCROLL BEHAVIOR =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== PAGE LOAD ANIMATION WITH TYPING =====
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  
  // Welcome animation
  createFloatingEmoji();
  setTimeout(() => createFloatingEmoji(), 300);
  setTimeout(() => createFloatingEmoji(), 600);
  
  // Start typing animations for main text
  const headerTitle = document.querySelector('.title');
  const headerSubtitle = document.querySelector('.subtitle');
  const welcomeText = document.querySelectorAll('.section-text');
  
  if (headerTitle) {
    const titleText = headerTitle.textContent;
    headerTitle.textContent = '';
    typeWriter(headerTitle, titleText, 30);
  }
  
  if (headerSubtitle) {
    setTimeout(() => {
      const subtitleText = headerSubtitle.textContent;
      headerSubtitle.textContent = '';
      typeWriter(headerSubtitle, subtitleText, 40);
    }, titleText ? titleText.length * 30 : 500);
  }
});

// Make sure page starts at top
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Add typing animations when sections come into view
document.addEventListener('DOMContentLoaded', () => {
  // Animate section titles on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Add typing animation to proposal text when it comes into view
        if (entry.target.classList.contains('proposal-section')) {
          const proposalTexts = entry.target.querySelectorAll('.proposal-text');
          proposalTexts.forEach((text, index) => {
            setTimeout(() => {
              typeWriter(text, null, 30);
            }, index * 500);
          });
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
  });
});
