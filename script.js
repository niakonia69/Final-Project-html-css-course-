// telefonis nav toggle
const navToggle = document.querySelector(".nav__toggle, .icon-btn--hamburger");
const navList = document.querySelector(".nav__list, .nav");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    navList.classList.toggle("nav__list--open");
  });
}
// wamzomi jblis
const musicTimer = document.querySelector(".music-banner__timer");

if (musicTimer) {
  const badges = musicTimer.querySelectorAll(".music-badge");
  const units = {};
  badges.forEach((badge) => {
    const unit = badge.dataset.unit; 
    const valueEl = badge.querySelector("span");
    units[unit] = {
      el: valueEl,
      value: parseInt(valueEl.textContent, 10) || 0,
    };
  });

  // wamebshi gadayvana
  let remaining =
    (units.days?.value || 0) * 24 * 60 * 60 +
    (units.hours?.value || 0) * 60 * 60 +
    (units.minutes?.value || 0) * 60 +
    (units.seconds?.value || 0);

  function updateMusicTimer() {
    if (remaining < 0) remaining = 0;

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    if (units.days) units.days.el.textContent = String(days).padStart(2, "0");
    if (units.hours) units.hours.el.textContent = String(hours).padStart(2, "0");
    if (units.minutes)
      units.minutes.el.textContent = String(minutes).padStart(2, "0");
    if (units.seconds)
      units.seconds.el.textContent = String(seconds).padStart(2, "0");

    remaining--;
  }

  updateMusicTimer();
  setInterval(updateMusicTimer, 1000);
}
//saati
const countdownEl = document.querySelector(".countdown[data-timer='flash']");

const daysEl = countdownEl ? countdownEl.querySelector("[data-unit='days']") : document.getElementById('fs-days');
const hoursEl = countdownEl ? countdownEl.querySelector("[data-unit='hours']") : document.getElementById('fs-hours');
const minutesEl = countdownEl ? countdownEl.querySelector("[data-unit='minutes']") : document.getElementById('fs-mins');
const secondsEl = countdownEl ? countdownEl.querySelector("[data-unit='seconds']") : document.getElementById('fs-secs');

if (daysEl || hoursEl || minutesEl || secondsEl) {
  let remaining = 3 * 24 * 60 * 60;

  function updateTimer() {
    if (remaining < 0) remaining = 0;

    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining / (60 * 60)) % 24);
    const minutes = Math.floor((remaining / 60) % 60);
    const seconds = Math.floor(remaining % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");

    remaining -= 1;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}


const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Your message has been sent (demo).");
    contactForm.reset();
  });
}
// Cartis page 
document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.querySelectorAll(".cart-item");
  if (!cartItems.length) return; 

  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  function formatMoney(value) {
    return "$" + value.toLocaleString();
  }

  function updateRow(row) {
    const price = Number(row.dataset.price); 
    const qtyInput = row.querySelector(".qty-input");
    let qty = Number(qtyInput.value) || 1;
    if (qty < 1) qty = 1;
    qtyInput.value = qty;

    const subtotal = price * qty;
    const cell = row.querySelector(".cart-item__subtotal");
    if (cell) cell.textContent = formatMoney(subtotal);
  }

  function updateTotals() {
    let total = 0;
    cartItems.forEach((row) => {
      const price = Number(row.dataset.price);
      const qty = Number(row.querySelector(".qty-input").value) || 1;
      total += price * qty;
    });

    if (subtotalEl) subtotalEl.textContent = formatMoney(total);
    if (totalEl) totalEl.textContent = formatMoney(total);
  }

  cartItems.forEach((row) => {
    const minus = row.querySelector(".qty-btn--minus");
    const plus = row.querySelector(".qty-btn--plus");
    const input = row.querySelector(".qty-input");

    minus.addEventListener("click", () => {
      input.value = Math.max(1, Number(input.value) - 1);
      updateRow(row);
      updateTotals();
    });

    plus.addEventListener("click", () => {
      input.value = Number(input.value) + 1;
      updateRow(row);
      updateTotals();
    });

    input.addEventListener("change", () => {
      updateRow(row);
      updateTotals();
    });
    updateRow(row);
  });

  updateTotals();
});
