const verifyForm = document.getElementById("verifyForm");
const reportContent = document.getElementById("reportContent");
const verifyPerformance = document.getElementById("verifyPerformance");
const verifyDate = document.getElementById("verifyDate");
const verifyTime = document.getElementById("verifyTime");
const verifySeats = document.getElementById("verifySeats");
const verifyTotal = document.getElementById("verifyTotal");
const paymentMethod = document.getElementById("paymentMethod");
const toast = document.getElementById("toast");

let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function getLatestBooking() {
  try {
    return JSON.parse(localStorage.getItem("medallionLatestBooking")) || null;
  } catch {
    return null;
  }
}

function fillTicket() {
  const booking = getLatestBooking() || {
    movie: "Dear England",
    date: "JAN 07, 2026",
    time: "7:00 PM",
    seats: ["H1", "H2", "H3"],
    total: "$165",
    paymentMethod: "Bank Transfer",
    soldSeats: ["A4", "A5", "B8", "D12", "G6", "H1", "H2", "H3"],
    availableSeats: 668
  };

  verifyPerformance.value = booking.movie;
  verifyDate.value = booking.date;
  verifyTime.value = booking.time;
  verifySeats.value = booking.seats.join(", ");
  verifyTotal.value = booking.total;
  paymentMethod.value = booking.paymentMethod || "Bank Transfer";
  renderReport(booking);
}

function renderReport(booking) {
  const soldSeats = booking.soldSeats || booking.seats || [];
  reportContent.innerHTML = `
    <div class="report-grid">
      <span>Performance</span><strong>${booking.movie}</strong>
      <span>Date and Time</span><strong>${booking.date} at ${booking.time}</strong>
      <span>Seats Sold</span><strong>${soldSeats.length}</strong>
      <span>Seats Available</span><strong>${booking.availableSeats}</strong>
      <span>Sold Seat Numbers</span><strong>${soldSeats.join(", ")}</strong>
    </div>
  `;
}

verifyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstName = document.getElementById("verifyFirstName").value.trim();
  const lastName = document.getElementById("verifyLastName").value.trim();
  const phone = document.getElementById("verifyPhone").value.trim();
  const email = document.getElementById("verifyEmail").value.trim();
  const booking = {
    movie: verifyPerformance.value.trim(),
    date: verifyDate.value.trim(),
    time: verifyTime.value.trim(),
    seats: verifySeats.value.split(",").map((seat) => seat.trim()).filter(Boolean),
    total: verifyTotal.value.trim(),
    paymentMethod: paymentMethod.value,
    soldSeats: verifySeats.value.split(",").map((seat) => seat.trim()).filter(Boolean),
    availableSeats: Math.max(0, 676 - verifySeats.value.split(",").filter(Boolean).length)
  };

  if (!firstName || !email || !booking.movie || booking.seats.length === 0) {
    showToast("Enter the customer, movie, and seat details first.");
    return;
  }

  localStorage.setItem("medallionLatestTicket", JSON.stringify({ ...booking, customer: `${firstName} ${lastName}`, phone, email }));
  renderReport(booking);
  showToast(`Ticket verified for ${firstName}.`);
});

fillTicket();
