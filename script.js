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

document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:"smooth"});
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
}, {threshold:.12});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

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
});

maybeBtn.addEventListener("click", () => {
  maybeBtn.textContent = "Take your time ♡";
  maybeBtn.style.transform = "scale(.98)";
  setTimeout(() => maybeBtn.style.transform = "", 300);
});

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
