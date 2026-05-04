const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

document.querySelectorAll(".nav-links a, .hero-actions a, .path-card a").forEach((link) => {
  link.addEventListener("click", () => {
    showToast(`${link.textContent.trim()} opened.`);
  });
});
