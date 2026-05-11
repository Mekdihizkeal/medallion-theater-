const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const forgotBtn = document.getElementById("forgotBtn");
const modeButtons = document.querySelectorAll("[data-login-role]");
let loginRole = "user";

function attemptLogin() {
  if (!emailInput?.value.trim() || !passwordInput?.value.trim()) {
    showToast("Enter both email and password.");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (loginRole === "admin") {
    if (email.toLowerCase() === "admin@medallion.com" && password === "admin123") {
      showToast("Admin login successful.");
      window.setTimeout(() => {
        window.location.href = "admin .html";
      }, 500);
      return;
    }

    showToast("Use admin@medallion.com and admin123 for admin demo.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("medallionUsers") || "[]");
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) {
    showToast("Create a user account first or check your password.");
    return;
  }

  localStorage.setItem("medallionCurrentUser", JSON.stringify(user));
  showToast(`Welcome back, ${user.firstName}.`);
  window.setTimeout(() => {
    window.location.href = "index.html";
  }, 600);
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    loginRole = button.dataset.loginRole;
    showToast(`${button.textContent.trim()} login selected.`);
  });
});

const loginParams = new URLSearchParams(window.location.search);
const requestedRole = loginParams.get("role");
if (requestedRole === "admin") {
  const adminButton = document.querySelector("[data-login-role='admin']");
  adminButton?.click();
}

const emailFromSignup = loginParams.get("email");
if (emailInput && emailFromSignup) {
  emailInput.value = emailFromSignup;
  passwordInput?.focus();
}

togglePassword?.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  attemptLogin();
});

[emailInput, passwordInput].filter(Boolean).forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      attemptLogin();
    }
  });
});

forgotBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Password reset link demo triggered.");
});

document.querySelectorAll(".social-btn").forEach((button) => {
  button.addEventListener("click", () => showToast("Social link demo clicked."));
});

const adminHeading = document.getElementById("adminHeading");
const usersTableBody = document.getElementById("usersTableBody");
const adminShowsTableBody = document.getElementById("adminShowsTableBody");
const adminShowForm = document.getElementById("adminShowForm");
const adminSalesReport = document.getElementById("adminSalesReport");

const defaultUsers = [
  { id: "U001", name: "Alice Morgan", email: "alice@example.com", role: "Customer", tickets: 4 },
  { id: "U002", name: "James Carter", email: "james@example.com", role: "Customer", tickets: 2 },
  { id: "U003", name: "Sam Admin", email: "admin@medallion.com", role: "Admin", tickets: 0 },
  { id: "U004", name: "Nina Patel", email: "nina@example.com", role: "Customer", tickets: 5 }
];

const defaultShows = [
  { movie: "Dear England", date: "May 11, 2026", time: "7:00 PM", sold: 11, available: 665, revenue: 715 },
  { movie: "Macbeth", date: "May 12, 2026", time: "8:00 PM", sold: 8, available: 668, revenue: 520 },
  { movie: "Rabbit Hole", date: "May 13, 2026", time: "6:30 PM", sold: 6, available: 670, revenue: 390 }
];

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

function renderUsers() {
  if (!usersTableBody) return;
  usersTableBody.innerHTML = defaultUsers
    .map((user) => `<tr><td>${user.id}</td><td>${user.name}</td><td>${user.email}</td><td>${user.role}</td><td>${user.tickets}</td></tr>`)
    .join("");
}

function renderShows() {
  if (!adminShowsTableBody) return;
  const shows = readShows();
  adminShowsTableBody.innerHTML = shows
    .map(
      (show, index) => `
        <tr>
          <td>${show.movie}</td>
          <td>${show.date}</td>
          <td>${show.time}</td>
          <td>${show.sold}</td>
          <td>${show.available}</td>
          <td><button type="button" class="danger-btn" data-remove-show="${index}">Remove</button></td>
        </tr>
      `
    )
    .join("");
}

document.querySelectorAll("[data-admin-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("[data-admin-panel].active")?.classList.remove("active");
    button.classList.add("active");
    const panel = button.dataset.adminPanel;
    adminHeading.textContent = panel === "users" ? "MANAGE USERS" : "MANAGE SHOWS";
    document.querySelectorAll("[data-admin-content]").forEach((content) => {
      content.hidden = content.dataset.adminContent !== panel;
    });
  });
});

document.getElementById("refreshUsersBtn")?.addEventListener("click", () => {
  renderUsers();
  showToast("User database pulled.");
});

adminShowForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const movie = document.getElementById("adminMovieName").value.trim();
  const date = document.getElementById("adminShowDate").value.trim();
  const time = document.getElementById("adminShowTime").value.trim();
  if (!movie || !date || !time) {
    showToast("Enter movie, date, and time.");
    return;
  }
  const shows = readShows();
  shows.push({ movie, date, time, sold: 0, available: 676, revenue: 0 });
  saveShows(shows);
  adminShowForm.reset();
  renderShows();
  showToast(`${movie} added.`);
});

adminShowsTableBody?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-show]");
  if (!removeButton) return;
  const shows = readShows();
  const [removed] = shows.splice(Number(removeButton.dataset.removeShow), 1);
  saveShows(shows);
  renderShows();
  showToast(`${removed.movie} removed.`);
});

document.getElementById("adminReportBtn")?.addEventListener("click", () => {
  const shows = readShows().map((show) => ({ ...show, revenue: Number(show.revenue) || (Number(show.sold) || 0) * 65 }));
  const sold = shows.reduce((sum, show) => sum + Number(show.sold), 0);
  const available = shows.reduce((sum, show) => sum + Number(show.available), 0);
  const totalRevenue = shows.reduce((sum, show) => sum + Number(show.revenue), 0);
  adminSalesReport.innerHTML = `<h3>Sales Report</h3><p>Total revenue: <strong>$${totalRevenue}</strong></p><p>Total seats sold: <strong>${sold}</strong></p><p>Total seats available: <strong>${available}</strong></p>`;
  showToast("Sales report generated.");
});

renderUsers();
renderShows();
