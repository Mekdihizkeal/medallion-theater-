const signupForm = document.getElementById("signupForm");
const topLogoLink = document.getElementById("topLogoLink");
const toast = document.getElementById("toast");

let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

topLogoLink.addEventListener("click", () => {
  showToast("Medallion Theatre home opened.");
});

document.querySelectorAll(".eye-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });
});

document.querySelectorAll(".footer-link").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.textContent.trim()} opened.`);
  });
});

document.querySelectorAll("input[name='sex']").forEach((radio) => {
  radio.addEventListener("change", () => {
    showToast(`${radio.value} selected.`);
  });
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("emailAddress").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showToast("Fill in all required fields first.");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match.");
    return;
  }

  showToast(`Account created for ${firstName} ${lastName}.`);
  window.setTimeout(() => {
    window.location.href = "login-page.html";
  }, 900);
});
