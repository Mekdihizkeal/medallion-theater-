const seatGrid = document.getElementById("seats");
const seatCount = document.getElementById("seatCount");
const totalPrice = document.getElementById("totalPrice");
const selectedSeatTags = document.getElementById("selectedSeatTags");
const searchInput = document.getElementById("tableSearch");
const headerSearchBtn = document.getElementById("headerSearchBtn");
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const nextDateBtn = document.getElementById("nextDateBtn");
const purchaseBtn = document.getElementById("purchaseBtn");
const toast = document.getElementById("toast");
const loginPageUrl = "login-page.html";
const layout = [
  ["K", [1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0]],
  ["J", [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]],
  ["I", [3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3]],
  ["H", [3, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3]],
  ["G", [1, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]],
  ["F", [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]],
  ["E", [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]],
  ["D", [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]],
  ["C", [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]],
  ["B", [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]],
  ["A", [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]],
  ["", [0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0]]
];

const allDates = [
  { month: "JAN", day: "05", label: "SUN" },
  { month: "JAN", day: "06", label: "MON" },
  { month: "JAN", day: "07", label: "TUE" },
  { month: "JAN", day: "08", label: "WED" },
  { month: "JAN", day: "09", label: "THU" },
  { month: "JAN", day: "10", label: "FRI" },
  { month: "JAN", day: "11", label: "SAT" }
];

const SEAT_PRICE = 100;
const lockedSeats = new Set();
const dateButtons = Array.from(document.querySelectorAll(".date-card"));
let visibleDateStart = 0;
let selectedDateIndex = 2;
let selectedSeats = ["G1", "G2", "G3"];
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

function updatePricing() {
  const seatTotal = selectedSeats.length * SEAT_PRICE;
  document.querySelector(".price-list div:nth-child(1) dd").textContent = `$${seatTotal}`;
  document.querySelector(".price-list div:nth-child(2) dd").textContent = "$0";
  document.querySelector(".price-list div:nth-child(3) dd").textContent = "$0";
  totalPrice.textContent = `$${seatTotal}`;
}

function updateSelection() {
  seatCount.textContent = selectedSeats.length;
  selectedSeatTags.innerHTML = "";

  selectedSeats.forEach((seat) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "seat-pill active";
    button.textContent = seat;
    button.dataset.seat = seat;
    button.addEventListener("click", () => toggleSeat(seat));
    selectedSeatTags.appendChild(button);
  });

  updatePricing();
}

function renderSeats() {
  seatGrid.innerHTML = "";

  layout.forEach(([rowLabel, seats]) => {
    let seatNumber = 0;

    seats.forEach((type) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "seat";

      if (type === 0) {
        button.classList.add("hidden");
        button.tabIndex = -1;
        seatGrid.appendChild(button);
        return;
      }

      if (type === 3) {
        button.classList.add("unavailable");
        button.disabled = true;
        button.tabIndex = -1;
        seatGrid.appendChild(button);
        return;
      }

      seatNumber += 1;
      const seatId = `${rowLabel}${seatNumber}`;
      button.dataset.seat = seatId;
      button.setAttribute("aria-label", `Seat ${seatId}`);

      if (type === 2 || selectedSeats.includes(seatId)) {
        button.classList.add("selected");
      }

      button.addEventListener("click", () => toggleSeat(seatId));
      seatGrid.appendChild(button);
    });
  });
}

function toggleSeat(seatId) {
  if (lockedSeats.has(seatId)) {
    showToast(`Seat ${seatId} is already reserved.`);
    return;
  }

  if (selectedSeats.includes(seatId)) {
    selectedSeats = selectedSeats.filter((seat) => seat !== seatId);
  } else {
    selectedSeats.push(seatId);
  }

  selectedSeats.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  updateSelection();
  renderSeats();
}

function updateDateButtons() {
  dateButtons.forEach((button, index) => {
    const date = allDates[visibleDateStart + index];
    button.querySelector("span").textContent = date.month;
    button.querySelector("strong").textContent = date.day;
    button.querySelector("small").textContent = date.label;
    button.dataset.dateIndex = String(visibleDateStart + index);
    button.classList.toggle("active", visibleDateStart + index === selectedDateIndex);
  });
}

function setActiveDate(nextIndex) {
  selectedDateIndex = nextIndex;

  if (selectedDateIndex < visibleDateStart) {
    visibleDateStart = selectedDateIndex;
  }

  if (selectedDateIndex > visibleDateStart + dateButtons.length - 1) {
    visibleDateStart = selectedDateIndex - (dateButtons.length - 1);
  }

  updateDateButtons();
  showToast(`Showtime updated to ${allDates[selectedDateIndex].month} ${allDates[selectedDateIndex].day}.`);
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.getElementById(link.dataset.navTarget);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast(`${link.textContent.trim()} opened.`);
    }
  });
});

headerSearchBtn.addEventListener("click", () => {
  document.getElementById("managementSection").scrollIntoView({ behavior: "smooth", block: "start" });
  searchInput.focus();
  showToast("Search is ready.");
});

profileBtn.addEventListener("click", () => {
  profileMenu.hidden = !profileMenu.hidden;
});

document.addEventListener("click", (event) => {
  if (!profileMenu.hidden && !event.target.closest(".toolbar")) {
    profileMenu.hidden = true;
  }
});

document.querySelectorAll(".profile-menu-item").forEach((button) => {
  button.addEventListener("click", () => {
    profileMenu.hidden = true;
    const action = button.dataset.profileAction;

    showToast(`${button.textContent.trim()} clicked.`);
  });
});

dateButtons.forEach((button, index) => {
  button.dataset.dateIndex = String(index);
  button.addEventListener("click", () => {
    setActiveDate(Number(button.dataset.dateIndex));
  });
});

nextDateBtn.addEventListener("click", () => {
  const nextIndex = (selectedDateIndex + 1) % allDates.length;
  setActiveDate(nextIndex);
});

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".tab-btn.active")?.classList.remove("active");
    button.classList.add("active");
    showToast(`${button.textContent.trim()} tab selected.`);
  });
});

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();

  document.querySelectorAll("#customerRows tr").forEach((row) => {
    row.hidden = !row.textContent.toLowerCase().includes(query);
  });
});

purchaseBtn.addEventListener("click", () => {
  if (selectedSeats.length === 0) {
    showToast("Choose at least one seat before purchasing.");
    return;
  }

  const chosenDate = allDates[selectedDateIndex];
  const total = totalPrice.textContent;
  const orderSummary = [`Tickets booked for ${chosenDate.month} ${chosenDate.day}`, `Seats: ${selectedSeats.join(", ")}`, `Total: ${total}`];

  showToast(orderSummary.join(" | "));
  window.setTimeout(() => {
    window.location.href = "tickets-page.html";
  }, 900);
});

renderSeats();
updateDateButtons();
updateSelection();
