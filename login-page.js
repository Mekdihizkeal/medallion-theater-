const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");
const forgotBtn = document.getElementById("forgotBtn");
const navLoginBtn = document.getElementById("navLoginBtn");
const bellBtn = document.getElementById("bellBtn");
const bellBadge = document.getElementById("bellBadge");
const heroLogoLink = document.getElementById("heroLogoLink");
const toast = document.getElementById("toast");
const dashboardHeading = document.getElementById("dashboardHeading");
const statLabelLeft = document.getElementById("statLabelLeft");
const statValueLeft = document.getElementById("statValueLeft");
const statLabelRight = document.getElementById("statLabelRight");
const statValueRight = document.getElementById("statValueRight");
const posterOne = document.getElementById("posterOne");
const posterTwo = document.getElementById("posterTwo");
const posterThree = document.getElementById("posterThree");
const statCardLeft = document.getElementById("statCardLeft");
const statCardRight = document.getElementById("statCardRight");
let toastTimer;
let notificationCount = 3;

const adminViews = {
  dashboard: {
    heading: "THE MEDALLION THEATRE",
    leftLabel: "TOTAL SOLD TICKET",
    leftValue: "9",
    rightLabel: "AVAILABLE MOVIES",
    rightValue: "4",
    posters: [
      { src: "images/rabbit-hole-card.png", alt: "Rabbit Hole poster" },
      { src: "images/macbeth-card.png", alt: "Macbeth poster" },
      { src: "images/green-card.png", alt: "Green poster" }
    ]
  },
  "add-movies": {
    heading: "ADD MOVIES",
    leftLabel: "DRAFT MOVIES",
    leftValue: "3",
    rightLabel: "POSTERS READY",
    rightValue: "6",
    posters: [
      { src: "images/green-card.png", alt: "Green poster" },
      { src: "images/rabbit-hole-card.png", alt: "Rabbit Hole poster" },
      { src: "images/macbeth-card.png", alt: "Macbeth poster" }
    ]
  },
  "available-movies": {
    heading: "AVAILABLE MOVIES",
    leftLabel: "NOW SHOWING",
    leftValue: "4",
    rightLabel: "COMING SOON",
    rightValue: "2",
    posters: [
      { src: "images/macbeth-card.png", alt: "Macbeth poster" },
      { src: "images/green-card.png", alt: "Green poster" },
      { src: "images/rabbit-hole-card.png", alt: "Rabbit Hole poster" }
    ]
  },
  "edit-screening": {
    heading: "EDIT SCREENING",
    leftLabel: "TODAY'S SHOWS",
    leftValue: "7",
    rightLabel: "UPDATED TIMES",
    rightValue: "5",
    posters: [
      { src: "images/rabbit-hole-card.png", alt: "Rabbit Hole poster" },
      { src: "images/green-card.png", alt: "Green poster" },
      { src: "images/macbeth-card.png", alt: "Macbeth poster" }
    ]
  },
  customers: {
    heading: "CUSTOMERS",
    leftLabel: "REGISTERED USERS",
    leftValue: "128",
    rightLabel: "ACTIVE BOOKINGS",
    rightValue: "37",
    posters: [
      { src: "images/macbeth-card.png", alt: "Macbeth poster" },
      { src: "images/rabbit-hole-card.png", alt: "Rabbit Hole poster" },
      { src: "images/green-card.png", alt: "Green poster" }
    ]
  }
};

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    showToast(`${link.textContent.trim()} opened.`);
  });
});

heroLogoLink.addEventListener("click", () => {
  showToast("Medallion Theatre home opened.");
});

navLoginBtn.addEventListener("click", () => {
  document.getElementById("loginSection").scrollIntoView({ behavior: "smooth", block: "start" });
  if (emailInput.value.trim() && passwordInput.value.trim()) {
    attemptLogin();
    return;
  }

  emailInput.focus();
  showToast("Login form ready.");
});

togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

function attemptLogin() {
  if (!emailInput.value.trim() || !passwordInput.value.trim()) {
    showToast("Enter both email and password.");
    return;
  }

  window.location.hash = "dashboardSection";
  document.getElementById("dashboardSection").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(`Welcome back, ${emailInput.value.trim()}.`);
}

function applyAdminView(sectionKey) {
  const view = adminViews[sectionKey];
  if (!view) {
    return;
  }

  dashboardHeading.textContent = view.heading;
  statLabelLeft.textContent = view.leftLabel;
  statValueLeft.textContent = view.leftValue;
  statLabelRight.textContent = view.rightLabel;
  statValueRight.textContent = view.rightValue;

  [posterOne, posterTwo, posterThree].forEach((poster, index) => {
    poster.src = view.posters[index].src;
    poster.alt = view.posters[index].alt;
  });
}

[emailInput, passwordInput].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      attemptLogin();
    }
  });
});


forgotBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Password reset link demo triggered.");
});

document.querySelectorAll(".social-btn").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Social link demo clicked.");
  });
});

document.querySelectorAll(".menu-btn, .menu-link").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".sidebar-menu .active")?.classList.remove("active");
    button.classList.add("active");
    applyAdminView(button.dataset.section);
    showToast(`${button.textContent.trim()} selected.`);
  });
});

bellBtn.addEventListener("click", () => {
  notificationCount = Math.max(0, notificationCount - 1);
  bellBadge.textContent = String(notificationCount);
  bellBadge.hidden = notificationCount === 0;
  showToast(notificationCount === 0 ? "All notifications cleared." : `${notificationCount} notifications remaining.`);
});

statCardLeft.addEventListener("click", () => {
  showToast(`${statLabelLeft.textContent}: ${statValueLeft.textContent}`);
});

statCardRight.addEventListener("click", () => {
  showToast(`${statLabelRight.textContent}: ${statValueRight.textContent}`);
});

document.querySelectorAll(".poster-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    showToast(`${image.alt} opened.`);
  });
});

applyAdminView("dashboard");
