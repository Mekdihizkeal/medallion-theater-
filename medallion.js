const seatGrid = document.getElementById("seats");
const seatCount = document.getElementById("seatCount");
const totalPrice = document.getElementById("totalPrice");
const selectedSeatTags = document.getElementById("selectedSeatTags");
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const nextDateBtn = document.getElementById("nextDateBtn");
const purchaseBtn = document.getElementById("purchaseBtn");
const toast = document.getElementById("toast");
const movieTitle = document.getElementById("movieTitle");
const moviePoster = document.getElementById("moviePoster");
const loginPageUrl = "login-page.html";
const selectedMovie = new URLSearchParams(window.location.search).get("movie") || "Dear England";

const MOVIE_POSTERS = {
  "Dear England": "images/poster.png",
  Macbeth: "images/macbeth-card.png",
  "Rabbit Hole": "images/rabbit-hole-card.png",
  "Green Shadow": "images/green-card.png"
};

const allDates = [
  { month: "JAN", day: "05", label: "SUN" },
  { month: "JAN", day: "06", label: "MON" },
  { month: "JAN", day: "07", label: "TUE" },
  { month: "JAN", day: "08", label: "WED" },
  { month: "JAN", day: "09", label: "THU" },
  { month: "JAN", day: "10", label: "FRI" },
  { month: "JAN", day: "11", label: "SAT" }
];

const CATEGORY_PRICES = { Orchestra: 65, Mezzanine: 55, Balcony: 40, Box: 85 };

const ORCHESTRA_ROWS = new Set(["A", "B", "C", "D", "E", "F"]);
const MEZZANINE_ROWS = new Set(["G", "H", "I", "J", "K", "L", "M", "N"]);
const BALCONY_ROWS   = new Set(["AA", "BB", "CC", "DD", "EE", "FF"]);
const BOX_ROWS       = new Set(["X"]);

function getSeatCategory(seatId) {
  const row = seatId.replace(/\d+$/, "");
  if (ORCHESTRA_ROWS.has(row)) return "Orchestra";
  if (MEZZANINE_ROWS.has(row)) return "Mezzanine";
  if (BALCONY_ROWS.has(row))   return "Balcony";
  if (BOX_ROWS.has(row))       return "Box";
  return "Orchestra";
}

function fullRow()  { return [...Array(15).fill(1), 0, ...Array(15).fill(1)]; }
function balRow(half) {
  const pad = 15 - half;
  return [...Array(pad).fill(0), ...Array(half).fill(1), 0, ...Array(half).fill(1), ...Array(pad).fill(0)];
}

// Each entry: [rowLabel, seatsArray, section]  OR  [null, sectionTitle, section] for headers
const layout = [
  [null, "ORCHESTRA", "orchestra"],
  ["A", fullRow(), "orchestra"], ["B", fullRow(), "orchestra"], ["C", fullRow(), "orchestra"],
  ["D", fullRow(), "orchestra"], ["E", fullRow(), "orchestra"], ["F", fullRow(), "orchestra"],
  [null, "MEZZANINE", "mezzanine"],
  ["G", fullRow(), "mezzanine"], ["H", fullRow(), "mezzanine"], ["I", fullRow(), "mezzanine"],
  ["J", fullRow(), "mezzanine"], ["K", fullRow(), "mezzanine"], ["L", fullRow(), "mezzanine"],
  ["M", fullRow(), "mezzanine"], ["N", fullRow(), "mezzanine"],
  [null, "BALCONY", "balcony"],
  ["AA", balRow(15), "balcony"], ["BB", balRow(15), "balcony"], ["CC", balRow(15), "balcony"],
  ["DD", balRow(14), "balcony"], ["EE", balRow(12), "balcony"], ["FF", balRow(12), "balcony"],
];

