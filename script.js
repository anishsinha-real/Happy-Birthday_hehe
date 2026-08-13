// ====== PERSONALIZE THESE ======
const HER_NAME = "CLARA";
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

// Envelope Opening Animation
const envelope = document.getElementById("envelope");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");
let envelopeOpened = false;

openEnvelopeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!envelopeOpened) {
    envelope.classList.add("opened");
    envelopeOpened = true;
    
    // Create sparkles around envelope
    createSparkles(envelope);
    
    // Scroll to next section after delay
    setTimeout(() => {
      document.querySelector("#words")?.scrollIntoView({behavior:"smooth"});
    }, 1000);
  }
});

// Sparkle effect
function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  for(let i = 0; i < 15; i++) {
    const sparkle = document.createElement("div");
    sparkle.style.position = "fixed";
    sparkle.style.left = rect.left + rect.width/2 + "px";
    sparkle.style.top = rect.top + rect.height/2 + "px";
    sparkle.style.width = "8px";
    sparkle.style.height = "8px";
    sparkle.style.background = ["#ff006e", "#00d9ff", "#ffbe0b"][Math.floor(Math.random() * 3)];
    sparkle.style.borderRadius = "50%";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "1000";
    sparkle.style.boxShadow = `0 0 10px ${sparkle.style.background}`;
    document.body.appendChild(sparkle);
    
    const angle = (i / 15) * Math.PI * 2;
    const distance = 80 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    sparkle.animate([
      {transform: "translate(0,0) scale(1)", opacity: 1},
      {transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0}
    ], {duration: 800, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"});
    
    setTimeout(() => sparkle.remove(), 800);
  }
}

// Scroll buttons
document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:"smooth"});
  });
});

// Enhanced observer with stagger animations
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if(entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 50);
    }
  });
}, {threshold:.12});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Add mouse tracking for interactive elements
document.addEventListener("mousemove", (e) => {
  const orbs = document.querySelectorAll(".orb");
  orbs.forEach(orb => {
    const rect = orb.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - y, e.clientX - x);
    const distance = 30;
    
    orb.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
  });
});

// Video: put birthday-video.mp4 in this folder.
const video = document.getElementById("birthdayVideo");
const placeholder = document.getElementById("videoPlaceholder");
const playButton = document.getElementById("playButton");

video.style.visibility = "hidden";

playButton.addEventListener("click", () => {
  video.style.visibility = "visible";
  placeholder.style.display = "none";
  video.play().catch(() => {});
});

video.addEventListener("ended", () => {
  document.querySelector("#proposal").scrollIntoView({behavior:"smooth"});
});

// Graceful fallback if video file hasn't been added yet.
video.addEventListener("error", () => {
  video.style.visibility = "hidden";
  placeholder.style.display = "flex";
  document.querySelector(".video-hint").textContent = "Add birthday-video.mp4 to play";
});

// Proposal
const success = document.getElementById("success");
const yesBtn = document.getElementById("yesBtn");
const maybeBtn = document.getElementById("maybeBtn");

yesBtn.addEventListener("click", () => {
  success.classList.add("show");
  makeConfetti();
  // Add ripple effect
  createRipple(yesBtn);
});

maybeBtn.addEventListener("click", () => {
  maybeBtn.textContent = "Take your time ♡";
  maybeBtn.style.transform = "scale(.98)";
  createRipple(maybeBtn);
  setTimeout(() => maybeBtn.style.transform = "", 300);
});

// Ripple effect
function createRipple(button) {
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.classList.add("ripple");
  ripple.style.position = "absolute";
  ripple.style.borderRadius = "50%";
  ripple.style.background = "rgba(255,255,255,.5)";
  ripple.style.pointerEvents = "none";
  ripple.style.transform = "scale(0)";
  ripple.style.animation = "ripple-animation .6s ease-out";
  
  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

document.getElementById("closeSuccess").addEventListener("click", () => {
  success.classList.remove("show");
});

function makeConfetti(){
  const box = document.getElementById("confetti");
  box.innerHTML = "";
  for(let i=0;i<70;i++){
    const piece = document.createElement("i");
    piece.style.left = Math.random()*100 + "%";
    piece.style.animationDuration = (2.5 + Math.random()*3) + "s";
    piece.style.animationDelay = Math.random()*.8 + "s";
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    box.appendChild(piece);
  }
}
