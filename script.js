// ====== CONFIGURATION ======
// Apna WhatsApp number yahan likhein (e.g. "923123456789")
const WAHAJ_WHATSAPP_NUMBER = "923149537402";

let selectedPhone = "";

// ====== NAVIGATION HELPER ======
function goToPage(pageId) {
  document.querySelectorAll('.card-screen').forEach(screen => {
    screen.classList.remove('active');
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
  }
}

// ====== PAGE 1: SLIDER LOGIC ======
const track = document.getElementById('sliderTrack');
const handle = document.getElementById('sliderHandle');
const fill = document.getElementById('trackFill');
const label = document.getElementById('sliderLabel');

let isDragging = false;
let startX = 0;
let maxSlide = 0;

function updateMaxSlide() {
  maxSlide = track.offsetWidth - handle.offsetWidth - 8;
}

window.addEventListener('resize', updateMaxSlide);
updateMaxSlide();

// Mouse / Touch events for slider
handle.addEventListener('mousedown', (e) => startSlide(e.clientX));
handle.addEventListener('touchstart', (e) => startSlide(e.touches[0].clientX));

window.addEventListener('mousemove', (e) => doSlide(e.clientX));
window.addEventListener('touchmove', (e) => doSlide(e.touches[0].clientX));

window.addEventListener('mouseup', endSlide);
window.addEventListener('touchend', endSlide);

function startSlide(clientX) {
  isDragging = true;
  startX = clientX - handle.offsetLeft;
  updateMaxSlide();
}

function doSlide(clientX) {
  if (!isDragging) return;
  let currentX = clientX - startX;
  if (currentX < 4) currentX = 4;
  if (currentX > maxSlide) currentX = maxSlide;

  handle.style.left = `${currentX}px`;
  fill.style.width = `${currentX + 25}px`;

  // Opacity fade of label while sliding
  const progress = currentX / maxSlide;
  label.style.opacity = `${1 - progress}`;

  // Trigger unlock when reached 90%
  if (progress > 0.9) {
    isDragging = false;
    handle.style.left = `${maxSlide}px`;
    label.innerText = "Unlocked! ❤️";
    setTimeout(() => {
      goToPage('page-journey');
    }, 400);
  }
}

function endSlide() {
  if (!isDragging) return;
  isDragging = false;
  // Snap back if not reached the end
  handle.style.transition = 'left 0.3s ease';
  fill.style.transition = 'width 0.3s ease';
  handle.style.left = '4px';
  fill.style.width = '0px';
  label.style.opacity = '1';

  setTimeout(() => {
    handle.style.transition = '';
    fill.style.transition = '';
  }, 300);
}

// ====== PAGE 2: TO CHOICE ======
document.getElementById('btnToChoice').addEventListener('click', () => {
  goToPage('page-choice');
});

// ====== PAGE 3: PHONE SELECTION ======
document.querySelectorAll('.phone-card').forEach(card => {
  card.addEventListener('click', () => {
    selectedPhone = card.getAttribute('data-phone');
    document.getElementById('chosenPhoneTitle').innerText = selectedPhone;
    goToPage('page-reveal');
  });
});

// ====== PAGE 4: WHATSAPP TRIGGER (CLEAN VERSION) ======
const waBtn = document.getElementById('btnWhatsapp');

if (waBtn) {
  waBtn.onclick = function (e) {
    e.preventDefault();

    const msgLines = [
      "Assalam-o-Alaikum Wahaj! ❤️",
      "",
      "Aapka surprise gift maine dekh liya aur unbox bhi kar liya! 🥰",
      "",
      "Mera final choice yeh hai:",
      "✨ *" + selectedPhone + "* ✨",
      "",
      "Ab jaldi se mera parcel le aao! 💕"
    ];

    const fullMessage = msgLines.join("\n");
    const encodedMsg = encodeURIComponent(fullMessage);
    const waUrl = "https://api.whatsapp.com/send?phone=" + WAHAJ_WHATSAPP_NUMBER + "&text=" + encodedMsg;

    window.open(waUrl, '_blank');
  };
}