const lockedSeats = new Set(["A4", "A5", "B8", "D12", "G6", "H7", "AA4", "X11"]);
const dateButtons = Array.from(document.querySelectorAll(".date-card"));
let visibleDateStart = 0;
let selectedDateIndex = 2;
let selectedSeats = ["H1", "H2", "H3"];
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
  const grandTotal = selectedSeats.reduce((sum, seat) => {
    return sum + CATEGORY_PRICES[getSeatCategory(seat)];
  }, 0);
  totalPrice.textContent = `$${grandTotal}`;
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

  layout.forEach(([rowLabel, seatsOrTitle, section]) => {
    if (rowLabel === null) {
      const header = document.createElement("div");
      header.className = `section-header section-${section}`;
      header.textContent = seatsOrTitle;
      seatGrid.appendChild(header);
      return;
    }

    const lblL = document.createElement("div");
    lblL.className = "row-label";
    lblL.textContent = rowLabel;
    seatGrid.appendChild(lblL);

    let seatNumber = 0;
    seatsOrTitle.forEach((type) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `seat section-${section}`;

      if (type === 0) {
        button.classList.add("hidden");
        button.tabIndex = -1;
        seatGrid.appendChild(button);
        return;
      }

      seatNumber++;
      const seatId = `${rowLabel}${seatNumber}`;
      button.dataset.seat = seatId;
      button.setAttribute("aria-label", `Seat ${seatId}`);

      if (selectedSeats.includes(seatId)) {
        button.classList.add("selected");
      }
      if (lockedSeats.has(seatId)) {
        button.classList.add("unavailable");
      }
      button.textContent = seatNumber;

      button.addEventListener("click", () => toggleSeat(seatId));
      seatGrid.appendChild(button);
    });

    const lblR = document.createElement("div");
    lblR.className = "row-label";
    lblR.textContent = rowLabel;
    seatGrid.appendChild(lblR);
  });

  renderBoxSeats();
}

function renderBoxSeats() {
  const leftGrid  = document.getElementById("leftBoxSeats");
  const rightGrid = document.getElementById("rightBoxSeats");
  if (!leftGrid || !rightGrid) return;
  leftGrid.innerHTML  = "";
  rightGrid.innerHTML = "";

  for (let i = 1; i <= 8; i++) {
    leftGrid.appendChild(makeBoxBtn(`X${i}`));
  }
  for (let i = 9; i <= 16; i++) {
    rightGrid.appendChild(makeBoxBtn(`X${i}`));
  }
}

function makeBoxBtn(seatId) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "seat section-box";
  btn.dataset.seat = seatId;
  btn.setAttribute("aria-label", `Seat ${seatId}`);
  btn.textContent = seatId.replace("X", "");
  if (selectedSeats.includes(seatId)) btn.classList.add("selected");
  if (lockedSeats.has(seatId)) btn.classList.add("unavailable");
  btn.addEventListener("click", () => toggleSeat(seatId));
  return btn;
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
    if (!link.dataset.navTarget) {
      return;
    }
    event.preventDefault();
    const target = document.getElementById(link.dataset.navTarget);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast(`${link.textContent.trim()} opened.`);
    }
  });
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


purchaseBtn.addEventListener("click", () => {
  if (selectedSeats.length === 0) {
    showToast("Choose at least one seat before purchasing.");
    return;
  }

  const chosenDate = allDates[selectedDateIndex];
  const total = totalPrice.textContent;
  const booking = {
    movie: selectedMovie,
    date: `${chosenDate.month} ${chosenDate.day}, 2026`,
    time: "7:00 PM",
    seats: selectedSeats,
    total,
    paymentMethod: "Bank Transfer",
    soldSeats: Array.from(new Set([...lockedSeats, ...selectedSeats])),
    availableSeats: Math.max(0, 676 - lockedSeats.size - selectedSeats.length)
  };
  localStorage.setItem("medallionLatestBooking", JSON.stringify(booking));
  const orderSummary = [`${selectedMovie}`, `Seats: ${selectedSeats.join(", ")}`, `Total: ${total}`];

  showToast(orderSummary.join(" | "));
  window.setTimeout(() => {
    window.location.href = "tickets-page.html";
  }, 900);
});

movieTitle.textContent = selectedMovie;
moviePoster.src = MOVIE_POSTERS[selectedMovie] || MOVIE_POSTERS["Dear England"];
moviePoster.alt = `${selectedMovie} poster`;
renderSeats();
updateDateButtons();
updateSelection();
