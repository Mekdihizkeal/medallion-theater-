const verifyForm = document.getElementById("verifyForm");
const reportBox = document.getElementById("reportBox");
const reportContent = document.getElementById("reportContent");
const verifyPerformance = document.getElementById("verifyPerformance");
const verifyDate = document.getElementById("verifyDate");
const verifyTime = document.getElementById("verifyTime");
const verifySeats = document.getElementById("verifySeats");
const verifyTotal = document.getElementById("verifyTotal");
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

function fillDemoTicket() {
  verifyPerformance.value = "Dear England";
  verifyDate.value = "01/07/2024";
  verifyTime.value = "2:00 PM";
  verifySeats.value = "H1, H2, H3";
  verifyTotal.value = "$300";
}

document.querySelectorAll(".patron-block").forEach((block) => {
  block.addEventListener("click", () => {
    const patronName = block.querySelector(".patron-head span")?.textContent ?? "Patron";
    showToast(`${patronName} report opened.`);
    fillDemoTicket();
  });
});

verifyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstName = document.getElementById("verifyFirstName").value.trim();
  const lastName = document.getElementById("verifyLastName").value.trim();
  const street = document.getElementById("verifyStreet").value.trim();
  const city = document.getElementById("verifyCity").value.trim();
  const state = document.getElementById("verifyState").value.trim();
  const zip = document.getElementById("verifyZip").value.trim();
  const phone = document.getElementById("verifyPhone").value.trim();
  const email = document.getElementById("verifyEmail").value.trim();
  const performance = verifyPerformance.value.trim();
  const date = verifyDate.value.trim();
  const time = verifyTime.value.trim();
  const seats = verifySeats.value.trim();
  const total = verifyTotal.value.trim();

  if (!firstName || !email || !performance || !seats) {
    showToast("Enter the patron and ticket details first.");
    return;
  }

  reportContent.innerHTML = `
    <strong>Customer Name:</strong> ${firstName} ${lastName}<br><br>
    <strong>Address:</strong> ${street}, ${city}, ${state}, ${zip}<br><br>
    <strong>Phone:</strong> ${phone}<br><br>
    <strong>Email:</strong> ${email}<br><br>
    <strong>Performance:</strong> ${performance}<br><br>
    <strong>Date:</strong> ${date}<br><br>
    <strong>Time:</strong> ${time}<br><br>
    <strong>Seats:</strong> ${seats}<br><br>
    <strong>Total Collected:</strong> ${total}
  `;

  reportBox.style.display = "block";
  showToast(`Ticket verified for ${firstName}.`);
});

fillDemoTicket();

