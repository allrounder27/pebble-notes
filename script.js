// Personalise everything here.
const CONFIG = {
  name: "Mansi baby",
  letter:
    "I've been thinking about what happened, and I know I hurt you. " +
    "That was never what I wanted, and I'm truly, deeply sorry.\n\n" +
    "You deserve patience, kindness and someone who listens, and I fell short of that. " +
    "No excuses. I own it.\n\n" +
    "You mean more to me than being right ever could.",
  reasons: [
    "Your smile fixes my worst days",
    "The way you laugh at your own jokes",
    "You make ordinary moments feel special",
    "You believe in me even when I don't",
    "You're my favourite person to talk to",
    "Home is wherever you are",
  ],
  promises: [
    "I'll listen before I react",
    "I'll never let you feel unheard",
    "I'll say sorry without making you ask",
    "I'll make you laugh every chance I get",
    "I'll choose us, every single day",
  ],
  noLines: [
    "Are you sure? 🥺",
    "Please reconsider…",
    "I'll bring chocolates 🍫",
    "And ice cream 🍦",
    "Okay now you're just playing 😅",
    "The No button is tired, just press Yes ♥",
  ],
};

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const herName = params.get("n") || CONFIG.name;
document.querySelectorAll(".her-name").forEach((el) => (el.textContent = herName));

function show(id) {
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo(0, 0);
}

// Floating hearts background
setInterval(() => {
  const h = document.createElement("span");
  h.className = "float-heart";
  h.textContent = Math.random() > 0.5 ? "♥" : "♡";
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 12 + Math.random() * 22 + "px";
  h.style.animationDuration = 6 + Math.random() * 6 + "s";
  $("#hearts-bg").appendChild(h);
  setTimeout(() => h.remove(), 12000);
}, 450);

// 1. Envelope
$("#envelope").addEventListener("click", () => {
  $("#envelope").classList.add("open");
  setTimeout(() => {
    show("#scene-letter");
    typeLetter();
  }, 800);
});

// 2. Typewriter letter
let skipTyping = false;
function typeLetter() {
  const el = $("#typewriter");
  el.textContent = "";
  el.classList.remove("done");
  skipTyping = false;
  let i = 0;
  const tick = () => {
    if (skipTyping) i = CONFIG.letter.length - 1;
    el.textContent = CONFIG.letter.slice(0, ++i);
    if (i < CONFIG.letter.length) {
      setTimeout(tick, CONFIG.letter[i - 1] === "\n" ? 250 : 32);
    } else {
      el.classList.add("done");
      $("#to-reasons").hidden = false;
    }
  };
  tick();
}
$("#typewriter").addEventListener("click", () => (skipTyping = true));

// 3. Flip cards
const reasonsEl = $("#reasons");
const flipped = new Set();
CONFIG.reasons.forEach((text, idx) => {
  const card = document.createElement("div");
  card.className = "flip";
  const inner = document.createElement("div");
  inner.className = "flip-inner";
  const front = document.createElement("div");
  front.className = "flip-face flip-front";
  front.textContent = "♥";
  const back = document.createElement("div");
  back.className = "flip-face flip-back";
  back.textContent = text;
  inner.append(front, back);
  card.appendChild(inner);
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    flipped.add(idx);
    if (flipped.size === CONFIG.reasons.length) $("#to-promises").hidden = false;
  });
  reasonsEl.appendChild(card);
});
$("#to-reasons").addEventListener("click", () => show("#scene-reasons"));

// 4. Promises reveal one by one
$("#to-promises").addEventListener("click", () => {
  show("#scene-promises");
  const list = $("#promises");
  list.innerHTML = "";
  CONFIG.promises.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = p;
    list.appendChild(li);
    setTimeout(() => li.classList.add("show"), 600 * (i + 1));
  });
  setTimeout(() => ($("#to-question").hidden = false), 600 * (CONFIG.promises.length + 1));
});
$("#to-question").addEventListener("click", () => show("#scene-question"));

// 5. Yes / runaway No
let noCount = 0;
const noBtn = $("#no");
const yesBtn = $("#yes");
function dodge(e) {
  e.preventDefault();
  noCount++;
  $("#no-text").textContent = CONFIG.noLines[Math.min(noCount - 1, CONFIG.noLines.length - 1)];
  yesBtn.style.transform = `scale(${1 + noCount * 0.15})`;
  noBtn.classList.add("runaway");
  const pad = 20;
  const maxX = window.innerWidth - noBtn.offsetWidth - pad;
  const maxY = window.innerHeight - noBtn.offsetHeight - pad;
  noBtn.style.left = pad + Math.random() * maxX + "px";
  noBtn.style.top = pad + Math.random() * maxY + "px";
  if (noCount >= CONFIG.noLines.length + 2) noBtn.style.display = "none";
}
noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", dodge, { passive: false });
noBtn.addEventListener("click", dodge);

yesBtn.addEventListener("click", () => {
  show("#scene-yay");
  confetti();
});

// 6. Celebration
function confetti() {
  const bits = ["💖", "💕", "🌸", "✨", "💗", "🎉"];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = bits[Math.floor(Math.random() * bits.length)];
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDuration = 2.5 + Math.random() * 3 + "s";
    c.style.animationDelay = Math.random() * 1.5 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 7000);
  }
}

$("#replay").addEventListener("click", () => {
  noCount = 0;
  noBtn.className = "btn no";
  noBtn.removeAttribute("style");
  yesBtn.removeAttribute("style");
  $("#no-text").textContent = "";
  $("#envelope").classList.remove("open");
  ["#to-reasons", "#to-promises", "#to-question"].forEach((s) => ($(s).hidden = true));
  flipped.clear();
  document.querySelectorAll(".flip").forEach((f) => f.classList.remove("flipped"));
  show("#scene-envelope");
});
