// ====== PERSONALIZE THESE ======
const HER_NAME = "Her Name";
// ================================

document.getElementById("heroName").textContent = HER_NAME + ".";
document.getElementById("navName").textContent = HER_NAME.toLowerCase();

const progress = document.querySelector(".progress span");
const sectionNo = document.getElementById("sectionNo");
const sections = [...document.querySelectorAll("[data-section]")];

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${(scrollY / max) * 100}%`;

  let current = "01";
  sections.forEach(section => {
    if (scrollY + innerHeight * .45 >= section.offsetTop) current = section.dataset.section;
  });
  sectionNo.textContent = current;
}, {passive:true});

// ===== ENVELOPE OPENING ANIMATION =====
const envelope = document.getElementById("envelope");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");
let envelopeOpened = false;

openEnvelopeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!envelopeOpened) {
    envelope.classList.add("opened");
    envelopeOpened = true;
    
    // Create sparkles
    createSparkles(envelope);
    
    // Play sound effect (optional - remove if no sound file)
    playSound();
    
    // Scroll to next section after animation
    setTimeout(() => {
      document.querySelector("#words")?.scrollIntoView({behavior:"smooth"});
    }, 1200);
  }
});

// Sparkle effect around envelope
function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  for(let i = 0; i < 20; i++) {
    const sparkle = document.createElement("div");
    sparkle.style.position = "fixed";
    sparkle.style.left = rect.left + rect.width/2 + "px";
    sparkle.style.top = rect.top + rect.height/2 + "px";
    sparkle.style.width = "8px";
    sparkle.style.height = "8px";
    sparkle.style.borderRadius = "50%";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "999";
    
    const colors = ["#ff006e", "#00d9ff", "#ffbe0b"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.background = color;
    sparkle.style.boxShadow = `0 0 12px ${color}`;
    
    document.body.appendChild(sparkle);
    
    const angle = (i / 20) * Math.PI * 2;
    const distance = 100 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    sparkle.animate([
      {transform: "translate(0,0) scale(1)", opacity: 1},
      {transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0}
    ], {duration: 900, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"});
    
    setTimeout(() => sparkle.remove(), 900);
  }
}

// Optional sound effect - remove this if you don't want sound
function playSound() {
  // Creates a simple beep sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch(e) {
    // Audio context not available, silently fail
  }
}

// ===== SCROLL BUTTONS =====
document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if(target) target.scrollIntoView({behavior:"smooth"});
  });
});

// ===== REVEAL ANIMATIONS ON SCROLL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry) => {
    if(entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {threshold:.12});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ===== MOUSE TRACKING FOR ORBS =====
document.addEventListener("mousemove", (e) => {
  const orbs = document.querySelectorAll(".orb");
  orbs.forEach(orb => {
    const rect = orb.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - y, e.clientX - x);
    const distance = 20;
    
    orb.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
  });
});

// ===== VIDEO SECTION =====
const video = document.getElementById("birthdayVideo");
const placeholder = document.getElementById("videoPlaceholder");
const playButton = document.getElementById("playButton");

video.style.visibility = "hidden";

playButton.addEventListener("click", () => {
  video.style.visibility = "visible";
  placeholder.style.display = "none";
  video.play().catch(() => {});
  createSparkles(playButton);
});

video.addEventListener("ended", () => {
  document.querySelector("#proposal")?.scrollIntoView({behavior:"smooth"});
});

video.addEventListener("error", () => {
  video.style.visibility = "hidden";
  placeholder.style.display = "flex";
  document.querySelector(".video-hint").textContent = "Add birthday-video.mp4 to play";
});

// ===== PROPOSAL BUTTONS =====
const success = document.getElementById("success");
const yesBtn = document.getElementById("yesBtn");
const maybeBtn = document.getElementById("maybeBtn");

yesBtn.addEventListener("click", (e) => {
  success.classList.add("show");
  makeConfetti();
  createButtonRipple(e, yesBtn);
});

maybeBtn.addEventListener("click", (e) => {
  maybeBtn.textContent = "Take your time ♡";
  maybeBtn.style.transform = "scale(.98)";
  createButtonRipple(e, maybeBtn);
  setTimeout(() => maybeBtn.style.transform = "", 300);
});

// Ripple effect on click
function createButtonRipple(event, button) {
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.style.position = "absolute";
  ripple.style.borderRadius = "50%";
  ripple.style.background = "rgba(255,255,255,.6)";
  ripple.style.pointerEvents = "none";
  ripple.style.animation = "ripple-animation .6s ease-out";
  
  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

document.getElementById("closeSuccess").addEventListener("click", () => {
  success.classList.remove("show");
});

// Confetti effect
function makeConfetti(){
  const box = document.getElementById("confetti");
  box.innerHTML = "";
  for(let i=0; i<70; i++){
    const piece = document.createElement("i");
    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDuration = (2.5 + Math.random() * 3) + "s";
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(piece);
  }
}
