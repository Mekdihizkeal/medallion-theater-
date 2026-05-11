const showsTableBody = document.getElementById("showsTableBody");
const showForm = document.getElementById("showForm");
const salesReport = document.getElementById("salesReport");
const toast = document.getElementById("toast");
let toastTimer;

const defaultShows = [
  { movie: "Dear England", date: "May 11, 2026", time: "7:00 PM", sold: 11, available: 665, revenue: 715 },
  { movie: "Macbeth", date: "May 12, 2026", time: "8:00 PM", sold: 8, available: 668, revenue: 520 },
  { movie: "Rabbit Hole", date: "May 13, 2026", time: "6:30 PM", sold: 6, available: 670, revenue: 390 }
];

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function readShows() {
  try {
    return JSON.parse(localStorage.getItem("medallionShows")) || defaultShows;
  } catch {
    return defaultShows;
  }
}

function saveShows(shows) {
  localStorage.setItem("medallionShows", JSON.stringify(shows));
}

function normalizeShow(show) {
  return {
    ...show,
    sold: Number(show.sold) || 0,
    available: Number(show.available) || 0,
    revenue: Number(show.revenue) || (Number(show.sold) || 0) * 65
  };
}

function getReportRows() {
  return readShows().map(normalizeShow);
}

function renderShows() {
  const shows = getReportRows();
  showsTableBody.innerHTML = shows
    .map(
      (show, index) => `
      <tr>
        <td>${show.movie}</td>
        <td>${show.date}</td>
        <td>${show.time}</td>
        <td>${show.sold}</td>
        <td>${show.available}</td>
        <td><button class="remove-btn" type="button" data-remove="${index}">Remove</button></td>
      </tr>
    `
    )
    .join("");
}

showForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const movie = document.getElementById("movieName").value.trim();
  const date = document.getElementById("showDate").value.trim();
  const time = document.getElementById("showTime").value.trim();

  if (!movie || !date || !time) {
    showToast("Enter movie, date, and time.");
    return;
  }

  const shows = readShows();
  shows.push({ movie, date, time, sold: 0, available: 676, revenue: 0 });
  saveShows(shows);
  showForm.reset();
  renderShows();
  showToast(`${movie} added.`);
});

showsTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;

  const shows = readShows();
  const [removed] = shows.splice(Number(button.dataset.remove), 1);
  saveShows(shows);
  renderShows();
  showToast(`${removed.movie} removed.`);
});

document.getElementById("salesReportBtn").addEventListener("click", () => {
  const shows = getReportRows();
  const today = "May 11, 2026";
  const currentMonth = "May";
  const currentYear = "2026";
  const dailyRevenue = shows
    .filter((show) => show.date === today)
    .reduce((sum, show) => sum + show.revenue, 0);
  const monthlyRevenue = shows
    .filter((show) => show.date.includes(currentMonth))
    .reduce((sum, show) => sum + show.revenue, 0);
  const yearlyRevenue = shows
    .filter((show) => show.date.includes(currentYear))
    .reduce((sum, show) => sum + show.revenue, 0);
  const totalRevenue = shows.reduce((sum, show) => sum + show.revenue, 0);
  const sold = shows.reduce((sum, show) => sum + show.sold, 0);
  const available = shows.reduce((sum, show) => sum + show.available, 0);
  salesReport.innerHTML = `
    <h2>Manage Show Sales Report</h2>
    <p>Daily revenue: <strong>$${dailyRevenue}</strong></p>
    <p>Monthly revenue: <strong>$${monthlyRevenue}</strong></p>
    <p>Yearly revenue: <strong>$${yearlyRevenue}</strong></p>
    <p>Total revenue: <strong>$${totalRevenue}</strong></p>
    <p>Total seats sold: <strong>${sold}</strong></p>
    <p>Total seats available: <strong>${available}</strong></p>
  `;
  showToast("Sales report generated.");
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "login-page.html";
});

renderShows();
