const verifyForm = document.getElementById("verifyForm");
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
  const email = document.getElementById("verifyEmail").value.trim();
  const performance = verifyPerformance.value.trim();
  const seats = verifySeats.value.trim();

  if (!firstName || !email || !performance || !seats) {
    showToast("Enter the patron and ticket details first.");
    return;
  }

  showToast(`Ticket verified for ${firstName}.`);
});

fillDemoTicket();
