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
const systemStatusReport = document.getElementById("systemStatusReport");

const defaultUsers = [
  { id: "U001", name: "Alice Morgan", email: "alice@example.com", role: "Customer", tickets: 4 },
  { id: "U002", name: "James Carter", email: "james@example.com", role: "Customer", tickets: 2 },
  { id: "U003", name: "Sam Admin", email: "admin@medallion.com", role: "Admin", tickets: 0 },
  { id: "U004", name: "Nina Patel", email: "nina@example.com", role: "Customer", tickets: 5 }
];

const defaultSystemSettings = {
  bookingSystem: "enabled",
  signupSystem: "enabled",
  bankPaymentSystem: "enabled",
  ticketVerificationSystem: "enabled",
  maintenanceSystem: "off",
  paymentSystem: "Bank Transfer"
};

function readSystemSettings() {
  try {
    return { ...defaultSystemSettings, ...JSON.parse(localStorage.getItem("medallionSystemSettings")) };
  } catch {
    return defaultSystemSettings;
  }
}

function saveSystemSettings(settings) {
  localStorage.setItem("medallionSystemSettings", JSON.stringify(settings));
}

function renderUsers() {
  if (!usersTableBody) return;
  usersTableBody.innerHTML = defaultUsers
    .map((user) => `<tr><td>${user.id}</td><td>${user.name}</td><td>${user.email}</td><td>${user.role}</td><td>${user.tickets}</td></tr>`)
    .join("");
}

function renderSystemSettings() {
  const settings = readSystemSettings();
  Object.entries(settings).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
  renderSystemStatus(settings);
}

function renderSystemStatus(settings = readSystemSettings()) {
  if (!systemStatusReport) return;
  systemStatusReport.innerHTML = `
    <h3>System Status</h3>
    <p>Booking: <strong>${settings.bookingSystem}</strong></p>
    <p>User sign up: <strong>${settings.signupSystem}</strong></p>
    <p>Bank payment: <strong>${settings.bankPaymentSystem}</strong></p>
    <p>Ticket verification: <strong>${settings.ticketVerificationSystem}</strong></p>
    <p>Maintenance mode: <strong>${settings.maintenanceSystem}</strong></p>
    <p>Payment method: <strong>${settings.paymentSystem}</strong></p>
  `;
}

document.querySelectorAll("[data-admin-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("[data-admin-panel].active")?.classList.remove("active");
    button.classList.add("active");
    const panel = button.dataset.adminPanel;
    adminHeading.textContent = panel === "users" ? "MANAGE USERS" : "MANAGE SYSTEM";
    document.querySelectorAll("[data-admin-content]").forEach((content) => {
      content.hidden = content.dataset.adminContent !== panel;
    });
  });
});

document.getElementById("refreshUsersBtn")?.addEventListener("click", () => {
  renderUsers();
  showToast("User database pulled.");
});

document.getElementById("saveSystemBtn")?.addEventListener("click", () => {
  const settings = {
    bookingSystem: document.getElementById("bookingSystem").value,
    signupSystem: document.getElementById("signupSystem").value,
    bankPaymentSystem: document.getElementById("bankPaymentSystem").value,
    ticketVerificationSystem: document.getElementById("ticketVerificationSystem").value,
    maintenanceSystem: document.getElementById("maintenanceSystem").value,
    paymentSystem: document.getElementById("paymentSystem").value
  };
  saveSystemSettings(settings);
  renderSystemStatus(settings);
  showToast("System settings saved.");
});

renderUsers();
renderSystemSettings();
