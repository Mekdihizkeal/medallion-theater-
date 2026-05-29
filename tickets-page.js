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
  return MedallionReservationDB.getLatestBooking();
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
  const report = MedallionReservationDB.getSeatReport({
    movie: booking.movie,
    date: booking.date,
    time: booking.time
  });
  const soldSeats = report.soldSeats;
  reportContent.innerHTML = `
    <div class="report-grid">
      <span>Performance</span><strong>${booking.movie}</strong>
      <span>Date and Time</span><strong>${booking.date} at ${booking.time}</strong>
      <span>Seats Sold</span><strong>${soldSeats.length}</strong>
      <span>Seats Available</span><strong>${report.availableSeats}</strong>
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
    id: getLatestBooking()?.id || "",
    movie: verifyPerformance.value.trim(),
    date: verifyDate.value.trim(),
    time: verifyTime.value.trim(),
    seats: MedallionReservationDB.normalizeSeats(verifySeats.value.split(",")),
    total: verifyTotal.value.trim(),
    paymentMethod: paymentMethod.value
  };

  if (!firstName || !email || !booking.movie || booking.seats.length === 0) {
    showToast("Enter the customer, movie, and seat details first.");
    return;
  }

  const customerDetails = {
    customer: `${firstName} ${lastName}`.trim(),
    phone,
    email,
    status: "verified"
  };
  const latestBooking = getLatestBooking();
  const sameLatestBooking =
    latestBooking &&
    latestBooking.id === booking.id &&
    latestBooking.movie === booking.movie &&
    latestBooking.date === booking.date &&
    latestBooking.time === booking.time &&
    latestBooking.seats.join(",") === booking.seats.join(",");
  const savedBooking = sameLatestBooking
    ? MedallionReservationDB.updateReservation(booking.id, customerDetails)
    : MedallionReservationDB.reserveSeats({ ...booking, ...customerDetails });

  if (savedBooking && savedBooking.ok === false) {
    showToast(`Seat already reserved: ${savedBooking.conflicts.join(", ")}.`);
    return;
  }

  const verifiedTicket = savedBooking?.booking || savedBooking || { ...booking, ...customerDetails };
  localStorage.setItem("medallionLatestTicket", JSON.stringify(verifiedTicket));
  renderReport(verifiedTicket);
  showToast(`Ticket verified for ${firstName}.`);
});

fillTicket();
