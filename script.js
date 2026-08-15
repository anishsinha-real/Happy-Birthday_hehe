// ===== PERSONALIZATION =====
// Change this to the person's name!
const PERSON_NAME = "Clara";
// ============================

// Set the person's name
document.getElementById("personName").textContent = PERSON_NAME;

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
const envelope = document.getElementById('envelope');
const envelopeBtn = document.getElementById('envelopeBtn');
let envelopeOpened = false;

envelopeBtn.addEventListener('click', () => {
  if (!envelopeOpened) {
    envelope.classList.add('opened');
    envelopeOpened = true;
    envelopeBtn.textContent = '💌 Opened! 💌';
    envelopeBtn.style.opacity = '0.6';
    envelopeBtn.style.pointerEvents = 'none';
    
    // Confetti on envelope open
    createConfetti();
    
    // Scroll down after delay
    setTimeout(() => {
      document.querySelector('.memories-section').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }
});

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

// ===== QUIZ FUNCTIONALITY =====
const quizQuestions = document.querySelectorAll('.quiz-question');
let currentQuestion = 0;
let correctAnswers = 0;

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('progressText').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
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
        // Quiz complete - scroll to proposal
        document.getElementById('nextBtn').style.display = 'block';
        document.getElementById('nextBtn').textContent = 'Ready? Let\'s continue! →';
      }
    }, 500);
  });
});

document.getElementById('nextBtn').addEventListener('click', () => {
  document.querySelector('.quiz-section').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.querySelector('.proposal-section').scrollIntoView({ behavior: 'smooth' });
  }, 800);
});

updateProgress();

// ===== PROPOSAL BUTTONS =====
document.getElementById('yesBtn').addEventListener('click', () => {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show success section
  document.getElementById('successSection').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Create confetti explosion
  for (let i = 0; i < 3; i++) {
    setTimeout(createConfetti, i * 200);
  }
});

document.getElementById('thinkBtn').addEventListener('click', () => {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show thinking section
  document.getElementById('thinkingSection').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Create gentle floating emojis instead
  for (let i = 0; i < 5; i++) {
    setTimeout(createFloatingEmoji, i * 200);
  }
});

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

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  
  // Welcome animation
  createFloatingEmoji();
  setTimeout(() => createFloatingEmoji(), 300);
  setTimeout(() => createFloatingEmoji(), 600);
});

// Make sure page starts at top
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Add some initial animations
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
